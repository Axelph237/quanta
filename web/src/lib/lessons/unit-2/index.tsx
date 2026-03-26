/**
 * COMPUTING UNIT
 */

import type { Lesson, Unit } from "@/lib/types/lessons";
import QuantCompMDX from "./quant-comp.mdx";
import CommonGatesMDX from "./common-gates.mdx";
import QuantCircMDX from "./quant-circ.mdx";

const unit: Unit = {
  id: "computing",
  title: "UNIT 2: QUANTUM COMPUTING",
  description: "",
  get lessons() {
    return lessons;
  },
};

const lessons: Lesson[] = [
  {
    id: "computers",
    unitId: "computing",
    title: "QUANTUM COMPUTERS",
    description: "",
    tocId: "2.0",
    headerImg: undefined,
    pageContent: <QuantCompMDX />,
    preQuestions: [
      {
        type: "choice",
        question: "How well would you say you understand classical computers?",
        answers: [
          { text: "I know nothing at all", correct: true },
          { text: "I know how to use computers", correct: true },
          { text: "I know how to use and program computers", correct: true },
          {
            text: "I understand computer hardware and programming",
            correct: true,
          },
        ],
      },
      {
        type: "choice",
        question: "What does it mean for an operation to be irreversible?",
        answers: [
          { text: "Information is lost during the operation", correct: true },
          { text: "The operation takes too much power", correct: false },
          {
            text: "The operation takes an infinite amount of time",
            correct: false,
          },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question:
          "How well do you feel you could explain the basics of a quantum computer to someone else?",
        answers: [
          { text: "1. I can't explain it at all", correct: true },
          { text: "2. Poorly", correct: true },
          { text: "3. Decently", correct: true },
          { text: "4. Adequately", correct: true },
        ],
      },
      {
        type: "choice",
        question: 'What does it mean for a qubit to "decohere"?',
        answers: [
          { text: "It loses information to the environment", correct: true },
          { text: "It gains too much energy", correct: false },
          {
            text: "It becomes perfectly aligned with the magnetic field",
            correct: false,
          },
          {
            text: "It turns back into a classical bit forever",
            correct: false,
          },
        ],
      },
    ],
  },
  {
    id: "gates",
    unitId: "computing",
    title: "COMMON GATES",
    description: "",
    tocId: "2.1",
    headerImg: undefined,
    pageContent: <CommonGatesMDX />,
    preQuestions: [
      {
        type: "choice",
        question: "Have you ever studied quantum gates?",
        answers: [
          { text: "Yes", correct: true },
          { text: "No", correct: true },
          { text: "I'm not sure", correct: true },
        ],
      },
      {
        type: "choice",
        question: "How comfortable are you with matrices?",
        answers: [
          { text: "Not at all", correct: true },
          { text: "A little", correct: true },
          { text: "Comfortable", correct: true },
          { text: "Very comfortable", correct: true },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question: "What does a Pauli-X gate do to a qubit's state?",
        answers: [
          { text: "It flips the state", correct: true },
          { text: "It puts the state in a superposition", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What does the Hadamard gate do to a qubit's state?",
        answers: [
          { text: "It puts it into a superposition", correct: true },
          { text: "It flips the state to the opposite", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What does the Controlled-NOT gate do to a qubit's state?",
        answers: [
          {
            text: "It flips the state of a target qubit if the control qubit is $|1\\rangle$",
            correct: true,
          },
          { text: "It applies a Hadamard gate to all qubits", correct: false },
        ],
      },
    ],
  },
  {
    id: "circuits",
    unitId: "computing",
    title: "QUANTUM CIRCUITS",
    description: "",
    tocId: "2.2",
    headerImg: undefined,
    pageContent: <QuantCircMDX />,
    preQuestions: [
      {
        type: "choice",
        question: "Have you ever heard of quantum circuits?",
        answers: [
          { text: "Yes", correct: true },
          { text: "No", correct: true },
          { text: "I'm not sure", correct: true },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question: "What is the width of a quantum circuit?",
        answers: [
          { text: "The number of qubits in a circuit", correct: true },
          { text: "The physical size of the quantum computer", correct: false },
          {
            text: "The amount of time the circuit takes to run",
            correct: false,
          },
          { text: "The number of gates in the circuit", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What does a quantum circuit represent?",
        answers: [
          {
            text: "The operations to be performed on a set of qubits",
            correct: true,
          },
          {
            text: "The electrical wiring of a quantum computer",
            correct: false,
          },
          { text: "A map of where to place qubits", correct: false },
          { text: "A blueprint for classical components", correct: false },
        ],
      },
    ],
  },
];

const UNIT2 = { unit, lessons };
export default UNIT2;
