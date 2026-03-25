import { gates, qubitSpans } from "./gates";
import { CircuitState, GateDefinition, Grid, PlacedGate } from "./types";

// What I would use to determine snap distance cache's
const SNAP_DISTANCE_PX = 40;

let gateIdx = 0;
export function getGateExistingId(gateDef: GateDefinition) {
  return `${gateDef.id}-${gateIdx++}`;
}

/**
 * Converts the logical cell coordinates to pixel coordinates
 * @param column The column of the cell
 * @param qubit The qubit of the cell
 * @returns The pixel coordinates of the cell
 */
export function cellToPixel(grid: Grid, column: number, qubit: number) {
  return {
    x: grid.xMargin + column * grid.columnWidth,
    y: grid.yMargin + qubit * grid.rowHeight,
  };
}

/**
 * Converts the pixel coordinates to the nearest logical cell coordinates
 * @param x The x coordinate
 * @param y The y coordinate
 * @returns The nearest logical cell coordinates
 */
export function pixelToNearestCell(grid: Grid, x: number, y: number) {
  const column = Math.floor((x - grid.xMargin) / grid.columnWidth);
  const qubit = Math.floor((y - grid.yMargin) / grid.rowHeight);
  return { column, qubit };
}

/**
 * Centers an item of width x height in the given cell
 * @param grid The grid
 * @param column The column of the cell
 * @param qubit The qubit of the cell
 * @param width The width of the point
 * @param height The height of the point
 * @returns The center coordinates of the point to center the item in the cell
 */
export function centerInCell(grid: Grid, column: number, qubit: number, width: number, height: number) {
  const { x, y } = cellToPixel(grid, column, qubit);
  return { 
    x: x + grid.columnWidth / 2 - width / 2, 
    y: y + grid.rowHeight / 2 - height / 2 
  };
}

/**
 * Checks if the given cell coordinates are within the bounds of the circuit
 * @param circuit The circuit state
 * @param column The column of the cell
 * @param qubits The qubits of the cell
 * @returns True if the cell coordinates are within the bounds of the circuit, false otherwise
 */
function isWithinBounds(
  circuit: CircuitState,
  column: number,
  qubits: number[]
) {
  if (column < 0 || column >= circuit.columnCount) return false;
  return qubits.every(q => q >= 0 && q < circuit.qubitCount);
}

// ---- COLLISION LOGIC

/**
 * Checks if the given gate occupies the given cell - Unconvinced this is useful
 * @param gate The gate to check
 * @param column The column of the cell
 * @param qubit The qubit of the cell
 * @returns True if the gate occupies the cell, false otherwise
 */
function occupiesCell(gate: PlacedGate, column: number, qubit: number) {
  return gate.column === column && gate.spanQubits.includes(qubit);
}

/**
 * Checks if the given gate has a collision with any other gates in the circuit
 * @param circuit The circuit state
 * @param candidate The gate to check
 * @param ignoreGateId The gate to ignore
 * @returns True if the gate has a collision, false otherwise
 */
function hasCollision(
  circuit: CircuitState,
  candidate: { column: number; qubits: number[] },
  ignoreGateId?: string
) {
  return circuit.gates.some(gate => {
    if (gate.id === ignoreGateId) return false; // Cannot collide with ignored gates
    if (gate.column !== candidate.column) return false; // Cannot collide with gates in other columns

    return gate.spanQubits.some(q => candidate.qubits.includes(q)); // Check gates in same column for overlaps
  });
}

/**
 * Checks if the given gate placement is valid
 * @param circuit The circuit state
 * @param gateDef The gate definition
 * @param column The column of the cell
 * @param qubits The qubits of the cell
 * @param ignoreGateId The gate to ignore
 * @returns True if the gate placement is valid, false otherwise
 */
function isValidPlacement(
  circuit: CircuitState,
  gateDef: GateDefinition,
  column: number,
  qubits: number[],
  ignoreGateId?: string
) {
  // We can ignore any gates that are being placed outside the bounds of the circuit
  if (!isWithinBounds(circuit, column, qubits)) 
    return false;

  // We can ignore a gate if it spans more qubits than the circuit has (i.e. a CCZ in a 2-qubit circuit)
  if (qubits.length !== (gateDef.numControls || 0) + gateDef.numTargets) 
    return false;

  // Ignore collisions
  if (hasCollision(circuit, { column, qubits }, ignoreGateId)) 
    return false;

  return true;
}

