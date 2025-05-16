import type { Node } from '../types/Node'
function NodeGraph({
  nodes
}: {
  nodes: Node[]
}
) {
  console.log(nodes)
  
  return (
    <div>
      <h1>Node Graph</h1>
      <div id="node-graph">
       
      </div>
    </div>
  );
}
export default NodeGraph;