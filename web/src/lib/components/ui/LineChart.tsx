"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { Data, Layout, Config } from "plotly.js";
import { COLORS } from "@/app/globals";

// Dynamically import Plot to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// Predefined color palette
const CHART_COLORS = [
  "rgb(75, 192, 192)",
  "rgb(255, 99, 132)",
  "rgb(54, 162, 235)",
  "rgb(255, 206, 86)",
  "rgb(153, 102, 255)",
  "rgb(255, 159, 64)",
  "rgb(201, 203, 207)",
];

interface FunctionData {
  fn: (x: number) => number;
  label: string;
}

interface LineChartProps {
  functions: FunctionData[];
  xMin?: number;
  xMax?: number;
  numPoints?: number;
  title?: string;
  showLegend?: boolean;
}

export default function LineChart({
  functions,
  xMin = 0,
  xMax = 10,
  numPoints = 50,
  title = "Function Plot",
  showLegend = true,
}: LineChartProps) {
  // Generate x values
  const xValues = useMemo(() => {
    const step = (xMax - xMin) / (numPoints - 1);
    return Array.from({ length: numPoints }, (_, i) => xMin + i * step);
  }, [xMin, xMax, numPoints]);

  // Generate plot data from functions
  const data: Data[] = useMemo(() => {
    return functions.map((funcData, index) => {
      const colorIndex = index % CHART_COLORS.length;
      const color = CHART_COLORS[colorIndex];

      // Evaluate function at each x value
      const yValues = xValues.map((x) => funcData.fn(x));

      return {
        x: xValues,
        y: yValues,
        type: "scatter",
        mode: "lines",
        name: funcData.label,
        line: {
          color: color,
          width: 2,
        },
      } as Data;
    });
  }, [functions, xValues]);

  const layout: Partial<Layout> = {
    title: { text: title },
    showlegend: showLegend,
    xaxis: {
      title: { text: "r" },
      gridcolor: "rgba(128, 128, 128, 0.2)",
    },
    yaxis: {
      title: { text: "4πr²ψ²" },
      gridcolor: "rgba(128, 128, 128, 0.2)",
    },
    hovermode: false,
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: {
      color: "currentColor",
      family: "Outfit",
    },
    margin: {
      l: 60,
      r: 40,
      t: title ? 60 : 40,
      b: 60,
    },
  };

  const config: Partial<Config> = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
  };

  return (
    <div className="w-full h-full">
      <Plot
        data={data}
        layout={layout}
        config={config}
        className="w-full h-full"
      />
    </div>
  );
}
