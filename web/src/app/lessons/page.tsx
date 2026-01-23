"use client";

import {
  useState,
  useEffect,
  Suspense,
  useRef,
  RefObject,
  useLayoutEffect,
} from "react";
import {
  motion,
  useAnimate,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { outfit } from "@/app/fonts";
import { redirect, RedirectType, useSearchParams } from "next/navigation";
import Logo from "@/lib/components/Logo";
import useComputedCSS from "@/lib/hooks/useComputedCSS";
import { GENTLE_EASE } from "../globals";
import { Lesson, LESSONS, Unit, UNITS } from "./lessons";
import GradientText from "@/lib/components/react-bits/GradientText";

function LessonsPageContent() {
  const searchParams = useSearchParams();
  const selectedLessonId = searchParams.get("selected");
  const selectedLessonIndex = LESSONS.findIndex(
    (l) => l.id === selectedLessonId,
  );

  const { cssvar, csstopx } = useComputedCSS();

  const [focusedIndex, setFocusedIndex] = useState(
    selectedLessonIndex !== -1 ? selectedLessonIndex : 0,
  );
  const [lessonOpened, setLessonOpened] = useState<number | false>(false);
  const [logoShift, setLogoShift] = useState<number>(0);

  const [redirecting, setRedirecting] = useState(false);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const handleResize = () => {
      const logoWidth = document
        .getElementById("logo")!
        .getBoundingClientRect().width;
      setLogoShift(
        window.innerWidth * 0.5 -
          logoWidth / 2 -
          Number(csstopx(cssvar("--page-padding", document.body))) -
          7, // HUH
      );
    };
    handleResize(); // Set initial height
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleHomeRedirect = async () => {
    setRedirecting(true);
    await animate(scope.current!, { left: "100vw", opacity: 0 }, GENTLE_EASE);

    redirect("/home", RedirectType.push);
  };

  const handleLessonClick = (index: number) => {
    setLessonOpened(index);
    setTimeout(() => {
      redirect(`/lessons/${LESSONS[index].id}`, RedirectType.push);
    }, 1000);
  };

  // When sidebar blob is clicked, scroll to corresponding lesson
  const handleLessonJump = (lesson: Lesson, index: number) => {
    if (index !== focusedIndex) {
      const lessonItem = document.getElementById(
        `${lesson.id}-card`,
      ) as HTMLDivElement;

      if (lessonItem) {
        lessonItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // When a lesson is scrolled into view
  const handleLessonFocus = (index: number) => {
    if (index !== focusedIndex) {
      setFocusedIndex(index);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: lessonOpened !== false ? 0 : 1 }}
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
        className={`relative inset-0 h-screen w-screen ${lessonOpened ? "overflow-hidden" : "overflow-y-scroll"} bg-surface text-on-surface flex items-center ${lessonOpened ? "" : ""}`}
      >
        {/* Carousel List */}
        <motion.div
          id="carousel-list"
          className="absolute left-0 right-0 flex flex-col gap-18 items-center snap-center"
          animate={{
            top: 0,
          }}
          transition={GENTLE_EASE}
        >
          {/* <div className="shadow-item h-[40vh] w-full"></div> */}
          {LESSONS.map((lesson, index) => {
            const [unitIdx, lessonIdx] = lesson.tocId.split(".").map(Number);

            return (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                parentRef={scope}
                // inViewRef={inViewTargetRef}
                unit={lessonIdx === 0 ? UNITS[unitIdx - 1] : false}
                isOpened={lessonOpened === index}
                onClick={() => handleLessonClick(index)}
                onFocus={() => handleLessonFocus(index)}
                // viewportDims={viewportDims}
              />
            );
          })}
          <div className="shadow-item h-[100vh] w-full"></div>
        </motion.div>

        {/* Lesson Blobs */}
        <motion.ol
          animate={{ translateX: lessonOpened ? "25vw" : 0 }}
          transition={GENTLE_EASE}
          className="fixed flex flex-col items-center top-1/2 right-[var(--page-padding)] -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity duration-500 whitespace-nowrap min-w-[20px] "
        >
          {LESSONS.map((lesson, index) => (
            <motion.li
              key={index}
              className={`w-full rounded-lg my-2 ${
                lesson.tocId.split(".")[1] === "0"
                  ? "bg-secondary"
                  : "bg-primary"
              } cursor-pointer`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: focusedIndex === index ? 1 : 0.8,
                height: focusedIndex === index ? "40px" : "20px",
              }}
              transition={{ duration: 0.2 }}
              onClick={() => handleLessonJump(lesson, index)}
            ></motion.li>
          ))}
        </motion.ol>
      </motion.main>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: lessonOpened !== false ? 0 : 1 }}
        transition={GENTLE_EASE}
        className="absolute bottom-0 left-0 w-[100vw] h-16 pointer-events-none z-1 bg-linear-to-t from-surface to-transparent"
      ></motion.div>
    </>
  );
}

