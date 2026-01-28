"use client";

import { CircuitView } from "@/lib/components/circuit/CircuitView";
import { GatePalette } from "@/lib/components/circuit/GatePalette";
import { createEmptyCircuit } from "@/lib/components/circuit/circuit";
import { DiceLevel } from "@/lib/components/games/DiceLevel";
import GameHandler from "@/lib/components/games/GameHandler";
import { useState } from "react";

export default function TestPage() {
  const [circuit, setCircuit] = useState(createEmptyCircuit(4, 6));

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col gap-20 items-center justify-center">
      {/* Game Components */}
      <GameHandler
        name="DICE"
        description="Guess if the hidden dice are entangled or not based on the total dice sum."
        levels={[
          <DiceLevel
            key={1}
            numVisDice={2}
            hidDice={[1, 3]}
            autoReset={true}
          />,
          <DiceLevel
            key={2}
            numVisDice={2}
            hidDice={[1, 1]}
            autoReset={true}
          />,
          <DiceLevel
            key={2}
            numVisDice={3}
            hidDice={[1, 1, 3]}
            autoReset={true}
          />,
          <DiceLevel
            key={2}
            numVisDice={1}
            hidDice={[1, 1, 1, 2]}
            autoReset={true}
          />,
        ]}
      />
      {/* Circuit Builder */}
      <div className="w-full h-fit flex flex-row items-center justify-center">
        <GatePalette />
        <CircuitView circuit={circuit} setCircuit={setCircuit} />
      </div>
    </div>
  );
}
