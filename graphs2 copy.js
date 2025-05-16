const nodes = {
    a: ['b', 'c'],
    b: ['c', 'd'],
    c: ['e'],
    d: [],
    e: [],
}

function dfs(nodes, source) {
    console.log(source);
    for ( let neighbor of nodes[source]) {
        dfs(nodes, neighbor);
    };
    
 
  
}

//dfs(nodes, 'a');

const visited = new Set();

const stack = ['a'];
while (stack.length > 0) {
    const node = stack.pop();
    if (!visited.has(node)) {
        visited.add(node);
        console.log(node);
        for (let neighbor of nodes[node]) {
            stack.push(neighbor);
        }
    }
}

console.log(visited);