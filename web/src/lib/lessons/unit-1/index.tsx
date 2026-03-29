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
        question:
          "Have you heard of the wave-particle duality of light and matter?",
        answers: [
          { text: "Yes", correct: true },
          { text: "No", correct: true },
          { text: "I'm not sure", correct: true },
        ],
      },
      {
        type: "choice",
        question: "What does it mean for something to be quantized?",
        randomize: true,
        answers: [
          {
            text: "It can only take on specific discrete values",
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
        randomize: true,
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
        question: "What does wave-particle duality imply?",
        randomize: true,
        answers: [
          {
            text: "Particles can exhibit both wave-like and particle-like behavior",
            correct: true,
          },
          {
            text: "Particles are sometimes waves and sometimes particles depending on the observer",
            correct: false,
          },
          {
            text: "Waves and particles are completely unrelated",
            correct: false,
          },
          {
            text: "Only light exhibits wave behavior",
            correct: false,
          },
        ],
      },
      {
        type: "choice",
        question: "What is the key feature of the Schrödinger equation?",
        randomize: true,
        answers: [
          {
            text: "It describes how a quantum state evolves over time",
            correct: true,
          },
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
          "Do you feel like you have a better understanding of quantum particles after this lesson?",
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
        question:
          "How comfortable do you feel working with binary (base-2) numbers?",
        answers: [
          { text: "Not at all", correct: true },
          { text: "Slightly", correct: true },
          { text: "Moderately", correct: true },
          { text: "Very", correct: true },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question: "What does a ket (e.g. $|0\\rangle$) represent?",
        randomize: true,
        answers: [
          {
            text: "A quantum state",
            correct: true,
          },
          {
            text: "A measurement result only",
            correct: false,
          },
          { text: "A probability value", correct: false },
          { text: "A mathematical constant", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "What does the combined state $|0\\rangle |1\\rangle$ equal to?",
        randomize: true,
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
          { text: "Slightly", correct: true },
          { text: "Moderately", correct: true },
          { text: "Very", correct: true },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question: "What does it mean for a qubit to be in superposition?",
        randomize: true,
        answers: [
          {
            text: "It exists as a combination of multiple states at once until measured",
            correct: true,
          },
          { text: "It rapidly switches between 0 and 1", correct: false },
          { text: "It is both 0 and 1 only after measurement", correct: false },
          { text: "It has an unknown but fixed value", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "What's the difference between classical probability and a probability amplitude?",
        randomize: true,
        answers: [
          {
            text: "Probability amplitudes can be complex and can take negative values",
            correct: true,
          },
          {
            text: "Probability amplitudes are always positive",
            correct: false,
          },
          { text: "Classical probabilities can be negative", correct: false },
          { text: "There is no difference", correct: false },
        ],
      },
      {
        type: "choice",
        question: "How comfortable would you be explaining superposition?",
        answers: [
          { text: "Not at all", correct: true },
          { text: "Slightly", correct: true },
          { text: "Moderately", correct: true },
          { text: "Very", correct: true },
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
        question:
          "Have you heard of wave interference (constructive or destructive)?",
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
        randomize: true,
        answers: [
          {
            text: "When two waves interfere, increasing the resulting amplitude",
            correct: true,
          },
          {
            text: "When two waves interfere, decreasing the resulting amplitude",
            correct: false,
          },
        ],
      },
      {
        type: "choice",
        question: "What is destructive interference?",
        randomize: true,
        answers: [
          {
            text: "When two waves interfere, decreasing the resulting amplitude",
            correct: true,
          },
          {
            text: "When two waves interfere, increasing the resulting amplitude",
            correct: false,
          },
        ],
      },
      {
        type: "choice",
        question: "Why can interference occur in quantum systems??",
        randomize: true,
        answers: [
          {
            text: "Because probability amplitudes can combine and cancel each other",
            correct: true,
          },
          {
            text: "Because particles collide with each other",
            correct: false,
          },
          {
            text: "Because probabilities can become negative",
            correct: false,
          },
          {
            text: "Because measurements change the system randomly",
            correct: false,
          },
        ],
      },
      {
        type: "choice",
        question: "What is special about probability amplitudes?",
        randomize: true,
        answers: [
          {
            text: "They can be complex-valued and may take negative values",
            correct: true,
          },
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
        randomize: true,
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
      {
        type: "choice",
        question:
          "Do entangled qubits have definite values before measurement?",
        randomize: true,
        answers: [
          {
            text: "No, their state is only defined as a combined system",
            correct: true,
          },
          {
            text: "Yes, but we just don't know them",
            correct: false,
          },
          {
            text: "Yes, and measurement reveals them without changing anything",
            correct: false,
          },
          {
            text: "Only one qubit has a definite value",
            correct: false,
          },
        ],
      },
      {
        type: "choice",
        question: "What is a key feature of entangled systems?",
        randomize: true,
        answers: [
          {
            text: "Measurement outcomes are correlated between qubits",
            correct: true,
          },
          {
            text: "Each qubit behaves completely independently",
            correct: false,
          },
          { text: "The system always has identical values", correct: false },
          {
            text: "The qubits must be physically connected",
            correct: false,
          },
        ],
      },
    ],
  },
];

const UNIT1 = { unit, lessons };
export default UNIT1;
