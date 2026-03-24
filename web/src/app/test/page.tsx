"use client";

import CircuitCanvas from "@/lib/circuit/CircuitCanvas";
import CircuitPalette from "@/lib/circuit/CircuitPalette";
import GameHandler from "@/lib/components/games/GameHandler";
import CircuitLevel from "@/lib/components/games/CircuitLevel";
import Aurora from "@/lib/components/react-bits/Aurora";
import Iridescence from "@/lib/components/react-bits/Iridescence";
import { DefineTooltips } from "@/lib/components/ui/DefineTooltip";

// const a0 = 5.29177210903e-11;

// const R1s = (r: number) =>
//   (1 / Math.sqrt(Math.PI)) * (1 / a0) ** (3 / 2) * Math.exp(-r / a0);

// const R2s = (r: number) =>
//   (1 / (32 * Math.sqrt(Math.PI))) *
//   (1 / a0) ** (3 / 2) *
//   (2 - r / a0) *
//   Math.exp(-r / (2 * a0));

// const P = (R: (r: number) => number) => (r: number) =>
//   4 * Math.PI * r ** 2 * R(r) ** 2;

const ccz: [string, number[]][] = [
  ["h", [2]],
  ["fill", [0]],
  ["fill", [1]],
  ["ccx", [0, 1, 2]],
  ["fill", [1]],
  ["fill", [0]],
  ["h", [2]],
];

const oracle: [string, number[]][] = [
  ["x", [0]],
  ["x", [1]],
  ["fill", [2]],
  ...ccz,
  ["fill", [2]],
  ["x", [1]],
  ["x", [0]],
];

const diffuser: [string, number[]][] = [
  ["h", [0]],
  ["h", [1]],
  ["h", [2]],
  ["x", [0]],
  ["x", [1]],
  ["x", [2]],
  ...ccz,
  ["x", [0]],
  ["x", [1]],
  ["x", [2]],
  ["h", [0]],
  ["h", [1]],
  ["h", [2]],
];

export default function TestPage() {
  return (
    <main className="w-[100vw] h-[100vh] flex flex-col gap-20 items-center justify-center">
      <DefineTooltips />

      <GameHandler
        id="test"
        name="Test"
        levels={[
          <CircuitLevel
            key={1}
            initialGates={[]}
            options={["h", "x", "s"]}
            numQubits={2}
            numColumns={4}
            levelAPI={undefined}
            startTrigger={false}
            targetState={[
              {
                bits: "000",
                real: 1 / Math.sqrt(2),
                imag: 0,
              },
              {
                bits: "001",
                imag: 1 / Math.sqrt(2),
                real: 0,
              },
            ]}
          />,
        ]}
        bg={<Aurora />}
      />
      {/* <FnChart
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
      /> */}
    </main>
  );
}
