"use server"

// This is effectively a static singleton, and since those don't exist in Javascript, I am leaving it with what
// Javascript is good with: modules

interface Topic {
    id: string,
    parent: string,
    name: string;
    resources: {
        url: string
    }[]
}

interface TopicNode {
    topic: Topic,
    children: TopicNode[]
}

// I'm both lazy and like overcomplicating my code. I want to have a simple list that maps into a tree
// since trees in code look awfully indented...
const topicList: Topic[] = []

// Map the topics to [parent]: Topic
const topicMap: Record<string, Topic[]> = function() {
    const map: Record<string, Topic[]> = {};

    // Add topic to list under key
    for (const topic of topicList) {
        map[topic.parent] = [...(map[topic.parent] || []), topic]
    }

    return map;
}();

// Map topicMap into a tree based on parents
const rootNodes: TopicNode[] = [];
for (const topic of topicMap["none"]) {
    const tree = buildTree(topic);
    rootNodes.push(tree);
} 

function buildTree(parent: Topic): TopicNode {
    const node: TopicNode = {
        topic: parent,
        children: []
    }

    const children = topicMap[parent.id];
    if (children) {
        for (const child of children) {
            node.children.push(buildTree(child));
        }
    }

    return node;
}

