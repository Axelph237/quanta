import { useViewportSize } from "@/lib/hooks/useViewportSize";
import { useEffect, useState } from "react";
import { Grid } from "./types";
import useComputedCSS from "../hooks/useComputedCSS";

// I only anticipate up to 10 qubits,
// so there should never be more than ~3 character widths for margin
const NUM_QBIT_CHARACTERS = 3;

const DEFAULT_GATE_SIZE = 30;

const INITIAL_GRID: Grid = {
  xMargin: DEFAULT_GATE_SIZE * 2,
  yMargin: DEFAULT_GATE_SIZE,
  columnWidth: DEFAULT_GATE_SIZE + DEFAULT_GATE_SIZE / 4,
  rowHeight: DEFAULT_GATE_SIZE + DEFAULT_GATE_SIZE / 4,
  gateSize: DEFAULT_GATE_SIZE,
};

export function useResponsiveGrid() {
  const viewport = useViewportSize();
  const { cssvar, csstopx } = useComputedCSS();

  const [grid, setGrid] = useState<Grid>(INITIAL_GRID);

  useEffect(() => {
    if (!viewport) return;

    let xMargin = 0;
    if (viewport.isXL) {
      xMargin = (csstopx(cssvar("--text-2xl")) || 0) * NUM_QBIT_CHARACTERS;
    } else if (viewport.isLg) {
      xMargin = (csstopx(cssvar("--text-2xl")) || 0) * NUM_QBIT_CHARACTERS;
    } else if (viewport.isMd) {
      xMargin = (csstopx(cssvar("--text-xl")) || 0) * NUM_QBIT_CHARACTERS;
    } else if (viewport.isSm) {
      xMargin = (csstopx(cssvar("--text-lg")) || 0) * NUM_QBIT_CHARACTERS;
    }
    const gateSize = Math.min(viewport.width, viewport.height) / 25;
    const margin = gateSize / 2;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGrid({
      xMargin,
      yMargin: gateSize,
      columnWidth: gateSize + margin,
      rowHeight: gateSize + margin,
      gateSize: gateSize,
    });
  }, [viewport]);

  return grid;
}
