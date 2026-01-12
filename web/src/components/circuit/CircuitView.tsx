// components/CircuitView.tsx
import { Dispatch, FC, SetStateAction } from "react";
import { Circuit, Gate } from "@/components/circuit/circuit";
import * as uuid from "uuid";

interface Props {
  circuit: Circuit;
  setCircuit: Dispatch<SetStateAction<Circuit>>;
}

export const CircuitView: FC<Props> = ({ circuit, setCircuit }) => {
  const { numQubits, depth, grid, gates } = circuit;

  const handleDropGate = (row: number, col: number, gateType: Gate["type"]) => {
    setCircuit((prev) => {
      // prevent overwriting existing gate if you like:
      if (prev.grid[row][col]) return prev;

      const id = uuid.v4();
      const newGate: Gate = {
        id,
        type: gateType,
        targets: [row],
      };

      const newGrid = prev.grid.map((r) => [...r]);
      newGrid[row][col] = id;

      return {
        ...prev,
        grid: newGrid,
        gates: {
          ...prev.gates,
          [id]: newGate,
        },
      };
    });
  };

  const onDrop = (
    row: number,
    col: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const type = e.dataTransfer.getData(
      "application/gate-type"
    ) as Gate["type"];
    if (!type) return;
    handleDropGate(row, col, type);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Column labels */}
      <div className="flex ml-10 gap-px">
        {Array.from({ length: depth }).map((_, col) => (
          <div key={col} className="w-10 text-xs text-center text-gray-500">
            {col}
          </div>
        ))}
      </div>

      {/* Qubit rows */}
      {Array.from({ length: numQubits }).map((_, row) => (
        <div key={row} className="flex items-center gap-2">
          {/* Qubit label */}
          <div className="w-10 text-sm font-mono">q{row}</div>

          {/* Slots */}
          <div className="flex">
            {Array.from({ length: depth }).map((_, col) => {
              const gateId = grid[row][col];
              const gate = gateId ? gates[gateId] : null;

              return (
                <div
                  key={col}
                  onDrop={(e) => onDrop(row, col, e)}
                  onDragOver={onDragOver}
                  className="w-10 h-10 flex items-center justify-center relative"
                >
                  {gate && <GateIcon gate={gate} />}
                  {/* horizontal wire line */}
                  <div className="absolute left-0 right-0 h-[1px] bg-gray-300" />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Minimal gate renderer. Swap for your own icons:
const GateIcon: FC<{ gate: Gate }> = ({ gate }) => {
  if (gate.type === "MEASURE") {
    return <span className="text-xs">M</span>; // replace with measurement icon
  }
  return <span className="text-xs font-semibold">{gate.type}</span>;
};
