export interface Definition {
    term: string;
    definition: string;
}

export const vocab: { [key: string]: Definition } = {
    "wave-eqn": {
        term: "Wave Equation",
        definition: "An equation that describes the propagation and state of a wave such as light or sound."
    }
}