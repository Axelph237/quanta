"use client";

import { CircuitPalette, CircuitCanvas } from "@/lib/circuit";
import CircuitScriptLoader, { State } from "@/lib/circuit/quantumCircuitClient";
import { DefineTooltips } from "@/lib/components/ui/DefineTooltip";
import ProbGraph from "@/lib/components/ui/figures/ProbGraph";
import { useViewportSize } from "@/lib/hooks/useViewportSize";
import { renderSnippet } from "@/lib/markdown/render-snippet";
import Link from "next/link";
import { useState } from "react";

export default function PlaygroundPage() {
  const viewport = useViewportSize();
  const [state, setState] = useState<State[]>([]);
  const [katex, setKatex] = useState<string>("");

  const isFrac = (number: number) => {
    return Math.abs(number) > 0.001 && Math.abs(number) < 1;
  };

  const stateToKatex = (state: Omit<State, "prob">[]) => {
    let katex = "$\\Psi = ";
    for (let i = 0; i < state.length; i++) {
      const q = state[i];

      if (isFrac(q.real)) {
        katex += q.real.toFixed(2);
      }
      if (isFrac(q.imag)) {
        katex += q.imag.toFixed(2) + "i";
      }
      katex += `|${q.bits}\\rangle`;
      if (i < state.length - 1) {
        katex += "+";
      }
    }
    katex += "$";
    return katex;
  };

  const handleCompute = (state: State[]) => {
    console.log("New state", state);
    setState(state);

    const filteredState = state.filter(
      (s) => Math.abs(s.real) > 0.001 || Math.abs(s.imag) > 0.001,
    );
    setKatex(stateToKatex(filteredState));
  };

  if (viewport.width < 1050) {
    // Arbitrary breakpoint because I am tired
    return (
      <main className="flex flex-col gap-8 h-screen items-center justify-center p-(--page-padding)">
        <h1 className="display-text-lg font-bold">Playground</h1>
        <h2 className="body-text text-center opacity-80">
          Please view on a larger device :(
        </h2>
        <Link
          href="/lessons"
          className="button-primary body-text border-2 border-quanta-primary"
        >
          Back
        </Link>
      </main>
    );
  }

  return (
    <>
      <CircuitScriptLoader />
      <DefineTooltips />
      <main className="flex flex-col gap-6 h-screen items-center justify-center p-(--page-padding)">
        <div className="flex flex-row justify-between w-full">
          <h1 className="display-text-lg font-bold">Playground</h1>
          <div className="flex flex-col gap-2 items-center justify-center">
            {viewport.isXL && (
              <h2 className="body-text self-end opacity-75">
                Build a quantum circuit and see the results!
              </h2>
            )}
            <Link
              href="/lessons"
              className="button-primary body-text border-2 border-quanta-primary self-end"
            >
              Back to Lessons
            </Link>
          </div>
        </div>
        <div
          id="playground-container"
          className="size-full border-2 border-quanta-on-surface p-8 rounded-xl"
        >
          <div className="flex flex-row justify-between">
            <CircuitPalette />
            <div className="place-self-end">
              <CircuitCanvas
                numQubits={3}
                numColumns={10}
                initialGates={[]}
                onCompute={handleCompute}
                compute
              />
            </div>
          </div>
          <div className="flex flex-row gap-6">
            <div className="border-2 border-quanta-primary bg-quanta-primary/15 flex flex-col w-full items-center rounded-lg">
              <h3 className="body-text p-6 font-bold">Probabilities</h3>
              <ProbGraph
                yMin={0}
                yMax={1}
                values={state.map((s) => s.prob)}
                labels={state.map((s) => s.bits)}
              />
            </div>
            <div className="border border-quanta-on-surface flex flex-col w-full items-center rounded-lg">
              <h3 className="body-text p-6 font-bold">State</h3>
              <div
                className="output-katex p-6"
                dangerouslySetInnerHTML={{
                  __html: renderSnippet(katex),
                }}
              ></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