export default function LessonsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <LessonsPageContent />
    </Suspense>
  );
}

const SENSITIVITY = 0.15;
const SPRING_CONFIG = { stiffness: 100, damping: 20 };
function LessonItem({
  lesson,
  unit,
  parentRef,
  isOpened,
  onFocus,
  onClick,
}: {
  lesson: Lesson;
  unit: Unit | false;
  parentRef: RefObject<HTMLDivElement | null>;
  isOpened: boolean;
  onFocus: () => void;
  onClick: () => void;
  // viewportDims: { height: number; width: number };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: parentRef,
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const cardOpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.6, 1, 0.6],
  );
  const cardOpacity = useSpring(cardOpacityRaw, SPRING_CONFIG);

  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const scale = useSpring(scaleRaw, SPRING_CONFIG);

  const detailOpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 1, 0],
  );
  const detailOpacity = useSpring(detailOpacityRaw, SPRING_CONFIG);

  const detailBlurRaw = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, 4]);
  const detailBlur = useSpring(detailBlurRaw, SPRING_CONFIG);
  const detailBlurTemplate = useMotionTemplate`blur(${detailBlur}px)`;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.5 + SENSITIVITY && latest > 0.5 - SENSITIVITY) {
      onFocus();
    }
  });

  useLayoutEffect(() => {
    // Position unit title about lesson title
    // Unit title is absolutely positioned, so we need to set the unit title's height manually
    if (titleRef.current && unitRef.current) {
      const titleRect = titleRef.current.getBoundingClientRect();
      const unitRect = unitRef.current.getBoundingClientRect();

      const titleHeight = titleRect.height;
      const unitHeight = unitRect.height;

      const totalHeight = titleHeight + unitHeight;

      unitRef.current.style.height = `${totalHeight + 20}px`;
    }
  }, [titleRef, unitRef]);

  useEffect(() => {
    if (isOpened) {
      const lessonItem = document.getElementById(
        `${lesson.id}-card`,
      ) as HTMLDivElement;
      lessonItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isOpened, lesson]);

  return (
    <motion.div
      id={`${lesson.id}-card`}
      className={`relative lesson-container cursor-pointer shrink-0 bg-primary text-on-surface ${outfit.className}`}
      initial={{ width: "40vw", height: "40vh" }}
      animate={{
        top: isOpened ? "0" : "30vh",
        width: isOpened ? "100vw" : "40vw",
        height: isOpened ? "100vh" : "40vh",
      }}
      style={{
        opacity: !isOpened ? cardOpacity : 1,
        scale: !isOpened ? scale : 1,
      }}
      transition={GENTLE_EASE}
      onClick={onClick}
      ref={containerRef}
    >
      {lesson.headerImg && (
        <Image
          src={lesson.headerImg}
          alt={lesson.title}
          fill
          className="object-cover"
        />
      )}
      <motion.h2
        initial={{ x: "-30vw", width: "30vw" }}
        animate={{
          x: isOpened ? 0 : "-30vw",
          width: isOpened ? "100vw" : "30vw",
        }}
        style={{
          opacity: !isOpened ? detailOpacity : 1,
          filter: !isOpened ? detailBlurTemplate : "blur(0)",
        }}
        transition={GENTLE_EASE}
        className="absolute flex flex-col top-0 h-full text-center justify-center items-center font-bold text-2xl"
      >
        {unit && (
          <motion.div
            ref={unitRef}
            className="lesson-unit-title absolute w-fit"
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpened ? 0 : 0.75 }}
            transition={GENTLE_EASE}
          >
            <GradientText
              colors={[
                "var(--color-primary)",
                "var(--color-primary-container)",
                "var(--color-primary)",
              ]}
              animationSpeed={3}
            >
              <span className="font-bold text-lg">{unit.title}</span>
            </GradientText>
          </motion.div>
        )}
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: isOpened ? 2 : 1 }}
          transition={GENTLE_EASE}
          ref={titleRef}
          className="lesson-title w-[25vw]"
        >
          {lesson.title}
        </motion.span>
      </motion.h2>
    </motion.div>
  );
}
