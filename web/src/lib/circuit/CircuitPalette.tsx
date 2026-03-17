import { throttle } from "@/lib/throttle";
import { motion } from "framer-motion";
import { cloneElement, useEffect, useRef, useState } from "react";
import { GateAttachEvent, GateDefinition, GateMoveEvent } from "./types";
import { gates } from "./gates";
import { useResponsiveGrid } from "./useResponsiveGrid";
import { useMoveableGate } from "./useMoveableGate";

export default function CircuitPalette() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center w-fit">
      <h1 className="font-bold text-2xl">Gates</h1>
      <ul className="grid grid-cols-2 gap-2 border-2 border-quanta-on-surface p-4 rounded-xl">
        {Object.values(gates)
          .filter((gate) => !gate.hidden)
          .map((gate) => (
            <GateTile key={gate.id} gate={gate} />
          ))}
      </ul>
    </div>
  );
}

const ANIMATION_DELAY = 0.2;
function GateTile({ gate }: { gate: GateDefinition }) {
  const grid = useResponsiveGrid();
  // const ref = useRef<HTMLDivElement>(null);

  // /**
  //  * Drag handlers for motion and resetting the tile's position
  //  */
  // const [dragTimeout, setDragTimeout] = useState<NodeJS.Timeout | null>(null);
  // const [resetTrigger, setResetTrigger] = useState(false);
  // const handleDragStart = () => {
  //   if (dragTimeout) {
  //     clearTimeout(dragTimeout);
  //   }

  //   // console.log("Drag start for", gate.id);
  //   setResetTrigger(false);
  // };

  // const handleDragEnd = () => {
  //   const rect = ref.current!.getBoundingClientRect();
  //   const dropEvent = new CustomEvent<GateMoveEvent>("gate-drop", {
  //     detail: {
  //       gate: gate,
  //       x: rect.x + rect.width / 2,
  //       y: rect.y + rect.height / 2,
  //     },
  //   });
  //   document.dispatchEvent(dropEvent);
  //   setDragTimeout(
  //     setTimeout(() => {
  //       // console.log("Drag timeout for", gate.name);
  //       setResetTrigger(true);
  //     }, 300),
  //   );
  // };

  // useEffect(() => {
  //   const handleAttach = (e: CustomEvent<GateAttachEvent>) => {
  //     console.log("Gate attached to circuit", e.detail.gate.label);
  //     if (e.detail.gate.id === gate.id) {
  //       setResetTrigger(true);
  //     }
  //   };
  //   document.addEventListener("attach-gate", handleAttach as EventListener);
  //   return () => {
  //     document.removeEventListener(
  //       "attach-gate",
  //       handleAttach as EventListener,
  //     );
  //   };
  // }, []);

  // // We need to throttle the onDrag event because it fires up to 200 times per second when dragging lol
  // const throttledOnDrag = throttle((e: CustomEvent<GateMoveEvent>) => {
  //   document.dispatchEvent(e);
  // }, 50); // Maximize to once per 50ms

  // const onDrag = () => {
  //   const rect = ref.current!.getBoundingClientRect();
  //   throttledOnDrag(
  //     new CustomEvent<GateMoveEvent>("gate-drag", {
  //       detail: {
  //         gate: gate,
  //         x: rect.x + rect.width / 2,
  //         y: rect.y + rect.height / 2,
  //       },
  //     }),
  //   );
  // };

  const { scope, reset, setReset, onDragStart, onDragEnd, onDrag } =
    useMoveableGate<HTMLDivElement>({
      gate,
    });

  //   const x = useTransform(isReset, [false, true], [0, 100]);
  //   const y = useTransform(isReset, [false, true], [0, 100]);

  const svg = cloneElement(gate.targetSVG, {
    width: grid.gateSize,
    height: grid.gateSize,
  });

  return (
    <motion.div
      // References and styling
      ref={scope}
      id={`gate-tile-${gate.id}`}
      className={`flex items-center justify-center hover:cursor-grab active:cursor-grabbing z-999 ${reset ? "pointer-events-none" : ""}`}
      style={{ color: gate.color }}
      // Bulky ahhhhhh animation right here. Basically, when the tile is reset via its ttl timer,
      // it scales up to 1.2x its size, then scales down to 0, then fades out before being reset to its original position {x: 0, y: 0}
      animate={
        reset
          ? {
              x: 0,
              y: 0,
              opacity: 0,
              scale: [1.2, 0],
              transition: {
                x: {
                  delay: ANIMATION_DELAY,
                  type: "tween",
                },
                y: {
                  delay: ANIMATION_DELAY,
                  type: "tween",
                },
                opacity: {
                  duration: ANIMATION_DELAY,
                  type: "tween",
                },
                scale: {
                  duration: ANIMATION_DELAY,
                },
              },
            }
          : { opacity: 1, scale: 1 }
      }
      onAnimationComplete={() => setReset(false)}
      // Drag props
      drag
      dragTransition={{
        power: 0.15,
      }}
      onDragEnd={onDragEnd}
      onDrag={onDrag}
      onDragStart={onDragStart}
    >
      {svg}
    </motion.div>
  );
}
