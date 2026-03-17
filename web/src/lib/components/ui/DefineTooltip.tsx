"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { renderSnippet } from "../../markdown/render-snippet";
import { gates } from "@/lib/circuit/gates";
import { useViewportSize } from "@/lib/hooks/useViewportSize";

type TooltipState =
  | { open: false }
  | {
      open: true;
      anchor: Element;
      vocab: Vocab | null;
      opts: Record<string, string>;
    };

type WiredElement = Element & { __tooltipWired?: boolean };

interface Vocab {
  term: string;
  definition: string;
}

const CLASS_REGEX = /define-(.+?)(?::(.+))?$/;

const vocab: { [key: string]: Vocab } = {
  "wave-eqn": {
    term: "Wave Equation",
    definition:
      "An equation that describes the propagation and state of a wave such as light or sound.",
  },
  hbar: {
    term: "h-bar",
    definition:
      "The reduced Planck constant, defined as $\\hbar=\\frac{h}{2\\pi}$",
  },
  "q-wave-eqn": {
    term: "Quantum Wave Equation",
    definition:
      "$\\Psi$ (Psi) is a wave function that describes the state of a quantum system.",
  },
  potential: {
    term: "Potential",
    definition:
      "The potential function ($U$) describes the potential energy of a quantum system. Like the drawing force between an electron and a hydrogen nucleus (one proton).",
  },
  hconjugate: {
    term: "Hermitian Conjugate",
    definition:
      "The Hermitian conjugate is the conjugate ($^*$) and transpose ($^T$) of a matrix $A$ such that $A^{(*)(T)}=A^\\dagger$. i.e. $$\\begin{bmatrix}2+i & 4-2i\\end{bmatrix}^\\dagger=\\begin{bmatrix}2-i \\\\ 4+2i\\end{bmatrix}$$",
  },
  "black-body": {
    term: "Black Body",
    definition:
      "A black body is an object that absorbs all incident radiation (hence the color black), also emitting all radiation it absorbs.",
  },
  "harm-osc": {
    term: "Harmonic Oscillator",
    definition:
      "A harmonic oscillator is a system that oscillates at a constant frequency $v$.",
  },
  // Map definitions for all gates
  ...Object.keys(gates).reduce(
    (acc, key) => {
      if (gates[key].id === "barrier" || gates[key].id === "fill") return acc;
      acc[gates[key].id + "-gate"] = {
        term: gates[key].label,
        definition: gates[key].description,
      };
      return acc;
    },
    {} as Record<string, Vocab>,
  ),
  "qbit-prob": {
    term: "Qubit Probability",
    definition:
      "The probability of measuring the qubit in the $|1\\rangle$ state.",
  },
  qbit: {
    term: "Qubit",
    definition:
      "A qubit is a two-level quantum system ($\\Psi$). They are almost always initialized to $|0\\rangle$ before a circuit is run.",
  },
};

