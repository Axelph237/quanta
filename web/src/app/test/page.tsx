"use client";

import { CircuitView } from "@/lib/components/circuit/CircuitView";
import { GatePalette } from "@/lib/components/circuit/GatePalette";
import { createEmptyCircuit } from "@/lib/components/circuit/circuit";
import { useState } from "react";

export default function TestPage() {
  const [circuit, setCircuit] = useState(createEmptyCircuit(4, 6));

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col gap-20 items-center justify-center">
      {/* Game Components */}
      <div>hello</div>
      {/* Circuit Builder */}
      <div className="w-full h-fit flex flex-row items-center justify-center">
        <GatePalette />
        <CircuitView circuit={circuit} setCircuit={setCircuit} />
      </div>
    </div>
  );
}
