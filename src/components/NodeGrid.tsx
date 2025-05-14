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
    <section>
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
    </section>
  );
}

export default NodeGrid;
