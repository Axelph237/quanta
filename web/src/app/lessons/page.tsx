"use client";

import { useState, useEffect, Suspense, useRef, RefObject } from "react";
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
import Logo from "@/lib/components/ui/Logo";
import { cssvar, csstopx } from "@/lib/styles";
import { COLORS, GENTLE_EASE } from "../globals";
import { LESSONS, UNITS, isLessonCompleted } from "@/lib/lessons";
import type { Lesson, Unit } from "@/lib/types/lessons";
import GradientText from "@/lib/components/react-bits/GradientText";
import ShinyText from "@/lib/components/react-bits/ShinyText";
import * as icons from "@/lib/components/ui/Icons";
import GameHandler from "@/lib/components/games/GameHandler";
import QuestionLevel from "@/lib/components/games/QuestionLevel";
import { useViewportSize } from "@/lib/hooks/useViewportSize";
import confetti from "canvas-confetti";
import "./offboarding.css";
import FeedbackLevel from "@/lib/components/games/FeedbackLevel";

const COMPLETED_LESSONS_STORAGE_KEY = "completedLessons";
type CompletedLessons = string[];

/**
 * Adds a lesson to the completed lessons list
 * @param lessonId The ID of the lesson to add
 * @returns true if the lesson was added, false if it was already completed
 */
function addCompletedLesson(lessonId: string): boolean {
  const completedLessons: CompletedLessons = JSON.parse(
    localStorage.getItem(COMPLETED_LESSONS_STORAGE_KEY) ?? "[]",
  );
  if (completedLessons.includes(lessonId)) {
    return false;
  }
  completedLessons.push(lessonId);
  localStorage.setItem(
    COMPLETED_LESSONS_STORAGE_KEY,
    JSON.stringify(completedLessons),
  );
  return true;
}

const ONBOARDING_STORAGE_KEY = "onboarded";
const OFFBOARDING_STORAGE_KEY = "offboarded";

