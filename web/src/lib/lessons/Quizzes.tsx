/**
 * These components just simplify the logic for Pre/Post quiz games. They also reduce the amount of code I need to write in the lessons dict
 */
import GameHandler, {
  LevelComponentProps,
} from "../components/games/GameHandler";
import QuestionLevel, {
  QuizQuestionType,
} from "../components/games/QuestionLevel";

interface QuizProps extends React.ComponentProps<"div"> {
  lessonId: string;
  onEnd: () => void;
  questions: (QuizQuestionType | React.ReactElement<LevelComponentProps>)[];
}

/*
  I want to create a system that tags when a specific pre/post quiz has already been completed client-side
  This is to track lesson completion on the client
  Uses: only unlocking a lesson when the last post quiz has been completed. Only unlocking a lesson once its prequiz has been completed
*/

// --- QUIZ STORAGE ---
const QUIZ_STORAGE_KEY = "quizCompletion";

type QuizCompletionStorage = {
  [lessonId: string]: {
    preQuizCompleted: boolean;
    postQuizCompleted: boolean;
    // If I later want to add storage for arbitrary games/quizzes I can.
  };
};

export function getQuizCompletion(lessonId: string) {
  const data = localStorage.getItem(QUIZ_STORAGE_KEY);
  return {
    preQuizCompleted: false,
    postQuizCompleted: false,
    ...(data ? (JSON.parse(data)[lessonId] ?? {}) : {}),
  };
}

export function isLessonCompleted(lessonId: string) {
  const quizCompletion = getQuizCompletion(lessonId);
  return quizCompletion?.preQuizCompleted && quizCompletion?.postQuizCompleted;
}

function setQuizCompletion(
  lessonId: string,
  completion: { preQuizCompleted?: boolean; postQuizCompleted?: boolean },
) {
  const data = localStorage.getItem(QUIZ_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(
      QUIZ_STORAGE_KEY,
      JSON.stringify({ [lessonId]: completion }),
    );
    return;
  }
  const parsedData = JSON.parse(data) as QuizCompletionStorage;
  parsedData[lessonId] = { ...parsedData[lessonId], ...completion };
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(parsedData));
}

// --- QUIZ COMPONENTS ---
export function PreQuiz({ lessonId, onEnd, questions, ...rest }: QuizProps) {
  const thisOnEnd = () => {
    setQuizCompletion(lessonId, { preQuizCompleted: true });
    // Bubble completion up to parent
    onEnd();
  };

  return (
    <GameHandler
      {...rest}
      id={lessonId + "-pre-quiz"}
      name="Pre Quiz"
      description="Before we get started, let's see where you're at!"
      hideBg
      recordOnly
      onGameEnd={thisOnEnd}
      levels={questions.map((question, i) => {
        if (question.type === "input" || question.type === "choice") {
          return (
            <QuestionLevel key={i} question={question as QuizQuestionType} />
          );
        }
        return question as React.ReactElement<LevelComponentProps>;
      })}
    />
  );
}

export function PostQuiz({ lessonId, onEnd, questions, ...rest }: QuizProps) {
  const thisOnEnd = () => {
    setQuizCompletion(lessonId, { postQuizCompleted: true });
    // Bubble completion up to parent
    onEnd();
  };
  return (
    <GameHandler
      {...rest}
      id={lessonId + "-post-quiz"}
      name="Post Quiz"
      description="Let's see what you've learned!"
      hideBg
      // recordOnly
      onGameEnd={thisOnEnd}
      levels={questions.map((question, i) => {
        if (question.type === "input" || question.type === "choice") {
          return (
            <QuestionLevel key={i} question={question as QuizQuestionType} />
          );
        }
        return question as React.ReactElement<LevelComponentProps>;
      })}
    />
  );
}
