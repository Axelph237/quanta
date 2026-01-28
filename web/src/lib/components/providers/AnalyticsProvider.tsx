"use client";

import { createContext, useContext } from "react";

interface AnalyticsContextType {
  recordEvent: (event: string, data?: Record<string, unknown>) => void;
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

  const recordEvent = (event: string, data?: Record<string, unknown>) => {
    console.log("Event recorded:", event, data);
  };

  return (
    <AnalyticsContext.Provider value={{ recordEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
