"use client";

import {
  AnalyticsEvent,
  AnalyticsContextType,
  AnalyticsEventDocument,
} from "@/lib/types/analytics";
import { createContext, useContext } from "react";

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
// Provider component for handling analytic data
// Exposes recordEvent() for child components to record important events
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // RETRIEVE OR GENERATE DEVICE ID
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }

  // FUNCTION EXPOSED IN CONTEXT
  const recordEvent = async (event: AnalyticsEvent) => {
    // Create a dedupe key to prevent duplicate events from being recorded
    let eventId: string = `${deviceId}:${event.type}:`;
    const timeBucket = Math.floor(Date.now() / 10_000); // 10 second time bucket
    switch (event.type) {
      case "lesson_viewed":
        eventId += `${event.lessonId}/${timeBucket}`;
        break;
      case "lesson_closed":
        eventId += `${event.lessonId}/${timeBucket}`;
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
      case "question_answered":
        eventId += `${event.gameId}:${event.questionId}`;
        break;
    }

    const data: AnalyticsEventDocument = {
      event,
      deviceId,
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
      {children}
    </AnalyticsContext.Provider>
  );
}
