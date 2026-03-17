/**
 * Client-side Loader for the browser use of the quantum-circuit library.
 *
 * The CircuitScriptLoader component should be included in all pages that utilize the quantum-circuit library.
 */

import Script from "next/script";
import Circuit from "quantum-circuit";

/**
 * Script loader for embedding in pages using quantum circuits
 */
export default function CircuitScriptLoader() {
  return (
    <Script
      src="https://unpkg.com/quantum-circuit@0.9.247/dist/quantum-circuit.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log("Circuit script loaded.");
      }}
    />
  );
}

/**
 * Declares the global window object to include the quantum circuit object
 */
declare global {
  interface Window {
    QuantumCircuit?: typeof Circuit;
  }
}

let quantumCircuitReady: Promise<typeof Circuit> | null = null;
function getQuantumCircuit(): Promise<typeof Circuit> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Circuit is only available in the browser."),
    );
  }

  if (window.QuantumCircuit) {
    return Promise.resolve(window.QuantumCircuit);
  }

  if (!quantumCircuitReady) {
    quantumCircuitReady = new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 100;

      const check = () => {
        if (window.QuantumCircuit) {
          resolve(window.QuantumCircuit);
          return;
        }

        attempts += 1;
        if (attempts >= maxAttempts) {
          reject(new Error("Circuit script did not load."));
          return;
        }

        setTimeout(check, 25);
      };

      check();
    });
  }

  return quantumCircuitReady;
}

/**
 * Creates a new quantum circuit once the quantum-circuit unpkg script has loaded
 * @param numQubits The number of qubits in the circuit
 * @returns A new quantum circuit
 */
export async function createCircuit(numQubits: number) {
  const Circuit = await getQuantumCircuit();
  return new Circuit(numQubits);
}

// Example state string: ([-]REAL)([+/-]IMAG)i|(BITS)> (NUMBER)%
const stateRegex =
  /(\-?[0-9]+\.[0-9]+)([\+\-][0-9]+\.[0-9]+)i\|([01]+)\>\s+([0-9]+\.[0-9]+)%/g;
export type State = {
  real: number;
  imag: number;
  bits: string;
  prob: number;
};
/**
 * Extracts the state of a quantum circuit from a state string
 * @param state The state string to extract from
 * @returns An array of states
 */
export function stateAsObjects(circuit: Circuit) {
  const stateString = circuit.stateAsString(false);

  const states: State[] = [];
  for (const match of stateString.matchAll(stateRegex)) {
    states.push({
      real: parseFloat(match[1]),
      imag: parseFloat(match[2]),
      bits: match[3],
      prob: parseFloat(match[4]) / 100,
    });
  }
  return states;
}
