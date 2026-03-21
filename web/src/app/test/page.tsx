"use client";

import CircuitCanvas from "@/lib/circuit/CircuitCanvas";
import CircuitPalette from "@/lib/circuit/CircuitPalette";
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

      <div className="w-full flex flex-row gap-10">
        <CircuitPalette />
        <CircuitCanvas
          numQubits={3}
          numColumns={26}
          initialGates={[
            ["h", [0]],
            ["h", [1]],
            ["h", [2]],
            ...oracle,
            ...diffuser,
            ...oracle,
            ...diffuser,
          ]}
          compute
        />
      </div>
      <CircuitCanvas
        numQubits={3}
        numColumns={9}
        initialGates={[
          ["ellipsis", [0]],
          ["ellipsis", [1]],
          ["ellipsis", [2]],
          ...diffuser,
        ]}
        compute={false}
      />
      <CircuitCanvas
        numQubits={5}
        numColumns={9}
        initialGates={[
          ["ellipsis", [0]],
          ["ellipsis", [1]],
          ["ellipsis", [2]],
          ...diffuser,
        ]}
        compute={true}
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
