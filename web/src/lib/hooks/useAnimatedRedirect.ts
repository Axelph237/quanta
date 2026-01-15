"use client";

import { useAnimate } from "framer-motion";
import { useRouter } from "next/navigation";

/**
 * A hook to orchestrate an exit animation on the current page before navigating to a new route.
 *
 * @returns An array containing:
 *  - `scope`: Animation scope to attach to the component you want to animate.
 *  - `animatedRedirect`: An async function to trigger the exit animation and then redirect.
 */
export function useAnimatedRedirect() {
  const [scope, animate] = useAnimate();
  const router = useRouter();

  const animatedRedirect = async (
    href: string,
    ...animations: Parameters<typeof animate>[]
  ) => {
    for (const anim of animations) {
      await animate(...anim);
    }
    // Once the animation is complete, push the new route
    router.push(href);
  };

  return [scope, animatedRedirect] as const;
}
