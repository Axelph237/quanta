import { cloneElement, useRef } from "react";
import Draggable from "./Draggable";
import { gates } from "@/lib/circuit";
import {
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  useVelocity,
} from "framer-motion";

export default function GateToy({ gateID }: { gateID: string }) {
  const gate = gates[gateID];
  const bodyRef = useRef<HTMLElement>(document.body);

  const rotate = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const velX = useVelocity(x);
  const velY = useVelocity(y);
  const velocity = useTransform(() =>
    Math.sqrt(velX.get() ** 2 + velY.get() ** 2),
  );

  useMotionValueEvent(velocity, "change", (v) => {
    rotate.set(rotate.get() + v / 100);
  });

  const svg = cloneElement(gate.targetSVG, { className: "size-[50px]" });
  return (
    <Draggable
      drag
      dragConstraints={bodyRef}
      dragElastic={false}
      dragTransition={{
        power: 0.3,
      }}
      className="z-999 shadow-lg relative!"
      style={{ color: gate.color, width: 50, height: 50, x, y, rotate }}
    >
      {svg}
    </Draggable>
  );
}