/* The Tooltip component that renders on a user's hover */
function Tooltip({ state }: { state: TooltipState }) {
  const viewport = useViewportSize();
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [vocab, setVocab] = useState<Vocab | undefined>(undefined);
  const width = viewport?.isXL ? 500 : viewport?.width * 0.5;

  useEffect(() => {
    if (!state.open || !state.vocab) return;
    setVocab(state.vocab);

    const update = () => {
      const r = state.anchor.getBoundingClientRect();
      setPos({
        top: r.top + window.scrollY - 8,
        // Clamp the tooltip to the viewport
        left: Math.max(
          Math.min(
            r.left + window.scrollX + r.width / 2,
            viewport.width - width / 2,
          ),
          width / 2,
        ),
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [state, viewport]);

  return createPortal(
    <motion.div
      className={`pointer-events-none absolute z-1000 h-fit border-2 border-quanta-secondary/50 backdrop-blur-xs bg-quanta-surface/75 text-white text-base p-2 rounded-lg`}
      initial={{ opacity: 0 }}
      animate={{ opacity: state.open && state.vocab ? 1 : 0 }}
      style={{
        top: pos.top,
        left: pos.left,
        width: `${width}px`,
        transform: `translate(-50%, -100%)`,
        // Overwrite tailwind style if options set a new color
        borderColor: state.open ? state.opts?.color + "7F" : undefined,
      }}
      transition={{ duration: 0.2 }}
    >
      <b
        className={`text-quanta-secondary`}
        style={{ color: state.open ? state.opts?.color : undefined }}
        dangerouslySetInnerHTML={{ __html: renderSnippet(vocab?.term || "") }}
      ></b>
      <span
        dangerouslySetInnerHTML={{
          __html: renderSnippet(vocab?.definition || ""),
        }}
      />
    </motion.div>,
    document.body,
  );
}

/**
 * Wires an element to command the tooltip on hover
 * @param el - The element to wire
 * @param getText - A function that returns the text to display for a given element
 * @param setState - A setState function for setting the tooltip state
 * @returns - A cleanup function to remove the event listeners
 */
function wireElement(
  el: Element,
  getArgs: (
    el: Element,
  ) => { term: Vocab; opts: Record<string, string> } | null,
  setState: React.Dispatch<React.SetStateAction<TooltipState>>,
) {
  // Avoid double-wiring on rerenders / multiple mutations
  if ((el as WiredElement).__tooltipWired) return () => {};
  (el as WiredElement).__tooltipWired = true;

  if (el instanceof HTMLElement || el instanceof SVGElement) {
    el.tabIndex = el.tabIndex >= 0 ? el.tabIndex : 0;
  }
  const args = getArgs(el);
  if (!args) {
    console.error("Failed to find definition for element", el);
    return () => {};
  }

  const onEnter = () => {
    setState({ open: true, anchor: el, vocab: args.term, opts: args.opts });
  };
  const onLeave = () => {
    setState({ open: false });
  };
  const onKeyDown = (e: Event) => {
    if ((e as KeyboardEvent).key === "Escape") setState({ open: false });
  };

  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mouseleave", onLeave);
  el.addEventListener("focus", onEnter);
  el.addEventListener("blur", onLeave);
  el.addEventListener("keydown", onKeyDown);

  return () => {
    el.removeEventListener("mouseenter", onEnter);
    el.removeEventListener("mouseleave", onLeave);
    el.removeEventListener("focus", onEnter);
    el.removeEventListener("blur", onLeave);
    el.removeEventListener("keydown", onKeyDown);
    delete (el as WiredElement).__tooltipWired;
  };
}

/* The parent component that wires up all elements and manages the tooltip state */
export function DefineTooltips({ root = "main" }: { root?: string }) {
  const selector = "[class*='define-']";
  const [state, setState] = useState<TooltipState>({ open: false });
  const cleanupsRef = useRef<(() => void)[]>([]);

  // choose tooltip content (prefer data-tooltip if present)
  const getArgs = (el: Element) => {
    const match = Array.from(el.classList)
      .find((c) => c.startsWith("define-"))
      ?.match(CLASS_REGEX); // define-[term][:options]
    if (!match) return null;

    const term = match[1];
    if (!term) return null;
    return {
      term: vocab[term],
      opts: match[2]
        ? match[2].split(":").reduce(
            (acc, opt) => {
              const [key, value] = opt.split("=");
              acc[key] = value;
              return acc;
            },
            {} as Record<string, string>,
          )
        : {},
    };
  };

  useEffect(() => {
    // Get root container
    const container = (
      root ? document.querySelector(root) : document.body
    ) as Element | null;
    if (!container) return;

    // Wire up all elements
    const wireAll = (scope: ParentNode) => {
      scope.querySelectorAll(selector).forEach((el) => {
        const cleanup = wireElement(el, getArgs, setState);
        cleanupsRef.current.push(cleanup);
      });
    };
    wireAll(container);

    // Observe future insertions (MathJax typesetting)
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          // If the added node itself matches, wire it
          if (n.matches?.(selector)) {
            const cleanup = wireElement(n, getArgs, setState);
            cleanupsRef.current.push(cleanup);
          }
          // Scan its subtree
          wireAll(n);
        });
      }
    });

    // Observe future insertions
    obs.observe(container, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      cleanupsRef.current.forEach((fn) => fn());
      cleanupsRef.current = [];
    };
  }, [selector, root]);

  return <Tooltip state={state} />;
}
