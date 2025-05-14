class Node {
    constructor(id) {
        this.id = id
        
        this.next = new Set();
    }

    addNext(id) {
        this.next.add(id);
    }

}

function dfsNonRecursive(node) {
    let stack = []; // empty here
    let visited = new Set(); // empty here
    stack.push(node); // stack gets the first node and length is 1
    while (stack.length > 0) {
        let currentNode = stack.pop(); // stack gets the last node and length is 0
        if (visited.has(currentNode.id)) { // if we have already visited this node
            // we don't want to visit it again. It would be a cycle
            // continue; // we don't want to visit it again
            throw new Error("Cycle detected");
        }
        visited.add(currentNode.id);
        console.log(currentNode.id);
        for (let nextId of currentNode.next) {
            stack.push(nodes[nextId]);
        }
    }

    return visited;
}

// const visited2 = dfsNonRecursive(nodes[0]);
// console.log("Visited nodes non recursive:", visited2); // 0, 1, 3, 2



function dfsNonRecursiveWithCycleDetection(node, nodes) {
    let stack = []; // starts empty as before
    let visited = new Set(); // Tracks visited nodes. Starts empty
    let activePath = new Set(); // Tracks nodes in the current traversal path

    stack.push(node); // Push the starting node onto the stack

    while (stack.length > 0) {
        let currentNode = stack.pop(); // Pop the last node from the stack

        if (activePath.has(currentNode.id)) {
            throw new Error("Cycle detected");
        }

        if (!visited.has(currentNode.id)) {
            visited.add(currentNode.id);
            activePath.add(currentNode.id);

            for (let nextId of currentNode.next) {
                stack.push(nodes[nextId]);
            }

            activePath.delete(currentNode.id); // Remove from active path after processing
        }
    }

    return visited;
}

let nodes = [];
let n = 7;
for (let i = 0; i < n; i++) {
    let node = new Node(i);
    nodes.push(node);
    console.log(node);
}

// Test 1: Directed Acyclic Graph (DAG)
let nodes1 = [];
for (let i = 0; i < 5; i++) {
    nodes1.push(new Node(i));
}
nodes1[0].addNext(1);
nodes1[0].addNext(2);
nodes1[1].addNext(3);
nodes1[3].addNext(4);

let visited1 = dfsNonRecursiveWithCycleDetection(nodes1[0], nodes1);
console.assert(
    Array.from(visited1).toString() === [0, 1, 3, 4, 2].toString(),
    "Test 1 Failed: Expected [0, 1, 3, 4, 2], got " + Array.from(visited1)
);

// Test 2: Graph with a Cycle
let nodes2 = [];
for (let i = 0; i < 4; i++) {
    nodes2.push(new Node(i));
}
nodes2[0].addNext(1);
nodes2[1].addNext(2);
nodes2[2].addNext(3);
nodes2[3].addNext(0); // Cycle: 3 -> 0

try {
    dfsNonRecursiveWithCycleDetection(nodes2[0], nodes2);
    console.assert(false, "Test 2 Failed: Expected cycle detection error");
} catch (e) {
    console.assert(
        e.message === "Cycle detected",
        "Test 2 Failed: Expected 'Cycle detected', got " + e.message
    );
}

// Test 3: Single Node Graph
let singleNode = new Node(0);
let visited3 = dfsNonRecursiveWithCycleDetection(singleNode, [singleNode]);
console.assert(
    Array.from(visited3).toString() === [0].toString(),
    "Test 3 Failed: Expected [0], got " + Array.from(visited3)
);

// Test 4: Disconnected Graph
let nodes4 = [];
for (let i = 0; i < 3; i++) {
    nodes4.push(new Node(i));
}
nodes4[0].addNext(1);
let visited4 = dfsNonRecursiveWithCycleDetection(nodes4[0], nodes4);
console.assert(
    Array.from(visited4).toString() === [0, 1].toString(),
    "Test 4 Failed: Expected [0, 1], got " + Array.from(visited4)
);

console.log("All tests passed!");