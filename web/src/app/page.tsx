"use client";

import { outfit } from "@/app/fonts";
import {
  HGate,
  NotGate,
  SGate,
  Swipe,
  TGate,
  XGate,
  YGate,
  ZGate,
} from "@/lib/components/ui/Icons";
import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { motion, useAnimate } from "framer-motion";
import { GENTLE_EASE } from "./globals";
import { redirect, RedirectType } from "next/navigation";
import Logo from "@/lib/components/ui/Logo";
import ShinyText from "@/lib/components/react-bits/ShinyText";

// All available gate components
const GATES = [
  { gate: HGate, color: "var(--color-red-500)" },
  { gate: NotGate, color: "var(--color-primary)" },
  { gate: SGate, color: "var(--color-secondary)" },
  { gate: TGate, color: "var(--color-secondary)" },
  { gate: XGate, color: "var(--color-primary)" },
  { gate: YGate, color: "var(--color-primary)" },
  { gate: ZGate, color: "var(--color-primary)" },
];

interface GateBody {
  id: number;
  body: Matter.Body;
  Gate: typeof XGate;
  color: string;
  size: number;
}

export default function LandingPage() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [scope, animate] = useAnimate();
  const [gateBodies, setGateBodies] = useState<GateBody[]>([]);
  const [textAreaClear, setTextAreaClear] = useState(false);
  const textSensorRef = useRef<Matter.Body | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. GET MATTER.JS CLASSES
    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
      Events,
    } = Matter;

    // 2. CREATE ENGINE
    const engine = Engine.create({
      gravity: { x: 0, y: 0 },
      enableSleeping: true,
    });
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 3. CREATE RENDERER
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
      },
    });

    // 4. CREATE GATE BODIES
    const gateCount = 50;
    const newGateBodies: GateBody[] = [];
    const size = 60;

    for (let i = 0; i < gateCount; i++) {
      // Centered around text
      const x = Math.random() * (width * 0.8) + width * 0.1;
      const y = (Math.random() - 0.5) * (height / 4) + height / 2;

      const body = Bodies.circle(x, y, size / 2, {
        restitution: 0.6,
        friction: 0.4,
        render: { visible: false },
      });

      // Give initial random angle
      Matter.Body.setAngle(body, (Math.random() - 0.5) * 360);

      const gate = GATES[Math.floor(Math.random() * GATES.length)];
      newGateBodies.push({
        id: i,
        body,
        Gate: gate.gate,
        color: gate.color,
        size,
      });

      Composite.add(engine.world, body);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGateBodies(newGateBodies);

    // 5. CREATE SENSOR OVER TITLE TEXT
    const textRect = textRef.current!.getBoundingClientRect();
    const textWidth = textRect.width * 0.9;
    const textHeight = textRect.height * 0.6;
    const textSensor = Bodies.rectangle(
      width / 2,
      height / 2,
      textWidth,
      textHeight,
      {
        isStatic: true,
        isSensor: true, // Sensor doesn't physically interact
        render: { fillStyle: "red", visible: false, opacity: 0.5 },
        label: "textSensor",
        collisionFilter: {
          category: 0x0002, // Different category from draggable bodies
          mask: 0x0001, // Can still detect collisions with gates
        },
      },
    );
    textSensorRef.current = textSensor;
    Composite.add(engine.world, textSensor);

    // 6. TRACK COLLISIONS WITH TEXT SENSOR
    const collidingBodies = new Set<Matter.Body>(); // Set to track colliding bodies

    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === textSensor || pair.bodyB === textSensor) {
          const otherBody = pair.bodyA === textSensor ? pair.bodyB : pair.bodyA;
          collidingBodies.add(otherBody);
          setTextAreaClear(false);
        }
      });
    });

    Events.on(engine, "collisionEnd", (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === textSensor || pair.bodyB === textSensor) {
          const otherBody = pair.bodyA === textSensor ? pair.bodyB : pair.bodyA;
          collidingBodies.delete(otherBody);
          if (collidingBodies.size === 0) {
            Matter.Composite.remove(engine.world, textSensor);
            setTextAreaClear(true);
          }
        }
      });
    });

    // 7. ADD MOUSE CONTROL FOR DRAGGING
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
      // Filter out the text sensor from mouse interactions
      collisionFilter: {
        mask: 0x0001, // Only interact with bodies that have category 0x0001
      },
    });

    Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // 8. RUN ENGINE
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  useEffect(() => {
    if (!textAreaClear) return;
    console.log("Text area is clear");

    setTimeout(async () => {
      if (!scope.current) return;
      await animate(
        scope.current!,
        {
          opacity: [1, 0],
        },
        GENTLE_EASE,
      );
      redirect("/home?from=landing", RedirectType.push);
    }, 1200); // Wait for text to unblur
  }, [textAreaClear]);

  return (
    <main
      className="absolute inset-0 overflow-hidden h-screen w-screen bg-background"
      ref={scope}
    >
      <header>
        <Logo />
      </header>
      {/* Title - behind gates */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.h1
          ref={textRef}
          animate={{
            scale: textAreaClear ? 1.25 : 1,
          }}
          className={`font-bold text-9xl ${
            outfit.className
          } select-none transition-all duration-1200 ${
            textAreaClear ? "" : "blur-md"
          }`}
        >
          DEMYSTIFYING
        </motion.h1>

        <span
          className={`absolute text-surface-variant left-1/2 top-3/4 flex items-center gap-2 -translate-x-1/2 ${outfit.className}`}
        >
          <Swipe className="w-14 h-14" />
          <ShinyText className="text-2xl opacity-75" text="drag to clear" />
        </span>
      </div>

      {/* Gates - in front of title */}
      <div className="absolute inset-0 z-10">
        {/* Matter.js canvas */}
        <div ref={sceneRef} className="absolute inset-0" />

        {/* React components synced with physics bodies */}
        {gateBodies.map((gateBody) => (
          <PhysicsGate key={gateBody.id} gateBody={gateBody} />
        ))}
      </div>
    </main>
  );
}

function PhysicsGate({ gateBody }: { gateBody: GateBody }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setPosition({
        x: gateBody.body.position.x,
        y: gateBody.body.position.y,
      });
      setRotation(gateBody.body.angle);
      requestAnimationFrame(updatePosition);
    };

    const animationId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationId);
  }, [gateBody.body]);

  const GateComponent = gateBody.Gate;

  return (
    <div
      className={`absolute pointer-events-none cursor-pointer`}
      style={{
        left: position.x - gateBody.size / 2,
        top: position.y - gateBody.size / 2,
        width: gateBody.size,
        height: gateBody.size,
        transform: `rotate(${rotation}rad)`,
        color: gateBody.color,
      }}
    >
      <GateComponent className="w-full h-full" />
    </div>
  );
}
