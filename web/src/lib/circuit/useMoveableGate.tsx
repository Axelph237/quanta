import { useEffect, useRef, useState } from "react";
import {
  GateAttachEvent,
  GateDefinition,
  GateMoveEvent,
  PlacedGate,
} from "@/lib/types/circuit";
import { throttle } from "@/lib/throttle";

export function useMoveableGate<T extends Element>({
  gate,
}: {
  gate: GateDefinition | PlacedGate;
}) {
  const scopeRef = useRef<T>(null);
  const [dragTimeout, setDragTimeout] = useState<NodeJS.Timeout | null>(null);
  const [resetTrigger, setResetTrigger] = useState(false);

  const onDragStart = () => {
    if (dragTimeout) {
      clearTimeout(dragTimeout);
    }
    setResetTrigger(false);
  };

  const onDragEnd = () => {
    const rect = scopeRef.current!.getBoundingClientRect();
    const dropEvent = new CustomEvent<GateMoveEvent>("gate-drop", {
      detail: {
        gate: gate,
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      },
    });
    document.dispatchEvent(dropEvent);
    setDragTimeout(
      setTimeout(() => {
        // console.log("Drag timeout for", gate.name);
        setResetTrigger(true);
      }, 300),
    );
  };

  const onDrag = () => {
    const rect = scopeRef.current!.getBoundingClientRect();
    throttledOnDrag(
      new CustomEvent<GateMoveEvent>("gate-drag", {
        detail: {
          gate: gate,
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
        },
      }),
    );
  };

  // We need to throttle the onDrag event because it fires up to 200 times per second when dragging lol
  const throttledOnDrag = throttle((e: CustomEvent<GateMoveEvent>) => {
    document.dispatchEvent(e);
  }, 50); // Maximize to once per 50ms
  useEffect(() => {
    const handleAttach = (e: CustomEvent<GateAttachEvent>) => {
      if (e.detail.gate.id === gate.id) {
        setResetTrigger(true);
      }
    };
    document.addEventListener("attach-gate", handleAttach as EventListener);
    return () => {
      document.removeEventListener(
        "attach-gate",
        handleAttach as EventListener,
      );
    };
  }, [gate.id]);

  return {
    scope: scopeRef,
    reset: resetTrigger,
    setReset: setResetTrigger,
    onDragStart,
    onDragEnd,
    onDrag,
  };
}
