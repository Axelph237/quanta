"use client";

import { CircuitView } from "@/components/circuit/CircuitView";
import { GatePalette } from "@/components/circuit/GatePalette";
import { createEmptyCircuit } from "@/components/circuit/circuit";
import { useState } from "react";

export default function TestPage() {
  const [circuit, setCircuit] = useState(createEmptyCircuit(4, 6));

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center">
      <div className="h-fit w-fit flex flex-row gap-4">
        <GatePalette />
        <CircuitView circuit={circuit} setCircuit={setCircuit} />
      </div>
    </div>
  );
}