// ---- DISTANCE FUNCTIONS


/**
 * Calculates the squared distance between two points
 * @param ax The x coordinate of the first point
 * @param ay The y coordinate of the first point
 * @param bx The x coordinate of the second point
 * @param by The y coordinate of the second point
 * @returns The squared distance between the two points
 */
function distanceSq(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function getQubits(gateDef: GateDefinition, qubit: number) {
  return Array.from({ length: (gateDef.numControls || 0) + gateDef.numTargets }, (_, i) => qubit + i);
}

/**
 * Finds the nearest valid placement for a gate
 * @param circuit The circuit state
 * @param gateDef The gate definition
 * @param mouseX The x coordinate of the mouse
 * @param mouseY The y coordinate of the mouse
 * @param ignoreGateId The gate to ignore
 * @returns The nearest valid placement
 */
export function findNearestValidPlacement(
  grid: Grid,
  circuit: CircuitState,
  gateDef: GateDefinition,
  mouseX: number,
  mouseY: number,
  ignoreGateId?: string
) {
  
  const rough = pixelToNearestCell(grid, mouseX, mouseY);


  // TODO: We should probably search the best possible location for the gate FIRST and return before checking the rest
  if (isValidPlacement(circuit, gateDef, rough.column, getQubits(gateDef, rough.qubit), ignoreGateId)) {
    return {
      column: rough.column,
      qubits: getQubits(gateDef, rough.qubit),
      dist: 0,
    };
  }

  let best: null | { column: number; qubits: number[]; dist: number } = null;

  // Search a small radius around the rough cell
  const columnRadius = 1;
  const rowRadius = 1;

  for (let dc = -columnRadius; dc <= columnRadius; dc++) {
    for (let dq = -rowRadius; dq <= rowRadius; dq++) {
      const column = rough.column + dc;
      const qubit = rough.qubit + dq;

      const qubits: number[] = getQubits(gateDef, qubit);

      // TODO: Update to use the gate's placement strategy
      if (!isValidPlacement(circuit, gateDef, column, qubits, ignoreGateId)) {
        continue;
      }

      // At this point, it is a valid placement, so we can calculate the distance
      // from this cell to the mouse pointer
      const center = cellToPixel(grid, column, qubits[0]);
      const dist = distanceSq(mouseX, mouseY, center.x, center.y);

      // If the distance is closer than the best distance, update the best distance
      // TODO: Just optimize the for-loop to do a circular search around the radius so the first returned location is
      // Always the nearest????
      // If I add a max distance, I can just search a few selected raycast directions that are baked so this
      // constant calculating of cell distances isn't necessary
      // In other words, based on the max search distance, cache a few directions and magnitudes to search.
      if (!best || dist < best.dist) {
        best = { column, qubits, dist };
      }
    }
  }

  return best ? { column: best.column, qubits: best.qubits } : null;
}

/**
 * Places a gate in the circuit at the first available position.
 * @param param0 
 * @param circuit 
 * @returns 
 */
export function implicitPlacement([gateName, qubits]: [string, number[]], circuit: CircuitState): PlacedGate | null {
  const gateDef = gates[gateName.toLowerCase()]; // Get base gate definition for this gate name
  if (!gateDef) {
    throw new Error(`Gate ${gateName} not found`);
  }
  
  // We need to get the max column of all the gates in the circuit
  let candidateColumn = -1;
  for (let col = 0; col < circuit.columnCount; col++) {
    if (isValidPlacement(circuit, gateDef, col, qubits)) {
      candidateColumn = col;
      break;
    }
  }

  // TODO: Update to use the gate's placement strategy
  if (candidateColumn === -1) {
    return null;
  }


  return {
    ...gateDef,
    column: candidateColumn,
    ...qubitSpans(gateDef, qubits),
    existingId: `implicit-${getGateExistingId(gateDef)}`,
  };
}

/**
 * Removes all gates from the circuit that start with the given mask
 * @param circuit The circuit state
 * @param mask The mask to filter by
 * @returns The circuit state with the gates removed
 */
export function clearGates(circuit: CircuitState, mask?: string): CircuitState {
  return {
    ...circuit,
    gates: mask ? circuit.gates.filter(gate => !gate.existingId.startsWith(mask)) : [],
  };
}