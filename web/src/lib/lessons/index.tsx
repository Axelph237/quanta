import { StaticImageData } from "next/image";
import unit1 from "./mdx/unit-1";
import unit2 from "./mdx/unit-2";
import unit3 from "./mdx/unit-3";
import { LevelComponentProps } from "../components/games/GameHandler";
import { QuizQuestionType } from "../components/games/QuestionLevel";
import { DiceLevel } from "../components/games/DiceLevel";

const SELF_EVAL_ANSWERS = [
  { text: "Very confident", correct: true },
  { text: "Somewhat confident", correct: true },
  { text: "Slightly confident", correct: true },
  { text: "Not confident at all", correct: true },
];

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

const MECHANICS_UNIT_LESSONS: Lesson[] = [
  {
    id: "history",
    unitId: "mechanics",
    title: "A BRIEF HISTORY",
    description: "Hiiiiiii",
    tocId: "1.0",
    headerImg: undefined,
    pageContent: <unit1.history />,
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
    pageContent: <unit1.braKet />,
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
          { text: "A state where $q_1 = 0$ and $q_0 = 1$", correct: true },
          { text: "A state where $q_1 = 1$ and $q_0 = 0$", correct: false },
          { text: "The number 1 in binary", correct: false },
          { text: "The probability of measuring 0 is 1", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What is $|0\\rangle |1\\rangle$ equal to?",
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
    pageContent: <unit1.superposition />,
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
    pageContent: <unit1.interfere />,
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
    pageContent: <unit1.entanglement />,
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
            text: "Knowing the state of one qubit tells you the state of the others",
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

const COMPUTING_UNIT_LESSONS: Lesson[] = [
  {
    id: "computers",
    unitId: "computing",
    title: "QUANTUM COMPUTERS",
    description: "",
    tocId: "2.0",
    headerImg: undefined,
    pageContent: <unit2.quantComp />,
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
    pageContent: <unit2.commonGates />,
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
    pageContent: <unit2.quantCirc />,
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

const ALGORITHMS_UNIT_LESSONS: Lesson[] = [
  {
    id: "grovers",
    unitId: "algorithms",
    title: "GROVER'S ALGORITHM",
    description: "",
    tocId: "3.0",
    headerImg: undefined,
    pageContent: <unit3.grovers />,
    preQuestions: [
      {
        type: "choice",
        question: "Have you ever worked directly with a database?",
        answers: [
          { text: "Yes", correct: true },
          { text: "No", correct: true },
          { text: "I'm not sure", correct: true },
        ],
      },
      {
        type: "choice",
        question: "How comfortable are you with search algorithms?",
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
        question: 'What does it mean for a database to be "unstructured"?',
        answers: [
          { text: "It doesn't have a fixed format or shape", correct: true },
          { text: "It is disorganized and messy", correct: false },
          { text: "It has no data in it", correct: false },
          { text: "All data is random noise", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "How well do you feel you could explain Grover's algorithm to someone else?",
        answers: [
          { text: "I can't explain it at all", correct: true },
          { text: "Poorly", correct: true },
          { text: "Decently", correct: true },
          { text: "Exceptionally", correct: true },
        ],
      },
    ],
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
