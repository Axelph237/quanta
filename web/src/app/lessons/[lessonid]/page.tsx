"use client";

import { useEffect, useState } from "react";
import { getLessonById, Lesson } from "../lessons";
import Image from "next/image";
import { motion } from "framer-motion";
import { redirect, RedirectType } from "next/navigation";
import { GENTLE_EASE } from "@/app/globals";
import Logo from "@/lib/components/Logo";
import { DefineTooltips } from "@/lib/components/DefineTooltip";

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonid: string }>;
}) {
  const [lesson, setLesson] = useState<Lesson | undefined>(undefined);

  useEffect(() => {
    params.then((resolvedParams) => {
      // console.log("Lesson ID:", resolvedParams.lessonid);
      setLesson(getLessonById(resolvedParams.lessonid));
    });
  }, [params]);

  const handleLogoClick = () => {
    redirect(
      "/lessons" + (lesson ? "?selected=" + lesson.id : ""),
      RedirectType.push
    );
  };

  return (
    <>
      <DefineTooltips />
      <motion.header
        className="w-full block"
        animate={{ left: 0 }}
        transition={GENTLE_EASE}
      >
        <Logo
          id="logo"
          textVisible={false}
          onClick={handleLogoClick}
          className="cursor-pointer"
        />
      </motion.header>
      <motion.main className="block flex flex-col items-center justify-start">
        <div className="relative top-0 left-0 w-[100vw] h-[100vh]">
          {lesson?.headerImg ? (
            <Image
              src={lesson.headerImg}
              alt={lesson.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-[100vw] h-[100vh] bg-primary"></div>
          )}
          {lesson?.title && (
            <motion.h2 className="absolute flex top-0 left-0 w-[100vw] h-[100vh] text-center justify-center items-center">
              <span className="text-2xl font-bold scale-200 w-[25vw]">
                {lesson.title}
              </span>
            </motion.h2>
          )}
        </div>
        <div
          id="lesson-content"
          className="p-[var(--page-padding)] min-h-[100vh] text-left w-full lg:w-2/3"
        >
          {lesson && lesson.pageContent}
        </div>
      </motion.main>
    </>
  );
}
