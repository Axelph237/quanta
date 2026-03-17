import { COLORS } from "@/app/globals";
import { P5CanvasInstance, P5Canvas } from "@p5-wrapper/react";
import { useViewportSize } from "@/lib/hooks/useViewportSize";

function sketch({ width, height }: { width: number; height: number }) {
  const constraint = Math.min(width, height) / 4;

  let t = 0;

  return (p: P5CanvasInstance) => {
    p.setup = () => {
      p.createCanvas(constraint, constraint);
    };

    p.draw = () => {
      p.clear();
      t += 1;

      p.translate(p.width / 2, p.height / 2);

      const baseRadius = constraint / 3;
      const noiseAmount = 25;
      const detail = 100;

      p.beginShape();
      p.fill(COLORS.primary.hex);
      for (let i = 0; i <= detail; i++) {
        const angle = p.map(i, 0, detail, 0, p.TWO_PI);

        const nx = p.cos(angle) * 0.3 - t * 0.005;
        const ny = p.sin(angle) * 0.3 + t * 0.005;

        const displacement = p.map(
          p.noise(nx, ny),
          0,
          1,
          -noiseAmount,
          noiseAmount,
        );
        const r = baseRadius + displacement;

        const x = p.cos(angle) * r;
        const y = p.sin(angle) * r;

        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
    };
  };
}

export default function WarpingCircle() {
  const viewportSize = useViewportSize();

  return <P5Canvas sketch={sketch(viewportSize)} />;
}
