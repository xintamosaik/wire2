import { useState, useEffect } from "react";
import NodeGrid from "./components/NodeGrid.tsx";
import NodeList from "./components/NodeList.tsx";
import NodeGraph from "./components/NodeGraph.tsx";
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

  function handleMark(id: string) {
    if (!markedNode) {
      setMarkedNode(id);
      return;
    }

    if (markedNode === id) {
      setMarkedNode(null);
      return;
    }

    const updated = nodes.map((entry) => {
      if (markedNode === entry.id) {
        return {
          ...entry,
          connections: new Set([...entry.connections, id]),
        };
      }
      return entry;
    });

    setNodes(updated);
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

      <NodeGraph nodes={nodes}>
      </NodeGraph>


    </>
  );
}

export default App;