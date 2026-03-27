"use client";

import { useEffect, useState } from "react";
import { getLessonById } from "@/lib/lessons";
import type { Lesson } from "@/lib/types/lessons";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { redirect, RedirectType } from "next/navigation";
import { COLORS, GENTLE_EASE } from "@/app/globals";
import Logo from "@/lib/components/ui/Logo";
import { DefineTooltips } from "@/lib/components/ui/DefineTooltip";
import * as icons from "@/lib/components/ui/Icons";
import { useAnalytics } from "@/lib/components/providers/AnalyticsProvider";
import CircuitScriptLoader from "@/lib/circuit/quantumCircuitClient";
import { getQuizCompletion, PostQuiz, PreQuiz } from "@/lib/lessons/Quizzes";
import GradientText from "@/lib/components/react-bits/GradientText";
import Link from "next/link";

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonid: string }>;
}) {
  const { recordEvent } = useAnalytics();
  const [lesson, setLesson] = useState<Lesson | undefined>(undefined);
  const { scrollYProgress } = useScroll();
  const breadcrumbOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [lessonId, setLessonId] = useState<string | undefined>(undefined);
  const [quizCompletion, setQuizCompletion] = useState<{
    preQuizCompleted: boolean;
    postQuizCompleted: boolean;
  }>({
    preQuizCompleted: false,
    postQuizCompleted: false,
  });

  useEffect(() => {
    params.then((resolvedParams) => {
      setLesson(getLessonById(resolvedParams.lessonid));
      setLessonId(resolvedParams.lessonid);
      setQuizCompletion(getQuizCompletion(resolvedParams.lessonid));
      recordEvent({ type: "lesson_viewed", lessonId: resolvedParams.lessonid });
    });
  }, [params, recordEvent]);

  const handleLogoClick = () => {
    if (lessonId) {
      recordEvent({ type: "lesson_closed", lessonId: lessonId });
    }
    redirect(
      "/lessons" + (lesson ? "?selected=" + lesson.id : ""),
      RedirectType.push,
    );
  };

  return (
    <>
      <DefineTooltips />
      <CircuitScriptLoader />
      <motion.header
        className="w-full block fixed!"
        animate={{ left: 0 }}
        transition={GENTLE_EASE}
      >
        <div className="flex flex-col items-center">
          <Logo
            id="logo"
            textVisible={false}
            onClick={handleLogoClick}
            className="cursor-pointer place-self-start"
          />

          <motion.div
            style={{ opacity: breadcrumbOpacity }}
            transition={GENTLE_EASE}
            className=" flex place-self-start text-white gap-2"
          >
            <icons.Click className="icon" />
            Click to return to Lessons
          </motion.div>
        </div>
      </motion.header>
      <motion.main className="flex flex-col items-center justify-start">
        <div className="relative top-0 left-0 w-screen h-screen">
          {lesson?.headerImg ? (
            <Image
              src={lesson.headerImg}
              alt={lesson.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-screen h-screen bg-quanta-primary"></div>
          )}
          {lesson?.title && (
            <motion.h2 className="absolute flex top-0 left-0 w-screen h-screen text-center justify-center items-center">
              <span className="text-sm md:text-xl lg:text-2xl font-bold scale-200 w-[25vw]">
                {lesson.title}
              </span>
            </motion.h2>
          )}
        </div>

        {lesson && (
          <AnimatePresence mode="wait">
            {quizCompletion.preQuizCompleted ? (
              <motion.div
                key="lesson-content"
                id="lesson-content"
                className="p-(--page-padding) min-h-screen text-left w-full lg:w-2/3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={GENTLE_EASE}
              >
                {lesson && lesson.pageContent}
                <AnimatePresence mode="wait">
                  {lesson && !quizCompletion.postQuizCompleted && (
                    <motion.div
                      key="post-quiz"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={GENTLE_EASE}
                      className="flex justify-center items-center"
                    >
                      <PostQuiz
                        className="mb-6"
                        lessonId={lesson.id}
                        onEnd={() =>
                          setQuizCompletion({
                            ...quizCompletion,
                            postQuizCompleted: true,
                          })
                        }
                        questions={lesson.postQuestions}
                      />
                    </motion.div>
                  )}
                  {quizCompletion.postQuizCompleted && (
                    <motion.div
                      key="return-button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={GENTLE_EASE}
                      className="h-[25vh] flex justify-center items-center"
                    >
                      <Link
                        href={
                          "/lessons" + (lesson ? "?selected=" + lesson.id : "")
                        }
                        className="cursor-pointer flex flex-col gap-2 justify-center items-center"
                      >
                        <GradientText
                          className="heading-text-lg text-center"
                          colors={[COLORS.primary.hex, COLORS.secondary.hex]}
                        >
                          You&apos;ve completed this lesson!
                        </GradientText>
                        <div className="flex items-center gap-3 heading-text-sm text-quanta-on-surface/50">
                          <icons.Click className="icon" />
                          Click to return to Lessons
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="pre-quiz"
                className="my-24 w-full flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={GENTLE_EASE}
              >
                <PreQuiz
                  className="w-3/4!"
                  lessonId={lesson.id}
                  onEnd={() =>
                    setQuizCompletion({
                      ...quizCompletion,
                      preQuizCompleted: true,
                    })
                  }
                  questions={lesson.preQuestions}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.main>
    </>
  );
}
