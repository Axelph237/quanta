"use client";

import { CircuitView } from "@/lib/components/circuit/CircuitView";
import { GatePalette } from "@/lib/components/circuit/GatePalette";
import { createEmptyCircuit } from "@/lib/components/circuit/circuit";
import { DiceLevel } from "@/lib/components/games/DiceLevel";
import GameHandler from "@/lib/components/games/GameHandler";
import QuestionLevel from "@/lib/components/games/QuestionLevel";
import Aurora from "@/lib/components/react-bits/Aurora";
import { useState } from "react";
import { text } from "stream/consumers";

export default function TestPage() {
  const [circuit, setCircuit] = useState(createEmptyCircuit(4, 6));

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col gap-20 items-center justify-center">
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
          <QuestionLevel
            key={1}
            question={{
              type: "choice",
              question: "What is the capital of Germany?",
              answers: [
                { text: "Paris", correct: false },
                { text: "London", correct: false },
                { text: "Berlin", correct: true },
                { text: "Madrid", correct: false },
              ],
            }}
          />,
          <QuestionLevel
            key={1}
            question={{
              type: "input",
              question: "What is the capital of Germany?",
              answer: "Berlin",
            }}
          />,
          <QuestionLevel
            key={1}
            question={{
              type: "choice",
              question: "What is the capital of Spain?",
              answers: [
                { text: "Paris", correct: false },
                { text: "London", correct: false },
                { text: "Berlin", correct: false },
                { text: "Madrid", correct: true },
              ],
            }}
          />,
          <QuestionLevel
            key={1}
            question={{
              type: "input",
              question: "What is the capital of Spain?",
              answer: "Madrid",
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
