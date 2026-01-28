/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import "./Dice.css";
import { RefObject, useEffect, useRef, useState } from "react";
import * as icons from "@/lib/components/ui/Icons";
import { LoadingRing } from "../ui/LoadingRing";
import confetti from "canvas-confetti";
import { GameComponentProps } from "./GameHandler";

interface DiceProps {
  maxForce?: number; // Magnitude of the spin force (0-1)
  minForce?: number; // Minimum magnitude of the spin force (0-1)
  minSpins?: number; // Minimum number of spins before landing
  directionX?: number; // Direction component for X-axis rotation (-1 to 1)
  directionY?: number; // Direction component for Y-axis rotation (-1 to 1)
  onLanded?: (faceValue: number, hidden?: boolean) => void; // Callback when dice lands with the face value
  sceneState?: SceneState;
}

// Map of rotation angles to face values
// Face 1: front (0, 0), Face 2: back (0, 180), Face 3: right (0, 90)
// Face 4: left (0, -90), Face 5: top (-90, 0), Face 6: bottom (90, 0)
const FACE_ROTATIONS: { rotateX: number; rotateY: number; value: number }[] = [
  { rotateX: 0, rotateY: 0, value: 1 }, // front
  { rotateX: 0, rotateY: 180, value: 2 }, // back
  { rotateX: 0, rotateY: 90, value: 3 }, // right
  { rotateX: 0, rotateY: -90, value: 4 }, // left
  { rotateX: -90, rotateY: 0, value: 5 }, // top
  { rotateX: 90, rotateY: 0, value: 6 }, // bottom
];

const ROLL_TIME_MS = 6000;

enum SceneState {
  READY,
  ROLLING,
  GUESSING,
  END,
  WIN,
  LOSE,
}

