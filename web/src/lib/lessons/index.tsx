import { StaticImageData } from "next/image";
import unit1 from "./mdx/unit-1";
import unit2 from "./mdx/unit-2";
import unit3 from "./mdx/unit-3";

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
}

const MECHANICS_UNIT_LESSONS: Lesson[] = [
  {
    id: "history",
    unitId: "mechanics",
    title: "A BRIEF HISTORY",
    description: "Hiiiiiii",
    tocId: "1.0",
    headerImg: undefined,
    pageContent: <unit1.history />,
  },
  {
    id: "bra-ket",
    unitId: "mechanics",
    title: "BRA-KET NOTATION",
    description: "Hiiiiiii",
    tocId: "1.2",
    headerImg: undefined,
    pageContent: <unit1.braKet />,
  },
  {
    id: "superposition",
    unitId: "mechanics",
    title: "SUPERPOSITION",
    description: "",
    tocId: "1.2",
    headerImg: undefined,
    pageContent: <unit1.superposition />,
  },
  {
    id: "interfer",
    unitId: "mechanics",
    title: "INTERFERENCE",
    description: "Hiiiiiii",
    tocId: "1.3",
    headerImg: undefined,
    pageContent: <unit1.interfere />,
  },
  {
    id: "entanglement",
    unitId: "mechanics",
    title: "ENTANGLEMENT",
    description: "",
    tocId: "1.4",
    headerImg: undefined,
    pageContent: <unit1.entanglement />,
  },
];

const COMPUTING_UNIT_LESSONS: Lesson[] = [
  {
    id: "computers",
    unitId: "computing",
    title: "QUANTUM COMPUTERS",
    description: "",
    tocId: "2.0",
    headerImg: undefined,
    pageContent: <unit2.quantComp />,
  },
  {
    id: "circuits",
    unitId: "computing",
    title: "QUANTUM CIRCUITS",
    description: "",
    tocId: "2.1",
    headerImg: undefined,
    pageContent: <unit2.quantCirc />,
  },
  {
    id: "gates",
    unitId: "computing",
    title: "COMMON GATES",
    description: "",
    tocId: "2.2",
    headerImg: undefined,
    pageContent: <unit2.commonGates />,
  },
];

const ALGORITHMS_UNIT_LESSONS: Lesson[] = [
  {
    id: "grovers",
    unitId: "algorithms",
    title: "GROVER'S ALGORITHM",
    description: "",
    tocId: "3.0",
    headerImg: undefined,
    pageContent: <unit3.grovers />,
  },
];

export const LESSONS: Lesson[] = [
  ...MECHANICS_UNIT_LESSONS,
  ...COMPUTING_UNIT_LESSONS,
  ...ALGORITHMS_UNIT_LESSONS,
];

export const UNITS: Unit[] = [
  {
    id: "mechanics",
    title: 'UNIT 1: WHAT IS "QUANTUM"?',
    description: "An introduction to quantum physics",
    lessons: MECHANICS_UNIT_LESSONS,
  },
  {
    id: "computing",
    title: "UNIT 2: QUANTUM COMPUTING",
    description: "",
    lessons: COMPUTING_UNIT_LESSONS,
  },
  {
    id: "algorithms",
    title: "UNIT 3: QUANTUM ALGORITHMS",
    description: "Putting it all together",
    lessons: ALGORITHMS_UNIT_LESSONS,
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}

export function getUnitById(id: string): Unit | undefined {
  return UNITS.find((unit) => unit.id === id);
}
