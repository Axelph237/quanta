import { StaticImageData } from "next/image";
import { LevelComponentProps } from "../components/games/GameHandler";
import { QuizQuestionType } from "../components/games/QuestionLevel";

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  tocId: string;
  headerImg: StaticImageData | undefined;
  pageContent: React.ReactNode;
  preQuestions: (QuizQuestionType | React.ReactElement<LevelComponentProps>)[];
  postQuestions: (QuizQuestionType | React.ReactElement<LevelComponentProps>)[];
}