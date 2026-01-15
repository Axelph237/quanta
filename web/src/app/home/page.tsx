"use client";

import { redirect } from "next/navigation";
import { libreBasker, outfit } from "@/app/fonts";
import Link from "next/link";
import BlurText from "@/lib/components/react-bits/BlurText";
import {
  HTMLMotionProps,
  motion,
  useAnimate,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import NavText from "@/lib/components/NavText";
import { Suspense, useEffect, useRef, useState } from "react";
import useComputedCSS from "@/lib/hooks/useComputedCSS";
import Logo from "@/lib/components/Logo";
import { GENTLE_EASE } from "../globals";
import { useSearchParams } from "next/navigation";
import "./home.css";
import Draggable from "@/lib/components/Draggable";
import {
  HGate,
  NotGate,
  SGate,
  TGate,
  XGate,
  YGate,
  ZGate,
} from "@/lib/components/Icons";

function HomeContent() {
  const searchParams = useSearchParams();
  const fromLanding = searchParams.get("from") === "landing";

  const { scrollY } = useScroll();
  const smoothedScrollY = useSpring(scrollY);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const [mainScope, animate] = useAnimate();
  const heroImgRef = useRef<HTMLDivElement>(null);

  const { cssvar, csstopx } = useComputedCSS();
  const [logoShift, setLogoShift] = useState<number>(0);

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
          7 // I have 0 idea where this comes from but apparently it works? There is a 7 px diff between
        // the left edge of the logo on this page, and the left edge of the logo on the lessons page
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      GENTLE_EASE
    );

    redirect("/lessons");
  };

  return (
    <>
      {/* Header */}
      <header>
        {/* About Nav */}
        <div className="absolute inset-0 z-0 bg-linear-to-b from-surface to-transparent"></div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{
            opacity: scrolled || redirecting ? 0 : 1,
          }}
          transition={GENTLE_EASE}
        >
          <NavText
            id="about-nav"
            text="ABOUT"
            onClick={() => redirect("/about")}
          />
        </motion.span>
        {/* Logo */}
        <Link href="/home">
          <Logo
            id="logo"
            animate={{
              left: scrolled || redirecting ? logoShift : 0,
            }}
            transition={GENTLE_EASE}
            textVisible={!(scrolled || redirecting)}
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
        className="relative p-[var(--page-padding)] flex min-h-screen mt-[var(--page-padding)] flex-col items-center justify-start text-center"
        ref={mainScope}
      >
        <HomeSection className="flex flex-col items-center justify-start">
          <BlurText
            text="QUANTUM"
            delay={75}
            animateBy="letters"
            direction="top"
            className={`${fromLanding ? "mb-4" : ""} text-[12rem] font-bold ${
              outfit.className
            }`}
            onAnimationComplete={() => console.log("Completed anim")}
          />
          {!fromLanding && (
            <motion.p
              className={`mb-4 text-lg opacity-50 ${outfit.className}`}
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
          )}
          <div
            id="hero-img-container"
            className="flex overflow-hidden self-stretch pb-[var(--page-padding)]"
            ref={heroImgRef}
          >
            {/* Content that should fill the remaining vertical space goes here */}
            <motion.div
              className="w-full bg-primary"
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={GENTLE_EASE}
            ></motion.div>
          </div>
        </HomeSection>

        {/* Quanta definition */}
        <HomeSection className="text-left text-3xl flex flex-col px-[var(--page-padding)] items-start justify-center">
          <h1 className={`mb-4 text-8xl font-bold ${libreBasker.className}`}>
            quanta
          </h1>
          <h2 className={`mb-4 text-2xl opacity-75 ${libreBasker.className}`}>
            / &apos;kwɒn tə /
          </h2>
          <p className={`mb-4 text-2xl opacity-75 ${libreBasker.className}`}>
            <i>noun:</i>
          </p>
          <p className={`mb-4 text-2xl opacity-75 ${libreBasker.className}`}>
            The plural form of quantum: the smallest quantity of radiant energy.
          </p>
          {/* <div className="absolute right-[400px]">
            <ToyGates count={3} bounds={{ x: 300, y: 300 }} />
          </div> */}
        </HomeSection>

        <HomeSection className="flex flex-col items-center justify-center">
          <h1 className={`text-xl`}>DISCRETE LEARNING</h1>
          <p className={"w-3/4 text-4xl"}>
            <span className="opacity-100">Quanta</span>{" "}
            <span className="opacity-65">
              is a platform for learning about quantum computing
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
      </main>
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
    <div className={`h-[100vh] w-full ${className}`} {...props}>
      {children}
    </div>
  );
}

function ToyGates({
  count,
  bounds,
  ...props
}: {
  count: number;
  bounds: { x: number; y: number };
} & HTMLMotionProps<"div">) {
  const [gates, setGates] = useState<
    {
      x: number;
      y: number;
      gate: React.ReactNode;
      angle: number;
      speed: number;
    }[]
  >([]);

  useEffect(() => {
    const gateSize = 16;
    const gateComps = [
      <HGate key={1} className={`text-red-500 w-${gateSize} h-${gateSize}`} />,
      <XGate key={2} className={`text-primary w-${gateSize} h-${gateSize}`} />,
      <YGate key={3} className={`text-primary w-${gateSize} h-${gateSize}`} />,
      <ZGate key={4} className={`text-primary w-${gateSize} h-${gateSize}`} />,
      <SGate
        key={5}
        className={`text-secondary w-${gateSize} h-${gateSize}`}
      />,
      <TGate
        key={6}
        className={`text-secondary w-${gateSize} h-${gateSize}`}
      />,
      <NotGate
        key={7}
        className={`text-primary w-${gateSize} h-${gateSize}`}
      />,
    ];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGates(
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * bounds.x,
        y: (Math.random() - 0.5) * bounds.y,
        angle: Math.random() * 360,
        speed: (Math.random() - 0.5) * 10 + 15,
        gate: gateComps[Math.floor(Math.random() * gateComps.length)],
      }))
    );
  }, [count]);

  return (
    <>
      {gates.map((gate, i) => {
        return (
          <Draggable
            key={i}
            dragConstraints={document.body.getBoundingClientRect()}
            {...props}
            initial={{ rotate: gate.angle }}
            animate={{ rotate: gate.angle + (gate.speed < 0 ? -360 : 360) }}
            transition={{
              duration: Math.abs(gate.speed),
              ease: "linear",
              repeat: Infinity,
            }}
            style={{
              x: gate.x,
              y: gate.y,
            }}
          >
            {gate.gate}
          </Draggable>
        );
      })}
    </>
  );
}
