"use client";

import { COLORS } from "@/app/globals";
import { P5CanvasInstance, P5Canvas, SketchProps } from "@p5-wrapper/react";
import { useEffect, useRef, useState } from "react";

interface QuasiProbSketchProps extends SketchProps {
  values: number[];
  labels?: string[];
  yMin?: number;
  yMax?: number;
  width?: number;
  height?: number;
}

function sketch(p: P5CanvasInstance) {
  const TEXT_SIZE = 16;
  let values = [1, 2, 3, 4];
  let displayValues = new Array(values.length).fill(0);
  let labels = ["1", "2", "3", "4"];
  let yMin = 0;
  let yMax = 10;

  p.setup = () => {
    p.createCanvas(600, 300);
  };

  p.updateWithProps = (sProps: SketchProps) => {
    const props = sProps as QuasiProbSketchProps;
    if (props.values) {
      values = props.values;
      displayValues = new Array(values.length).fill(0);
    }
    if (props.labels) {
      labels = props.labels;
    }
    if (props.yMin) {
      yMin = props.yMin;
    }
    if (props.yMax) {
      yMax = props.yMax;
    }
  };

  p.draw = () => {
    p.clear();

    const marginX = TEXT_SIZE * 3.5;
    const marginY = TEXT_SIZE * 3;
    const rightMargin = 20;
    const graphWidth = p.width - marginX - rightMargin;
    const graphHeight = p.height - marginY * 2;

    if (values.length === 0 || graphWidth <= 0 || graphHeight <= 0) return;

    p.textFont("Outfit, sans-serif");

    const barWidth = graphWidth / values.length;
    const spacing = barWidth * 0.2;
    const actualBarWidth = Math.max(1, barWidth - spacing);

    // Draw baseline / grid
    p.stroke(128, 128, 128, 100);
    p.strokeWeight(2);

    const yZero = p.map(0, yMin, yMax, p.height - marginY, marginY);
    p.line(marginX, yZero, p.width - rightMargin, yZero);

    // Y axis labels
    p.fill(128, 128, 128);
    p.noStroke();
    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(TEXT_SIZE);
    p.text(yMax.toString(), marginX - 10, marginY);
    p.text(yMin.toString(), marginX - 10, p.height - marginY);

    if (yMin < 0 && yMax > 0) {
      p.text("0", marginX - 10, yZero);
    }

    p.textAlign(p.CENTER, p.TOP);
    for (let i = 0; i < values.length; i++) {
      displayValues[i] = p.lerp(displayValues[i], values[i], 0.1);

      const val = displayValues[i];
      const x = marginX + i * barWidth + spacing / 2;
      const targetY = p.map(val, yMin, yMax, p.height - marginY, marginY);

      const barH = yZero - targetY;

      if (val >= 0) {
        p.fill(COLORS.primary.hex);
        p.rect(x, targetY, actualBarWidth, barH, 4, 4, 0, 0);
      } else {
        p.fill(COLORS.secondary.hex);
        p.rect(x, yZero, actualBarWidth, Math.abs(barH), 0, 0, 4, 4);
      }

      // X Labels
      const label = labels && labels[i] ? labels[i] : i.toString();
      p.fill(128, 128, 128);
      p.text(label, x + actualBarWidth / 2, p.height - marginY + 10);
    }
  };
}

export interface QuasiProbGraphProps {
  values: number[];
  labels?: string[];
  yMin?: number;
  yMax?: number;
}

export default function QuasiProbGraph({
  values,
  labels,
  yMin = -1,
  yMax = 1,
}: QuasiProbGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <P5Canvas
      sketch={sketch}
      width={dimensions.width}
      height={dimensions.height}
      yMin={yMin}
      yMax={yMax}
      labels={labels}
      values={values}
    />
  );
}
