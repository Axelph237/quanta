import { useViewportSize } from "@/lib/hooks/useViewportSize";
import { useEffect, useState } from "react";
import { Grid } from "./types";

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

  const [grid, setGrid] = useState<Grid>(INITIAL_GRID);

  useEffect(() => {
    if (!viewport) return;

    let gateSize = 0;
    if (viewport.isXL) {
      gateSize = Math.min(viewport.width, viewport.height) / 25;
    } else if (viewport.isLg) {
      gateSize = Math.min(viewport.width, viewport.height) / 35;
    } else if (viewport.isMd) {
      gateSize = Math.min(viewport.width, viewport.height) / 45;
    } else if (viewport.isSm) {
      gateSize = Math.min(viewport.width, viewport.height) / 55;
    }
    const margin = gateSize / 2;

    setGrid({
      xMargin: gateSize * 2,
      yMargin: gateSize,
      columnWidth: gateSize + margin,
      rowHeight: gateSize + margin,
      gateSize: gateSize,
    });
  }, [viewport]);

  return grid;
}
