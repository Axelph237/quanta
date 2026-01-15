// types/circuit.ts
export type GateType = 'H' | 'X' | 'Y' | 'Z' | 'CNOT' | 'MEASURE'; // extend as needed

export interface Gate {
  id: string;
  type: GateType;
  // for single-qubit gates, targets = [qubitIndex]
  // for CNOT, e.g. control = 0, targets = [1]
  control?: number;
  targets: number[];
}

export interface Circuit {
  numQubits: number;
  depth: number;
  // grid[qubit][depth] = gateId or null
  grid: (string | null)[][];
  gates: Record<string, Gate>;
}

export function createEmptyCircuit(numQubits: number, depth: number): Circuit {
  return {
    numQubits,
    depth,
    grid: Array.from({ length: numQubits }, () =>
      Array.from({ length: depth }, () => null)
    ),
    gates: {},
  };
}
