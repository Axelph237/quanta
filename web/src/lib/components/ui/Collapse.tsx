import { GENTLE_EASE } from "@/app/globals";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Collapse({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <details className="collapsable mb-6 cursor-pointer">
      <summary
        className="collapse-label body-text text-quanta-secondary mb-2 select-none"
        onClick={() => setOpen(!open)}
      >
        {label}
      </summary>
      <motion.div
        className="collapse-content border-2 border-quanta-secondary bg-quanta-secondary/10 rounded-xl p-6"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    </details>
  );
}
