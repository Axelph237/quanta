import { StaticImageData } from "next/image";
import unit1 from "./lesson-mds/unit-1/unit";
import unit2 from "./lesson-mds/unit-2/unit";
import unit3 from "./lesson-mds/unit-3/unit";

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
    tocId: "1.1",
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
    id: "entanglement",
    unitId: "mechanics",
    title: "ENTANGLEMENT",
    description: "",
    tocId: "1.3",
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
  {
    id: "compile",
    unitId: "computing",
    title: "CIRCUIT COMPILATION",
    description: "",
    tocId: "2.3",
    headerImg: undefined,
    pageContent: <unit2.compile />,
  },
  {
    id: "measurement",
    unitId: "computing",
    title: "QUBIT MEASUREMENT",
    description: "",
    tocId: "2.4",
    headerImg: undefined,
    pageContent: <p>TODO</p>,
  },
];

const ALGORITHMS_UNIT_LESSONS: Lesson[] = [
  {
    id: "query-model",
    unitId: "algorithms",
    title: "QUERY MODEL OF COMPUTATION",
    description: "",
    tocId: "3.0",
    headerImg: undefined,
    pageContent: <unit3.query />,
  },
  {
    id: "example-algos",
    unitId: "algorithms",
    title: "EXAMPLE ALGORITHMS",
    description: "",
    tocId: "3.1",
    headerImg: undefined,
    pageContent: <p>TODO</p>,
  },
  {
    id: "nisq-challenges",
    unitId: "algorithms",
    title: "NISQ-ERA CHALLENGES",
    description: "",
    tocId: "3.2",
    headerImg: undefined,
    pageContent: <p>TODO</p>,
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
    description: "The foray into quantum physics",
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
