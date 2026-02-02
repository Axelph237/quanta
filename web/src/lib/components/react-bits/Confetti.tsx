"use client";

import type { ReactNode } from "react";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from "canvas-confetti";
import confetti from "canvas-confetti";

type Api = {
  fire: (options?: ConfettiOptions) => void;
};

type Props = React.ComponentPropsWithRef<"canvas"> & {
  options?: ConfettiOptions;
  globalOptions?: ConfettiGlobalOptions;
  manualstart?: boolean;
  children?: ReactNode;
};

export type ConfettiRef = Api | null;

const ConfettiContext = createContext<Api>({} as Api);

// Define component first
const ConfettiComponent = forwardRef<ConfettiRef, Props>((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    children,
    ...rest
  } = props;
  const instanceRef = useRef<ConfettiInstance | null>(null);

  const canvasRef = useCallback(
    (node: HTMLCanvasElement) => {
      if (node !== null) {
        if (instanceRef.current) return;
        instanceRef.current = confetti.create(node, {
          ...globalOptions,
          resize: true,
        });
      } else {
        if (instanceRef.current) {
          instanceRef.current.reset();
          instanceRef.current = null;
        }
      }
    },
    [globalOptions],
  );

  const fire = useCallback(
    async (opts = {}) => {
      try {
        await instanceRef.current?.({ ...options, ...opts });
      } catch (error) {
        console.error("Confetti error:", error);
      }
    },
    [options],
  );

  const api = useMemo(
    () => ({
      fire,
    }),
    [fire],
  );

  useImperativeHandle(ref, () => api, [api]);

  useEffect(() => {
    if (!manualstart) {
      (async () => {
        try {
          await fire();
        } catch (error) {
          console.error("Confetti effect error:", error);
        }
      })();
    }
  }, [manualstart, fire]);

  return (
    <ConfettiContext.Provider value={api}>
      <canvas ref={canvasRef} {...rest} />
      {children}
    </ConfettiContext.Provider>
  );
});

// Set display name immediately
ConfettiComponent.displayName = "Confetti";

// Export as Confetti
export const Confetti = ConfettiComponent;

interface ConfettiButtonProps extends React.ComponentProps<"button"> {
  options?: ConfettiOptions &
    ConfettiGlobalOptions & { canvas?: HTMLCanvasElement };
}

const ConfettiButtonComponent = ({
  options,
  children,
  onClick,
  ...props
}: ConfettiButtonProps) => {
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    try {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      await confetti({
        ...options,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
      });
    } catch (error) {
      console.error("Confetti button error:", error);
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

ConfettiButtonComponent.displayName = "ConfettiButton";

export const ConfettiButton = ConfettiButtonComponent;

export const fireConfettiCannon = (context: HTMLElement) => {
  const rect = context.getBoundingClientRect();
  if (!rect) return;
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const cat = confetti.shapeFromPath({
    path: "M45.7336 0C48.8798 0.00221635 53.0832 13.692 53.5413 22.4932L55.8928 21.6162L56.4788 21.3975L56.4817 21.3965L59.0891 20.4238C60.7435 19.807 62.6071 20.348 63.6741 21.7549L65.1868 23.75C66.8053 25.8853 65.9071 28.9773 63.3967 29.9141L61.8772 30.4805V43.9014C61.8771 45.571 60.8389 47.0647 59.2747 47.6484L35.009 56.7002C34.3231 56.956 33.6215 56.9446 32.9993 56.7324C32.3775 56.9442 31.6768 56.9568 30.9915 56.7012L6.72583 47.6494C5.16147 47.0659 4.12361 45.5719 4.12329 43.9023V30.4814L2.60376 29.915C0.0932297 28.9785 -0.804628 25.8864 0.813721 23.751L2.32642 21.7559C3.39342 20.3489 5.25686 19.8078 6.91138 20.4248L9.5188 21.3975L9.52173 21.3984L10.1077 21.6172L11.7932 22.2461C12.3158 13.4376 16.4751 0.000328244 19.592 0C23.2823 0.000323203 24.9742 6.15127 25.3586 9.22656C25.4049 9.21855 29.8092 8.45709 32.6624 8.45703C35.5306 8.45708 39.967 9.22656 39.967 9.22656C40.3515 6.15118 42.0432 0 45.7336 0ZM22.5032 16.915C20.8047 16.915 19.428 18.2918 19.428 19.9902C19.4281 21.6886 20.8048 23.0654 22.5032 23.0654C24.2013 23.0651 25.5782 21.6884 25.5784 19.9902C25.5784 18.2919 24.2014 16.9154 22.5032 16.915ZM42.4924 16.915C40.7941 16.9152 39.4172 18.2919 39.4172 19.9902C39.4174 21.6885 40.7942 23.0652 42.4924 23.0654C44.1907 23.0653 45.5684 21.6885 45.5686 19.9902C45.5686 18.2918 44.1908 16.9152 42.4924 16.915Z",
  });
  confetti({
    startVelocity: 25,
    shapes: [cat],
    origin: {
      x: x / window.innerWidth,
      y: y / window.innerHeight,
    },
  });
};
