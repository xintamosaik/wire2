import { filterNodes } from "../types/Nodes";
import type { Node } from "../types/Node";
function NodeList({
  nodes,
  setFilter,
  filter,
}: {
  nodes: Node[];
  setFilter: (filter: string) => void;
  filter: string;
}) {
  const filteredNodes = filterNodes(filter, nodes);

  return (
    <section>
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
    </section>
  );
}

export default NodeList;
