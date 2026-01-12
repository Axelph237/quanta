import { GENTLE_EASE } from "@/app/globals";
import { vocab } from "@/app/lessons/definitions";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function Define({
  children,
  term,
}: {
  children: React.ReactNode;
  term: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const def = vocab[term];
  const [showDef, setShowDef] = useState(false);

  const handleMouseEnter = () => {
    console.log("Mouse enter vocab!");
    setShowDef(true);
    // const termElement = document.createElement("span");
    // termElement.textContent = def.definition;
    // termElement.style.fontWeight = "bold";
    // termElement.style.position = "absolute";
    // termElement.style.backgroundColor = "red";
    // termElement.style.zIndex = "1000";
    // termElement.style.color = "white";
    // termElement.style.padding = "4px 8px";
    // termElement.style.borderRadius = "4px";
    // termElement.style.bottom = "100%";
    // termElement.style.left = "0";

    // container.appendChild(termElement);
  };

  const handleMouseLeave = () => {
    console.log("Mouse leave vocab!");
    setShowDef(false);
  };

  if (!def) {
    return children;
  }

  return (
    <span
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="text-secondary font-bold">{children}</span>
      <motion.span
        className={
          "absolute bottom-[100%] left-0 z-1000 w-[300px] border-2 border-secondary/50 backdrop-blur-xs bg-surface/75 text-white text-base p-2 rounded-lg " +
          (showDef ? "" : "hidden")
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: showDef ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <b className="text-secondary">{def.term}</b>
        <br />
        {def.definition}
      </motion.span>
    </span>
  );
}
