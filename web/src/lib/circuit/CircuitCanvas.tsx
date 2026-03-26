import { useEffect, useRef, useState } from "react";
import { CircuitState, Grid, PlacedGate } from "./types";
import { useGateDrop } from "./useGateDrop";
import { useGateDrag } from "./useGateDrag";
import { centerInCell, clearGates, implicitPlacement } from "./placement";
import { useResponsiveGrid } from "./useResponsiveGrid";
import { createCircuit, State, stateAsObjects } from "./quantumCircuitClient";
import { qubitSpans } from "./gates";
import { motion } from "framer-motion";
import { COLORS } from "@/app/globals";
import { dmMono } from "@/app/fonts";
import { throttle } from "../throttle";

export default function CircuitCanvas({
  numQubits,
  numColumns,
  initialGates,
  onCompute,
  compute = false,
  noEdit = false,
  hideDefs = false,
}: {
  numQubits: number;
  numColumns: number;
  initialGates: [string, number[]][];
  onCompute?: (state: State[]) => void;
  compute?: boolean;
  noEdit?: boolean;
  hideDefs?: boolean;
}) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [circuit, setCircuit] = useState<CircuitState>({
    qubitCount: numQubits,
    columnCount: numColumns,
    gates: [],
  });
  const [qubitStates, setQubitStates] = useState<State[]>(
    Array(numQubits).fill({ real: 0, imag: 0, bits: "0", prob: 0 }),
  );
  const [qubitProbs, setQubitProbs] = useState<number[]>(
    Array(numQubits).fill(0),
  );

  /**
   * Initialize the circuit with the initial gates
   */

  const removeGates = (circuit: CircuitState, filter: Partial<PlacedGate>) => {
    return {
      ...circuit,
      // All gates
      gates: circuit.gates.filter(
        (gate) =>
          // Where the filter keys are
          !Object.keys(filter).every(
            (key) =>
              // Identically equal to the filter's
              gate[key as keyof PlacedGate] === filter[key as keyof PlacedGate],
          ),
      ),
    };
  };

  useEffect(() => {
    setCircuit((prev) => {
      const newCircuit = clearGates({ ...prev }, "implicit");
      for (const gate of initialGates) {
        // We can't just map the gates since the placement depends on the updating circuit state
        // I tried :(
        const placed = implicitPlacement(gate, newCircuit);
        if (placed) {
          newCircuit.gates.push(placed);
        }
      }

      // Fill gates are used temporarily to structure the implicitly created circuit, remove them
      return removeGates(newCircuit, { id: "fill" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialGates, numColumns, numQubits]);

  /**
   * Run the circuit and update the probabilities on circuit change (NEEDS TESTING ON SLOWER PCS)
   */
  const circuitRef = useRef<CircuitState>(circuit);
  useEffect(() => {
    if (!compute) return;
    circuitRef.current = circuit;

    const newCircuit = async () => {
      const qCircSim = await createCircuit(circuit.qubitCount);

      circuit.gates.sort((a, b) => {
        return a.column - b.column;
      });

      circuit.gates.map((g) =>
        g.apply(qCircSim, [...(g.controlQubits || []), ...g.targetQubits], {}),
      );

      qCircSim.run();

      setQubitProbs(qCircSim.probabilities());
      const states = stateAsObjects(qCircSim);
      setQubitStates(states);
      if (onCompute) {
        onCompute(states);
      }
    };
    newCircuit();
  }, [circuit, onCompute]);

  // Gate placement hooks
  const grid = useResponsiveGrid();
  const gridRef = useRef<Grid>(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Framer Motion's drag inertia continues firing drag events after drop, so we need some throttling
  // for race conditions
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const cooldown = useRef<boolean>(false);
  useGateDrop(containerRef, gridRef, circuit, setCircuit, () => {
    setShowPreview(false);
    cooldown.current = true;
    setTimeout(() => {
      // Ignore drag events for 700ms after drop
      cooldown.current = false;
    }, 700);
  });
  const dragPreview = useGateDrag(containerRef, gridRef, circuitRef, () => {
    if (cooldown.current) return;
    setShowPreview(true);
  });

  const width =
    grid.xMargin +
    grid.gateSize + // Gate size for qbit labels
    (circuit.columnCount + (compute ? 1.5 : 0.5)) * grid.columnWidth;
  const height = grid.yMargin * 2 + circuit.qubitCount * grid.rowHeight;

  // Gate selection
  const [selectedGate, setSelectedGate] = useState<PlacedGate | null>(null);

  return (
    <>
      <svg
        ref={containerRef}
        width={width}
        height={height}
        className="fill-quanta-on-surface stroke-quanta-on-surface"
      >
        {/* Render the wires */}
        {Array.from({ length: circuit.qubitCount }).map((_, qubit) => {
          const { y } = centerInCell(grid, 0, qubit, 0, 0);
          return (
            <g key={qubit}>
              <text
                className="define-qbit body-text"
                x={grid.xMargin / 2}
                y={y}
                dominantBaseline="middle"
                strokeWidth={0}
              >
                q{qubit}
              </text>
              <line
                x1={grid.xMargin + grid.gateSize * 1.5} // Idk why 0.9, truly a magic number for me here
                y1={y}
                x2={width - grid.columnWidth}
                y2={y}
              />
            </g>
          );
        })}

        {/* Render the gates */}
        {circuit.gates.map((gate, i) => (
          <GateRenderer
            key={i}
            gate={gate}
            grid={grid}
            selected={gate.existingId === selectedGate?.existingId}
            onClick={(g) => {
              if (noEdit) return;
              setSelectedGate((prev) =>
                prev?.existingId === g.existingId ? null : g,
              );
            }}
            hideDef={hideDefs}
          />
        ))}

        {/* Render the probability */}
        {compute &&
          Array.from({ length: circuit.qubitCount }).map((_, q) => (
            <AmplitudeDisplay
              key={q}
              lastColumn={circuit.columnCount}
              qubit={q}
              grid={grid}
              probability={qubitProbs[q]}
              // phase={Math.atan2(qubitStates[q].real, qubitStates[q].imag)}
            />
          ))}

        {/* Render the drag preview */}
        {showPreview && dragPreview && dragPreview.candidate && (
          <g opacity={0.5}>
            <GateRenderer
              gate={{
                ...dragPreview.gate,
                column: dragPreview.candidate.column,
                // These are the defaults for the candidate just having a minimum number of qubits it spans
                ...qubitSpans(dragPreview.gate, dragPreview.candidate.qubits),
                existingId: "drag-preview",
              }}
              grid={grid}
              selected={false}
              onClick={() => {}}
              hideDef={hideDefs}
            />
          </g>
        )}
      </svg>
      {!noEdit && selectedGate && (
        <OptionsDisplay
          gate={selectedGate}
          utilities={[
            {
              label: "Delete",
              onClick: (g) => {
                setCircuit(removeGates(circuit, { existingId: g.existingId }));
                if (selectedGate && selectedGate.existingId === g.existingId) {
                  setSelectedGate(null);
                }
              },
            },
            // {
            //   label: "Edit",
            //   onClick: (g) => {},
            // },
          ]}
        />
      )}
    </>
  );
}

function GateRenderer({
  gate,
  grid,
  selected,
  onClick,
  hideDef = false,
}: {
  gate: PlacedGate;
  grid: Grid;
  selected: boolean;
  onClick: (g: PlacedGate) => void;
  hideDef?: boolean;
}) {
  /*
  I had some stuff here for dragging around gates in a circuit, but I was spending too much time on this so its temporarily
  disabled until I can later make it work
  */
  // const { scope, onDragStart, onDragEnd, onDrag } =
  //   useMoveableGate<SVGGElement>({
  //     gate,
  //   });

  // useEffect(() => {
  //   const handleAttach = (e: CustomEvent<GateAttachEvent>) => {
  //     if (
  //       e.detail.gate.existingId &&
  //       e.detail.gate.existingId === gate.existingId
  //     ) {
  //       scope.current!.remove();
  //     }
  //   };

  //   document.addEventListener("attach-gate", handleAttach as EventListener);
  //   return () => {
  //     document.removeEventListener(
  //       "attach-gate",
  //       handleAttach as EventListener,
  //     );
  //   };
  // }, []);

  const scale = grid.gateSize / 100;
  const viewJSX = (svg: React.ReactNode, x: number, y: number, key: number) => (
    <g
      key={key}
      color={gate.color}
      strokeWidth={0}
      transform={`translate(${x}, ${y}) scale(${scale})`}
    >
      {gate.type !== "empty" && (
        <rect
          x={5}
          y={12.5}
          width={90}
          height={75}
          className="fill-quanta-surface"
        />
      )}
      {svg}
    </g>
  );

  const targetsPos = gate.targetQubits.map((qubit) =>
    centerInCell(grid, gate.column, qubit, grid.gateSize, grid.gateSize),
  );
  const controlsPos = gate.controlQubits?.map((qubit) =>
    centerInCell(grid, gate.column, qubit, grid.gateSize, grid.gateSize),
  );

  const spanQubits = gate.spanQubits.sort();
  const head = spanQubits[0];
  const tail = spanQubits[spanQubits.length - 1];

  return (
    <motion.g
      id={gate.existingId}
      // ref={scope}
      // onDragStart={onDragStart}
      // onDragEnd={onDragEnd}
      // onDrag={onDrag}
      // drag
      className={`${gate.showDef !== false && !hideDef ? `define-${gate.id}-gate:color=${gate.color}` : ""} cursor-pointer!`}
      onClick={() => onClick(gate)}
      animate={
        selected
          ? {
              rotate: [0, -5, 0, 5, 0],
              transition: {
                rotate: {
                  repeat: Infinity,
                  ease: "easeInOut",
                  duration: 0.2,
                },
              },
            }
          : { rotate: 0 }
      }
    >
      {spanQubits.length > 1 &&
        (() => {
          const first = centerInCell(
            grid,
            gate.column,
            head,
            grid.gateSize,
            grid.gateSize,
          );
          const last = centerInCell(
            grid,
            gate.column,
            tail,
            grid.gateSize,
            grid.gateSize,
          );

          return (
            <line
              stroke={gate.color}
              strokeWidth={grid.gateSize / 10}
              x1={first.x + grid.gateSize / 2}
              y1={first.y + grid.gateSize / 2}
              x2={last.x + grid.gateSize / 2}
              y2={last.y + grid.gateSize / 2}
            />
          );
        })()}
      {targetsPos.map((pos, i) => {
        const { x, y } = pos;
        return viewJSX(gate.targetSVG, x, y, i);
      })}
      {controlsPos &&
        controlsPos.map((pos, i) => {
          const { x, y } = pos;
          return (
            <circle
              fill={gate.color}
              strokeWidth={0}
              key={i}
              cx={x + grid.gateSize / 2}
              cy={y + grid.gateSize / 2}
              r={grid.gateSize / 3}
            />
          );
        })}
    </motion.g>
  );
}

function AmplitudeDisplay({
  qubit,
  lastColumn,
  grid,
  probability,
  // phase,
}: {
  qubit: number;
  lastColumn: number;
  grid: Grid;
  probability: number;
  // phase: number;
}) {
  const pos = centerInCell(
    grid,
    lastColumn,
    qubit,
    grid.gateSize,
    grid.gateSize,
  );

  // const toHue = (r: number) => {
  //   const TWO_PI = 2 * Math.PI;
  //   const MIN_COLOR = 195;
  //   const MAX_COLOR = 288;

  //   const t = r / TWO_PI;
  //   const hue = MIN_COLOR + t * (MAX_COLOR - MIN_COLOR);
  //   return `hsl(${hue}, 100%, 50%)`;
  // };

  return (
    <g className={`define-qbit-prob:color=${COLORS.primary.hex}`}>
      <defs>
        <mask id={`probability-mask-${qubit}`}>
          <circle
            cx={pos.x + grid.gateSize / 2}
            cy={pos.y + grid.gateSize / 2}
            r={grid.gateSize / 2}
            fill="white"
          />
        </mask>
      </defs>

      <circle
        cx={pos.x + grid.gateSize / 2}
        cy={pos.y + grid.gateSize / 2}
        r={grid.gateSize / 2}
        strokeWidth={0}
        fill="var(--color-quanta-surface)"
      />
      <rect
        x={pos.x}
        y={pos.y + grid.gateSize * (1 - probability)}
        width={grid.gateSize}
        height={grid.gateSize * probability}
        strokeWidth={0}
        // fill={toHue(phase)}
        fill="var(--color-quanta-primary)"
        mask={`url(#probability-mask-${qubit})`}
      />
      <text
        x={pos.x + grid.gateSize / 2}
        y={pos.y + grid.gateSize / 2}
        dominantBaseline="middle"
        textAnchor="middle"
        fill="var(--color-quanta-on-surface)"
        fontSize={grid.gateSize / 3}
        className={dmMono.className}
        strokeWidth={0}
      >
        {(probability * 100).toFixed(0) + "%"}
      </text>
      <circle
        cx={pos.x + grid.gateSize / 2}
        cy={pos.y + grid.gateSize / 2}
        r={grid.gateSize / 2}
        className="fill-transparent"
      />
    </g>
  );
}

function OptionsDisplay({
  gate,
  utilities,
}: {
  gate: PlacedGate;
  utilities: { label: string; onClick: (g: PlacedGate) => void }[];
}) {
  const thisRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const active = pos.x !== 0 && pos.y !== 0;

  useEffect(() => {
    if (gate === null) return;

    const el = document.getElementById(gate.existingId);
    if (!el) return;

    const anchorRect = el.getBoundingClientRect();
    const offsetRect = thisRef.current?.offsetParent?.getBoundingClientRect();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPos({
      x: anchorRect.left + anchorRect.width / 2 - (offsetRect?.left || 0),
      y: anchorRect.top + anchorRect.height + 10 - (offsetRect?.top || 0),
    });
  }, [gate]);

  return (
    <div
      ref={thisRef}
      className={`absolute border-2 backdrop-blur-sm px-2 flex flex-row gap-4 py-2 rounded-full -translate-x-1/2`}
      style={{
        left: pos.x,
        top: pos.y,
        borderColor: gate.color + "7f",
        backgroundColor: gate.color + "2f",
        visibility: active ? "visible" : "hidden",
      }}
    >
      {utilities.map((utility, i) => (
        <button
          className="button-primary border-2 bg-quanta-surface/50 border-quanta-on-surface/25 hover:border-quanta-on-surface rounded-full"
          key={i}
          onClick={() => utility.onClick(gate)}
        >
          {utility.label}
        </button>
      ))}
    </div>
  );
}
