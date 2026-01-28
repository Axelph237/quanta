import { Transition } from "framer-motion";

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
}