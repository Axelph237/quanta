import { P5Canvas, P5CanvasInstance } from "@p5-wrapper/react";
import p5 from "p5";
import { outfit } from "@/app/fonts";

interface Chart {
  view: {
    axes: {
      x: AxisOptions;
      y: AxisOptions;
    };
    color?: string;
    axesColor?: string;
    font?: string;
    width?: number;
    height?: number;
  };
  plots: Plot[];
}

interface AxisOptions {
  min: number;
  max: number;
  label?: string;
  unit?: {
    // scale - graph axis values are calculated by unscaled x * scale
    scale: number;
    name?: string;
  };
}

interface Plot {
  fn: (x: number) => number;
  // fidelity - how many datapoints to plot per unit of unscaled x
  fidelity: number;
  options: Partial<PlotOptions>;
}

interface PlotOptions {
  color: string;
}

interface FnChartProps {
  chart: Chart;
}

const MAX_DATAPOINTS = 1000;
const NUM_INTERVALS = 4;
const LABEL_SIZE = 25;

function chartSketch(chart: Chart) {
  // Curried to pass to P5Canvas
  return (p: P5CanvasInstance) => {
    // ---- CONSTANTS
    const axes = chart.view.axes;
    const view = chart.view;

    let t = 0; // tick
    const ttf = 80; // ticks to full scale

    const bleed = LABEL_SIZE * 2; // Bleed around the graph

    const canvasWidth = chart.view.width || 600; // Canvas width in pixels
    const canvasHeight = chart.view.height || 600; // Canvas height in pixels

    const graphWidth = canvasWidth - bleed; // Graph width in pixels
    const graphHeight = canvasHeight - bleed; // Graph height in pixels

    const xViewWidth = axes.x.max - axes.x.min;
    const yViewWidth = axes.y.max - axes.y.min;

    // Scale to convert from unscaled units to pixels
    const xScale = graphWidth / xViewWidth;
    const yScale = graphHeight / yViewWidth;

    // Unit scales (how many scaled units per unscaled unit)
    const xUnitScale = axes.x.unit?.scale || 1;
    const yUnitScale = axes.y.unit?.scale || 1;

    // ---- HELPER FUNCTIONS
    const alphaHex = (
      a: number, // Takes an alpha value and returns a hex string
    ) =>
      Math.round(a * 255)
        .toString(16)
        .padStart(2, "0");

    // ---- DATA GENERATION
    const plotData = chart.plots.map((plot) => {
      const dataPoints: p5.Vector[] = [];

      if (plot.fidelity <= 0) {
        console.error(`Invalid fidelity [${plot.fidelity}] for plot: ${plot}`);
        return { plot, dataPoints };
      }

      // Calculate the total number of datapoints based on scaled range
      const scaledXRange = (axes.x.max - axes.x.min) * xUnitScale;
      const numDatapoints = Math.round(scaledXRange / plot.fidelity);

      // Return empty data if too many datapoints
      if (numDatapoints > MAX_DATAPOINTS) {
        console.error(
          `Too many datapoints [${numDatapoints}] for plot: ${plot}`,
        );
        return { plot, dataPoints };
      }

      // Add datapoints
      // Generate points in unscaled space, but evaluate function with scaled values
      const xStep = (axes.x.max - axes.x.min) / numDatapoints;
      for (
        let xUnscaled = axes.x.min - xStep;
        xUnscaled < axes.x.max + xStep;
        xUnscaled += xStep
      ) {
        const xScaled = xUnscaled * xUnitScale; // Convert to scaled space for function
        const yScaled = plot.fn(xScaled); // Function receives scaled x
        const yUnscaled = yScaled / yUnitScale; // Convert back to unscaled space for storage
        dataPoints.push(p.createVector(xUnscaled, yUnscaled));
      }

      return { plot, dataPoints };
    });

    console.log("Generated datapoints:", plotData);

    // ---- GRAPH SETUP
    p.setup = () => {
      p.pixelDensity(1); // Explicitly set pixel density to 1
      p.createCanvas(canvasWidth, canvasHeight); // Create canvas

      p.textFont(outfit.style.fontFamily); // Set font
    };

    // ---- GRAPH DRAW CONTROL
    p.draw = () => {
      p.clear(); // Clear the canvas completely (transparent background)

      drawGrid(); // Draw background grid

      // Draw plots
      for (const pd of plotData) {
        drawPlot(pd);
      }

      drawAxes(); // Draw axes

      t += 1; // Iterate time step
      if (t > ttf) {
        p.noLoop();
      }
    };

    const drawAxes = () => {
      p.push();
      p.strokeWeight(2);

      const ctx = p.drawingContext;
      if (ctx instanceof CanvasRenderingContext2D) {
        ctx.globalAlpha = 0.5; // 50% opacity
      }
      p.stroke(view.axesColor + alphaHex(0.75));
      p.line(bleed, graphHeight, graphWidth, graphHeight); // X axis
      p.line(bleed, bleed, bleed, graphHeight); // Y axis

      if (ctx instanceof CanvasRenderingContext2D) {
        ctx.globalAlpha = 1.0; // Reset to full opacity
      }
      p.pop();
    };

    const drawGrid = () => {
      const ctx = p.drawingContext;
      if (ctx instanceof CanvasRenderingContext2D) {
        ctx.globalAlpha = 0.25; // 25% opacity
      }

      const xInterval = graphWidth / NUM_INTERVALS;
      const yInterval = graphHeight / NUM_INTERVALS;

      p.push();
      p.stroke(view.axesColor!);
      p.strokeWeight(1);
      for (let x = xInterval; x < graphWidth; x += xInterval) {
        // Vertical
        p.line(x + bleed, bleed, x + bleed, graphHeight);
      }
      for (let y = yInterval; y < graphHeight; y += yInterval) {
        // Horizontal
        p.line(bleed, y, graphWidth, y);
      }

      if (ctx instanceof CanvasRenderingContext2D) {
        ctx.globalAlpha = 0.75; // Reset to full opacity
      }
      p.pop();

      // Label text
      p.push();
      // properties
      p.strokeWeight(1);
      p.stroke(view.axesColor!);
      p.textSize(10);
      p.textStyle(p.NORMAL);
      p.textFont(view.font!);
      p.textAlign(p.CENTER, p.CENTER);

      // draw
      const valLabelY = Math.round(canvasHeight - LABEL_SIZE * (3 / 2));
      const axisLabelY = Math.round(canvasHeight - LABEL_SIZE * (1 / 2));
      for (let x = xInterval; x < graphWidth; x += xInterval) {
        // Calculate unscaled value at this position
        const unscaledValue =
          (axes.x.max - axes.x.min) * (x / graphWidth) + axes.x.min;
        // Convert to scaled value for display
        const label = unscaledValue * xUnitScale;
        const xPos = Math.round(x + bleed);
        const yPos = valLabelY;
        p.text(label.toPrecision(2), xPos, yPos);
      }
      p.text(
        (axes.x.label || "X") +
          (axes.x.unit?.name ? `  [${axes.x.unit.name}]` : ""),
        graphWidth / 2 + bleed,
        axisLabelY,
      );

      // Rotate to align with y axis
      p.rotate(-p.PI / 2);
      const valLabelX = Math.round(LABEL_SIZE * (3 / 2));
      const axisLabelX = Math.round(LABEL_SIZE * (1 / 2));
      for (let y = yInterval; y < graphHeight; y += yInterval) {
        // Calculate unscaled value at this position
        const unscaledValue =
          (axes.y.max - axes.y.min) * (y / graphHeight) + axes.y.min;
        // Convert to scaled value for display
        const label = unscaledValue * yUnitScale;
        const xPos = Math.round(valLabelX);
        const yPos = graphHeight - Math.round(y);
        p.text(label.toPrecision(2), -yPos, xPos);
      }
      p.text(
        (axes.y.label || "Y") +
          (axes.y.unit?.name ? `  [${axes.y.unit.name}]` : ""),
        -(graphHeight / 2),
        axisLabelX,
      );

      // end
      p.pop();

      if (ctx instanceof CanvasRenderingContext2D) {
        ctx.globalAlpha = 1.0; // Reset to full opacity
      }
    };

    const drawPlot = (plotData: { plot: Plot; dataPoints: p5.Vector[] }) => {
      const { plot, dataPoints } = plotData;

      p.push();
      // properties
      p.stroke(plot.options.color || "white");
      p.strokeWeight(3);
      p.noFill();
      p.beginShape();
      p.splineProperties({ ends: p.EXCLUDE });

      p.beginClip();
      p.rect(bleed, bleed, graphWidth, graphHeight);
      p.endClip();

      // draw vetices
      for (let i = 0; i < dataPoints.length; i++) {
        const { x, y } = dataPoints[i];
        // Nudge x by label size, and invert y to be properly aligned to expectation
        const canvasX = (x - axes.x.min) * xScale + bleed;
        const canvasY = (y - axes.y.min) * yScale + bleed;

        p.splineVertex(canvasX, canvasHeight - canvasY);
      }
      // end
      p.endShape(undefined);
      p.pop();
    };
  };
}

export default function FnChart({ chart }: FnChartProps) {
  return (
    <div>
      <P5Canvas sketch={chartSketch(chart)} />
    </div>
  );
}
