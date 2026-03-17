import Circuit from "quantum-circuit";
import { createCircuit } from "./quantumCircuitClient";

const NUM_QUBITS = 3;

const hall = (circuit: Circuit) => {
    for (let i = 0; i < NUM_QUBITS; i++) {
        circuit.appendGate("h", i, {});
    }
}

const ccz = (circuit: Circuit) => {
    circuit.appendGate("h", 2, {});
    circuit.appendGate("ccx", [0, 1, 2], {});
    circuit.appendGate("h", 2, {});
}

// Trivial oracle that directly marks a target state
const oracle = async (targetState: string) => {
    const oracle = await createCircuit(NUM_QUBITS);

    // Swap |100> to |111>
    for (let i = 0; i < targetState.length; i++) {
        if (targetState[i] === "0") {
            oracle.appendGate("x", targetState.length - 1 - i, {});
        }
    }
    
    // Hadamard toffoli in place of a CCZ
    ccz(oracle);

    // Return state to normal
    for (let i = 0; i < targetState.length; i++) {
        if (targetState[i] === "0") {
            oracle.appendGate("x", targetState.length - 1 - i, {});
        }
    }
    return oracle.save(false, false);
}

const diffuser = async () => {
    const diffuser = await createCircuit(NUM_QUBITS);

    for (let i = 0; i < NUM_QUBITS; i++) {
        diffuser.appendGate("h", i, {});
        diffuser.appendGate("x", i, {});
    }

    ccz(diffuser);

    for (let i = 0; i < NUM_QUBITS; i++) {
        diffuser.appendGate("x", i, {});
        diffuser.appendGate("h", i, {});
    }

    return diffuser.save(false, false);
}

export const grovers = async () => {

    const circuit = await createCircuit(NUM_QUBITS);
    circuit.registerGate("oracle", await oracle("100"));
    circuit.registerGate("diffuser", await diffuser());

    // Actual circuit
    hall(circuit);
    for (let i = 0; i < Math.round(Math.PI / 4 * Math.sqrt(Math.pow(2, NUM_QUBITS))); i++) {
        circuit.appendGate("oracle", [0, 1, 2], {});
        circuit.appendGate("diffuser", [0, 1, 2], {});
    }

    circuit.run();

    circuit.print(false);
}