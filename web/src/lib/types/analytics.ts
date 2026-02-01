import { Serializable } from "child_process";


interface AnalyticsContextType {
  recordEvent: (event: AnalyticsEvent, timeBucket?: number) => void;
}


interface LessonViewedEvent {
    type: "lesson_viewed";
    lessonId: string;
}

interface LessonClosedEvent {
    type: "lesson_closed";
    lessonId: string;
}

interface GameStartedEvent {
    type: "game_started";
    gameId: string;
}

interface GameCompletedEvent {
    type: "game_completed";
    gameId: string;
}

interface GameActionEvent {
    type: "game_action";
    gameId: string;
    action: string; // arbitrary action, dependent on game
    details?: Serializable; // added details if action requires
}

// Last things to implement
interface QuestionAnsweredEvent {
    type: "question_answered";
    gameId: string;
    questionId: string;
    correct: boolean;
}

interface AnalyticsEventDocument {
    eventId: string,
    deviceId: string,
    timestamp: string,
    event: AnalyticsEvent,
}

type AnalyticsEvent = LessonViewedEvent | LessonClosedEvent | GameStartedEvent | GameCompletedEvent | GameActionEvent | QuestionAnsweredEvent;

export type { AnalyticsEvent, AnalyticsContextType, AnalyticsEventDocument };