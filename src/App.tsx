import { useState, useEffect } from "react";

interface Node {
  id: string;
  label: string;
  connections: Set<string>;
}

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

function generateUUID() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function createEmptyNode(): Node {
  return {
    id: generateUUID(),
    label: "unnamed",
    connections: new Set(),
  };
}

function filterNodes(filter: string, nodes: Node[]) {
  if (filter === "disconnected") {
    return nodes.filter((node) => node.connections.size === 0);
  }
  if (filter === "connected") {
    return nodes.filter((node) => node.connections.size > 0);
  }
  return nodes;
}

function App() {
  const [nodes, setNodes] = useState<Node[]>(getLocalNodes());
  const [markedNode, setMarkedNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    saveNodesToLocalStorage(nodes);
  }, [nodes]);

  const filteredNodes = filterNodes(filter, nodes);

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

      <br />

      <h1>List</h1>

      <h2>Filters</h2>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button onClick={() => setFilter("disconnected")}>Disconnected</button>
        <button onClick={() => setFilter("connected")}>Connected</button>
        <button onClick={() => setFilter("all")}>All</button>
      </div>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}
      >
        <thead>
          <tr
            style={{ textAlign: "left", borderBottom: "1px solid lightgrey" }}
          >
            <th>ID</th>
            <th>Connections</th>
            <th>Connections List</th>
          </tr>
        </thead>
        <tbody>
          {filteredNodes.map((node) => (
            <tr
              key={node.id}
              style={{
                borderBottom: "1px solid lightgrey",
                padding: "0.5rem",
                textAlign: "left",
              }}
            >
              <td>{node.id}</td>
              <td>{node.connections.size}</td>
              <td>
                {node.connections.size > 0 &&
                  Array.from(node.connections).map((connection: string) => (
                    <span key={connection} style={{ marginRight: "1rem" }}>
                      {connection}
                    </span>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <h1>Grid</h1>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        }}
      >
        {nodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            markedNode={markedNode}
            onMark={handleMark}
          ></NodeCard>
        ))}
      </div>
    </>
  );
}

function NodeCard({
  node,
  markedNode,
  onMark,
}: {
  node: Node;
  markedNode: string | null;
  onMark: (id: string) => void;
}) {
  const connections = node.connections.size;
  const disconnected = connections === 0;

  const activeColor = disconnected ? "grey" : "white";
  const borderColor = markedNode === node.id ? "yellow" : activeColor;
  const style = {
    fontFamily: "monospace",
    border: "1px solid " + borderColor,
    padding: "1rem",
    borderRadius: "5px",
  };
  return (
    <div className="node" style={style} onClick={() => onMark(node.id)}>
      <h2 style={{ color: borderColor }}>{node.id}</h2>
      {disconnected ? (
        <h3 style={{ color: "grey" }}> No connections</h3>
      ) : (
        <h3 style={{ color: "green" }}>{connections} connections</h3>
      )}

      <ul>
        {Array.from(node.connections).map((connection) => (
          <li key={"li_" + connection}>{connection}</li>
        ))}
      </ul>
    </div>
  );
}
export default App;
