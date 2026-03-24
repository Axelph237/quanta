/**
 * Circuit Level displays a circuit and an outcome state, asking the user to create that state.
 */

import { useEffect, useState } from "react";
import { LevelComponentProps } from "./GameHandler";
import { CircuitCanvas, CircuitPalette, State } from "@/lib/circuit";
import { renderSnippet } from "@/lib/markdown/render-snippet";

export default function CircuitLevel({
  initialGates,
  options, // the gates the user has the option of choosing
  numQubits,
  numColumns,
  targetState,
  levelAPI,
  ...props
}: {
  initialGates: [string, number[]][];
  options?: string[];
  numQubits: number;
  numColumns: number;
  targetState: Omit<State, "prob">[];
} & LevelComponentProps) {
  const [correct, setCorrect] = useState<boolean>(false);
  const [outputKatex, setOutputKatex] = useState<string>("");

  // Ready on mount
  useEffect(() => {
    levelAPI?.ready();
  }, []);

  // Once given the okay to start, immediately start playing
  useEffect(() => {
    // Just setting the ready and playing states for GameHandler
    if (props.startTrigger === true) {
      levelAPI?.playing();
    }
  }, [levelAPI, props.startTrigger]);

  const floatEq = (a: number, b: number, epsilon: number = 0.001) => {
    return Math.abs(a - b) < epsilon;
  };

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

  const verifyState = (state: State[]) => {
    if (state.length !== targetState.length) {
      return false;
    }

    state.sort((a, b) => (a.bits > b.bits ? 1 : -1));
    targetState.sort((a, b) => (a.bits > b.bits ? 1 : -1));

    for (let i = 0; i < state.length; i++) {
      if (
        !floatEq(state[i].real, targetState[i].real) ||
        !floatEq(state[i].imag, targetState[i].imag)
      ) {
        return false;
      }
    }
    return true;
  };

  const handleChange = (state: State[]) => {
    // Any state that is effectively zero should be filtered out
    const filteredState = state.filter(
      (s) => Math.abs(s.real) > 0.001 || Math.abs(s.imag) > 0.001,
    );

    setOutputKatex(stateToKatex(filteredState));

    if (verifyState(filteredState)) {
      setCorrect(true);
      // Just a small delay to feel more natural
      setTimeout(() => {
        levelAPI?.end({ result: "win" });
      }, 150);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-2xl">
      Build The State:
      <div
        className="target-katex"
        dangerouslySetInnerHTML={{
          __html: renderSnippet(stateToKatex(targetState)),
        }}
      ></div>
      <div className="flex flex-row gap-6">
        <CircuitPalette only={options} />
        <CircuitCanvas
          numQubits={numQubits}
          numColumns={numColumns}
          initialGates={initialGates}
          compute
          onCompute={handleChange}
        />
      </div>
      Current Circuit State:
      <div
        className="output-katex"
        dangerouslySetInnerHTML={{ __html: renderSnippet(outputKatex) }}
      ></div>
    </div>
  );
}
