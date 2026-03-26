import { Lesson, Unit } from "../types/lessons";

export * from "./Quizzes";

import UNIT1 from "./unit-1";
import UNIT2 from "./unit-2";
import UNIT3 from "./unit-3";

export const LESSONS: Lesson[] = [
  ...UNIT1.lessons,
  ...UNIT2.lessons,
  ...UNIT3.lessons,
];

export const UNITS: Unit[] = [UNIT1.unit, UNIT2.unit, UNIT3.unit];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}

export function getUnitById(id: string): Unit | undefined {
  return UNITS.find((unit) => unit.id === id);
}
