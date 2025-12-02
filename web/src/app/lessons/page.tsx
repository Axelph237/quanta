"use client";

import { useState, useEffect } from "react";
import {
  motion,
  type Transition,
  AnimatePresence,
  useAnimate,
} from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { outfit } from "@/app/fonts";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import useComputedCSS from "@/hooks/useComputedCSS";
import { GENTLE_EASE } from "../globals";
import { Lesson, LESSONS } from "./lessons";

const GAP = 64; // gap-16 is 4rem = 64px

export default function LessonsPage() {
  const { cssvar, csstopx } = useComputedCSS();

  const [activeIndex, setActiveIndex] = useState(0);
  const [lessonOpened, setLessonOpened] = useState(false);
  const [viewportDims, setViewportDims] = useState({ width: 0, height: 0 });
  const [logoShift, setLogoShift] = useState<number>(0);

  const [redirecting, setRedirecting] = useState(false);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const handleResize = () => {
      setViewportDims({ height: window.innerHeight, width: window.innerWidth });
      const logoWidth = document
        .getElementById("logo")!
        .getBoundingClientRect().width;
      setLogoShift(
        window.innerWidth * 0.5 -
          logoWidth / 2 -
          Number(csstopx(cssvar("--page-padding", document.body))) -
          7 // HUH
      );
    };
    handleResize(); // Set initial height
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate the y-offset to center the active item.
  // We want the center of the active item to be at the center of the viewport.
  // Item height is 50vh (viewportHeight * 0.5)
  // Gap is fixed at 64px
  // Item i center is at: i * (itemHeight + GAP) + itemHeight/2
  // So we need to shift up by that amount.
  const itemHeight = viewportDims.height * 0.4;
  const yOffset =
    -(
      activeIndex * (itemHeight + GAP) +
      (lessonOpened ? viewportDims.height : itemHeight) / 2
    ) +
    viewportDims.height * 0.5;

  const handleHomeRedirect = async () => {
    setRedirecting(true);
    await animate(scope.current!, { left: "100vw", opacity: 0 }, GENTLE_EASE);

    redirect("/home");
  };

  const handleLessonClick = (index: number) => {
    if (index === activeIndex) {
      setLessonOpened(!lessonOpened);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: lessonOpened ? 0 : 1 }}
        transition={GENTLE_EASE}
        className="absolute left-0 top-0 w-[100vw] h-16 pointer-events-none z-1 bg-linear-to-b from-surface to-transparent"
      ></motion.div>

      <motion.header
        className="w-fit"
        animate={{ left: redirecting ? logoShift : 0 }}
        transition={GENTLE_EASE}
      >
        <Logo
          id="logo"
          textVisible={redirecting}
          onClick={handleHomeRedirect}
          className="cursor-pointer"
        />
      </motion.header>

      {/* Main Container: Fixed and hidden overflow to act as the viewport for the carousel */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        ref={scope}
        className="fixed inset-0 h-screen w-screen overflow-hidden bg-surface text-on-surface flex items-center"
      >
        {/* Carousel List */}
        <motion.div
          className="absolute top-1/2 left-0 right-0 flex flex-col gap-16 items-center"
          animate={{
            top: yOffset,
          }}
          transition={GENTLE_EASE}
        >
          {LESSONS.map((lesson, index) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              isActive={index === activeIndex}
              isOpened={index === activeIndex && lessonOpened}
              onClick={() => handleLessonClick(index)}
              viewportDims={viewportDims}
            />
          ))}
        </motion.div>

        {/* Fixed Label Container */}
        {/* <div
          className={`pointer-events-none fixed top-1/2 left-10 -translate-y-1/2 w-1/2 z-20 ${outfit.className}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              id="lesson-label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col gap-4"
            >
              <h2 className="text-4xl text-on-surface bg-green-300">
                {LESSONS[activeIndex].title}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div> */}
      </motion.main>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: lessonOpened ? 0 : 1 }}
        transition={GENTLE_EASE}
        className="absolute bottom-0 left-0 w-[100vw] h-16 pointer-events-none z-1 bg-linear-to-t from-surface to-transparent"
      ></motion.div>
    </>
  );
}

function LessonItem({
  lesson,
  isActive,
  isOpened,
  onClick,
  viewportDims,
}: {
  lesson: Lesson;
  isActive: boolean;
  isOpened: boolean;
  onClick: () => void;
  viewportDims: { height: number; width: number };
}) {
  return (
    <motion.div
      className={`relative lesson-container cursor-pointer shrink-0 bg-primary text-on-surface ${outfit.className}`}
      initial={{ width: "40vw", height: "40vh" }}
      animate={{
        scale: isActive ? 1 : 0.8,
        opacity: isActive ? 1 : 0.6,
        width: isOpened ? "100vw" : "40vw",
        height: isOpened ? "100vh" : "40vh",
      }}
      style={{ pointerEvents: "auto" }}
      transition={GENTLE_EASE}
      onClick={onClick}
    >
      {lesson.img && (
        <Image
          src={lesson.img}
          alt={lesson.title}
          className="w-full h-full cover"
        />
      )}
      <motion.h2
        initial={{ opacity: 0, x: viewportDims.width * 0.3, width: "30vw" }}
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isOpened ? 2 : 1,
          x: isOpened ? 0 : -viewportDims.width * 0.3,
          filter: isActive ? "blur(0px)" : "blur(20px)",
          width: isOpened ? "100vw" : "30vw",
          color: isOpened
            ? "var(--color-on-primary)"
            : "var(--color-on-surface)",
        }}
        transition={GENTLE_EASE}
        className="absolute flex top-0 h-full text-center justify-center items-center text-4xl"
      >
        <span className="w-[30vw]">{lesson.title}</span>
      </motion.h2>
    </motion.div>
  );
}
