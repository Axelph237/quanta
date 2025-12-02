"use client";

import { useAnimatedRedirect } from "@/hooks/useAnimatedRedirect";

export default function About() {
  const [scope, animatedRedirect] = useAnimatedRedirect();

  const handleRedirect = () => {
    animatedRedirect("/");
  };

  return (
    <div
      className="flex min-h-[calc(100vh-theme(spacing.24))] flex-col items-center justify-center text-center p-4"
      ref={scope}
    >
      <h1 className="mb-4 text-4xl font-bold">About Page</h1>
      <p className="mb-8 text-lg">
        You've arrived! Note the different entrance animation.
      </p>
      <button
        onClick={handleRedirect}
        className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
      >
        Go Back Home
      </button>
    </div>
  );
}
