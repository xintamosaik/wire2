import type { Node } from "./Node.tsx";

function saveNodesToLocalStorage(nodes: Node[]) {
    const converted = nodes.map((node) => ({
        ...node,
        connections: Array.from(node.connections),
    }));

    localStorage.setItem("nodes", JSON.stringify(converted));
}

function getLocalNodes(): Node[] {
    const nodes = localStorage.getItem("nodes");
    if (!nodes) {
        return [];
    }

    return JSON.parse(nodes).map((node: Node) => ({
        ...node,
        connections: node.connections
            ? new Set<string>(node.connections)
            : new Set<string>(),
    }));
}
// We want very short UUIDs, let's just use the timestamp and generate a 4 digit alphanumeric string
function generateUUID() {
    return (
           Date.now().toString(36).substring(2, 6) +
        Math.random().toString(36).substring(2, 6)
     
    ).toUpperCase();
}

function createEmptyNode(): Node {
    return {
        id: generateUUID(),
        label: "unnamed",
        connections: new Set(),
    };
}

function nodeIsConnected(nodes: Node[], id: string) {
    return nodes.some((node) => node.connections.has(id));
}


function filterNodes(filter: string, nodes: Node[]) {
    if (filter === "disconnected") {
        return nodes.filter((node) => node.connections.size === 0 && !nodeIsConnected(nodes, node.id));
    }
    if (filter === "connected") {
        return nodes.filter((node) => node.connections.size > 0 || nodeIsConnected(nodes, node.id));
    }
    return nodes;
}

export {
    saveNodesToLocalStorage,
    getLocalNodes,
    generateUUID,
    createEmptyNode,
    nodeIsConnected,
    filterNodes,
};
