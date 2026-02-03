"use client";

import { COLORS } from "@/app/globals";
import { P5CanvasInstance, P5Canvas } from "@p5-wrapper/react";

export function sketch(p: P5CanvasInstance) {
  const rect = {
    width: 400,
    height: 400,
  };
  let t = 0; // time parameter for animation
  const waveSpeed = 2; // pixels per frame
  const wavelength = 80; // distance between wave crests
  const slitSeparation = 100; // distance between the two slits
  const slitWidth = 20; // width of each slit opening
  const wallThickness = 5;

  const wall1X = rect.width / 4;
  const wall2X = (3 * rect.width) / 4;

  const slit1Y = rect.height / 2 - slitSeparation / 2;
  const slit2Y = rect.height / 2 + slitSeparation / 2;

  const canvasWidth = rect.width + (rect.width % wavelength);

  // Calculate interference points on wall 2
  const interferencePoints: { y: number; intensity: number }[] = [];

  p.setup = () => {
    p.createCanvas(canvasWidth, rect.height);
    calculateInterferencePattern();
  };

  function calculateInterferencePattern() {
    interferencePoints.length = 0;
    const numPoints = 50;

    for (let i = 0; i < numPoints; i++) {
      const y = (i / (numPoints - 1)) * rect.height;

      // Calculate path difference from the two slits to this point
      const dist1 = p.dist(wall1X, slit1Y, wall2X, y);
      const dist2 = p.dist(wall1X, slit2Y, wall2X, y);
      const pathDiff = Math.abs(dist1 - dist2);

      // Constructive interference when path difference is a multiple of wavelength
      const phase = (pathDiff % wavelength) / wavelength;
      const intensity = Math.cos(phase * 2 * Math.PI);

      // Only show points with strong constructive interference
      if (intensity > 0.9) {
        interferencePoints.push({ y, intensity });
      }
    }
  }

  p.draw = () => {
    p.background(0);

    // Draw waves with masking
    drawWaves();

    // Draw walls on top (they mask the waves)
    drawWalls();

    // Draw interference pattern circles on wall 2
    drawInterferencePattern();

    t += 1;
  };

  function drawWalls() {
    p.stroke("white");
    p.strokeWeight(wallThickness);
    p.noFill();

    // Wall 1 - Double Slit (three segments)
    p.line(wall1X, 0, wall1X, slit1Y - slitWidth / 2); // top segment
    p.line(wall1X, slit1Y + slitWidth / 2, wall1X, slit2Y - slitWidth / 2); // middle segment
    p.line(wall1X, slit2Y + slitWidth / 2, wall1X, rect.height); // bottom segment

    // Wall 2 - Detection screen
    p.line(wall2X, 0, wall2X, rect.height);
  }

  function drawWaves() {
    const ctx = p.drawingContext;

    // Only use clipping if we have a 2D context
    if (!(ctx instanceof CanvasRenderingContext2D)) return;

    // Create clipping region (everything except the walls)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, rect.width, rect.height);

    // Cut out wall 1 (except slits)
    ctx.rect(
      wall1X - wallThickness,
      0,
      wallThickness * 2,
      slit1Y - slitWidth / 2,
    );
    ctx.rect(
      wall1X - wallThickness,
      slit1Y + slitWidth / 2,
      wallThickness * 2,
      slit2Y - slit1Y - slitWidth,
    );
    ctx.rect(
      wall1X - wallThickness,
      slit2Y + slitWidth / 2,
      wallThickness * 2,
      rect.height - slit2Y - slitWidth / 2,
    );

    // Cut out wall 2
    ctx.rect(wall2X - wallThickness, 0, wallThickness * 2, rect.height);

    ctx.clip("evenodd");

    // Draw incoming plane waves on the left side
    p.stroke(COLORS.primary.hex);
    p.strokeWeight(2);
    p.noFill();

    const maxR = canvasWidth + wavelength;
    const numWaves = Math.ceil(maxR / wavelength); // Total number of complete waves
    for (let w = 0; w < numWaves; w++) {
      const r = (w * wavelength + t * waveSpeed) % maxR; // Wave location

      if (r < wall1X) {
        // plan waves before slits
        const alpha = p.map(r, 0, wall1X, 100, 255);
        p.stroke(
          COLORS.primary.hex + Math.floor(alpha).toString(16).padStart(2, "0"),
        );
        p.line(r, 0, r, rect.height);
      } else {
        // radial waves past slits
        const radius = r - wall1X;
        const alpha = p.map(radius, 0, maxR, 255, 0);
        p.stroke(
          COLORS.primary.hex + Math.floor(alpha).toString(16).padStart(2, "0"),
        );
        p.arc(wall1X, slit1Y, radius * 2, radius * 2, -p.HALF_PI, p.HALF_PI);
        p.arc(wall1X, slit2Y, radius * 2, radius * 2, -p.HALF_PI, p.HALF_PI);
      }
    }

    ctx.restore();
  }

  function drawInterferencePattern() {
    p.noStroke();

    for (const point of interferencePoints) {
      // Pulsing effect based on wave phase
      const phase = (t * waveSpeed * 2 * Math.PI) / wavelength;
      const pulse = (Math.sin(phase + Math.PI) + 1) / 2;

      const baseSize = 10;
      // const size = baseSize + pulse * 3;
      const alpha = 150 + pulse * 105;

      p.fill(
        COLORS.primary.hex + Math.floor(alpha).toString(16).padStart(2, "0"),
      );
      p.circle(wall2X, point.y, baseSize);
    }
  }
}

export default function DoubleSlitFigure() {
  return <P5Canvas sketch={sketch} />;
}
