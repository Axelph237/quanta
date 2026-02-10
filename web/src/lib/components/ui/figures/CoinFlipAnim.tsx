import { COLORS } from "@/app/globals";
import { useViewportSize } from "@/lib/hooks/useViewportSize";
import { P5Canvas, P5CanvasInstance, SketchProps } from "@p5-wrapper/react";

interface CanvasProps {
  canvasSize: { width: number; height: number };
}

function sketch(p: P5CanvasInstance) {
  let canvas: { width: number; height: number };

  let tick = 0;
  const tps = 60;
  const angularVel = 6;

  p.setup = () => {
    p.background("white");

    p.createCanvas(canvas.width, canvas.height, p.WEBGL);
  };

  p.updateWithProps = (props: unknown) => {
    const cprops = props as CanvasProps; // Type cast because typescript hates fun

    canvas = cprops.canvasSize;
  };

  p.draw = () => {
    p.clear();

    p.fill(COLORS.primary.hex);
    p.stroke("white");
    p.rotate((tick / tps) * angularVel, [1, 0, 0]);
    p.cylinder(canvas.width / 8, 10, 20);

    tick++;
  };
}

export default function CoinFlipAnim() {
  const viewportSize = useViewportSize();
  return <P5Canvas sketch={sketch} canvasSize={viewportSize} />;
}