function handleLessonJump(index: number) {
  const lessonItem = document.getElementById(
    `${LESSONS[index].id}-card`,
  ) as HTMLDivElement;

  if (lessonItem) {
    lessonItem.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function LessonsPageContent() {
  const viewport = useViewportSize();
  const searchParams = useSearchParams();
  const selectedLessonId = searchParams.get("selected");
  const selectedLessonIndex = LESSONS.findIndex(
    (l) => l.id === selectedLessonId,
  );
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
  const [offboardingComplete, setOffboardingComplete] =
    useState<boolean>(false);

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [lessonOpened, setLessonOpened] = useState<number | false>(false);
  const [logoShift, setLogoShift] = useState<number>(0);

  const [redirecting, setRedirecting] = useState(false);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // Check if onboarding is complete
    (async () => {
      setOnboardingComplete(
        typeof window !== "undefined" &&
          localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true",
      );
      setOffboardingComplete(
        typeof window !== "undefined" &&
          localStorage.getItem(OFFBOARDING_STORAGE_KEY) === "true",
      );
    })();

    // Check if any lessons are completed
    for (const l of LESSONS) {
      if (isLessonCompleted(l.id)) {
        const exists = addCompletedLesson(l.id);
        if (!exists) {
        }
      }
    }

    // Window resize handler
    const handleResize = () => {
      const logoWidth = document
        .getElementById("logo")!
        .getBoundingClientRect().width;
      setLogoShift(
        window.innerWidth * 0.5 -
          logoWidth / 2 -
          Number(csstopx(cssvar("--page-padding", document.body))) -
          10, // HUH!! 10px why? See sibling comment in app/home/page.tsx
      );
    };
    handleResize(); // Set initial height
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setOnboardingComplete(true);
  };

  const handleOffboardingComplete = () => {
    localStorage.setItem(OFFBOARDING_STORAGE_KEY, "true");
    setOffboardingComplete(true);
  };

  useEffect(() => {
    // If a lesson is selected, scroll to it
    const jumpToIndex = selectedLessonIndex >= 0 ? selectedLessonIndex : 0;

    setTimeout(() => {
      handleLessonJump(jumpToIndex);
    }, GENTLE_EASE.duration! * 1000); // Wait until page transitions in
  }, [selectedLessonIndex]);

  // When a lesson is scrolled into view
  const handleLessonFocus = (index: number) => {
    if (index !== focusedIndex) {
      setFocusedIndex(index);
    }
  };

  /**
   * Lesson unlock sequence
   */
  const [maxCompletedLesson, setMaxCompletedLesson] = useState<number>(0);
  useEffect(() => {
    let max = LESSONS.findIndex((l) => !isLessonCompleted(l.id));
    if (max === -1) max = LESSONS.length;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaxCompletedLesson(max);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <motion.div
        id="upper-fade"
        initial={{ opacity: 1 }}
        animate={{ opacity: lessonOpened !== false ? 0 : 1 }}
        transition={GENTLE_EASE}
        className="fixed left-0 top-0 w-screen h-16 pointer-events-none z-1 bg-linear-to-b from-quanta-surface to-transparent"
      ></motion.div>

      <motion.header
        id="lessons-page-header"
        className="w-fit flex flex-col fixed!"
        animate={{ left: redirecting && viewport.isSm ? logoShift : 0 }}
        transition={GENTLE_EASE}
      >
        <Logo
          id="logo"
          textVisible={redirecting && viewport.isSm}
          onClick={handleHomeRedirect}
          className="cursor-pointer w-fit"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: redirecting || focusedIndex !== 0 ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="flex place-self-start text-quanta-surface-variant gap-2"
        >
          <icons.Click className="icon" />
          <ShinyText text="Click to return Home" />
        </motion.div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        ref={scope}
        className={`relative inset-0 h-screen w-screen ${lessonOpened ? "overflow-hidden" : "overflow-y-scroll"} bg-quanta-surface text-quanta-on-surface flex items-center ${lessonOpened ? "" : ""}`}
      >
        {onboardingComplete ? (
          maxCompletedLesson !== LESSONS.length ||
          offboardingComplete === true ? (
            <>
              {/* Main Container: Fixed and hidden overflow to act as the viewport for the carousel */}
              {/* Carouse list */}
              <motion.div
                id="carousel-list"
                className="absolute left-0 right-0 flex flex-col gap-18 items-center snap-center"
                initial={{ top: "100vh" }}
                animate={{
                  top: 0,
                }}
                transition={GENTLE_EASE}
              >
                {/* <div className="shadow-item h-[40vh] w-full"></div> */}
                {LESSONS.map((lesson, index) => {
                  const [unitIdx, lessonIdx] = lesson.tocId
                    .split(".")
                    .map(Number);

                  return (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      parentRef={scope}
                      unlocked={index <= maxCompletedLesson}
                      unit={lessonIdx === 0 ? UNITS[unitIdx - 1] : false}
                      isOpened={lessonOpened === index}
                      onClick={() => {
                        if (index <= maxCompletedLesson) {
                          handleLessonClick(index);
                        } else {
                          handleLessonJump(maxCompletedLesson);
                        }
                      }}
                      onFocus={() => handleLessonFocus(index)}
                    />
                  );
                })}
                <div className="shadow-item h-screen w-full"></div>
              </motion.div>
              {/* Lesson Blobs */}
              <motion.ol
                animate={{ translateX: lessonOpened ? "25vw" : 0 }}
                transition={GENTLE_EASE}
                className="fixed flex-col items-center top-1/2 right-(--page-padding) -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity duration-500 whitespace-nowrap min-w-[20px] "
              >
                {LESSONS.map((lesson, index) => (
                  <motion.li
                    key={index}
                    className={`w-full rounded-lg my-2 ${
                      lesson.tocId.split(".")[1] === "0"
                        ? "bg-quanta-secondary"
                        : "bg-quanta-primary"
                    } cursor-pointer`}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: focusedIndex === index ? 1 : 0.8,
                      height: focusedIndex === index ? "40px" : "20px",
                    }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleLessonJump(index)}
                  ></motion.li>
                ))}
              </motion.ol>
            </>
          ) : (
            <Offboarding onComplete={handleOffboardingComplete} />
          )
        ) : (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
      </motion.main>
      <motion.div
        id="bottom-fade"
        initial={{ opacity: 1 }}
        animate={{ opacity: lessonOpened !== false ? 0 : 1 }}
        transition={GENTLE_EASE}
        className="fixed bottom-0 left-0 w-screen h-16 pointer-events-none z-1 bg-linear-to-t from-quanta-surface to-transparent"
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
  unlocked,
}: {
  lesson: Lesson;
  unit: Unit | false;
  parentRef: RefObject<HTMLDivElement | null>;
  isOpened: boolean;
  onFocus: () => void;
  onClick: () => void;
  unlocked: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      setFocused(true);
    } else {
      setFocused(false);
    }
  });

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
      className={`relative lesson-container shrink-0 cursor-pointer text-quanta-on-surface ${outfit.className}`}
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
      {lesson.headerImg ? (
        <Image
          src={lesson.headerImg}
          alt={lesson.title}
          fill
          className="object-cover"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-quanta-primary ${!unlocked && "blur-sm"}`}
        ></div>
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
        className={`absolute flex flex-col top-0 h-full text-center justify-center items-center font-bold text-2xl`}
      >
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: isOpened ? 2 : 1 }}
          transition={GENTLE_EASE}
          className={`text-sm md:text-xl lg:text-2xl lesson-title relative w-[25vw] ${!unlocked && "blur-sm"}`}
        >
          {lesson.title}
          {unit && (
            <motion.div
              className="lesson-unit-title absolute bottom-full left-1/2 -translate-x-1/2 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpened ? 0 : 0.75 }}
              transition={GENTLE_EASE}
            >
              <GradientText
                colors={[
                  "var(--color-quanta-primary)",
                  "var(--color-quanta-primary-container)",
                  "var(--color-quanta-primary)",
                ]}
                animationSpeed={3}
              >
                <span className="font-bold text-sm md:text-xl lg:text-2xl ">
                  {unit.title}
                </span>
              </GradientText>
            </motion.div>
          )}
        </motion.span>
      </motion.h2>
      {!unlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: focused ? 1 : 0 }}
          transition={{ ...GENTLE_EASE, duration: GENTLE_EASE.duration! / 2 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-quanta-on-primary/50"
        >
          <icons.Lock className="icon" />
          <p className="body-text font-bold">
            Complete previous lessons to unlock
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

// Get some basic info about the user
function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [fadeOutHeader, setFadeOutHeader] = useState(false);

  const [scope, animate] = useAnimate();

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prevStep) => prevStep + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onEnd = () => {
    setTimeout(() => {
      animate(
        scope.current,
        {
          top: "100vh",
        },
        GENTLE_EASE,
      );

      setTimeout(onComplete, 2000);
    }, 1000);
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center h-full w-full p-12"
      ref={scope}
    >
      <motion.h1
        className={`text-[3rem] lg:text-[5rem] break-keep flex items-center justify-center font-bold ${outfit.className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOutHeader ? 0 : 1 }}
        transition={GENTLE_EASE}
      >
        Hey there!{" "}
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 15, -15, 15, -15, 15, 0] }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <icons.SchrodingersCat className="w-20 h-20 m-4" />
        </motion.span>
      </motion.h1>
      <motion.h2
        className={`text-quanta-headline-large lg:text-[3rem] break-keep flex items-center justify-center font-bold ${outfit.className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 1 && !fadeOutHeader ? 1 : 0 }}
        transition={GENTLE_EASE}
      >
        What&apos;s your background?
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 2 ? 1 : 0 }}
        transition={GENTLE_EASE}
        className="w-3/4 p-6"
      >
        <GameHandler
          id="onboarding-quiz"
          name="A little about you!"
          hideBg
          className="h-full w-full border-0!"
          successMessages={[
            "Wow!",
            "That's awesome!",
            "That's amazing!",
            "That's incredible!",
          ]}
          onGameStart={() => setFadeOutHeader(true)}
          onGameEnd={onEnd}
          recordOnly
          levels={[
            <QuestionLevel
              key={1}
              question={{
                type: "choice",
                question: "What's your major?",
                answers: [
                  { text: "Physics", correct: true },
                  { text: "Engineering", correct: true },
                  { text: "Math", correct: true },
                  { text: "Chemistry", correct: true },
                  { text: "Biology", correct: true },
                  { text: "Computer Science", correct: true },
                  { text: "Non-STEM", correct: true },
                  { text: "Other", correct: true },
                  { text: "Not a student", correct: true },
                ],
              }}
            />,
            <QuestionLevel
              key={1}
              question={{
                type: "choice",
                question: "How comfortable are you with physics?",
                answers: [
                  { text: "Not at all", correct: true },
                  { text: "A little", correct: true },
                  { text: "Comfortable", correct: true },
                  { text: "Very comfortable", correct: true },
                  { text: "I've studied modern physics", correct: true },
                ],
              }}
            />,
            <QuestionLevel
              key={1}
              question={{
                type: "choice",
                question: "How comfortable are you with math?",
                answers: [
                  { text: "Not at all", correct: true },
                  { text: "A little", correct: true },
                  { text: "Comfortable", correct: true },
                  { text: "Very comfortable", correct: true },
                  { text: "I've studied linear algebra", correct: true },
                ],
              }}
            />,
          ]}
        />
      </motion.div>
    </motion.div>
  );
}

function Offboarding({ onComplete }: { onComplete: () => void }) {
  const [scope, animate] = useAnimate();
  const [showForm, setShowForm] = useState(false);

  const fireworks = () => {
    // const sfx = [
    //   new Audio("/assets/firework1.mp3"),
    //   new Audio("/assets/firework2.mp3"),
    //   new Audio("/assets/firework3.mp3"),
    //   new Audio("/assets/firework4.mp3"),
    //   new Audio("/assets/firework5.mp3"),
    // ];

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const cat = confetti.shapeFromPath({
      path: "M45.7336 0C48.8798 0.00221635 53.0832 13.692 53.5413 22.4932L55.8928 21.6162L56.4788 21.3975L56.4817 21.3965L59.0891 20.4238C60.7435 19.807 62.6071 20.348 63.6741 21.7549L65.1868 23.75C66.8053 25.8853 65.9071 28.9773 63.3967 29.9141L61.8772 30.4805V43.9014C61.8771 45.571 60.8389 47.0647 59.2747 47.6484L35.009 56.7002C34.3231 56.956 33.6215 56.9446 32.9993 56.7324C32.3775 56.9442 31.6768 56.9568 30.9915 56.7012L6.72583 47.6494C5.16147 47.0659 4.12361 45.5719 4.12329 43.9023V30.4814L2.60376 29.915C0.0932297 28.9785 -0.804628 25.8864 0.813721 23.751L2.32642 21.7559C3.39342 20.3489 5.25686 19.8078 6.91138 20.4248L9.5188 21.3975L9.52173 21.3984L10.1077 21.6172L11.7932 22.2461C12.3158 13.4376 16.4751 0.000328244 19.592 0C23.2823 0.000323203 24.9742 6.15127 25.3586 9.22656C25.4049 9.21855 29.8092 8.45709 32.6624 8.45703C35.5306 8.45708 39.967 9.22656 39.967 9.22656C40.3515 6.15118 42.0432 0 45.7336 0ZM22.5032 16.915C20.8047 16.915 19.428 18.2918 19.428 19.9902C19.4281 21.6886 20.8048 23.0654 22.5032 23.0654C24.2013 23.0651 25.5782 21.6884 25.5784 19.9902C25.5784 18.2919 24.2014 16.9154 22.5032 16.915ZM42.4924 16.915C40.7941 16.9152 39.4172 18.2919 39.4172 19.9902C39.4174 21.6885 40.7942 23.0652 42.4924 23.0654C44.1907 23.0653 45.5684 21.6885 45.5686 19.9902C45.5686 18.2918 44.1908 16.9152 42.4924 16.915Z",
    });
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      particleCount: 50,
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
    }, 1500);

    return interval;
  };

  useEffect(() => {
    const interval = fireworks();
    return () => clearInterval(interval);
  }, []);

  const handleYes = () => {
    setShowForm(true);
  };

  const handleNo = () => {
    const duration = 500;
    animate("div", {
      opacity: 0,
    });
    setTimeout(() => {
      onComplete();
    }, duration);
  };

  const handleFreedbackComplete = () => {
    onComplete();
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center h-full w-full p-12"
      ref={scope}
    >
      <motion.h1
        className={`text-[3rem] lg:text-[5rem] break-keep flex items-center justify-center font-bold ${outfit.className}`}
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
          <icons.SchrodingersCat className="w-20 h-20 ml-4" />
        </motion.span>
      </motion.h1>
      <motion.h2
        className={`heading-text-lg lg:text-[3rem] break-keep flex items-center justify-center ${outfit.className}`}
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
          onClick={handleYes}
        >
          Absolutely!
        </button>
        <button
          className="button-primary border-2 border-quanta-primary mt-5"
          onClick={handleNo}
        >
          I&apos;m okay, thanks!
        </button>
      </motion.div>

      {showForm && (
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
          onGameEnd={handleFreedbackComplete}
          recordOnly
          levels={[
            <QuestionLevel
              key={1}
              question={{
                type: "choice",
                question:
                  "How accessible was Quanta for someone without a relevant background?",
                answers: [
                  { text: "Very accessible", correct: true },
                  { text: "Somewhat accessible", correct: true },
                  { text: "Neutral", correct: true },
                  { text: "Somewhat inaccessible", correct: true },
                  { text: "Very inaccessible", correct: true },
                ],
              }}
            />,
            <QuestionLevel
              key={1}
              question={{
                type: "choice",
                question: "How enjoyable were the lessons in Quanta?",
                answers: [
                  { text: "Very unenjoyable", correct: true },
                  { text: "Somewhat unenjoyable", correct: true },
                  { text: "Neutral", correct: true },
                  { text: "Somewhat enjoyable", correct: true },
                  { text: "Very enjoyable", correct: true },
                ],
              }}
            />,
            <QuestionLevel
              key={1}
              question={{
                type: "choice",
                question: "How much did you learn from using Quanta?",
                answers: [
                  { text: "Nothing", correct: true },
                  { text: "A little", correct: true },
                  { text: "A moderate amount", correct: true },
                  { text: "A lot", correct: true },
                ],
              }}
            />,
            <QuestionLevel
              key={1}
              question={{
                type: "choice",
                question:
                  "Overall, how much did your understanding of quantum computing improve after using Quanta?",
                answers: [
                  { text: "Not at all", correct: true },
                  { text: "A little", correct: true },
                  { text: "A moderate amount", correct: true },
                  { text: "A lot", correct: true },
                ],
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
                  { text: "30 minutes to an hour", correct: true },
                  { text: "More than an hour", correct: true },
                ],
              }}
            />,
            <FeedbackLevel
              key={1}
              question="What were your favorite part(s) of Quanta?"
            />,
            <FeedbackLevel
              key={1}
              question="What were your least favorite part(s) of Quanta?"
            />,
            <FeedbackLevel
              key={1}
              question="What is one feature you would like added to Quanta?"
            />,
          ]}
        />
      )}
    </motion.div>
  );
}
