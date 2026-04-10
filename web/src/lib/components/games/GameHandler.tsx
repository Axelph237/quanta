import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import {
  cloneElement,
  ComponentProps,
  useEffect,
  useRef,
  useState,
} from "react";
import Iridescence from "../react-bits/Iridescence";
import { COLORS } from "@/app/globals";
import { Eye, EyeOff } from "../ui/Icons";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { Serializable } from "child_process";
import { useViewportSize } from "@/lib/hooks/useViewportSize";

const SUCCESS_MESSAGES = [
  "NICE!",
  "CORRECT!",
  "PERFECT!",
  "AMAZING!",
  "FANTASTIC!",
  "WONDERFUL!",
  "EXCELLENT!",
];

const FAILURE_MESSAGES = [
  "TRY AGAIN!",
  "ALMOST!",
  "CLOSE!",
  "NEVER GIVE UP!",
  "YOU CAN DO IT!",
];

const CONTINUE_MESSAGES = [
  "ON TO THE NEXT!",
  "LET'S CONTINUE!",
  "LET'S KEEP GOING!",
  "ONLY A FEW MORE!",
  "KEEP IT UP!",
];

enum GameState {
  READY,
  PLAYING,
  END,
}

export interface LevelComponentProps {
  levelAPI?: {
    ready: () => void; // Called when the level is ready to be played
    playing: () => void; // Called when the level is being played
    end: ({ result }: { result: "win" | "lose" }) => void; // Called when the level ends
    recordAction: (action: string, details: Serializable) => void; // Called to record an action
  };
  startTrigger?: boolean; // Trigger to start the level, useful for levels that need an action to trigger on start
}

/**
 * The Game Handler is a component for managing the state and success of a game. It handles state updates passed as events from children.
 * @returns
 */
