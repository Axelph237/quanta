import { COLORS } from "@/app/globals";
import { CircuitState, GateDefinition } from "./types";
import * as icons from "@/lib/components/ui/Icons";
import Circuit from "quantum-circuit";

/*
  Eventually I intend to move gate-dependent placement logic into the gate definitinos themselves, this should clear a lot
  of the other messy code up once I have done that. Things like targets, controls, etc can be determined by the gate definition
  instead of having to be jankily created on command. 
*/
const nullPlacement = (
  circuit: CircuitState,
  mouseX: number,
  mouseY: number,
  ignoreGateId?: string,
) => {
  console.log("null placement", circuit, mouseX, mouseY, ignoreGateId);
  return null;
};

export const gates: Record<string, GateDefinition> = {
  // Rn fill and barrier are the same, but I am debating on whether or not to make barrier an actual usable gate
  ellipsis: {
    id: "ellipsis",
    type: "empty",
    color: "var(--color-quanta-on-surface)",
    label: "Ellipsis",
    description: "Ellipsis",
    targetSVG: (
      <>
        <circle cx="20" cy="50" r="8" fill="currentColor" />
        <circle cx="50" cy="50" r="8" fill="currentColor" />
        <circle cx="80" cy="50" r="8" fill="currentColor" />
      </>
    ),
    numControls: 0,
    numTargets: 1,
    apply: () => {},
    place: nullPlacement,
    hidden: true,
    showDef: false,
  },
  fill: {
    id: "fill",
    type: "empty",
    color: "transparent",
    label: "Fill",
    description: "Fill",
    targetSVG: <></>,
    numControls: 0,
    numTargets: 1,
    apply: () => {},
    place: nullPlacement,
    hidden: true,
  },
  barrier: {
    id: "barrier",
    type: "block",
    color: "transparent",
    label: "Barrier",
    description: "Barrier",
    targetSVG: <></>,
    numControls: 1,
    numTargets: 1,
    apply: () => {},
    place: nullPlacement,
    hidden: true,
  },
  // Functional gates
  x: {
    id: "x",
    type: "x",

    color: COLORS.primary.hex,
    label: "Pauli-X",
    description:
      "Inverts the state of the qubit in the computational basis. Effectively a NOT gate.",
    targetSVG: <icons.XGate />,

    numControls: 0,
    numTargets: 1,
    apply: (c: Circuit, qubits: number[]) => c.appendGate("x", qubits, {}),
    place: nullPlacement,
  },
  h: {
    id: "h",
    type: "h",
    color: COLORS.error.hex,
    label: "Hadamard",
    description:
      "Creates a superposition of the qubit in the computational basis. I.E. $H|0\\rangle \\rightarrow \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)$.",
    targetSVG: <icons.HGate />,

    numControls: 0,
    numTargets: 1,
    apply: (c: Circuit, qubits: number[]) => c.appendGate("h", qubits, {}),
    place: nullPlacement,
  },
  s: {
    id: "s",
    type: "s",
    color: COLORS.secondary.hex,
    label: "Phase",
    description:
      "Nudges the phase of the qubit in the computational basis. I.E. $S|1\\rangle \\rightarrow i|1\\rangle$.",
    targetSVG: <icons.SGate />,

    numControls: 0,
    numTargets: 1,
    apply: (c: Circuit, qubits: number[]) => c.appendGate("s", qubits, {}),
    place: nullPlacement,
  },
  cx: {
    id: "cx",
    type: "cx",
    color: COLORS.secondary.hex,
    label: "Controlled-NOT",
    description:
      "If the control qubit is in the $|1\\rangle$ state, the target qubit will be flipped.",
    targetSVG: <icons.NotGate />,

    numControls: 1,
    numTargets: 1,
    apply: (c: Circuit, qubits: number[]) => c.appendGate("cx", qubits, {}),
    place: nullPlacement,
  },
  ccx: {
    id: "ccx",
    type: "ccx",
    color: COLORS.secondary.hex,
    label: "Controlled-Controlled-NOT",
    description:
      "If both control qubits are in the $|1\\rangle$ state, the target qubit will be flipped.",
    targetSVG: <icons.NotGate />,

    numControls: 2,
    numTargets: 1,
    apply: (c: Circuit, qubits: number[]) => c.appendGate("ccx", qubits, {}),
    place: nullPlacement,
    hidden: true,
  },
  ccz: {
    id: "ccz",
    type: "ccz",
    color: COLORS.secondary.hex,
    label: "Controlled-Controlled-Z",
    description:
      "Flips the state's phase if both control qubits are in the $|1\\rangle$ state.",
    targetSVG: <icons.NotGate />,

    numControls: 2,
    numTargets: 1,
    apply: (c: Circuit, qubits: number[]) => {
      c.appendGate("h", [qubits[qubits.length - 1]], {});
      c.appendGate("ccx", qubits, {});
      c.appendGate("h", [qubits[qubits.length - 1]], {});
    },
    place: nullPlacement,
    hidden: true,
  },
};

/**
 * Calculates the target, control, and span qubits for a gate
 * @param gateDef The gate definition
 * @param qubits The qubits to span
 * @returns The span qubits
 */
export function qubitSpans(gateDef: GateDefinition, qubits: number[]) {
  const lowQubit = qubits.reduce((last, q) => Math.min(last, q), qubits[0]);
  const highQubit = qubits.reduce((last, q) => Math.max(last, q), lowQubit);

  return {
    targetQubits: qubits.slice(gateDef.numControls),
    controlQubits: qubits.slice(0, gateDef.numControls),
    spanQubits: Array.from(
      { length: highQubit - lowQubit + 1 },
      (_, i) => lowQubit + i,
    ),
  };
}
