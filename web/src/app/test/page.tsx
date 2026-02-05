"use client";

import { CircuitView } from "@/lib/components/circuit/CircuitView";
import { GatePalette } from "@/lib/components/circuit/GatePalette";
import { createEmptyCircuit } from "@/lib/components/circuit/circuit";
import FnChart from "@/lib/components/ui/figures/FnChart";
import { useState } from "react";
import { COLORS } from "../globals";

const a0 = 5.29177210903e-11;

const R1s = (r: number) =>
  (1 / Math.sqrt(Math.PI)) * (1 / a0) ** (3 / 2) * Math.exp(-r / a0);

const R2s = (r: number) =>
  (1 / (32 * Math.sqrt(Math.PI))) *
  (1 / a0) ** (3 / 2) *
  (2 - r / a0) *
  Math.exp(-r / (2 * a0));

const P = (R: (r: number) => number) => (r: number) =>
  4 * Math.PI * r ** 2 * R(r) ** 2;

export default function TestPage() {
  const [circuit, setCircuit] = useState(createEmptyCircuit(4, 6));

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col gap-20 items-center justify-center">
      <FnChart
        chart={{
          view: {
            axes: {
              x: {
                min: 0,
                max: 15,
                label: "r",
                unit: {
                  scale: a0,
                  name: "a0",
                },
              },
              y: {
                min: 0,
                max: 2,
                label: "P(a0)",
                unit: {
                  scale: P(R1s)(a0),
                },
              },
            },
            axesColor: "#ffffff",
            font: "Outfit",
          },
          plots: [
            {
              fn: (r: number) => P(R1s)(r),
              options: {
                color: COLORS.primary.hex,
              },
              fidelity: 0.1,
            },
          ],
        }}
      />
      <FnChart
        chart={{
          view: {
            axes: {
              x: {
                min: -4,
                max: 4,
              },
              y: {
                min: 0,
                max: 16,
              },
            },
            axesColor: "#ffffff",
            font: "Outfit",
          },
          plots: [
            {
              fn: (x: number) => x ** 2,
              options: {
                color: COLORS.primary.hex,
              },
              fidelity: 0.1,
            },
          ],
        }}
      />
      {/* Game Components */}
      {/* Circuit Builder */}
      <div className="w-full h-fit flex flex-row items-center justify-center">
        <GatePalette />
        <CircuitView circuit={circuit} setCircuit={setCircuit} />
      </div>
    </div>
  );
}
