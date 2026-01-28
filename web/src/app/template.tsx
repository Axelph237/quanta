"use client";

import { AnalyticsProvider } from "@/lib/components/providers/AnalyticsProvider";
import { useEffect, useState } from "react";

const MOBILE_SIZE = 768;

function MobileWarning() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <div className="max-w-md w-full">
        <div className="px-6 py-8 border-2 border-primary bg-primary/10 rounded-xl text-on-surface">
          <div className="flex flex-col items-center text-center space-y-4">
            <svg
              className="w-16 h-16 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <h1 className="text-2xl font-bold">Mobile Not Supported</h1>
            <p className="text-on-surface">
              This application is optimized for desktop and tablet devices.
              Please visit on a larger screen for the best experience! :D
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_SIZE - 1}px)`);

    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    onChange(mql); // initial call

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  if (isMobile === undefined) {
    return null;
  }

  return isMobile ? (
    <MobileWarning />
  ) : (
    <AnalyticsProvider>{children}</AnalyticsProvider>
  );
}
