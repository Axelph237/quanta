import catlaying from "@public/assets/cat_tiles_laying.jpeg";
import { StaticImageData } from "next/image";

export interface Unit {
  id: string;
  title: string;
  description: string;
}

export const UNITS: Unit[] = [
  {
    id: "basics",
    title: "QUANTUM BASICS",
    description: "",
  },
  {
    id: "computing",
    title: "QUANTUM COMPUTING",
    description: "",
  },
  {
    id: "algorithms",
    title: "QUANTUM ALGORITHMS",
    description: "",
  },
];

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  img: StaticImageData | undefined;
}

export const LESSONS: Lesson[] = [
  {
    id: "quantum-basics",
    unitId: "basics",
    title: "QUANTUM BASICS",
    description: "",
    img: catlaying,
  },
  {
    id: "wave-functions",
    unitId: "basics",
    title: "WAVE FUNCTIONS",
    description: "",
    img: undefined,
  },
  {
    id: "super-entangle",
    unitId: "basics",
    title: "SUPERPOSITION & ENTANGLEMENT",
    description: "",
    img: undefined,
  },
  {
    id: "braket",
    unitId: "computing",
    title: "BRA-KET NOTATION",
    description: "",
    img: undefined,
  },
  {
    id: "measurement",
    unitId: "computing",
    title: "MEASUREMENT",
    description: "Collapsing the wave function",
    img: undefined,
  },
  {
    id: "gates",
    unitId: "computing",
    title: "GATES",
    description: "Pauli-X, Hadamard, and CNOT",
    img: undefined,
  },
  {
    id: "algorithms",
    unitId: "algorithms",
    title: "INTRO TO ALGORITHMS",
    description: "Grover's",
    img: undefined,
  },
  {
    id: "solving-problems",
    unitId: "algorithms",
    title: "SOLVING SUDOKU",
    description: "",
    img: undefined,
  },
];