import type { Node } from "../types/Node.tsx";

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
  function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.borderColor = "#646cff";
  }

  const activeColor = disconnected ? "grey" : "white";
  const borderColor = markedNode === node.id ? "yellow" : activeColor;
    function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.borderColor =  borderColor;
  }
  const style = {
    fontFamily: "monospace",
    border: "1px solid " + borderColor,
    padding: "1rem",
    borderRadius: "5px",
    cursor: "pointer",
  };
  return (
    <div 
    className="node" 
    style={style} 
    onClick={() => onMark(node.id)}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    >
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
export default NodeCard;
