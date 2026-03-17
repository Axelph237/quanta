import Circuit from "quantum-circuit"
import { JSX } from "react";


/**
 * Defines the event data for a gate move event.
 * existingId exists when moving placed gates
 */
export type GateMoveEvent = {
    x: number;
    y: number;
    gate: GateDefinition & { existingId?: string };
}

export type GateAttachEvent = {
    gate: GateDefinition & { existingId?: string };
    column: number;
    qubits: number[];
}

/**
 * Defines the pixel spacing of the circuit grid, not very responsive
 */
export type Grid = {
  xMargin: number;
  yMargin: number;
  columnWidth: number;
  rowHeight: number;
  gateSize: number;
}

/**
 * Defines the state of the circuit.
 */
export type CircuitState = {
  qubitCount: number;
  columnCount: number;
  gates: PlacedGate[];
};

// --- Gate Types ---
type GateType = "h" | "x" | "y" | "z" | "s" | "cx" | "ccx" | "swap" | "measure" | "empty" | "block";

/**
 * Defines the properties of a gate.
 */
export type GateDefinition = {
  id: string;
  type: GateType;
  hidden?: boolean;
  showDef?: boolean;
  // Visual details
  color: string;
  label: string;
  description: string;
  targetSVG: JSX.Element;
  // Quantity of qubits that this gate acts on
  numTargets: number;
  numControls?: number;
  apply: ApplyFn;
  // Placement strategy
  place: PlacementStrategyFn;
};

/**
 * Extends the GateDefinition type to contain placement information.
 */
export type PlacedGate = {
  // Specific qubits that this gate acts on
  // e.g. [1] for single-qubit, [1, 3] for control-target style gate
  targetQubits: number[];
  controlQubits?: number[];
  spanQubits: number[];
  // The column this gate is placed in
  column: number;
  existingId: string; // The identifier of the placed gate
} & GateDefinition;

/**
 * Applies the gate to a given circuit.
 */
export type ApplyFn = (circuit: Circuit, qubits: number[], options: unknown) => void;

// --- Placement Types ---

/**
 * Defines a candidate for gate placement.
 */
export type PlacementCandidate = {
  column: number;
  qubits: number[];
};

/**
 * Defines the strategy for placing a gate.
 */
export type PlacementStrategyFn = (
  circuit: CircuitState,
  mouseX: number,
  mouseY: number,
  ignoreGateId?: string
) => PlacementCandidate | null;

