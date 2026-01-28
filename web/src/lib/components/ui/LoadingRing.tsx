"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingRingProps {
  durationMs: number;
  size?: number;
  strokeWidth?: number;
  onComplete?: () => void;
  className?: string;
}

/**
 * A circular loading ring that progresses over a given duration.
 * Inherits the current text color via `currentColor`.
 */
export function LoadingRing({
  durationMs,
  size = 40,
  strokeWidth = 3,
  onComplete,
  className = "",
}: LoadingRingProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      onComplete?.();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onComplete]);

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={{ display: "block" }}
    >
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={0.3}
      />

      {/* Animated progress circle */}
      <motion.circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          duration: durationMs / 1000,
          ease: "linear",
        }}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      />
    </svg>
  );
}
