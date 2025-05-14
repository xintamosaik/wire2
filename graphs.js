class Node {
    constructor(id) {
        this.id = id
        
        this.next = new Set();
    }

    addNext(id) {
        this.next.add(id);
    }

}
let nodes = [];
let n = 7;
for (let i = 0; i < n; i++) {
    let node = new Node(i);
    nodes.push(node);
    console.log(node);
}

nodes[0].addNext(nodes[1].id);
nodes[0].addNext(nodes[2].id);

nodes[1].addNext(nodes[3].id);

console.log(nodes);

function dfs(node, visited) {
    if (visited.has(node.id)) {
        return;
    }
    visited.add(node.id);
    console.log(node.id);
    for (let nextId of node.next) {
        dfs(nodes[nextId], visited);
    }
}

let visited = new Set();

console.log("Visited nodes:", visited);

// cyclic 

nodes[3].addNext(nodes[0].id);
nodes[3].addNext(nodes[5].id);
dfs(nodes[0], visited);
console.log("Visited nodes after cycle:", visited); // 0, 1, 3, 2

// it does not detect cycles. It still works. And it does not loop infinite
// but it will not visit all nodes. Let's test that.
// still not a problem. It will visit all nodes. 
// Why? 

// on the first iteration it visits 0, 
// on the second iteration it visits 1,
// on the third iteration it visits 3,
// on the fourth iteration it visits 2,
// on the fifth iteration it visits 5,

// but .. anyway I don't get it. 

// How does a non recursive function work?

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

let visited3 = dfsNonRecursiveWithCycleDetection(nodes[0], nodes);
console.log("Visited nodes non recursive with cycle detection:", visited3); // 0, 1, 3, 2