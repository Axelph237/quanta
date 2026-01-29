"use client";

import AnalyticsEvent from "@/lib/types/analytics";
import { createContext, useContext } from "react";

interface AnalyticsContextType {
  recordEvent: (event: AnalyticsEvent) => void;
}

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
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }

  const recordEvent = (event: AnalyticsEvent) => {
    console.log("Event recorded:", event);

    // Event types:
    // lesson_viewed
    // lesson_closed
    // game_started
    // game_completed
    // game_response

    switch (event.type) {
      case "lesson_viewed": // When a lesson is opened
        break;
      case "lesson_closed": // When a lesson is closed
        break;
      case "game_started": // When a game is started
        break;
      case "game_completed": // When a game is completed
        break;
      case "game_action": // When a user answers a question in a game
        break;
    }
  };

  return (
    <AnalyticsContext.Provider value={{ recordEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
