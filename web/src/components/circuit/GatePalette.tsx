// components/GatePalette.tsx
import { motion } from "framer-motion";
import { FC } from "react";

const gates = [
  { type: "H" as const, label: "H" },
  { type: "X" as const, label: "X" },
  { type: "Z" as const, label: "Z" },
  //   { type: "CNOT" as const, label: "CNOT" },
  { type: "MEASURE" as const, label: "M" },
];

export const GatePalette: FC = () => {
  return (
    <div className="flex flex-col gap-2 border rounded p-2 min-w-[120px]">
      <h2 className="font-semibold mb-2">Gates</h2>
      {gates.map((g) => (
        <motion.div
          key={g.type}
          drag
          dragMomentum={false}
          onDragStart={(e) => {
            //e.dataTransfer.setData("application/gate-type", g.type);
          }}
          className="bg-primary z-10 rounded w-[40px] h-[40px] flex text-center items-center justify-center cursor-grab aspect-square"
        >
          {/* Replace this with your gate icon component */}
          {g.label}
        </motion.div>
      ))}
    </div>
  );
};
