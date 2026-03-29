import { LESSONS } from "@/lib/lessons";
import { Transition } from "framer-motion";

declare global {
  var finishAllLessons: () => void;
  var colors: Record<string, { hex: string; rgb: number[] }>;
  var transitions: Record<string, Transition>;
}

export const GENTLE_EASE: Transition = {
  type: "tween",
  duration: 0.8,
  ease: [0.8, 0.04, 0.48, 0.92],
};

export const COLORS = {
  primary: {
    hex: "#2b7fff",
    rgb: [43, 127, 255],
  },
  secondary: {
    hex: "#c27aff",
    rgb: [194, 122, 255],
  },
  error: {
    hex: "#fb2c36",
    rgb: [251, 44, 54],
  }
}

// I just found out about globalThis at the end of development 😫 bruh... so these variables aren't used anywhere lol
globalThis.colors = COLORS;
globalThis.transitions = {
  gentleEase: GENTLE_EASE,
}