import { useState, useEffect } from "react";
import NodeGrid from "./components/NodeGrid.tsx";
import NodeList from "./components/NodeList.tsx";

import type { Node } from "./types/Node.ts";
import {
  saveNodesToLocalStorage,
  getLocalNodes,
  createEmptyNode,
  filterNodes,
  getLinks,
} from "./types/Nodes.ts";
import ForceGraph from "./components/ForceGraph.tsx";

function App() {
  const [nodes, setNodes] = useState<Node[]>(getLocalNodes());
  const [markedNode, setMarkedNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    saveNodesToLocalStorage(nodes);
  }, [nodes]);

  const filteredNodes = filterNodes(filter, nodes);

  const links = getLinks(nodes);

  function isThereCyclicConnections(nodes: Node[]) {
    const visited = new Set<string>();
    const stack = new Set<string>();
    const dfs = (node: Node): boolean => {  
      if (stack.has(node.id)) return true; // Cycle detected
      if (visited.has(node.id)) return false; // Already visited

      visited.add(node.id);
      stack.add(node.id);

      for (const connection of node.connections) {
        const connectedNode = nodes.find((n) => n.id === connection);
        if (connectedNode && dfs(connectedNode)) {
          return true;
        }
      }

      stack.delete(node.id);
      return false;
    };

    for (const node of nodes) {
      if (dfs(node)) {
        return true;
      }
    }
    return false;
  }

  function handleMark(id: string) {
    if (!markedNode) {
      setMarkedNode(id);
      return;
    }

    if (markedNode === id) {
      setMarkedNode(null);
      return;
    }
    

    const simulated = nodes.map((entry) => {
      if (markedNode === entry.id) {
        return {
          ...entry,
          connections: new Set([...entry.connections, id]),
        };
      }
      return entry;
    });

    const cyclicDetected = isThereCyclicConnections(simulated);
    if (cyclicDetected) {
      alert("Cyclic connection detected!");
      return;
    }

    setNodes(simulated);
    setMarkedNode(null);
  }
  return (
    <>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button onClick={() => setNodes([])}>Clear</button>

        <button onClick={() => setNodes([...nodes, createEmptyNode()])}>
          Add Node
        </button>
      </div>


      <NodeList
        nodes={nodes}
        setFilter={setFilter}
        filter={filter}
      ></NodeList>


      <NodeGrid
        nodes={filteredNodes}
        markedNode={markedNode}
        handleMark={handleMark}
      ></NodeGrid>

      <ForceGraph
        nodes={nodes}
        links={links}
      ></ForceGraph>



    </>
  );
}

export default App;