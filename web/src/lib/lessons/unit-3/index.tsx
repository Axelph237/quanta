/**
 * ALGORITHMS UNIT
 */

import type { Lesson, Unit } from "@/lib/types/lessons";
import GroversMDX from "./grovers.mdx";

const unit: Unit = {
  id: "algorithms",
  title: "UNIT 3: QUANTUM ALGORITHMS",
  description: "Putting it all together",
  get lessons() {
    return lessons;
  },
};

const lessons: Lesson[] = [
  {
    id: "grovers",
    unitId: "algorithms",
    title: "GROVER'S ALGORITHM",
    description: "",
    tocId: "3.0",
    headerImg: undefined,
    pageContent: <GroversMDX />,
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

const UNIT3 = { unit, lessons };
export default UNIT3;
