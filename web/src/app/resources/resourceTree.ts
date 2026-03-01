interface Resource {
    type: "resource",
    data: string
    parent: string
}

interface Topic {
    type: "topic",
    data: string,
    parent: string
}

const cards: (Resource | Topic)[] = []

export {
    type Resource, type Topic, cards
}