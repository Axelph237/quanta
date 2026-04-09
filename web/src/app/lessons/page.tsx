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
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/lib/components/ui/Logo";
import { cssvar, csstopx } from "@/lib/styles";
import { GENTLE_EASE } from "../globals";
import {
  LESSONS,
  UNITS,
  getQuizCompletion,
  isLessonCompleted,
  likert,
} from "@/lib/lessons";
import type { Lesson, Unit } from "@/lib/types/lessons";
import GradientText from "@/lib/components/react-bits/GradientText";
import ShinyText from "@/lib/components/react-bits/ShinyText";
import * as icons from "@/lib/components/ui/Icons";
import GameHandler from "@/lib/components/games/GameHandler";
import QuestionLevel from "@/lib/components/games/QuestionLevel";
import { useViewportSize } from "@/lib/hooks/useViewportSize";
import "./offboarding.css";
import { getPermissions } from "@/lib/components/providers/AnalyticsProvider";
import SectionLevel from "@/lib/components/games/SectionLevel";
import { OFFBOARDING_STORAGE_KEY } from "../feedback/page";

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

function handleLessonJump(index: number) {
  const lessonItem = document.getElementById(
    `${LESSONS[index].id}-card`,
  ) as HTMLDivElement;

  if (lessonItem) {
    lessonItem.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function LessonsPageContent() {
  const router = useRouter();
  const viewport = useViewportSize();
  const searchParams = useSearchParams();
  const selectedLessonId = searchParams.get("selected");
  const selectedLessonIndex = LESSONS.findIndex(
    (l) => l.id === selectedLessonId,
  );
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
  const [showFeedbackButton, setShowFeedbackButton] = useState<boolean>(false);

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [lessonOpened, setLessonOpened] = useState<number | false>(false);
  const [logoShift, setLogoShift] = useState<number>(0);

  const [redirecting, setRedirecting] = useState(false);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // Check if onboarding is complete
    (async () => {
      setOnboardingComplete(
        () =>
          (typeof window !== "undefined" &&
            localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true") ||
          getPermissions() === "false", // Ignore onboarding if user has explicitly denied usage permission
      );
      setShowFeedbackButton(() => {
        const complete =
          (typeof window !== "undefined" &&
            localStorage.getItem(OFFBOARDING_STORAGE_KEY) === "true") ||
          getPermissions() !== "true"; // Ignore offboarding if user has given usage permission

        return complete === true
          ? false
          : // Show feedback button after viewing three lessons
            LESSONS.filter((l) => getQuizCompletion(l.id).preQuizCompleted)
              .length >= 3;
      });
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

    router.push("/home");
  };

  const handleLessonClick = (index: number) => {
    setLessonOpened(index);
    setTimeout(() => {
      router.push(`/lessons/${LESSONS[index].id}`);
    }, 1000);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setOnboardingComplete(true);
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
                    unlocked={true} // Statically true because we decided to undo the unlocking feature
                    unit={lessonIdx === 0 ? UNITS[unitIdx - 1] : false}
                    isOpened={lessonOpened === index}
                    onClick={() => {
                      if (true) {
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
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        {showFeedbackButton && <FeedbackButton />}
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
  const [showQuestions, setShowQuestions] = useState(false);

  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (fadeOutHeader) {
      setTimeout(() => {
        setShowQuestions(true);
      }, 1000);
    }
  }, [fadeOutHeader]);

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
      className="relative flex flex-col items-center justify-center h-full w-full"
      ref={scope}
    >
      {!showQuestions && (
        <>
          <motion.h1
            className={`text-quanta-headline-large md:text-[3rem] lg:text-[5rem] break-keep flex items-center justify-center font-bold ${outfit.className}`}
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
              <icons.SchrodingersCat className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 m-4" />
            </motion.span>
          </motion.h1>
          <motion.div
            className={`text-quanta-headline-small md:text-quanta-headline-medium lg:text-quanta-headline-large gap-4 break-keep flex flex-col items-center justify-center font-bold ${outfit.className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 1 && !fadeOutHeader ? 1 : 0 }}
            transition={GENTLE_EASE}
          >
            <h2>What&apos;s your background?</h2>
            <button
              onClick={() => setFadeOutHeader(true)}
              className="flex flex-row gap-2 items-center justify-center button-primary bg-quanta-primary text-quanta-on-surface"
            >
              <icons.Click className="icon" /> Start
            </button>
          </motion.div>
        </>
      )}
      {showQuestions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: step >= 2 ? 1 : 0 }}
          transition={GENTLE_EASE}
          className="w-full p-6"
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
            onGameEnd={onEnd}
            levels={[
              // Background questions
              <QuestionLevel
                key={1}
                question={{
                  type: "choice",
                  question: "What is your highest level of education?",
                  answers: [
                    { text: "High School or equivalent", correct: true },
                    { text: "Some college", correct: true },
                    { text: "Bachelor's degree", correct: true },
                    { text: "Graduate degree", correct: true },
                    { text: "Other / Prefer not to say", correct: true },
                  ],
                }}
              />,
              <QuestionLevel
                key={1}
                question={{
                  type: "choice",
                  question:
                    "Have you previously taken a course related to quantum mechanics or quantum computing?",
                  answers: [
                    { text: "Yes", correct: true },
                    { text: "No", correct: true },
                    { text: "I'm not sure", correct: true },
                  ],
                }}
              />,
              <QuestionLevel
                key={1}
                question={{
                  type: "choice",
                  question: "What is your primary field of study or work?",
                  answers: [
                    { text: "STEM field", correct: true },
                    { text: "Non-STEM field", correct: true },
                    { text: "Not currently a student", correct: true },
                    { text: "Other / Prefer not to say", correct: true },
                  ],
                }}
              />,
              <QuestionLevel
                key={1}
                question={likert(
                  "I am familiar with quantum computing concepts.",
                )}
              />,
              <QuestionLevel
                key={1}
                question={{
                  type: "choice",
                  question:
                    "Have you previously used interactive or online tools to learn physics or computing concepts?",
                  answers: [
                    { text: "Yes", correct: true },
                    { text: "No", correct: true },
                  ],
                }}
              />,
              // Education background questions
              <SectionLevel
                key="onboarding-section"
                header="Education"
                subheader="Just a bit more about your education experience!"
              />,
              <QuestionLevel
                key={1}
                question={{
                  type: "choice",
                  question:
                    "What is your primary field of study or background?",
                  answers: [
                    { text: "Computer Science", correct: true },
                    { text: "Physics", correct: true },
                    { text: "Mathematics", correct: true },
                    { text: "Engineering", correct: true },
                    { text: "Chemistry", correct: true },
                    { text: "Biology", correct: true },
                    { text: "Non-STEM", correct: true },
                    { text: "Other", correct: true },
                    { text: "Not a student", correct: true },
                  ],
                }}
              />,
              <QuestionLevel
                key={1}
                question={likert("I feel comfortable with physics concepts.")}
              />,
              <QuestionLevel
                key={1}
                question={likert("I feel comfortable with mathematics.")}
              />,
              <QuestionLevel
                key={1}
                question={{
                  type: "choice",
                  question: "Have you taken linear algebra?",
                  answers: [
                    { text: "Yes", correct: true },
                    { text: "No", correct: true },
                    { text: "I'm not sure", correct: true },
                  ],
                }}
              />,
              // Global measures (mirrored in offboarding)
              <SectionLevel
                key="global-section"
                header="Almost done!"
                subheader="Just a couple more questions."
              />,
              <QuestionLevel
                key={1}
                question={likert(
                  "I feel confident explaining basic quantum computing concepts.",
                )}
              />,
              <QuestionLevel
                key={1}
                question={likert("Quantum computing seems approachable to me.")}
              />,
            ]}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

function FeedbackButton() {
  const router = useRouter();

  const goToFeedback = () => {
    router.push("/feedback");
  };

  return (
    <div
      className="fixed z-90 bottom-(--page-padding) right-(--page-padding) flex flex-col items-center gap-2 cursor-pointer"
      onClick={goToFeedback}
    >
      <motion.button
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 10, -10, 10, -10, 10, 0],
          transition: {
            ease: "easeInOut",
            duration: 1,
            repeat: Infinity,
            delay: 0.5,
            repeatDelay: 3,
          },
        }}
        className="self-end flex flex-row items-center justify-center py-4 px-6 sm:px-8 rounded-full bg-quanta-on-surface text-quanta-surface hover:text-quanta-primary transition-colors duration-250"
      >
        <icons.PartyHorn className="size-4 md:size-5 lg:size-6" />
      </motion.button>
      <motion.div
        transition={GENTLE_EASE}
        className="flex place-self-start text-white gap-2"
      >
        <icons.Click className="icon" />
        Click to give feedback!
      </motion.div>
    </div>
  );
}
