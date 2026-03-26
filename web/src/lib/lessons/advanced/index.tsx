import { Lesson, Unit } from "@/lib/types/lessons";
import CompileMDX from "./compile.mdx";
import ExampleAlgosMDX from "./example-alogs.mdx";
import NISQChallMDX from "./nisq-chall.mdx";
import QueryMDX from "./query.mdx";

const unit: Unit = {
  id: "advanced",
  title: "ADVANCED",
  description: "",
  get lessons() {
    return lessons;
  },
};

const lessons: Lesson[] = [
  {
    id: "compile",
    unitId: "advanced",
    title: "COMPILATION",
    description: "",
    tocId: "4.1",
    headerImg: undefined,
    pageContent: <CompileMDX />,
    preQuestions: [],
    postQuestions: [],
  },
  {
    id: "example-alogs",
    unitId: "advanced",
    title: "EXAMPLE ALGORITHMS",
    description: "",
    tocId: "4.2",
    headerImg: undefined,
    pageContent: <ExampleAlgosMDX />,
    preQuestions: [],
    postQuestions: [],
  },
  {
    id: "nisq-chall",
    unitId: "advanced",
    title: "NISQ-ERA CHALLENGES",
    description: "",
    tocId: "4.3",
    headerImg: undefined,
    pageContent: <NISQChallMDX />,
    preQuestions: [],
    postQuestions: [],
  },
  {
    id: "query",
    unitId: "advanced",
    title: "QUERY MODEL OF COMPUTATION",
    description: "",
    tocId: "4.4",
    headerImg: undefined,
    pageContent: <QueryMDX />,
    preQuestions: [],
    postQuestions: [],
  },
];

const UNIT4 = { unit, lessons };
export default UNIT4;
