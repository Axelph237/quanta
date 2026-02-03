"use client";

import { CircuitView } from "@/lib/components/circuit/CircuitView";
import { GatePalette } from "@/lib/components/circuit/GatePalette";
import { createEmptyCircuit } from "@/lib/components/circuit/circuit";
import GameHandler from "@/lib/components/games/GameHandler";
import QuestionLevel from "@/lib/components/games/QuestionLevel";
import Aurora from "@/lib/components/react-bits/Aurora";
import LineChart from "@/lib/components/ui/LineChart";
import { useState } from "react";

const a0 = 5.29177210903e-11;

const hydro1s = (r: number) =>
  2 * (1 / (Math.sqrt(Math.PI) * a0)) ** (3 / 2) * Math.exp(-r / a0);

export default function TestPage() {
  const [circuit, setCircuit] = useState(createEmptyCircuit(4, 6));

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col gap-20 items-center justify-center">
      <LineChart
        functions={[
          { fn: (r) => 4 * Math.PI * r ** 2 * hydro1s(r) ** 2, label: "1s" },
        ]}
        xMin={0}
        xMax={20 * a0}
        numPoints={100}
        title="Mathematical Functions"
      />
      {/* Game Components */}
      <GameHandler
        id="test-quiz"
        name="QUIZ"
        description="A fun little quiz!"
        bg={<Aurora />}
        levels={[
          <QuestionLevel
            key={1}
            question={{
              type: "choice",
              question: "What is the capital of France?",
              answers: [
                { text: "Paris", correct: true },
                { text: "London", correct: false },
                { text: "Berlin", correct: false },
                { text: "Madrid", correct: false },
              ],
            }}
          />,
          <QuestionLevel
            key={1}
            question={{
              type: "input",
              question: "What is the capital of France?",
              answer: "Paris",
            }}
          />,
        ]}
      />
      {/* Circuit Builder */}
      <div className="w-full h-fit flex flex-row items-center justify-center">
        <GatePalette />
        <CircuitView circuit={circuit} setCircuit={setCircuit} />
      </div>
    </div>
  );
}
