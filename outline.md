# Outline Flow

## What do I want someone to get out of this?

I want a student to have an understanding of the process of building, running, and measuring a quantum circuit.

Our demonstration problem of choice: Sudoku (using Grover's algorithm)

Steps for learning:

1. Unit 1: What is "Quantum"?
	1. [x] A brief history
	2. [ ] Schrödinger equation
	3. [x] Superposition
	4. [x] Entanglement
2. Unit 2: What is a Quantum Computer?
	1. [x] Quantum Computing
	2. [x] Quantum Circuits
	3. [x] Circuit Compilation
	4. [ ] Qubit Measurement
3. Unit 4: Quantum Algorithms
	1. [x] Query Computation
	2. [ ] Example Algorithms
	3. [ ] NISQ-Era Complications

# Quantum Computing

## Quantum? Like really small?

_The basics of quantum mechanics_

In a sense, yes, but also no (we will get to that part!). Quantum mechanics is the theory of physics that describes the unusual characteristics of matter and light at or below the scale of atoms (1). We won't be deep diving into quantum mechanics as a whole, but for the sake of **quantum computing**, it does describe some deeply interesting phenomena!

Let's take a look into an example of those phenomena, light! Now, scientists have for a long time debated the nature of light. For instance, is it a particle (think like a singular ray), or is it a wave (like a ripple in a pond when you drop a pebble in). Years of experiments and conversation lead many brilliant scientists to a fascinating discovery: it's both! How can that be? We will leave that topic for another discussion, because all that we are interested in is

### Wave functions

### States

### Parallelism & Superposition

### Entanglement

## Quantum, but as a Computer

_How we use superposition for calculations, probably focus on Nuetral Atom QPUs_

The ability to manipulate and measure quantum phenomena is an incredibly impressive feat on its own. Even just by understanding those principles there are countless real world applications without the need for quantum logic -- for example, fiber optics, MRI, and quantum resistant security (ALL NEEDS CITATION AND FACT CHECKING). But what if we want to use these for logical computations? Welcome to quantum computing!

### Uses

### Bra-Ket notation

### Construction

### Measurement

## Actually Doing Things With Quantum Computing

_How does a quantum computer use qubits to calculate data?_
z### Quantum Gate Universality Theorem

Okay, that's quite a long name so let's break it down into pieces.

**Quantum Gate:** A quantum gate is an individual transformation performed on at least one qubit. These gates are used together to create **quantum circuits**. You can think of them in two ways: 1) a mathematical transformation (as a matrix) applied to the state of the system, and 2) a physical transformation (like shooting a laser at an electron) that mirrors the mathematical transformation.

**Universality Theorem:** The theorem stats that so long as your computer can perform two specific types of gates, it can run theoretically any quantum circuit. To be more specific, those two kinds of gates are: 1) a single-qubit gate, and 2) an entangling gate (acts on two or more qubits).

### Common Gates

#### NOT (Pauli-X)

$X=\begin{bmatrix}0&1\\1&0\end{bmatrix}$

A Not gate does pretty much just that! It inverts the state of the qubit. For instance, a state of $|1\rangle$ would be transformed into a state of $|0\rangle$.

#### Hadamard

$H=\frac{1}{\sqrt{2}}\begin{bmatrix}1&1\\1&-1\end{bmatrix}$

The Hadamard gate puts the qubit it acts upon into a superposition of states. For instance, a state of $|1\rangle$ would be transformed into a state of $\frac{1}{\sqrt{2}}|0\rangle+\frac{1}{\sqrt{2}}|1\rangle$. This is quite possibly the most used gate in all of quantum computing; I mean, we almost always have to set the system into a superposition as the first step of a calculation!

#### CNOT

$CNOT=\begin{bmatrix}1&0&0&0\\0&1&0&0\\0&0&0&1\\0&0&1&0\end{bmatrix}$

A Controlled Not gate (C-Not) is an _entangling_ gate that flips the target qubit given that the control qubit was in the $|1\rangle$ state. C-Not doesn't always entangle, but its capability of entangling makes it still valid for the Quantum Gate Universality Theorem.

#### RZ

$R_Z(\theta)=\begin{bmatrix}e^{-i\frac{\theta}{2}}&0\\0&e^{i\frac{\theta}{2}}\end{bmatrix}$

The Z-Rotation gate (RZ) is a _single-qubit_ gate that applies a phase of $\theta$ to a qubit. For instance, a qubit in state $\alpha|0\rangle+\beta|1\rangle$ undergoing a $R_Z(\frac{\pi}{2})$ transformation would result in a state of $e^{-i\frac{\pi}{4}}\alpha|0\rangle+e^{i\frac{\pi}{4}}\beta|1\rangle$ .

#### Gate Translation

_MAYBE NOT NEEDED_
These are all great examples of very math-heavy transformations, but how does this actually work in the real world? Well, due to the Quantum Gate Universality Theorem, if our quantum computer can perform a single-qubit gate and an entangling gate (of any kind, not necessarily those above), then it can perform _any_ gate.

Think of the gates above like a kind of "high-level" set of gates. They are generally easy to read and understand, so we use them to describe our circuits. However, a quantum computer might use different matrices to model how it operates on its qubits. Those other matrices might have "conversions" to these standard gates. Essentially, the gates above compile into the set of operations that a quantum computer physically performs on its qubits.

### Complexity

_MAYBE NOT NEEDED_

#### Width

#### Depth

### Current NISQ-Era Algorithms

## Solving Sudoku, the Cool Way

### Grover's Algorithm

### Classical Reductions

### Pattern Encoding

### Reducing the Number of Auxiliary Qubits

# Sources

1. [Quantum mechanics](https://en.wikipedia.org/wiki/Quantum_mechanics)

## Randomly Jotted down

- [Encoding Strategies to solve Soduko with Quantum Computers](https://elib.dlr.de/193653/1/Abgabe_weiss22.pdf)
