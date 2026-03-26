import { useAnimate } from "framer-motion";
import { createContext, useContext } from "react";

type AnimateFunction = ReturnType<typeof useAnimate>[1];

type PageTransitionContextType = {
  pageScope: ReturnType<typeof useAnimate>[0];
  animatePage: (
    keyframes: Parameters<AnimateFunction>[1],
    options?: Parameters<AnimateFunction>[2],
  ) => Promise<void>;
};

export const PageTransitionContext =
  createContext<PageTransitionContextType | null>(null);

// Hooks into the PageTransitionProvider's context
export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error(
      "usePageTransition must be used within an PageTransitionProvider",
    );
  }
  return context;
}

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pageScope, animate] = useAnimate();

  const animatePage = async (
    // Trying to curry this function was a nightmare
    keyframes: Parameters<typeof animate>[1],
    options?: Parameters<typeof animate>[2],
  ) => {
    if (!pageScope.current) {
      throw new Error("pageScope is not defined");
    }
    await animate(pageScope.current, keyframes, options);
  };

  return (
    <PageTransitionContext.Provider
      value={{
        pageScope,
        animatePage,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}
