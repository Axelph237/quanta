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
        question:
          "How would you rate your understanding of how classical computers work?",
        answers: [
          { text: "Not at all", correct: true },
          { text: "Basic (user level)", correct: true },
          { text: "Intermediate (some programming knowledge)", correct: true },
          {
            text: "Advanced (understand hardware/architecture)",
            correct: true,
          },
        ],
      },
      {
        type: "choice",
        question: "What does it mean for an operation to be irreversible?",
        randomize: true,
        answers: [
          { text: "Information is lost during the operation", correct: true },
          {
            text: "The operation cannot be reversed even in principle",
            correct: false,
          },
          {
            text: "The operation takes too much power",
            correct: false,
          },
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
        question: "What is a key difference between classical bits and qubits?",
        randomize: true,
        answers: [
          {
            text: "Qubits can exist in a superposition of states",
            correct: true,
          },
          { text: "Qubits can only store one value at a time", correct: false },
          {
            text: "Classical bits can be in multiple states at once",
            correct: false,
          },
          { text: "There is no difference", correct: false },
        ],
      },
      {
        type: "choice",
        question: "Why must quantum operations be reversible?",
        randomize: true,
        answers: [
          { text: "To preserve quantum information", correct: true },
          { text: "To make computations faster", correct: false },
          { text: "To reduce energy usage", correct: false },
          { text: "Because measurements require it", correct: false },
        ],
      },
      {
        type: "choice",
        question: 'What does it mean for a qubit to "decohere"?',
        randomize: true,
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
      {
        type: "choice",
        question:
          "How well do you feel you could explain the basics of a quantum computer to someone else?",
        answers: [
          { text: "I can't explain it at all", correct: true },
          { text: "Poorly", correct: true },
          {
            text: "Decently",
            correct: true,
          },
          {
            text: "Exceptionally",
            correct: true,
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
        type: "step",
        question: "How comfortable are you with matrices?",
        highLabel: "Very",
        lowLabel: "Not at all",
        steps: 4,
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question: "What does a Pauli-X gate do to a qubit's state?",
        randomize: true,
        answers: [
          {
            text: "It flips the state from $|0\\rangle$ to $|1\\rangle$ and vice-versa",
            correct: true,
          },
          { text: "It puts the state in a superposition", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What does the Hadamard gate do to a qubit's state?",
        randomize: true,
        answers: [
          {
            text: "It puts it into an equal superposition of $|0\rangle$ and $|1\rangle$",
            correct: true,
          },
          { text: "It flips the state to the opposite", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What does the Controlled-NOT gate do to a qubit's state?",
        randomize: true,
        answers: [
          {
            text: "It flips the state of a target qubit if the control qubit is $|1\\rangle$",
            correct: true,
          },
          { text: "It applies a Hadamard gate to all qubits", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What do quantum gates represent?",
        randomize: true,
        answers: [
          {
            text: "Operations that change the state of qubits",
            correct: true,
          },
          { text: "Measurements of qubits", correct: false },
          { text: "Storage of quantum information", correct: false },
          { text: "Physical connections between qubits", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "What is special about quantum gates compared to classical logic gates?",
        randomize: true,
        answers: [
          {
            text: "They must be reversible operations",
            correct: true,
          },
          { text: "They always reduce information", correct: false },
          { text: "They only work on classical bits", correct: false },
          { text: "They are random operations", correct: false },
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
      {
        type: "choice",
        question: "What do you think a quantum circuit does?",
        randomize: true,
        answers: [
          { text: "Performs operations on qubits", correct: true },
          { text: "Stores classical data in memory", correct: false },
          { text: "Connects hardware components together", correct: false },
          { text: "Controls electrical signals in a computer", correct: false },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question: "What is the width of a quantum circuit?",
        randomize: true,
        answers: [
          { text: "The number of qubits used in the circuit", correct: true },
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
        randomize: true,
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
      {
        type: "choice",
        question: "What does each line (wire) in a quantum circuit represent?",
        randomize: true,
        answers: [
          {
            text: "A single qubit",
            correct: true,
          },
          {
            text: "A classical bit",
            correct: false,
          },
          { text: "A physical cable inside the computer", correct: false },
          { text: "A sequence of measurements", correct: false },
        ],
      },
    ],
  },
];

const UNIT2 = { unit, lessons };
export default UNIT2;
