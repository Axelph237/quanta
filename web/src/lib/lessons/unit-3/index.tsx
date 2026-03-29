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
        question: "Have you ever worked with or seached through a database?",
        answers: [
          { text: "Yes", correct: true },
          { text: "No", correct: true },
          { text: "I'm not sure", correct: true },
        ],
      },
      {
        type: "step",
        question: "How comfortable are you with search algorithms?",
        highLabel: "Very",
        lowLabel: "Not at all",
        steps: 4,
      },
    ],
    postQuestions: [
      {
        type: "choice",
        question: 'What does it mean for a database to be "unstructured"?',
        randomize: true,
        answers: [
          {
            text: "It doesn't have a fixed format or organization",
            correct: true,
          },
          { text: "It is disorganized and messy", correct: false },
          { text: "It has no data in it", correct: false },
          { text: "All data is random noise", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What is the goal of Grover's algorithm?",
        randomize: true,
        answers: [
          {
            text: "To find a marked item in an unstructured database",
            correct: true,
          },
          { text: "To sort a database efficiently", correct: false },
          { text: "To compress data", correct: false },
          { text: "To simulate quantum systems", correct: false },
        ],
      },
      {
        type: "choice",
        question:
          "How does Grover's algorithm improve search compared to classical methods?",
        randomize: true,
        answers: [
          {
            text: "It requires fewer steps to find the desired item",
            correct: true,
          },
          {
            text: "It checks all items at the same time instantly",
            correct: false,
          },
          {
            text: "It guarantees finding the answer in one step",
            correct: false,
          },
          { text: "It does not improve search speed", correct: false },
        ],
      },
      {
        type: "choice",
        question: "What is the key idea behind Grover's algorithm?",
        randomize: true,
        answers: [
          {
            text: "Increasing the probability of the correct answer through repeated operations",
            correct: true,
          },
          {
            text: "Randomly guessing until the correct answer is found",
            correct: false,
          },
          { text: "Storing all answers in memory", correct: false },
          {
            text: "Measuring repeatedly to collapse the system faster",
            correct: false,
          },
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
