"use client";

import {
  AnalyticsEvent,
  AnalyticsContextType,
  AnalyticsEventDocument,
} from "@/lib/types/analytics";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import ConsentText from "./AnalyticsConsentText.mdx";
import { AnimatePresence, motion } from "framer-motion";
import { SchrodingersCat } from "../ui/Icons";

/* CONTEXT & HOOKS */

// Creates the context for the AnalyticsProvider
export const AnalyticsContext = createContext<AnalyticsContextType | null>(
  null,
);

// Hooks into the AnalyticsProvider's context
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}

export const getPermissions = () => {
  return localStorage.getItem("usagePermission");
};

const setPermissions = (permission: boolean) => {
  localStorage.setItem("usagePermission", permission.toString());
};

// Provider component for handling analytic data
// Exposes recordEvent() for child components to record important events
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [usagePermission, setUsagePermission] = useState<string | null>(null);
  const deviceIdRef = useRef<string | null>(null);

  const updatePerms = (permission: boolean) => {
    setUsagePermission(permission.toString());
    setPermissions(permission);
  };

  useEffect(() => {
    deviceIdRef.current = localStorage.getItem("deviceId");
    if (!deviceIdRef.current) {
      deviceIdRef.current = crypto.randomUUID();
      localStorage.setItem("deviceId", deviceIdRef.current);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsagePermission(getPermissions());
  }, []);

  // FUNCTION EXPOSED IN CONTEXT
  const recordEvent = async (
    event: AnalyticsEvent,
    timeBucket: number = 10_000, // default 10 second time bucket
  ) => {
    if (
      !usagePermission ||
      usagePermission === "false" ||
      !deviceIdRef.current
    ) {
      console.warn("recordEvent: Usage recording is not enabled.");
      return;
    }

    // Create a dedupe key to prevent duplicate events from being recorded
    let eventId: string = `${deviceIdRef.current}:${event.type}:`;
    const currentTimeBucket = Math.floor(Date.now() / timeBucket);
    switch (event.type) {
      case "lesson_viewed":
        eventId += `${event.lessonId}`;
        break;
      case "lesson_closed":
        eventId += `${event.lessonId}`;
        break;
      case "game_started":
        eventId += `${event.gameId}`;
        break;
      case "game_completed":
        eventId += `${event.gameId}`;
        break;
      case "game_action":
        eventId += `${event.gameId}:${event.action}`;
        break;
        // case "question_answered":
        //   eventId += `${event.gameId}:${event.questionId}`;
        break;
    }
    eventId += `/${currentTimeBucket}`;

    const data: AnalyticsEventDocument = {
      event,
      deviceId: deviceIdRef.current,
      eventId,
      timestamp: new Date().toISOString(),
    };

    // Forward data to server for storage
    try {
      await fetch("/api/analytic-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Failed to record event:", err);
    }
  };

  return (
    <AnalyticsContext.Provider value={{ recordEvent }}>
      <AnimatePresence>
        {usagePermission === null && <ConsentPopup updatePerms={updatePerms} />}
      </AnimatePresence>
      {children}
    </AnalyticsContext.Provider>
  );
}

function ConsentPopup({
  updatePerms,
}: {
  updatePerms: (permission: boolean) => void;
}) {
  const [showFullText, setShowFullText] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      id="consent-form-popup"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        id="consent-form-container"
        className="relative border-2 border-quanta-primary rounded-2xl shadow-2xl shadow-quanta-primary p-6 max-w-2xl max-h-[80vh] bg-quanta-surface overflow-y-scroll flex flex-col items-center gap-4"
      >
        <h1
          id="consent-form-title"
          className="sticky top-0 left-0 right-0 text-center text-2xl font-bold mb-4"
        >
          Anonymous Usage Analytics Consent
        </h1>
        {showFullText ? (
          <motion.div
            id="consent-form-text"
            className="overflow-y-auto rounded-lg border-2 border-quanta-on-surface/15 p-4"
          >
            <ConsentText />
          </motion.div>
        ) : (
          <motion.div
            id="consent-form-overview"
            className="overflow-y-auto rounded-lg border-2 border-quanta-on-surface/15 p-4"
          >
            Hello! This website was built to study the effectiveness of{" "}
            <b>interactivity</b> on <b>quantum computing education</b>. In order
            to do this, Quanta collects <i>completely anonymous</i> data about
            how you use the website. This data includes:
            <ul>
              <li>- Pages you visit</li>
              <li>- How long you spend on each page</li>
              <li>- What you do on each page</li>
            </ul>
            <br />
            Should you accept, a random ID will be generated and attached to
            your device. This ID will be used to identify you across sessions,
            <i>but will not be used to identify you personally</i>. You may
            withdraw your participation at any time by visiting the About page
            of quanta.akingstudio.com and unchecking the{" "}
            <b>&quot;Allow Collection of Usage Analytics for Research&quot;</b>{" "}
            checkbox. Thanks a bunch! :)
          </motion.div>
        )}
        <button
          className="cursor-pointer text-quanta-on-surface/50 hover:text-quanta-on-surface transition-colors duration-300"
          onClick={() => setShowFullText(!showFullText)}
        >
          {showFullText ? "Show Less" : "Show Details"}
        </button>
        <div id="consent-form-buttons" className="flex flex-col gap-4 relative">
          <button
            className="button-primary bg-quanta-primary"
            onClick={() => updatePerms(true)}
          >
            I Agree
          </button>
          <button
            className="text-quanta-primary text-sm cursor-pointer"
            onClick={() => updatePerms(false)}
          >
            Do Not Participate
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function ConsentCheckbox() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecked(getPermissions() === "true");
  }, []);

  const handleClick = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    setPermissions(newChecked);
  };

  return (
    <button
      className="flex flex-row items-center bg-quanta-primary/25 border-quanta-primary border p-4 rounded-lg"
      onClick={handleClick}
    >
      <div
        id="usage-permission-checkbox"
        className={`cursor-pointer w-6 h-6 p-4 rounded-md border border-quanta-primary flex items-center justify-center transition-all duration-150 ${checked ? "bg-quanta-primary" : ""}`}
      >
        {checked && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 500 }}
          >
            <SchrodingersCat className="w-6 h-6" />
          </motion.span>
        )}
      </div>
      <label
        htmlFor="usage-permission-checkbox"
        className="ms-2 text-sm font-medium text-heading"
      >
        Allow Collection of Usage Analytics for Research
      </label>
    </button>
  );
}