export function DiceLevel({
  numVisDice = 2,
  hidDice = [1, 3], // Dice values are not random. This is so that the game is semi-deterministic,
  ...props
}: {
  numVisDice: number;
  hidDice: number[];
  autoReset?: boolean;
} & GameComponentProps) {
  const [visRollValues, setVisRollValues] = useState<number[]>([]);

  const [sceneState, setSceneState] = useState<SceneState>(SceneState.READY);

  const entangledBtn = useRef<HTMLButtonElement>(null);
  const unentangledBtn = useRef<HTMLButtonElement>(null);

  const fireConfetti = (context: RefObject<HTMLButtonElement | null>) => {
    const rect = context.current?.getBoundingClientRect();
    if (!rect) return;
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const cat = confetti.shapeFromPath({
      path: "M45.7336 0C48.8798 0.00221635 53.0832 13.692 53.5413 22.4932L55.8928 21.6162L56.4788 21.3975L56.4817 21.3965L59.0891 20.4238C60.7435 19.807 62.6071 20.348 63.6741 21.7549L65.1868 23.75C66.8053 25.8853 65.9071 28.9773 63.3967 29.9141L61.8772 30.4805V43.9014C61.8771 45.571 60.8389 47.0647 59.2747 47.6484L35.009 56.7002C34.3231 56.956 33.6215 56.9446 32.9993 56.7324C32.3775 56.9442 31.6768 56.9568 30.9915 56.7012L6.72583 47.6494C5.16147 47.0659 4.12361 45.5719 4.12329 43.9023V30.4814L2.60376 29.915C0.0932297 28.9785 -0.804628 25.8864 0.813721 23.751L2.32642 21.7559C3.39342 20.3489 5.25686 19.8078 6.91138 20.4248L9.5188 21.3975L9.52173 21.3984L10.1077 21.6172L11.7932 22.2461C12.3158 13.4376 16.4751 0.000328244 19.592 0C23.2823 0.000323203 24.9742 6.15127 25.3586 9.22656C25.4049 9.21855 29.8092 8.45709 32.6624 8.45703C35.5306 8.45708 39.967 9.22656 39.967 9.22656C40.3515 6.15118 42.0432 0 45.7336 0ZM22.5032 16.915C20.8047 16.915 19.428 18.2918 19.428 19.9902C19.4281 21.6886 20.8048 23.0654 22.5032 23.0654C24.2013 23.0651 25.5782 21.6884 25.5784 19.9902C25.5784 18.2919 24.2014 16.9154 22.5032 16.915ZM42.4924 16.915C40.7941 16.9152 39.4172 18.2919 39.4172 19.9902C39.4174 21.6885 40.7942 23.0652 42.4924 23.0654C44.1907 23.0653 45.5684 21.6885 45.5686 19.9902C45.5686 18.2918 44.1908 16.9152 42.4924 16.915Z",
    });
    confetti({
      startVelocity: 25,
      shapes: [cat],
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    });
  };

  const handleRoll = () => {
    props.playing?.();
    setSceneState(SceneState.ROLLING);
  };

  const handleGuess = (guess: string) => {
    setSceneState(SceneState.END);
    evaluateGuess(guess);
  };

  // Evaluate the user's guess
  const evaluateGuess = (guess: string) => {
    const hidTotal = hidDice.reduce((a, b) => a + b, 0);
    if (
      hidDice.length === 1 ||
      hidTotal === hidDice.length ||
      hidTotal === hidDice.length * 6 ||
      hidTotal === hidDice.length * 6 - 1 ||
      hidTotal === hidDice.length + 1
    ) {
      // Is entangled
      if (guess === "entangled") {
        fireConfetti(entangledBtn);
        setSceneState(SceneState.WIN);
      } else {
        setSceneState(SceneState.LOSE);
      }
    } else {
      // Is unentangled
      if (guess === "unentangled") {
        fireConfetti(unentangledBtn);
        setSceneState(SceneState.WIN);
      } else {
        setSceneState(SceneState.LOSE);
      }
    }
  };

  // Async callback for handling visible dice landing
  const onLanded = (faceValue: number) => {
    setVisRollValues((prev) => [...prev, faceValue]);
  };

  useEffect(() => {
    props.ready?.();
  }, []);

  useEffect(() => {
    if (props.startTrigger !== undefined && props.startTrigger) {
      setVisRollValues([]);
      handleRoll();
    }
  }, [props.startTrigger]);

  useEffect(() => {
    if (sceneState === SceneState.WIN || sceneState === SceneState.LOSE) {
      if (sceneState === SceneState.WIN) {
        console.log("You win!");
        props.end?.({ result: "win" });
      } else {
        console.log("You lose!");
        props.end?.({ result: "lose" });
      }
    }
  }, [sceneState]);

  return (
    <div className="relative flex flex-row gap-4 items-end justify-center gap-10">
      <div className="flex flex-col gap-10">
        {/* Hidden Dice Box */}
        {hidDice.length > 0 && (
          <div className="flex flex-col items-start justify-center text-lg">
            <h2>HIDDEN DICE</h2>
            <div
              id="hidden-dice-container"
              className="dice-container border-on-surface bg-on-surface/10"
            >
              {Array.from({ length: hidDice.length }).map((_, i) => (
                <BlankDice
                  key={i}
                  sceneState={sceneState}
                  faceValue={
                    sceneState === SceneState.WIN ||
                    sceneState === SceneState.LOSE
                      ? hidDice[i]
                      : undefined
                  }
                />
              ))}
              <span className="absolute top-0 left-0 text-on-surface">
                <icons.Box className="icon-sm opacity-50 m-1" />
              </span>
            </div>
          </div>
        )}
        {/* Dice Tray */}
        <div className="flex flex-col items-start justify-center text-lg">
          <h2>VISIBLE DICE</h2>
          <div
            id="visible-dice-container"
            className="dice-container border-on-surface/50"
          >
            {Array.from({ length: numVisDice }).map((_, i) => (
              <Dice
                key={i}
                sceneState={sceneState}
                onLanded={(face) => onLanded(face)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Guessing */}
      <div
        className={`flex flex-col gap-2 items-center justify-center ${sceneState === SceneState.GUESSING ? "" : "opacity-50 pointer-events-none transition-all duration-300"}`}
      >
        {sceneState === SceneState.GUESSING && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            DICE SUM:{" "}
            {visRollValues.reduce((a, b) => a + b, 0) +
              hidDice.reduce((a, b) => a + b, 0)}
          </motion.p>
        )}
        <div className="relative">
          <button
            ref={entangledBtn}
            onClick={() => handleGuess("entangled")}
            className="bg-primary hover:bg-primary/80-full h-fit w-full hover:scale-105 transition-all duration-300"
          >
            Entangled
          </button>
        </div>
        <div className="relative">
          <button
            ref={unentangledBtn}
            onClick={() => handleGuess("unentangled")}
            className="bg-primary hover:bg-primary/80 h-fit w-full hover:scale-105 transition-all duration-300"
          >
            Unentangled
          </button>
        </div>
      </div>
      {/* Loading Ring */}
      <span className="absolute top-0 right-0">
        {sceneState === SceneState.ROLLING && (
          <LoadingRing
            size={25}
            strokeWidth={5}
            onComplete={() => setSceneState(SceneState.GUESSING)}
            durationMs={ROLL_TIME_MS}
            className="text-primary"
          />
        )}
        {/* Roll Button */}
        {/* {sceneState === SceneState.READY && (
          <button
            onClick={handleRoll}
            className="font-bold cursor-pointer bg-primary hover:bg-primary/80 p-2 rounded-lg h-fit"
          >
            Roll!
          </button>
        )} */}
      </span>
    </div>
  );
}

function Dice({
  maxForce = 4,
  minForce = 3,
  minSpins = 1,
  directionX = 1,
  directionY = 1,
  onLanded,
  sceneState,
}: DiceProps) {
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);

  const randNeg = () => Math.random() * 2 - 1;

  // Calculate which face to land on and snap rotation to that face
  const calculateLandingRotation = () => {
    // Pick a random face
    const targetFace = FACE_ROTATIONS[Math.floor(Math.random() * 6)];

    const force = Math.random() * (maxForce - minForce) + minForce;

    // Add random full rotations for visual effect (multiple spins before landing)
    const extraRotationsX = (Math.floor(randNeg() * force) + minSpins) * 360;
    const extraRotationsY = (Math.floor(randNeg() * force) + minSpins) * 360;

    const finalRotationX = targetFace.rotateX + extraRotationsX * directionX;
    const finalRotationY = targetFace.rotateY + extraRotationsY * directionY;

    return { finalRotationX, finalRotationY, faceValue: targetFace.value };
  };

  const handleRoll = () => {
    const { finalRotationX, finalRotationY, faceValue } =
      calculateLandingRotation();

    setRotationX(finalRotationX);
    setRotationY(finalRotationY);

    if (onLanded) {
      // Call value instantly so parent can calculate
      onLanded(faceValue);
    }
  };

  // Watch for rollTrigger changes to roll the dice
  useEffect(() => {
    if (sceneState === SceneState.ROLLING) {
      handleRoll();
    }
  }, [sceneState]);

  return (
    <div className="dice-scene">
      <motion.div
        className="cube"
        initial={{
          rotateX: 0,
          rotateY: 0,
        }}
        animate={{
          rotateX: rotationX,
          rotateY: rotationY,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 50,
          mass: 1,
          restDelta: 0.001,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="cube__face cube__face--front">
          <icons.SchrodingersCat className="icon-sm" />
        </div>
        <div className="cube__face cube__face--back">2</div>
        <div className="cube__face cube__face--right">4</div>
        <div className="cube__face cube__face--left">3</div>
        <div className="cube__face cube__face--top">5</div>
        <div className="cube__face cube__face--bottom">6</div>
      </motion.div>
    </div>
  );
}

function BlankDice({
  maxForce = 4,
  minForce = 3,
  minSpins = 1,
  directionX = 1,
  directionY = 1,
  sceneState,
  faceValue,
}: DiceProps & { faceValue?: number }) {
  return (
    <span className="relative">
      <span className="text-transparent">
        <Dice
          maxForce={maxForce}
          minForce={minForce}
          minSpins={minSpins}
          directionX={directionX}
          directionY={directionY}
          sceneState={sceneState}
        />
      </span>
      {/* Psuedo face for displaying guesses */}
      <motion.span
        key={faceValue}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: [1, 1.2, 1] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="box__face !w-full !h-full text-white top-0 left-0"
      >
        {faceValue ?? ""}
      </motion.span>
    </span>
  );
}
