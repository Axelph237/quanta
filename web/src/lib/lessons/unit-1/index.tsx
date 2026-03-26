/**
 * INTRODUCTION UNIT
 */

import type { Lesson, Unit } from "@/lib/types/lessons";
import { DiceLevel } from "../../components/games/DiceLevel";
import BriefHistoryMDX from "./brief-history.mdx";
import BraKetMDX from "./bra-ket.mdx";
import SuperposMDX from "./superpos.mdx";
import InterfereMDX from "./interfere.mdx";
import EntangleMDX from "./entangle.mdx";

const unit: Unit = {
  id: "mechanics",
  title: 'UNIT 1: WHAT IS "QUANTUM"?',
  description: "An introduction to quantum physics",
  get lessons() {
    return lessons;
  },
};

const lessons: Lesson[] = [
  {
    id: "history",
    unitId: "mechanics",
    title: "A BRIEF HISTORY",
    description: "Hiiiiiii",
    tocId: "1.0",
    headerImg: undefined,
    pageContent: <BriefHistoryMDX />,
    preQuestions: [
      {
        type: "choice",
        question: "Have you heard of the particle wave debate?",
        answers: [
          { text: "Yes", correct: true },
          { text: "No", correct: true },
          { text: "I'm not sure", correct: true },
        ],
      },
      {
        type: "choice",
        question: "What does it mean for something to be quantized?",
        answers: [
          {
            text: "It can only take on certain discrete values",
            correct: true,
          },
          { text: "It can only exist in continuous amounts", correct: false },
          { text: "It is completely random", correct: false },
          { text: "It has a very large mass", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What is a wave equation?",
        answers: [
          {
            text: "A mathematical equation that describes the propagation of waves",
            correct: true,
          },
          {
            text: "An equation that proves particles cannot be waves",
            correct: false,
          },
          { text: "A classical rule for throwing objects", correct: false },
          {
            text: "A theory that applies only to water ripples",
            correct: false,
          },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question: "What is the key feature of the Schrödinger equation?",
        answers: [
          { text: "It shows that matter waves", correct: true },
          {
            text: "It shows that matter is complex due to the value i",
            correct: false,
          },
          { text: "It's is very long", correct: false },
          {
            text: "It shows that matter has energy equivalence",
            correct: false,
          },
        ],
      },
      {
        type: "choice",
        question:
          'Do you feel like you have a better understanding of "quantum" particles after this lesson?',
        answers: [
          { text: "Yes", correct: true },
          { text: "No", correct: true },
          { text: "I'm not sure", correct: true },
        ],
      },
    ],
  },
  {
    id: "bra-ket",
    unitId: "mechanics",
    title: "BRA-KET NOTATION",
    description: "Hiiiiiii",
    tocId: "1.2",
    headerImg: undefined,
    pageContent: <BraKetMDX />,
    preQuestions: [
      {
        type: "choice",
        question: "Have you ever heard of Bra-Ket notation?",
        answers: [
          { text: "Yes", correct: true },
          { text: "No", correct: true },
          { text: "I'm not sure", correct: true },
        ],
      },
      {
        type: "choice",
        question: "How comfortable do you feel working with binary numbers?",
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
        question: "What does $|01\\rangle$ mean?",
        answers: [
          {
            text: "A state where the first qubit is 0 and the second qubit is 1",
            correct: true,
          },
          {
            text: "A state where the first qubit is 1 and the second qubit is 0",
            correct: false,
          },
          { text: "The number 1 in binary", correct: false },
          { text: "The probability of measuring 0 is 1", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "What is the combined state of $|0\\rangle |1\\rangle$ equal to?",
        answers: [
          { text: "$|01\\rangle$", correct: true },
          { text: "$|10\\rangle$", correct: false },
          { text: "$|1\\rangle$", correct: false },
          { text: "$|0\\rangle$", correct: false },
        ],
      },
    ],
  },
  {
    id: "superposition",
    unitId: "mechanics",
    title: "SUPERPOSITION",
    description: "",
    tocId: "1.2",
    headerImg: undefined,
    pageContent: <SuperposMDX />,
    preQuestions: [
      {
        type: "choice",
        question: "Have you ever heard of superposition?",
        answers: [
          { text: "Yes", correct: true },
          { text: "No", correct: true },
          { text: "I'm not sure", correct: true },
        ],
      },
      {
        type: "choice",
        question: "How comfortable are you with understanding probabilities?",
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
        question: "How comfortable would you be explaining superposition?",
        answers: [
          { text: "Not at all", correct: true },
          { text: "A little", correct: true },
          { text: "Comfortable", correct: true },
          { text: "Very comfortable", correct: true },
        ],
      },
      {
        type: "choice",
        question:
          "What's the difference between classical probability and a probability amplitude?",
        answers: [
          {
            text: "Probability amplitudes have direction (complex and negative).",
            correct: true,
          },
          {
            text: "Probability amplitudes are always positive.",
            correct: false,
          },
          { text: "Classical probabilities can be negative.", correct: false },
          { text: "There is no difference.", correct: false },
        ],
      },
    ],
  },
  {
    id: "interfer",
    unitId: "mechanics",
    title: "INTERFERENCE",
    description: "Hiiiiiii",
    tocId: "1.3",
    headerImg: undefined,
    pageContent: <InterfereMDX />,
    preQuestions: [
      {
        type: "choice",
        question: "Have you ever heard of wave interference?",
        answers: [
          { text: "Yes", correct: true },
          { text: "No", correct: true },
          { text: "I'm not sure", correct: true },
        ],
      },
      {
        type: "choice",
        question: "Have you ever heard of destructive interference?",
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
        question: "What is constructive interference?",
        answers: [
          {
            text: "When two waves interfere, increasing the amplitude of the wave",
            correct: true,
          },
          {
            text: "When two waves interfere, decreasing the amplitude of the wave",
            correct: false,
          },
        ],
      },
      {
        type: "choice",
        question: "What is destructive interference?",
        answers: [
          {
            text: "When two waves interfere, decreasing the amplitude of the wave",
            correct: true,
          },
          {
            text: "When two waves interfere, increasing the amplitude of the wave",
            correct: false,
          },
        ],
      },
      {
        type: "choice",
        question: "What is special about probability amplitudes?",
        answers: [
          { text: "They can be negative & complex", correct: true },
          { text: "They can be negative but not complex", correct: false },
          { text: "They can be complex but not negative", correct: false },
          {
            text: "They are identical to classical probabilities",
            correct: false,
          },
        ],
      },
    ],
  },
  {
    id: "entanglement",
    unitId: "mechanics",
    title: "ENTANGLEMENT",
    description: "",
    tocId: "1.4",
    headerImg: undefined,
    pageContent: <EntangleMDX />,
    preQuestions: [
      {
        type: "choice",
        question: "Have you ever heard of entanglement?",
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
        question: "What does it mean for a set of qubits to be entangled?",
        answers: [
          {
            text: "The state of the qubits cannot be described independently of each other",
            correct: true,
          },
          {
            text: "They are physically connected by tiny strings",
            correct: false,
          },
          { text: "They can never be separated", correct: false },
          {
            text: "They have the identical same value continuously",
            correct: false,
          },
        ],
      },
      <DiceLevel key={"dice-1"} numVisDice={2} hidDice={[1, 2]} />,
      <DiceLevel key={"dice-2"} numVisDice={2} hidDice={[3, 6]} />,
      <DiceLevel key={"dice-3"} numVisDice={2} hidDice={[5, 5]} />,
    ],
  },
];

const UNIT1 = { unit, lessons };
export default UNIT1;
