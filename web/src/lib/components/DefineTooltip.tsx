"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { renderSnippet } from "../mdx/render-snippet";

type TooltipState =
  | { open: false }
  | { open: true; anchor: HTMLElement; vocab: Vocab | null };

type WiredElement = HTMLElement & { __tooltipWired?: boolean };

interface Vocab {
  term: string;
  definition: string;
}

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
};

/* The Tooltip component that renders on a user's hover */
function Tooltip({ state }: { state: TooltipState }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [vocab, setVocab] = useState<Vocab | undefined>(undefined);

  useEffect(() => {
    if (!state.open || !state.vocab) return;
    setVocab(state.vocab);

    const update = () => {
      const r = state.anchor.getBoundingClientRect();
      setPos({
        top: r.top + window.scrollY - 8,
        left: r.left + window.scrollX + r.width / 2,
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [state]);

  return createPortal(
    <motion.div
      className={
        "pointer-events-none absolute z-1000 w-fit h-fit border-2 border-secondary/50 backdrop-blur-xs bg-surface/75 text-white text-base p-2 rounded-lg"
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: state.open && state.vocab ? 1 : 0 }}
      style={{
        top: pos.top,
        left: pos.left,
        transform: `translate(-50%, -100%)`,
      }}
      transition={{ duration: 0.2 }}
    >
      <b
        className="text-secondary"
        dangerouslySetInnerHTML={{ __html: renderSnippet(vocab?.term || "") }}
      ></b>
      <span
        dangerouslySetInnerHTML={{
          __html: renderSnippet(vocab?.definition || ""),
        }}
      />
    </motion.div>,
    document.body
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
  el: HTMLElement,
  getVocab: (el: HTMLElement) => Vocab | null,
  setState: React.Dispatch<React.SetStateAction<TooltipState>>
) {
  // Avoid double-wiring on rerenders / multiple mutations
  if ((el as WiredElement).__tooltipWired) return () => {};
  (el as WiredElement).__tooltipWired = true;

  el.tabIndex = el.tabIndex >= 0 ? el.tabIndex : 0;
  const vocab = getVocab(el);
  if (!vocab) {
    console.error("Failed to find definition for element", el);
    return () => {};
  }

  const onEnter = () => setState({ open: true, anchor: el, vocab });
  const onLeave = () => setState({ open: false });
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setState({ open: false });
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
export function DefineTooltips({
  root = "main", // or the container that holds your MDX
}: {
  root?: string;
}) {
  const selector = "[class*='define-']";
  const [state, setState] = useState<TooltipState>({ open: false });
  const cleanupsRef = useRef<(() => void)[]>([]);

  // choose tooltip content (prefer data-tooltip if present)
  const getVocab = (el: HTMLElement) => {
    const term = Array.from(el.classList)
      .find((c) => c.startsWith("define-"))
      ?.split("define-")[1];
    if (!term) return null;
    return vocab[term];
  };

  useEffect(() => {
    // Get root container
    const container = (
      root ? document.querySelector(root) : document.body
    ) as HTMLElement | null;
    if (!container) return;

    // Wire up all elements
    const wireAll = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        const cleanup = wireElement(el, getVocab, setState);
        cleanupsRef.current.push(cleanup);
      });
    };
    wireAll(container);

    // Observe future insertions (MathJax typesetting)
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          // If the added node itself matches, wire it
          if (n.matches?.(selector)) {
            const cleanup = wireElement(n, getVocab, setState);
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
