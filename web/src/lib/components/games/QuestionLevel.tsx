import { useEffect, useRef, useState } from "react";
import { GameComponentProps } from "./GameHandler";
import { fireConfettiCannon } from "../react-bits/Confetti";
import * as icons from "../ui/Icons";

interface ChoiceQuestion {
  type: "choice";
  question: string;
  answers: { text: string; correct: boolean }[];
}

interface InputQuestion {
  type: "input";
  question: string;
  answer: string;
}

type QuizQuestion = ChoiceQuestion | InputQuestion;

export default function QuizQuestion({
  question,
  levelAPI,
  ...props
}: {
  question: QuizQuestion;
} & GameComponentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [gridDims, setGridDims] = useState({ cols: 1, rows: 4 });
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  // Ready on mount
  useEffect(() => {
    levelAPI?.ready();
  }, []);

  // Set question grid dimensions
  useEffect(() => {
    if (question.type === "choice") {
      const sideLength = Math.ceil(Math.sqrt(question.answers.length));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGridDims({ cols: sideLength, rows: sideLength });
    }
  }, [question]);

  // Once given the okay to start, immediately start playing
  useEffect(() => {
    // Just setting the ready and playing states for GameHandler
    if (props.startTrigger === true) {
      levelAPI?.playing();
    }
  }, [levelAPI, props.startTrigger]);

  const onAnswer = (
    question: QuizQuestion,
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
      <h2 className="text-2xl font-bold">{question.question}</h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        className={`grid gap-4`}
        style={{
          gridTemplateColumns: `repeat(${gridDims.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridDims.rows}, 1fr)`,
        }}
      >
        {question.type === "choice" ? (
          question.answers.map((answer) => (
            <button
              key={answer.text}
              className="button-primary bg-primary col-span-1 text-xl"
              onClick={(e) => onAnswer(question, answer, e)}
            >
              {answer.text}
            </button>
          ))
        ) : (
          <div className="flex flex-row gap-2 items-center justify-center">
            <input
              type="text"
              ref={inputRef}
              className="input-no-border p-2 border-b-3 border-primary/25 focus:border-primary/75 transition-all duration-200"
            />
            <button
              type="submit"
              className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-200"
              onClick={(e) =>
                onAnswer(
                  question,
                  {
                    text: inputRef.current?.value || "",
                    correct:
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
        )}
      </form>
    </div>
  );
}
