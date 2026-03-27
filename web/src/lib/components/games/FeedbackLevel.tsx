"use client";

import { useEffect, useRef, useState } from "react";
import { LevelComponentProps } from "./GameHandler";
import { fireConfettiCannon } from "../react-bits/Confetti";
import * as icons from "../ui/Icons";
import { renderSnippet } from "@/lib/markdown/render-snippet";
import { useViewportSize } from "@/lib/hooks/useViewportSize";

const MAX_INPUT = 300;

export default function FeedbackLevel({
  question,
  levelAPI,
  ...props
}: {
  question: string;
} & LevelComponentProps) {
  const viewport = useViewportSize();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [numChars, setNumChars] = useState(0);

  // Ready on mount
  useEffect(() => {
    levelAPI?.ready();
  }, []);

  // Set question grid dimensions
  useEffect(() => {}, [question, viewport]);

  // Once given the okay to start, immediately start playing
  useEffect(() => {
    // Just setting the ready and playing states for GameHandler
    if (props.startTrigger === true) {
      levelAPI?.playing();
    }
  }, [levelAPI, props.startTrigger]);

  const onSubmit = (response: string, e: React.MouseEvent) => {
    if (answerSubmitted) return;
    console.log("Submitting response", response);
    levelAPI?.recordAction("question_answered", { question, response });
    levelAPI?.end({ result: "win" });
    setAnswerSubmitted(true);
    fireConfettiCannon(e.currentTarget as HTMLElement);
  };
  return (
    <div className="flex flex-col gap-4 h-full justify-center items-center">
      <h2
        className="text-2xl font-bold"
        dangerouslySetInnerHTML={{
          __html: renderSnippet(question),
        }}
      />
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full flex flex-col items-center justify-center gap-2"
      >
        <textarea
          ref={inputRef}
          rows={4}
          className="input-no-border p-4 border-2 border-quanta-primary/50 focus:border-quanta-primary transition-all duration-150 w-full h-full max-w-[500px] rounded-xl resize-none"
          maxLength={MAX_INPUT}
          onChange={(e) => setNumChars(e.target.value.length)}
        ></textarea>
        <div className="w-full max-w-[500px] flex justify-between">
          <button
            type="submit"
            className="button-primary bg-quanta-primary text-sm! flex items-center justify-center gap-2"
            onClick={(e) => onSubmit(inputRef.current?.value || "", e)}
          >
            <icons.Check className="w-4 h-4" />
            Submit
          </button>
          <p className="text-sm text-quanta-primary">
            {numChars}/{MAX_INPUT}
          </p>
        </div>
      </form>
    </div>
  );
}
