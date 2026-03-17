import { useViewportSize } from "@/lib/hooks/useViewportSize";
import { useEffect, useState } from "react";
import { Grid } from "./types";

const DEFAULT_GATE_SIZE = 30;

const INITIAL_GRID: Grid = {
  xMargin: DEFAULT_GATE_SIZE * 2,
  yMargin: DEFAULT_GATE_SIZE * 2,
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
      gateSize = Math.min(viewport.width, viewport.height) / 20;
    } else if (viewport.isLg) {
      gateSize = Math.min(viewport.width, viewport.height) / 30;
    } else if (viewport.isMd) {
      gateSize = Math.min(viewport.width, viewport.height) / 40;
    } else if (viewport.isSm) {
      gateSize = Math.min(viewport.width, viewport.height) / 50;
    }
    const padding = gateSize * 2;
    const margin = gateSize / 4;

    setGrid({
      xMargin: padding,
      yMargin: padding,
      columnWidth: gateSize + margin,
      rowHeight: gateSize + margin,
      gateSize: gateSize,
    });
  }, [viewport]);

  return grid;
}
