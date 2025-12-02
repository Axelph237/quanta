import { Transition } from "framer-motion";

export const GENTLE_EASE: Transition = {
  type: "tween",
  duration: 0.8,
  ease: [0.8, 0.04, 0.48, 0.92],
};