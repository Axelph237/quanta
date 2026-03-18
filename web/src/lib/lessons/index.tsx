import { StaticImageData } from "next/image";
import unit1 from "./mdx/unit-1";
import unit2 from "./mdx/unit-2";
import unit3 from "./mdx/unit-3";
import { GameComponentProps } from "../components/games/GameHandler";
import { QuizQuestionType } from "../components/games/QuestionLevel";

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
  preQuestions: (QuizQuestionType | React.ReactElement<GameComponentProps>)[];
  postQuestions: (QuizQuestionType | React.ReactElement<GameComponentProps>)[];
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
        question:
          "Before quantum physics, was light considered a wave or a particle?",
        answers: [
          { text: "A wave", correct: false },
          { text: "A particle", correct: false },
          { text: "Both", correct: false },
          { text: "It was a debated topic", correct: true },
        ],
      },
      {
        type: "choice",
        question:
          "What is expected when a wave passes through two narrow slits?",
        answers: [
          { text: "It travels straight through", correct: false },
          { text: "It bounces back", correct: false },
          { text: "It creates an interference pattern", correct: true },
          { text: "It changes color", correct: false },
        ],
      },
      {
        type: "choice",
        question: "If an object's energy was continuous, what would that mean?",
        answers: [
          {
            text: "It can have any number of positive energy levels",
            correct: true,
          },
          {
            text: "It can only have specific, discrete levels of energy",
            correct: false,
          },
          { text: "It constantly creates energy", correct: false },
          { text: "It has zero energy", correct: false },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question:
          "Who proposed the first formulation successfully modeling black body radiation?",
        answers: [
          { text: "Albert Einstein", correct: false },
          { text: "Louis de Broglie", correct: false },
          { text: "Max Planck", correct: true },
          { text: "Erwin Schrödinger", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "What equation is central to modern quantum mechanics and models the waving properties of matter?",
        answers: [
          { text: "Planck relation", correct: false },
          { text: "Schrödinger equation", correct: true },
          { text: "Einstein's mass-energy equivalence", correct: false },
          { text: "Rayleigh-Jeans Law", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "What was Max Planck's 'silent killer' discovery regarding black body radiation?",
        answers: [
          {
            text: "Energy of harmonic oscillators is continuous",
            correct: false,
          },
          { text: "Light is only a wave", correct: false },
          {
            text: "Energy levels of harmonic oscillators are discrete/quantized",
            correct: true,
          },
          { text: "Matter cannot wave", correct: false },
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
        question:
          "In physics and mathematics, what does a vector typically represent?",
        answers: [
          { text: "Only a magnitude", correct: false },
          { text: "A point in space without direction", correct: false },
          {
            text: "A quantity with both magnitude and direction",
            correct: true,
          },
          { text: "A scalar value", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "In mathematics, what does it mean to take the conjugate of a complex number?",
        answers: [
          { text: "To negate the imaginary part", correct: true },
          { text: "To square the number", correct: false },
          { text: "To divide by zero", correct: false },
          { text: "To negate the real part", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What do we call a 1D array of values in linear algebra?",
        answers: [
          { text: "A scalar", correct: false },
          { text: "A matrix", correct: false },
          { text: "A vector", correct: true },
          { text: "A constant", correct: false },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question:
          "In quantum computing, what is a ket |...⟩ typically used to represent?",
        answers: [
          { text: "The state of a system", correct: true },
          { text: "A classical bit", correct: false },
          { text: "The speed of light", correct: false },
          { text: "A scalar constant", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What is a bra ⟨...| used to represent?",
        answers: [
          { text: "The basic state of a vector", correct: false },
          { text: "The Hermitian conjugate of a vector", correct: true },
          { text: "A classical variable", correct: false },
          { text: "A quantum gate", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "How is the combined state of multiple qubits written in bra-ket notation, such as a |0⟩ and a |1⟩?",
        answers: [
          { text: "|0⟩ + |1⟩", correct: false },
          { text: "|01⟩", correct: true },
          { text: "0 ⋅ 1", correct: false },
          { text: "|0⟩ × |1⟩", correct: false },
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
        question:
          "If you flip a fair coin, what are the odds it lands on heads?",
        answers: [
          { text: "100%", correct: false },
          { text: "50%", correct: true },
          { text: "25%", correct: false },
          { text: "0%", correct: false },
        ],
      },
      {
        type: "choice",
        question: "In reality, is a coin toss truly random?",
        answers: [
          { text: "Yes, it is entirely random", correct: false },
          { text: "No, physics can determine the outcome", correct: true },
        ],
      },
      {
        type: "choice",
        question:
          "If you don't look at a spinning top, can you definitively say which way the logo on it is pointing at an exact millisecond?",
        answers: [
          { text: "Yes, we can always know", correct: false },
          {
            text: "No, unless we observe it or know its exact starting conditions",
            correct: true,
          },
        ],
      },
      {
        type: "choice",
        question:
          "In classical probability, what must the sum of all possible outcomes' probabilities equal?",
        answers: [
          { text: "0", correct: false },
          { text: "0.5", correct: false },
          { text: "1 (or 100%)", correct: true },
          { text: "2", correct: false },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question:
          "According to the Heisenberg Uncertainty Principle, if we know a particle's exact location, what can we NOT know?",
        answers: [
          { text: "Its mass", correct: false },
          { text: "Its momentum", correct: true },
          { text: "Its charge", correct: false },
          { text: "Its spin", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "Unlike classical probabilities, quantum probability amplitudes can be:",
        answers: [
          { text: "Only between 0 and 1", correct: false },
          { text: "Complex and negative", correct: true },
          { text: "Always 100%", correct: false },
          { text: "Only positive real numbers", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "Why is the Schrödinger equation's property of 'linearity' important?",
        answers: [
          { text: "It makes solving the equation easy", correct: false },
          {
            text: "It ensures particles only move in straight lines",
            correct: false,
          },
          {
            text: "It allows multiple probability amplitudes to be superimposed",
            correct: true,
          },
          { text: "It removes the need for complex numbers", correct: false },
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
        question:
          "When two ripples in a pond meet and their wave peaks add together, this is an example of:",
        answers: [
          { text: "Destructive interference", correct: false },
          { text: "Refraction", correct: false },
          { text: "Constructive interference", correct: true },
          { text: "Diffraction", correct: false },
        ],
      },
      {
        type: "choice",
        question: "Can two waves cancel each other out?",
        answers: [
          {
            text: "Yes, if their peaks and troughs align inversely",
            correct: true,
          },
          {
            text: "No, waves always add together constructively",
            correct: false,
          },
          { text: "Only in the ocean, not in physics", correct: false },
          {
            text: "Yes, but only for sound waves, not water waves",
            correct: false,
          },
        ],
      },
      {
        type: "choice",
        question: "What happens when the peaks of two waves meet?",
        answers: [
          { text: "They cancel each other out", correct: false },
          { text: "They create a larger peak", correct: true },
          { text: "They stop moving", correct: false },
          { text: "They reflect backwards", correct: false },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question:
          "When the phase of two quantum wave functions are opposite each other, what occurs?",
        answers: [
          { text: "Constructive interference", correct: false },
          { text: "Destructive interference", correct: true },
          { text: "Superposition", correct: false },
          { text: "Entanglement", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "How is a quantum probability amplitude different from a classical wave amplitude?",
        answers: [
          { text: "It is always a scalar", correct: false },
          { text: "It has no phase", correct: false },
          {
            text: "It has a phase that includes real and imaginary parts",
            correct: true,
          },
          { text: "It can only be measured in inches", correct: false },
        ],
      },
      {
        type: "choice",
        question: "How does Grover's Algorithm use interference?",
        answers: [
          {
            text: "To destroy the incorrect answers completely in one step",
            correct: false,
          },
          {
            text: "To amplify the probability of measuring the target state through constructive interference",
            correct: true,
          },
          { text: "To collapse the wave function randomly", correct: false },
          { text: "To entangle all the qubits", correct: false },
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
        question:
          "If I have two distinct puzzle pieces that fit together to make a whole, and I know the shape of one piece, do I know the shape of the other?",
        answers: [
          { text: "Yes", correct: true },
          { text: "No", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "Imagine two envelopes, one contains a red ball and the other a blue ball. If you open one and see a red ball, do your actions change the other envelope?",
        answers: [
          { text: "No, it was already blue", correct: true },
          {
            text: "Yes, knowing it is red magically makes the other blue",
            correct: false,
          },
        ],
      },
      {
        type: "choice",
        question:
          "Does changing the state of one classically independent object instantly affect another distinct classically independent object?",
        answers: [
          { text: "Yes", correct: false },
          { text: "No", correct: true },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question:
          "What does measuring one particle in a fully entangled pair tell you about the other particle?",
        answers: [
          { text: "Nothing at all", correct: false },
          { text: "Only its classical probability", correct: false },
          { text: "Precisely the value of the other particle", correct: true },
          {
            text: "It changes the other particle's state randomly",
            correct: false,
          },
        ],
      },
      {
        type: "choice",
        question:
          "If a wave function for a two-qubit system can be factored into two separate system wave functions, is the system entangled?",
        answers: [
          { text: "Yes", correct: false },
          { text: "No", correct: true },
        ],
      },
      {
        type: "choice",
        question:
          "For the two-qubit state Ψ = 1/√2(|10⟩+|01⟩), if the first qubit is measured as |1⟩, what is the state of the second qubit?",
        answers: [
          { text: "|1⟩", correct: false },
          { text: "|0⟩", correct: true },
          { text: "It has a 50% chance of being either", correct: false },
          { text: "It becomes disentangled", correct: false },
        ],
      },
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
        question:
          "Are modern classical computers deterministic or non-deterministic?",
        answers: [
          { text: "Deterministic", correct: true },
          { text: "Non-deterministic", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "In computing, what does it mean for an operation to be 'irreversible'?",
        answers: [
          { text: "It cannot be paused", correct: false },
          {
            text: "Given the output, you cannot uniquely determine the input",
            correct: true,
          },
          {
            text: "The computer will break if you try to undo it",
            correct: false,
          },
          { text: "It takes an infinite amount of time", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What is 'pseudo-randomness' in classical computing?",
        answers: [
          { text: "True randomness from physical phenomena", correct: false },
          {
            text: "Randomness generated by a deterministic algorithm",
            correct: true,
          },
          { text: "When the computer makes a mistake", correct: false },
          { text: "A hardware failure", correct: false },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question: "What is a qubit's state?",
        answers: [
          { text: "Only a 1 or a 0 at any given time", correct: false },
          {
            text: "Any combination of 1 and 0 (given total probability is 1)",
            correct: true,
          },
          { text: "A purely deterministic output", correct: false },
          { text: "An analog wave without bits", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What does 'coherence time' refer to in quantum computing?",
        answers: [
          { text: "The time it takes to boot the computer", correct: false },
          { text: "The time it takes to run an algorithm", correct: false },
          {
            text: "The duration an average qubit can be kept in superposition",
            correct: true,
          },
          { text: "The time a classical bit stays a 1", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What does classical operation 'irreversibility' look like?",
        answers: [
          {
            text: "An AND gate outputting 0 doesn't tell you if the inputs were 0,0 or 0,1 or 1,0",
            correct: true,
          },
          {
            text: "A NOT gate outputting 1 doesn't tell you the input",
            correct: false,
          },
          { text: "Storing a file on a hard drive", correct: false },
          { text: "Turning the computer off", correct: false },
        ],
      },
    ],
  },
  {
    id: "circuits",
    unitId: "computing",
    title: "QUANTUM CIRCUITS",
    description: "",
    tocId: "2.1",
    headerImg: undefined,
    pageContent: <unit2.quantCirc />,
    preQuestions: [
      {
        type: "choice",
        question: "What does a classical circuit diagram typically show?",
        answers: [
          {
            text: "The physical placement of computer case fans",
            correct: false,
          },
          { text: "The logical flow of code line-by-line", correct: false },
          {
            text: "The path and components for electrical flow",
            correct: true,
          },
          { text: "The memory addresses of variables", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "Why do computer scientists and electrical engineers use circuit diagrams?",
        answers: [
          { text: "They look cool", correct: false },
          {
            text: "To visualize the flow of operations or electricity",
            correct: true,
          },
          { text: "Because code is too hard to read", correct: false },
          { text: "To increase the speed of the computer", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What is an algorithm?",
        answers: [
          { text: "A type of hardware", correct: false },
          {
            text: "A step-by-step procedure for solving a problem",
            correct: true,
          },
          { text: "A continuous wave", correct: false },
          { text: "A programming language", correct: false },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question:
          "In a quantum circuit diagram, what do horizontal lines represent?",
        answers: [
          { text: "Physical wires", correct: false },
          { text: "Qubits over time", correct: true },
          { text: "Measurements", correct: false },
          { text: "Classical bits", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What does the 'depth' of a quantum circuit refer to?",
        answers: [
          {
            text: "The number of time-steps or layers of gates",
            correct: true,
          },
          { text: "The number of qubits in the circuit", correct: false },
          { text: "The physical size of the quantum computer", correct: false },
          { text: "The number of classical bits used", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What does the 'width' of a quantum circuit refer to?",
        answers: [
          { text: "The physical size of the gate", correct: false },
          {
            text: "The amount of time the circuit takes to run",
            correct: false,
          },
          { text: "The number of qubits the circuit contains", correct: true },
          { text: "The logical complexity of the algorithm", correct: false },
        ],
      },
    ],
  },
  {
    id: "gates",
    unitId: "computing",
    title: "COMMON GATES",
    description: "",
    tocId: "2.2",
    headerImg: undefined,
    pageContent: <unit2.commonGates />,
    preQuestions: [
      {
        type: "choice",
        question: "In classical logic, what does a NOT gate do?",
        answers: [
          { text: "Outputs 1 always", correct: false },
          { text: "Inverts the input value", correct: true },
          { text: "Adds two inputs together", correct: false },
          { text: "Outputs 0 always", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "In classical computing, can a logic gate take two inputs and produce one output?",
        answers: [
          { text: "Yes", correct: true },
          {
            text: "No, inputs and outputs must be equal in number",
            correct: false,
          },
          { text: "No, gates only take one input", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "Which of the following is an example of a classical logic gate that takes two inputs?",
        answers: [
          { text: "NOT gate", correct: false },
          { text: "AND gate", correct: true },
          { text: "YES gate", correct: false },
          { text: "COPY gate", correct: false },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question:
          "Which quantum gate is primarily used to put a qubit into a superposition of states?",
        answers: [
          { text: "Pauli-X (NOT)", correct: false },
          { text: "Hadamard (H)", correct: true },
          { text: "Controlled-NOT (CNOT)", correct: false },
          { text: "Z-Rotation (RZ)", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What does a CNOT (Controlled Not) gate do?",
        answers: [
          {
            text: "Flips the target qubit if the control qubit is 1",
            correct: true,
          },
          { text: "Puts both qubits into superposition", correct: false },
          { text: "Flips both the control and target qubits", correct: false },
          { text: "Measures the target qubit", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What does a Z-Rotation (RZ) gate do to a qubit?",
        answers: [
          { text: "Flips its amplitude", correct: false },
          {
            text: "Applies a rotation around the Z-axis, changing its phase",
            correct: true,
          },
          { text: "Entangles it with another qubit", correct: false },
          { text: "Measures it", correct: false },
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
        question:
          "If you need to find a specific entry in an completely unorganized database with N entries, what is the maximum number of entries you might have to check classically?",
        answers: [
          { text: "1", correct: false },
          { text: "The square root of N", correct: false },
          { text: "Half of N", correct: false },
          { text: "N", correct: true },
        ],
      },
      {
        type: "choice",
        question: "What is an 'oracle' in computer science theory?",
        answers: [
          { text: "A person who predicts the future", correct: false },
          { text: "A literal black box used for storage", correct: false },
          {
            text: "A black box function that provides the answer to a specific question",
            correct: true,
          },
          { text: "A compilation error", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What is 'inversion about the mean'?",
        answers: [
          {
            text: "Averaging all values and reflecting them across that average",
            correct: true,
          },
          { text: "Finding the median value", correct: false },
          { text: "Deleting all values below the average", correct: false },
          { text: "Flipping the sign of the average", correct: false },
        ],
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question: "In Grover's Algorithm, what does the quantum Oracle do?",
        answers: [
          { text: "Measures all the qubits", correct: false },
          {
            text: "Marks the target state with a negative phase",
            correct: true,
          },
          { text: "Sorts the database", correct: false },
          { text: "Inverts the average amplitude", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "What is the primary role of the Diffuser in Grover's algorithm?",
        answers: [
          { text: "To scramble the qubits", correct: false },
          { text: "To guess the correct state", correct: false },
          {
            text: "To perform inversion-about-the-mean, increasing the marked state's amplitude",
            correct: true,
          },
          { text: "To mark the incorrect states", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "How many iterations of the oracle and diffuser are needed in Grover's algorithm for optimal probability of success on N possible states?",
        answers: [
          { text: "N", correct: false },
          { text: "N / 2", correct: false },
          { text: "≈ (π / 4) * √N", correct: true },
          { text: "1", correct: false },
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
