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

