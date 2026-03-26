"use client";

import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";
import { libreBasker, outfit } from "@/app/fonts";
import Link from "next/link";
import BlurText from "@/lib/components/react-bits/BlurText";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import NavText from "@/lib/components/ui/NavText";
import { Suspense, useEffect, useRef, useState } from "react";
import { cssvar, csstopx } from "@/lib/styles";
import Logo from "@/lib/components/ui/Logo";
import { COLORS, GENTLE_EASE } from "../globals";
import { useSearchParams } from "next/navigation";
import {
  HandLazy,
  HandReaching,
  TerriblyInnacurateQubit,
} from "@/lib/components/ui/Icons";
import CatSideEye from "@public/assets/cat_side_eye.jpg";

import AboutContent from "./about.mdx";
import { useViewportSize } from "@/lib/hooks/useViewportSize";

function HomeContent() {
  const viewport = useViewportSize();
  const searchParams = useSearchParams();
  const fromLanding = searchParams.get("from") === "landing";

  const { scrollY } = useScroll();
  const smoothedScrollY = useSpring(scrollY);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const [mainScope, animate] = useAnimate();
  const heroImgRef = useRef<HTMLDivElement>(null);


  const [logoShift, setLogoShift] = useState<number>(0);

  const [clickCounter, setClickCounter] = useState<number>(0);

  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set height of hero image to fill remaining viewport space
    const heroImg = heroImgRef.current;
    if (heroImg) {
      const height = window.innerHeight - heroImg.getBoundingClientRect().top;
      heroImg.style.height = `${height}px`;
    }

    // Update the left shift for the logo component
    const handleResize = () => {
      const logoWidth = document
        .getElementById("logo")!
        .getBoundingClientRect().width;
      setLogoShift(
        -(window.innerWidth * 0.5) +
          Number(csstopx(cssvar("--page-padding", document.body))) +
          logoWidth / 2 +
          10, // I have 0 idea where this comes from but apparently it works? There is a 10 px diff between
        // the left edge of the logo on this page, and the left edge of the logo on the lessons page. Truly a magic number
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (clickCounter === 10) {
      const sfx = new Audio("/assets/thud_sfx.mp3");
      sfx.play();
    }

    const timer = setTimeout(() => {
      setClickCounter(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [clickCounter]);

  // Animate header when scrolling
  useMotionValueEvent(smoothedScrollY, "change", (latest) => {
    const SCROLL_DEADZONE = 50;
    setScrolled(latest > SCROLL_DEADZONE);
  });

  const handleLessonsRedirect = async () => {
    setRedirecting(true);
    await animate(
      mainScope.current!,
      {
        x: "-100%",
        opacity: 0,
      },
      GENTLE_EASE,
    );

    redirect("/lessons", RedirectType.push);
  };

  return (
    <>
      {/* Header */}
      <header>
        <div className="top-0 left-0 w-full h-full absolute backdrop-blur-sm mask-b-from-25%" />
        {/* About Nav */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{
            opacity: scrolled || redirecting || !viewport.isSm ? 0 : 1,
          }}
          transition={GENTLE_EASE}
        >
          <NavText
            id="about-nav"
            text="ABOUT"
            onClick={() =>
              window.scrollTo({
                top: aboutRef.current?.offsetTop,
                behavior: "smooth",
              })
            }
          />
        </motion.span>
        {/* Logo */}
        <Link href="/home">
          <Logo
            id="logo"
            animate={{
              left: scrolled || redirecting || !viewport.isSm ? logoShift : 0,
            }}
            transition={GENTLE_EASE}
            textVisible={!(scrolled || redirecting || !viewport.isSm)}
            onClick={() => setClickCounter(clickCounter + 1)}
          />
        </Link>
        {/* Lessons Nav */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{
            opacity: redirecting ? 0 : 1,
          }}
          transition={GENTLE_EASE}
        >
          <NavText
            id="lessons-nav"
            text="LESSONS"
            onClick={handleLessonsRedirect}
          />
        </motion.span>
      </header>
      <main
        className="relative px-(--page-padding) pb-(--page-padding) flex min-h-screen flex-col items-center justify-start text-center"
        ref={mainScope}
      >
        <HomeSection className="flex flex-col items-center justify-start">
          <BlurText
            text="BRIDGE THE GAP"
            delay={75}
            animateBy="words"
            direction="top"
            className={`${
              fromLanding ? "mb-4" : ""
            } text-center text-[3rem] sm:text-[5rem] lg:text-[7rem] xl:text-[8rem] 2xl:text-[10rem] break-keep flex items-center justify-center font-bold ${outfit.className}`}
            onAnimationComplete={() => console.log("Completed anim")}
          />
          {/* {!fromLanding && (
            <motion.p
              className={`mb-4 text-center text-lg opacity-50 ${outfit.className}`}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 0.75,
              }}
              transition={GENTLE_EASE}
            >
              made easy
            </motion.p>
          )} */}
          <div
            id="hero-img-container"
            className="flex overflow-hidden self-stretch pb-(--page-padding)"
            ref={heroImgRef}
          >
            {/* Content that should fill the remaining vertical space goes here */}
            <HeroImg />
          </div>
        </HomeSection>

        {/* Quanta definition */}
        <HomeSection className="text-left text-3xl flex flex-col px-0 md:px-(--page-padding) items-start justify-center">
          <h1
            className={`mb-4 display-text-md font-bold ${libreBasker.className}`}
          >
            quanta
          </h1>
          <h2 className={`mb-4 body-text opacity-75 ${libreBasker.className}`}>
            / &apos;kwɒn tə /
          </h2>
          <p
            className={`mb-4 heading-text-sm opacity-75 ${libreBasker.className}`}
          >
            <i>noun:</i>
          </p>
          <p
            className={`mb-4 heading-text-sm opacity-75 ${libreBasker.className}`}
          >
            The plural form of quantum: the smallest quantity of radiant energy.
          </p>
          {/* <div className="absolute right-[400px]">
            <ToyGates count={3} bounds={{ x: 300, y: 300 }} />
          </div> */}
        </HomeSection>

        <HomeSection className="flex flex-col items-center justify-center">
          <h1 className="heading-text-lg mb-2">DISCRETE LEARNING</h1>
          <p className={"w-3/4 heading-text-sm"}>
            <span className="opacity-100">Quanta</span>{" "}
            <span className="opacity-65">
              is a platform for learning a few interesting topics in quantum
              computing
              {fromLanding && ", made easy"}. I&apos;ve created a range of{" "}
            </span>
            <span className="opacity-100">interactive lessons</span>
            <span className="opacity-65">
              {" "}
              to help you learn the fundamentals {":D"} Just click the{" "}
            </span>
            <span className="opacity-100">lessons tab</span>
            <span className="opacity-65">
              {" "}
              above and explore what interests you!
            </span>
          </p>
        </HomeSection>

        <div
          id="about-content"
          ref={aboutRef}
          className="size-full flex flex-col items-start text-left justify-center w-3/4"
        >
          <AboutContent />
        </div>
      </main>
      {/* BEAUTIFUL */}
      <motion.div
        className="fixed pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: clickCounter >= 10 ? [1, 1, 0] : 0 }}
        transition={{ duration: 0.75 }}
      >
        <Image
          src={CatSideEye}
          alt="sideeye"
          style={{ width: "100vw", height: "100vh", zIndex: 9999 }}
        />
      </motion.div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

function HomeSection({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div className={`h-screen w-full ${className}`} {...props}>
      {children}
    </div>
  );
}

function HeroImg() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      id="hero-img"
      className="w-full"
      initial={{
        height: 0,
        background: `linear-gradient(270deg, ${COLORS.primary.hex} 25%, ${COLORS.primary.hex} 100%)`,
      }}
      animate={{
        height: "100%",
        background: isHovered
          ? `linear-gradient(270deg, ${COLORS.primary.hex} 25%, ${COLORS.secondary.hex} 100%)`
          : `linear-gradient(270deg, ${COLORS.primary.hex} 0%, ${COLORS.primary.hex} 100%)`,
        transition: {
          default: GENTLE_EASE,
          background: {
            ...GENTLE_EASE,
            delay: GENTLE_EASE.duration! * 1.3,
          },
        },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        id="hero-img-content"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{
          ...GENTLE_EASE,
          duration: GENTLE_EASE.duration! * 0.6,
          delay: GENTLE_EASE.duration,
        }}
        className="relative w-full h-full flex flex-row justify-between"
      >
        <AnimatePresence mode="wait">
          <motion.span
            id="hero-img-hand-content"
            className="relative"
            key={isHovered ? 1 : 0} // Reaching Hand : Lazy Hand
            initial={{
              opacity: 0,
              left: isHovered ? "-50%" : "-10%",
              top: isHovered ? "0%" : "50%",
              scale: isHovered ? 0.8 : 1,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              left: "0%",
              top: "0%",
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              left: "-50%",
              top: "0%",
              scale: 0.8,
              filter: "blur(10px)",
            }}
            transition={GENTLE_EASE}
          >
            {isHovered ? (
              <HandReaching className="text-quanta-surface h-7/12 flex-1 relative top-1/2 -translate-y-1/2 aspect-auto" />
            ) : (
              <HandLazy className="text-quanta-surface h-1/2 flex-1 relative top-1/2 -translate-y-1/2 -translate-x-[2px] aspect-auto" />
            )}
          </motion.span>
        </AnimatePresence>
        <motion.span
          animate={{
            rotate: [0, 180],
            transition: {
              rotate: {
                type: "spring",
                stiffness: 250,
                damping: 20,
                mass: 2,
                repeat: Infinity,
                repeatDelay: 1,
              },
            },
          }}
          className="mr-64 flex items-center justify-center"
        >
          <TerriblyInnacurateQubit className="text-quanta-surface h-3/7 relative aspect-auto" />
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
