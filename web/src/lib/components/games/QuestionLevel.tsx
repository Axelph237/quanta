"use client";

import { useEffect, useRef, useState } from "react";
import { LevelComponentProps } from "./GameHandler";
import { fireConfettiCannon } from "../react-bits/Confetti";
import * as icons from "../ui/Icons";
import { renderSnippet } from "@/lib/markdown/render-snippet";
import { useViewportSize } from "@/lib/hooks/useViewportSize";

interface ChoiceQuestion {
  type: "choice";
  question: string;
  randomize?: boolean;
  answers: { text: string; correct: boolean }[];
}

interface InputQuestion {
  type: "input";
  question: string;
  answer?: string;
}

// Used for qualitative questions usually about user confidence
interface SliderQuestion {
  type: "slider";
  question: string;
  highLabel: string;
  lowLabel: string;
  steps: number;
}

export type QuizQuestionType = ChoiceQuestion | InputQuestion | SliderQuestion;

export default function QuestionLevel({
  question,
  levelAPI,
  ...props
}: {
  question: QuizQuestionType;
} & LevelComponentProps) {
  const viewport = useViewportSize();
  const inputRef = useRef<HTMLInputElement>(null);
  const [gridDims, setGridDims] = useState({ cols: 1, rows: 4 });
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const [answers, setAnswers] = useState(
    question.type === "choice" ? [...question.answers] : [],
  );

  // Ready on mount
  useEffect(() => {
    if (question.type === "choice" && question.randomize === true) {
      const shuffled = [...question.answers].sort(() => Math.random() - 0.5);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers(() => {
        return shuffled;
      });
    }
    levelAPI?.ready();
  }, []);

  // Set question grid dimensions
  useEffect(() => {
    if (question.type === "choice") {
      if (viewport.isMd) {
        const sideLength = Math.ceil(Math.sqrt(question.answers.length));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGridDims({ cols: sideLength, rows: sideLength });
      } else {
        setGridDims({ cols: 1, rows: question.answers.length });
      }
    }
  }, [question, viewport]);

  // Once given the okay to start, immediately start playing
  useEffect(() => {
    // Just setting the ready and playing states for GameHandler
    if (props.startTrigger === true) {
      levelAPI?.playing();
    }
  }, [levelAPI, props.startTrigger]);

  const onAnswer = (
    question: QuizQuestionType,
    response: { text: string; correct: boolean },
    e: React.MouseEvent,
  ) => {
    if (answerSubmitted) return;
    levelAPI?.recordAction("question_answered", { question, response });
    levelAPI?.end({ result: response.correct ? "win" : "lose" });
    if (response.correct) {
      setAnswerSubmitted(true);
      fireConfettiCannon(e.currentTarget as HTMLElement);
    }
  };
  return (
    <div className="flex flex-col gap-4 h-full justify-center items-center">
      <h2
        className="text-2xl font-bold"
        dangerouslySetInnerHTML={{
          __html: renderSnippet(question.question),
        }}
      />
      <form
        onSubmit={(e) => e.preventDefault()}
        className={`grid gap-3 md:gap-4 w-full md:w-fit`}
        style={{
          gridTemplateColumns: `repeat(${gridDims.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridDims.rows}, 1fr)`,
        }}
      >
        {question.type === "choice" ? (
          // Choice questions
          answers.map((answer) => (
            <button
              key={answer.text}
              className="button-primary bg-quanta-primary col-span-1"
              onClick={(e) => onAnswer(question, answer, e)}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: renderSnippet(answer.text),
                }}
              />
            </button>
          ))
        ) : question.type === "input" ? (
          // Input questions
          <div className="flex flex-row gap-2 items-center justify-center">
            <input
              type="text"
              ref={inputRef}
              className="input-no-border p-2 border-b-3 border-quanta-primary/25 focus:border-quanta-primary/75 transition-all duration-200"
            />
            <button
              type="submit"
              className="bg-quanta-primary w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-200"
              onClick={(e) =>
                onAnswer(
                  question,
                  {
                    text: inputRef.current?.value || "",
                    correct:
                      question.answer === undefined ||
                      inputRef.current?.value.toLowerCase() ===
                        question.answer.toLowerCase(),
                  },
                  e,
                )
              }
            >
              <icons.Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // Slider questions
          <div>TODO: Slider questions</div>
        )}
      </form>
    </div>
  );
}
