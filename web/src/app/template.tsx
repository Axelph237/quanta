"use client";

import { useEffect, useState } from "react";

function MobileWarning() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full">
        <div className="px-6 py-8 border-2 border-primary rounded-xl bg-primary-container text-on-primary-container">
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
            <p className="text-base">
              This application is optimized for desktop and tablet devices.
              Please visit us on a larger screen for the best experience.
            </p>
            <p className="text-sm opacity-80">
              Minimum recommended width: 768px
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
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if device is phone-sized (less than 768px width)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!mounted) {
    return null;
  }

  return isMobile ? <MobileWarning /> : <>{children}</>;
}
