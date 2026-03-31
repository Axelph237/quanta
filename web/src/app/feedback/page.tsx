"use client";

import GameHandler from "@/lib/components/games/GameHandler";
import QuestionLevel from "@/lib/components/games/QuestionLevel";
import GradientText from "@/lib/components/react-bits/GradientText";
import confetti from "canvas-confetti";
import { useAnimate, motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { outfit } from "../fonts";
import { GENTLE_EASE, COLORS } from "../globals";
import * as icons from "@/lib/components/ui/Icons";
import "./offboarding.css";
import { useRouter } from "next/navigation";

export const OFFBOARDING_STORAGE_KEY = "offboarded";

export default function FeedbackPage() {
  const router = useRouter();

  const complete = () => {
    localStorage.setItem(OFFBOARDING_STORAGE_KEY, "true");
    router.push("/lessons");
  };

  return (
    <main className="h-full w-full">
      <Offboarding onComplete={complete} />
    </main>
  );
}

function Offboarding({ onComplete }: { onComplete: () => void }) {
  const [scope, animate] = useAnimate();
  const [showForm, setShowForm] = useState(false);

  const fireworks = () => {
    const MAX_FIREWORKS = 5;
    let fireworksLaunched = 0;

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const cat = confetti.shapeFromPath({
      path: "M45.7336 0C48.8798 0.00221635 53.0832 13.692 53.5413 22.4932L55.8928 21.6162L56.4788 21.3975L56.4817 21.3965L59.0891 20.4238C60.7435 19.807 62.6071 20.348 63.6741 21.7549L65.1868 23.75C66.8053 25.8853 65.9071 28.9773 63.3967 29.9141L61.8772 30.4805V43.9014C61.8771 45.571 60.8389 47.0647 59.2747 47.6484L35.009 56.7002C34.3231 56.956 33.6215 56.9446 32.9993 56.7324C32.3775 56.9442 31.6768 56.9568 30.9915 56.7012L6.72583 47.6494C5.16147 47.0659 4.12361 45.5719 4.12329 43.9023V30.4814L2.60376 29.915C0.0932297 28.9785 -0.804628 25.8864 0.813721 23.751L2.32642 21.7559C3.39342 20.3489 5.25686 19.8078 6.91138 20.4248L9.5188 21.3975L9.52173 21.3984L10.1077 21.6172L11.7932 22.2461C12.3158 13.4376 16.4751 0.000328244 19.592 0C23.2823 0.000323203 24.9742 6.15127 25.3586 9.22656C25.4049 9.21855 29.8092 8.45709 32.6624 8.45703C35.5306 8.45708 39.967 9.22656 39.967 9.22656C40.3515 6.15118 42.0432 0 45.7336 0ZM22.5032 16.915C20.8047 16.915 19.428 18.2918 19.428 19.9902C19.4281 21.6886 20.8048 23.0654 22.5032 23.0654C24.2013 23.0651 25.5782 21.6884 25.5784 19.9902C25.5784 18.2919 24.2014 16.9154 22.5032 16.915ZM42.4924 16.915C40.7941 16.9152 39.4172 18.2919 39.4172 19.9902C39.4174 21.6885 40.7942 23.0652 42.4924 23.0654C44.1907 23.0653 45.5684 21.6885 45.5686 19.9902C45.5686 18.2918 44.1908 16.9152 42.4924 16.915Z",
    });
    const defaults = {
      startVelocity: 20,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      particleCount: 15,
      scalar: 1.5,
      shapes: [cat],
    };
    const interval = setInterval(() => {
      // sfx[Math.floor(Math.random() * sfx.length)].play();
      if (!document.hasFocus()) return;

      confetti({
        ...defaults,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      });
      fireworksLaunched++;
      if (fireworksLaunched >= MAX_FIREWORKS) {
        clearInterval(interval);
      }
    }, 1500);

    return interval;
  };

  useEffect(() => {
    const interval = fireworks();
    return () => clearInterval(interval);
  }, []);

  const exit = () => {
    animate(
      scope.current,
      {
        opacity: 0,
      },
      GENTLE_EASE,
    );
    setTimeout(() => {
      onComplete();
    }, GENTLE_EASE.duration! * 1000);
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center h-screen w-full p-12"
      ref={scope}
    >
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="feedback-intro"
            id="feedback-intro"
            exit={{ opacity: 0 }}
            transition={GENTLE_EASE}
            className="flex flex-col items-center justify-center"
          >
            <motion.h1
              className={`text-quanta-headline-large md:text-quanta-headline-medium lg:text-quanta-headline-large break-keep flex items-center justify-center font-bold ${outfit.className}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={GENTLE_EASE}
            >
              Thank You
              <motion.span
                initial={{ rotate: 0 }}
                animate={{
                  rotate: [0, 15, -15, 15, -15, 15, 0],
                  transition: {
                    rotate: { duration: 1, ease: "easeInOut" },
                  },
                }}
                className="cat-icon relative"
              >
                <icons.SchrodingersCat className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 m-4" />
              </motion.span>
            </motion.h1>
            <motion.h2
              className={`text-quanta-headline-small md:text-quanta-headline-medium lg:text-quanta-headline-large break-keep flex items-center justify-center w-fit ${outfit.className}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...GENTLE_EASE, delay: 1 }}
            >
              <span className="mr-2">for learning with</span>
              <GradientText
                colors={[
                  COLORS.primary.hex,
                  COLORS.secondary.hex,
                  COLORS.primary.hex,
                ]}
              >
                Quanta
              </GradientText>
              !
            </motion.h2>

            <motion.h3
              className={`mt-5 w-full body-text break-keep flex items-center justify-center ${outfit.className}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...GENTLE_EASE, delay: 2.5 }}
            >
              My name is Aiden, and I would love your feedback!
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...GENTLE_EASE, delay: 4 }}
              className="flex flex-row gap-4"
            >
              <button
                className="button-primary bg-quanta-primary mt-5"
                onClick={() => setShowForm(true)}
              >
                Absolutely!
              </button>
              <button
                className="button-primary border-2 border-quanta-primary mt-5"
                onClick={exit}
              >
                I&apos;m okay, thanks!
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={GENTLE_EASE}
            key="feedback-quiz"
            id="feedback-quiz"
            className="flex w-full h-full flex-col items-center justify-center"
          >
            <GameHandler
              id="feedback-quiz"
              name="Feedback"
              hideBg
              className="h-fit max-w-3/4 border-0!"
              successMessages={[
                "Thank you so much!",
                "I appreciate your feedback!",
                "Thanks for helping me improve Quanta!",
              ]}
              onGameEnd={exit}
              recordOnly
              levels={[
                <QuestionLevel
                  key={1}
                  question={{
                    type: "step",
                    question:
                      "How accessible was Quanta for someone without a relevant background?",
                    highLabel: "Very",
                    lowLabel: "Not at all",
                    steps: 4,
                  }}
                />,
                <QuestionLevel
                  key={1}
                  question={{
                    type: "step",
                    question: "How enjoyable were the lessons in Quanta?",
                    highLabel: "Very",
                    lowLabel: "Not at all",
                    steps: 4,
                  }}
                />,
                <QuestionLevel
                  key={1}
                  question={{
                    type: "step",
                    question: "How much did you learn from using Quanta?",
                    highLabel: "A lot",
                    lowLabel: "Nothing at all",
                    steps: 4,
                  }}
                />,
                <QuestionLevel
                  key={1}
                  question={{
                    type: "step",
                    question:
                      "Overall, how much did your understanding of quantum computing improve after using Quanta?",
                    highLabel: "A lot",
                    lowLabel: "Not at all",
                    steps: 4,
                  }}
                />,
                <QuestionLevel
                  key={1}
                  question={{
                    type: "choice",
                    question:
                      "Approximately how much time did you spend using Quanta?",
                    answers: [
                      { text: "Less than 10 minutes", correct: true },
                      { text: "10-30 minutes", correct: true },
                      { text: "30-60 minutes", correct: true },
                      { text: "More than 1 hour", correct: true },
                    ],
                  }}
                />,
                <QuestionLevel
                  key={1}
                  question={{
                    type: "free-response",
                    question: "What were your favorite part(s) of Quanta?",
                  }}
                />,
                <QuestionLevel
                  key={1}
                  question={{
                    type: "free-response",
                    question:
                      "What were your least favorite part(s) of Quanta?",
                  }}
                />,
                <QuestionLevel
                  key={1}
                  question={{
                    type: "free-response",
                    question:
                      "What is one feature you would like added to Quanta?",
                  }}
                />,
              ]}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
