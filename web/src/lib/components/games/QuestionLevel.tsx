"use client";

import { useEffect, useRef, useState } from "react";
import { LevelComponentProps } from "./GameHandler";
import { fireConfettiCannon } from "../react-bits/Confetti";
import * as icons from "../ui/Icons";
import { renderSnippet } from "@/lib/markdown/render-snippet";
import { useViewportSize } from "@/lib/hooks/useViewportSize";
import { motion } from "framer-motion";

export interface ChoiceQuestion {
  type: "choice";
  question: string;
  randomize?: boolean;
  multiple?: boolean;
  answers: { text: string; correct: boolean }[];
}

export interface InputQuestion {
  type: "input";
  question: string;
  answer?: string;
}

// Used for qualitative questions usually about user confidence
export interface StepQuestion {
  type: "step";
  question: string;
  highLabel: string;
  lowLabel: string;
  steps: number;
}

export interface FreeResponseQuestion {
  type: "free-response";
  question: string;
}

export type QuizQuestionType =
  | ChoiceQuestion
  | InputQuestion
  | StepQuestion
  | FreeResponseQuestion;

type OnAnswerCallback<T extends QuizQuestionType> = (
  question: T,
  response: { text?: string; value?: number; correct?: boolean },
  e: React.MouseEvent,
) => void;

export default function QuestionLevel({
  question,
  levelAPI,
  ...props
}: {
  question: QuizQuestionType;
} & LevelComponentProps) {
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

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

  const onAnswer = (
    question: QuizQuestionType,
    response: { text?: string; value?: number; correct?: boolean },
    e: React.MouseEvent,
  ) => {
    if (answerSubmitted) return;
    levelAPI?.recordAction("question_answered", { question, response });
    levelAPI?.end({ result: response.correct !== false ? "win" : "lose" });
    if (response.correct !== false) {
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
      {question.type === "choice" ? (
        <ChoiceQuestion question={question} onAnswer={onAnswer} />
      ) : question.type === "input" ? (
        <InputQuestion question={question} onAnswer={onAnswer} />
      ) : question.type === "step" ? (
        <StepQuestion question={question} onAnswer={onAnswer} />
      ) : (
        <FreeResponseQuestion question={question} onAnswer={onAnswer} />
      )}
    </div>
  );
}

function ChoiceQuestion({
  question,
  onAnswer,
}: {
  question: ChoiceQuestion;
  onAnswer: OnAnswerCallback<ChoiceQuestion>;
}) {
  const viewport = useViewportSize();
  const [gridDims, setGridDims] = useState({ cols: 1, rows: 4 });
  const [answers, setAnswers] = useState(question.answers);

  // Ready on mount
  useEffect(() => {
    if (question.randomize === true) {
      const shuffled = [...question.answers].sort(() => Math.random() - 0.5);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers(() => {
        return shuffled;
      });
    }
  }, []);

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

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`grid gap-3 md:gap-4 w-full md:w-fit`}
      style={{
        gridTemplateColumns: `repeat(${gridDims.cols}, 1fr)`,
        gridTemplateRows: `repeat(${gridDims.rows}, 1fr)`,
      }}
    >
      {answers.map((answer) => (
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
      ))}
    </form>
  );
}

function InputQuestion({
  question,
  onAnswer,
}: {
  question: InputQuestion;
  onAnswer: OnAnswerCallback<InputQuestion>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-row gap-2 items-center justify-center"
    >
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
    </form>
  );
}

function StepQuestion({
  question,
  onAnswer,
}: {
  question: StepQuestion;
  onAnswer: OnAnswerCallback<StepQuestion>;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4 items-center justify-center w-fit"
    >
      <div className="flex justify-between w-full">
        <p>{question.lowLabel}</p>
        <p>{question.highLabel}</p>
      </div>
      <div className="flex flex-row items-center w-full gap-8 sm:gap-22 md:gap-28 lg:gap-32">
        {Array.from({ length: question.steps }, (_, i) => (
          <label
            key={i}
            className="border-3 border-quanta-primary size-6 rounded-full background-transparent flex items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: selected === i ? [0, 1.3, 1] : 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="size-4 rounded-full bg-quanta-primary"
            ></motion.div>
            <input
              id={`slider-checkbox-${i}`}
              type="checkbox"
              checked={selected === i}
              key={i}
              className="appearance-none hidden"
              onChange={() => setSelected(i)}
            ></input>
          </label>
        ))}
      </div>
      <button
        className="button-primary bg-quanta-primary place-self-end"
        onClick={(e) => {
          if (selected === null) return;
          onAnswer(question, { value: selected }, e);
        }}
      >
        <icons.Check className="icon" />
      </button>
    </form>
  );
}

const MAX_CHARS = 300;
function FreeResponseQuestion({
  question,
  onAnswer,
}: {
  question: FreeResponseQuestion;
  onAnswer: OnAnswerCallback<FreeResponseQuestion>;
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [numChars, setNumChars] = useState(0);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full flex flex-col items-center justify-center gap-2"
    >
      <textarea
        ref={inputRef}
        rows={4}
        className="input-no-border p-4 border-2 border-quanta-primary/50 focus:border-quanta-primary transition-all duration-150 w-full h-full max-w-[500px] rounded-xl resize-none"
        maxLength={MAX_CHARS}
        onChange={(e) => setNumChars(e.target.value.length)}
      ></textarea>
      <div className="w-full max-w-[500px] flex justify-between">
        <button
          type="submit"
          className="button-primary bg-quanta-primary text-sm! flex items-center justify-center gap-2"
          onClick={(e) =>
            onAnswer(question, { text: inputRef.current?.value || "" }, e)
          }
        >
          <icons.Check className="w-4 h-4" />
          Submit
        </button>
        <p className="text-sm text-quanta-primary">
          {numChars}/{MAX_CHARS}
        </p>
      </div>
    </form>
  );
}
