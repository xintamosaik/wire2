import NodeCard from "./NodeCard";
import type { Node } from "../types/Node";

function NodeGrid({
  nodes,
  markedNode,
  handleMark,
}: {
  nodes: Node[];
  markedNode: string | null;
  handleMark: (id: string) => void;
}) {
  return (
    <section style={{  display: "flex", flexDirection: "column"  }}>
      <h1>Grid</h1>

      <div
        style={{
          
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
    </section>
  );
}

export default NodeGrid;
