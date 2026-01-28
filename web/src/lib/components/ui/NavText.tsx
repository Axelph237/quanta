"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import GradientText from "../react-bits/GradientText";
import { outfit } from "@/app/fonts";

interface NavTextProps extends HTMLMotionProps<"span"> {
  text: string;
}

export default function NavText({
  text,
  className = "",
  onClick = undefined,
  ...props
}: NavTextProps) {
  return (
    <motion.span
      className={`relative inline-block ${outfit.className} ${className}`}
      initial="default"
      whileHover="hover"
      onClick={onClick}
      {...props}
    >
      {/* Normal text - fades out on hover */}
      <motion.span
        className="block"
        variants={{
          default: { opacity: 1 },
          hover: { opacity: 0 },
        }}
        transition={{ duration: 0.3 }}
      >
        {text}
      </motion.span>

      {/* Gradient text - fades in on hover */}
      <motion.span
        className="absolute inset-0"
        variants={{
          default: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
      >
        <GradientText
          colors={[
            "var(--color-primary)",
            "var(--color-primary-container)",
            "var(--color-primary)",
          ]}
          animationSpeed={3}
        >
          {text}
        </GradientText>
      </motion.span>
    </motion.span>
  );
}
