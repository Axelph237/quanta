"use client";

import { motion } from "framer-motion";
import { RefObject, useRef } from "react";
import { cards } from "./resourceTree";

interface Card {
  this: React.ReactElement;
  parent: RefObject<React.ReactElement>;
}

export default function ResourcesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const mapCards = () => {
    const cardRefs = new Map<string, RefObject<React.ReactElement>>();

    for (const c of cards) {
      const el: React.ReactElement =
        c.type === "resource" ? (
          <ResourceCard title={c.data} />
        ) : (
          <TopicCard title={c.data} />
        );

      const elRef = useRef(el);
      cardRefs.set(c.data, elRef);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      Resources!
      <div
        id="resource-graph-container"
        className="relative border-2 border-quanta-primary h-3/4 w-3/4 overflow-hidden"
        ref={containerRef}
      >
        <motion.div
          id="resource-graph bg-primary"
          className="absolute bg-linear-to-b from-quanta-primary to-quanta-secondary p-4 cursor-grab active:cursor-grabbing"
          drag
          dragConstraints={containerRef}
        >
          <ResourceCard title="Card 1" />
        </motion.div>
      </div>
    </div>
  );
}

function ResourceCard(props: { title: string }) {
  return (
    <div className="p-4 border-2 border-quanta-on-surface rounded-xl">
      <h1 className="font-bold">{props.title}</h1>\
    </div>
  );
}

function TopicCard(props: { title: string }) {
  return (
    <div className="p-4 border-2 border-quanta-on-surface rounded-xl">
      <h1 className="font-bold">{props.title}</h1>\
    </div>
  );
}

/* ---- PLAN
    I want this page to serve as a tree of resources depending on question and resources to study that topic.
    Essentially a DECISION TREE.

    Features: 
    1. Fuzzy search for topic and keywords.
    2. "Click" to complete resources or understanding
    3. Graph-like view for linking sections to deeper topics
    4. Multi-directional??

    Tree leaves go like:
    Resource -> Topic -> Resource -> Topic (recursively)
*/
