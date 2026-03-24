import { RefObject, useState, useEffect } from "react";
import { GateDefinition, CircuitState, Grid, GateMoveEvent } from "./types";
import { findNearestValidPlacement } from "./placement";


type DragPreview = {
  gate: GateDefinition & { existingId?: string };
  mouseX: number;
  mouseY: number;
  candidate: null | {
    column: number;
    qubits: number[];
  };
};

/**
 * Non-destructive gate drag hook
 * @param circuit a reference to the circuit state
 */
export function useGateDrag(containerRef: RefObject<SVGElement | null>, gridRef: RefObject<Grid>, circuitRef: RefObject<CircuitState>, callback?: ({ gate, column, qubits }: { gate: GateDefinition, column?: number, qubits?: number[] }) => void): DragPreview | null {
    const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);

    useEffect(() => {
        const onDrag = (e: CustomEvent<GateMoveEvent>) => {
            const { x, y, gate } = e.detail;
            
            const container = containerRef.current?.getBoundingClientRect();
            if (!container) return;
            
            const relX = x - container.left;
            const relY = y - container.top;

            const candidate = findNearestValidPlacement(
                gridRef.current,
                circuitRef.current,
                gate,
                relX,
                relY,
                gate.existingId
            );

            setDragPreview({
                gate,
                mouseX: x,
                mouseY: y,
                candidate,
            });

            if (callback) {
                callback({ gate, column: candidate?.column, qubits: candidate?.qubits });
            }
        }

        document.addEventListener("gate-drag", onDrag as EventListener);
        return () => {
            document.removeEventListener("gate-drag", onDrag as EventListener);
        }
    }, [])

    return dragPreview;
}
