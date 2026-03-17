import { Dispatch, RefObject, SetStateAction, useEffect } from "react";
import { CircuitState, GateAttachEvent, GateMoveEvent, Grid, PlacedGate } from "./types";
import { findNearestValidPlacement, getGateExistingId } from "./placement";

export function useGateDrop(containerRef: RefObject<SVGElement | null>, gridRef: RefObject<Grid>, circuit: CircuitState, setCircuit: Dispatch<SetStateAction<CircuitState>>) {
  useEffect(() => {
    const onDrop = (e: CustomEvent<GateMoveEvent>) => {
      const { x, y, gate } = e.detail;


      const container = containerRef.current?.getBoundingClientRect();
      if (!container) return;
      
      const relX = x - container.left;
      const relY = y - container.top;

      const candidate = findNearestValidPlacement(
        gridRef.current,
        circuit,
        gate,
        relX,
        relY,
        gate.existingId
      );

      if (candidate) {
        setCircuit((prev: CircuitState) => {
          const restGates = gate.existingId
            ? prev.gates.filter((g: PlacedGate) => g.id !== gate.existingId)
            : prev.gates;

          const targets = Array.from({ length: gate.numTargets }, (_, i) => candidate.qubits[i]);
          const controls = Array.from({ length: gate.numControls || 0 }, (_, i) => candidate.qubits[i + gate.numTargets]);

          return {
            ...prev,
            gates: [
              ...restGates,
              {
                ...gate,
                // Placed gate properties
                targetQubits: targets,
                controlQubits: controls,
                spanQubits: candidate.qubits,
                column: candidate.column,
                existingId: gate.existingId || getGateExistingId(gate),
              }
            ]
          } as CircuitState
        });

        const attachEvent = new CustomEvent<GateAttachEvent>("attach-gate", {
          detail: {
            gate: gate,
            column: candidate.column,
            qubits: candidate.qubits,
          },
        });
        document.dispatchEvent(attachEvent);
      } else {
        // Drop the gate if it had an existing id
        if (gate.existingId) {
          setCircuit((prev: CircuitState) => {
            return {
              ...prev,
              gates: prev.gates.filter((g: PlacedGate) => g.id !== gate.existingId),
            } as CircuitState
          });
        }
      }
    }

    document.addEventListener("gate-drop", onDrop as EventListener);
    return () => {
      document.removeEventListener("gate-drop", onDrop as EventListener);
    }
  }, [gridRef, circuit, setCircuit])
}