export default function GameHandler({
  id,
  name,
  description,
  levels,
  bg,
  hideBg,
  recordOnly = false,
  successMessages,
  failureMessages,
  onGameStart,
  onGameEnd,
  className,
  ...rest
}: {
  id: string;
  name: string;
  description?: string;
  levels: Array<React.ReactElement<LevelComponentProps>>;
  bg?: React.ReactNode;
  hideBg?: boolean;
  recordOnly?: boolean;
  successMessages?: string[];
  failureMessages?: string[];
  onGameStart?: () => void;
  onGameEnd?: () => void;
} & ComponentProps<"div">) {
  const background = bg || (
    <Iridescence
      color={
        COLORS.secondary.rgb.map((c) => c / 255) as [number, number, number]
      }
    />
  );
  const viewport = useViewportSize();
  const { recordEvent } = useAnalytics();
  const [started, setStarted] = useState<boolean>(false);
  const [bgVisible, setBgVisible] = useState<boolean>(hideBg ? false : true);
  const [activeGame, setActiveGame] = useState<number>(0);
  const [activeState, setActiveState] = useState<GameState | null>(null);
  const [startTrigger, setStartTrigger] = useState<boolean>(false); // Trigger to start the internal game
  const [displayMessage, setDisplayMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(true);

  const getRandomMessage = (messages: string[]) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Set display messages whenever the success changes
  useEffect(() => {
    (async () => {
      if (recordOnly) {
        setDisplayMessage(getRandomMessage(CONTINUE_MESSAGES));
      } else {
        setDisplayMessage(
          success
            ? getRandomMessage(successMessages || SUCCESS_MESSAGES)
            : getRandomMessage(failureMessages || FAILURE_MESSAGES),
        );
      }
    })();
  }, [success, recordOnly, successMessages, failureMessages]);

  const onReady = () => {
    setActiveState(GameState.READY);
    if (activeGame !== 0) {
      setStartTrigger(true);
    }
  };

  const onPlaying = () => {
    setActiveState(GameState.PLAYING);
    setStartTrigger(false);
  };

  const onEnd = ({ result }: { result: "win" | "lose" }) => {
    setActiveState(GameState.END);
    if (result === "win" || recordOnly) {
      setTimeout(() => {
        setActiveGame(activeGame + 1);
      }, 500);
      setSuccess(true);
    } else {
      setActiveState(GameState.READY);
      setSuccess(false);
    }
    setStartTrigger(false);
  };

  const onAction = (action: string, details: Serializable) => {
    recordEvent(
      {
        type: "game_action",
        gameId: id,
        action,
        details: {
          level: activeGame,
          ...(typeof details === "object" ? details : { value: details }),
        },
      },
      500, // 500ms time bucket
    );
  };

  // Record analytics events
  useEffect(() => {
    if (activeState === GameState.PLAYING && activeGame === 0 && !started) {
      // Record start of game
      recordEvent({
        type: "game_started",
        gameId: id,
      });
      onGameStart?.();
      setStarted(true); // Prevent double counting
    } else if (activeState === GameState.END && activeGame === levels.length) {
      // Record end of game
      recordEvent({
        type: "game_completed",
        gameId: id,
      });
      onGameEnd?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeState,
    activeGame,
    id,
    levels.length,
    recordEvent,
    onGameEnd,
    onGameStart,
  ]);

  // Clone the game element and inject the event handlers
  let renderedLevel;
  if (activeGame >= levels.length) {
    renderedLevel = <VictoryScreen />;
  } else {
    const level = levels[activeGame];
    renderedLevel = cloneElement(level, {
      levelAPI: {
        ready: onReady,
        playing: onPlaying,
        end: onEnd,
        recordAction: onAction,
      },
      startTrigger, // Boolean signal to start the internal game
    });
  }

  const handleClick = () => {
    setStartTrigger(true);
  };

  const gameReady =
    renderedLevel !== null && // Not on last screen
    activeState === GameState.READY && // A game is ready
    startTrigger === false; // The game has not been started

  return (
    <div
      id={id}
      className={`${className} h-fit relative rounded-lg border-2 ${success || activeState !== GameState.READY ? "border-quanta-on-surface" : "border-quanta-error"} transition-color duration-250 p-10 overflow-hidden w-full h-1/2 min-h-fit ${className}`}
      {...rest}
    >
      {/* First game has a "Play!" button, each sequential game has a "Ready?" button */}
      <AnimatePresence>
        {gameReady && (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute bg-quanta-surface/50 top-0 right-0 w-full h-full flex flex-col gap-2 items-center justify-center z-10"
          >
            {success ? (
              <>
                <h1 className="text-4xl font-bold">{name}</h1>
                <h1 className="text-xl w-1/2 text-center opacity-85">
                  {description}
                </h1>
                <button
                  className="button-primary cursor-pointer bg-quanta-on-surface text-quanta-surface rounded-full"
                  onClick={handleClick}
                >
                  Ready?
                </button>
              </>
            ) : (
              <>
                <motion.h1
                  animate={{
                    rotate: [0, -3, 3, 0],
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-4xl font-bold"
                >
                  {displayMessage}
                </motion.h1>
                <h1 className="text-xl w-1/2 text-center opacity-85">
                  Not quite the right answer
                </h1>
                <button
                  className="button-primary cursor-pointer bg-quanta-on-surface text-quanta-surface rounded-full"
                  onClick={handleClick}
                >
                  Ready?
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute top-0 left-0 w-full flex items-center justify-start z-10 gap-1 m-1">
        {levels.map((_, index) => (
          <div
            key={index}
            className="p-1 border-2 border-quanta-on-surface rounded-full"
          >
            <div
              className={`w-[10px] aspect-square ${index === activeGame ? "bg-quanta-on-surface/50" : index < activeGame ? "bg-quanta-on-surface" : "bg-transparent"} rounded-full transition-all duration-300`}
            ></div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={activeGame}
          className="relative"
          initial={{ left: activeGame === 0 ? "0%" : "100%" }}
          animate={{
            left: 0,
            filter: gameReady ? "blur(3px)" : "blur(0px)",
          }}
          exit={{
            left: "-100%",
          }}
          transition={{
            duration: viewport.isMd ? 0.4 : 0.2,
            ease: "easeInOut",
          }}
        >
          {renderedLevel}
        </motion.span>
      </AnimatePresence>
      <AnimatePresence>
        {activeState === GameState.END && activeGame < levels.length && (
          <DisplayMessage message={displayMessage} />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: bgVisible ? 0.75 : 0 }}
        className="absolute top-0 left-0 w-full h-full z-[-1]"
      >
        {background}
      </motion.div>
      {!hideBg && (
        <button
          className="button-primary absolute p-0! m-2 bottom-0 flex w-8 aspect-square items-center justify-center text-quanta-surface left-0 bg-quanta-on-surface z-10"
          onClick={() => setBgVisible(!bgVisible)}
        >
          {bgVisible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}

function VictoryScreen() {
  const ref = useRef<HTMLDivElement>(null);

  const fireworks = () => {
    const duration = 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    //const rect = ref.current?.getBoundingClientRect();

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      const cat = confetti.shapeFromPath({
        path: "M45.7336 0C48.8798 0.00221635 53.0832 13.692 53.5413 22.4932L55.8928 21.6162L56.4788 21.3975L56.4817 21.3965L59.0891 20.4238C60.7435 19.807 62.6071 20.348 63.6741 21.7549L65.1868 23.75C66.8053 25.8853 65.9071 28.9773 63.3967 29.9141L61.8772 30.4805V43.9014C61.8771 45.571 60.8389 47.0647 59.2747 47.6484L35.009 56.7002C34.3231 56.956 33.6215 56.9446 32.9993 56.7324C32.3775 56.9442 31.6768 56.9568 30.9915 56.7012L6.72583 47.6494C5.16147 47.0659 4.12361 45.5719 4.12329 43.9023V30.4814L2.60376 29.915C0.0932297 28.9785 -0.804628 25.8864 0.813721 23.751L2.32642 21.7559C3.39342 20.3489 5.25686 19.8078 6.91138 20.4248L9.5188 21.3975L9.52173 21.3984L10.1077 21.6172L11.7932 22.2461C12.3158 13.4376 16.4751 0.000328244 19.592 0C23.2823 0.000323203 24.9742 6.15127 25.3586 9.22656C25.4049 9.21855 29.8092 8.45709 32.6624 8.45703C35.5306 8.45708 39.967 9.22656 39.967 9.22656C40.3515 6.15118 42.0432 0 45.7336 0ZM22.5032 16.915C20.8047 16.915 19.428 18.2918 19.428 19.9902C19.4281 21.6886 20.8048 23.0654 22.5032 23.0654C24.2013 23.0651 25.5782 21.6884 25.5784 19.9902C25.5784 18.2919 24.2014 16.9154 22.5032 16.915ZM42.4924 16.915C40.7941 16.9152 39.4172 18.2919 39.4172 19.9902C39.4174 21.6885 40.7942 23.0652 42.4924 23.0654C44.1907 23.0653 45.5684 21.6885 45.5686 19.9902C45.5686 18.2918 44.1908 16.9152 42.4924 16.915Z",
      });
      confetti({
        ...defaults,
        particleCount,
        scalar: 1.5,
        shapes: [cat],
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      });
      // confetti({
      //   ...defaults,
      //   particleCount,
      //   origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      // });
    }, 250);
  };

  useEffect(() => {
    fireworks();
  }, []);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
      }}
      exit={{
        scale: 0,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex items-center justify-center w-full h-full"
      ref={ref}
    >
      <h1 className="text-4xl font-bold">VICTORY!</h1>
    </motion.div>
  );
}

function DisplayMessage({ message }: { message: string }) {
  const [tilt, setTilt] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTilt(Math.random() * 10 - 5);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        rotate: tilt,
      }}
      exit={{
        scale: 0,
        rotate: 0,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-center"
    >
      <h1 className="text-4xl font-bold">{message}</h1>
    </motion.div>
  );
}
