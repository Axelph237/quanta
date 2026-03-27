import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

interface IridescenceProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}

export default function Iridescence({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  ...rest
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  const program = useRef<Program | null>(null);
  const renderer = useRef<Renderer | null>(null);
  const mesh = useRef<Mesh | null>(null);

  const isSetup = () => {
    return program.current && mesh.current && renderer.current;
  };

  useEffect(() => {
    if (!ctnDom.current) return;
    try {
      renderer.current = new Renderer();
    } catch (error) {
      console.warn("WebGL not supported or context missing.", error);
      return;
    }
    const gl = renderer.current.gl;
    if (!gl) return;

    gl.clearColor(1, 1, 1, 1);

    const geometry = new Triangle(gl);
    program.current = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          ),
        },
        uMouse: {
          value: new Float32Array([mousePos.current.x, mousePos.current.y]),
        },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });

    mesh.current = new Mesh(gl, { geometry, program: program.current });
  }, []);

  useEffect(() => {
    if (!isSetup()) return;
    const gl = renderer.current!.gl;
    if (!gl) return;

    function resize() {
      if (!isSetup()) return;

      const scale = 1;
      renderer.current!.setSize(
        ctnDom.current!.offsetWidth * scale,
        ctnDom.current!.offsetHeight * scale,
      );
      if (program.current) {
        program.current.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        );
      }
    }
    window.addEventListener("resize", resize, false);
    resize();

    let animateId: number;
    function update(t: number) {
      if (!program.current || !mesh.current || !renderer.current) return;

      animateId = requestAnimationFrame(update);
      program.current!.uniforms.uTime.value = t * 0.001;
      renderer.current!.render({ scene: mesh.current });
    }
    animateId = requestAnimationFrame(update);
    ctnDom.current!.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctnDom.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
      program.current!.uniforms.uMouse.value[0] = x;
      program.current!.uniforms.uMouse.value[1] = y;
    }
    if (mouseReact) {
      ctnDom.current!.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (mouseReact && ctnDom.current) {
        ctnDom.current.removeEventListener("mousemove", handleMouseMove);
      }
      if (ctnDom.current) {
        ctnDom.current.removeChild(gl.canvas);
      }
      // gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact]);

  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  if (isIOS) {
    return <div className="w-full h-full" {...rest} />;
  }

  return <div ref={ctnDom} className="w-full h-full" {...rest} />;
}
