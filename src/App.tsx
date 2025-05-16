type Node = Array<string>
type Nodes = Record<string, Node>

function App() {

  const nodes = {
    a: ['b',],
    b: ['c', 'd'],
    c: ['e', 'f', 'g'],
    d: ['f', 'g', 'h'],
    e: [],
    f: [],
    g: [],
    h: [],
  } as Nodes
  const start = 'a'

  const edges = []

  const visited = new Set()
  const queue = [start]
  visited.add(start)
  while (queue.length > 0) {
    const node = queue.shift()
    if (!node) {
      break
    }
    const neighbors = nodes[node]
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
        edges.push([node, neighbor])
      }
    }
  }

  const node = <rect
    x={400 - 10}
    y={0}
    width={20}
    height={20}
    fill="teal"
    stroke="white"
  />
  const arrow = <path d="M 0 0 L 10 10 L 20 0" fill="none" stroke="white" />
  console.log(edges)
  const height = edges.length * 20
  return (
    <div>

      <svg width="800" height={height} viewBox={'0 0 800 ' + height} xmlns="http://www.w3.org/2000/svg" style={{ border: '1px solid black' }}>
        <Node x={400 - 10} y={0} />
        <Edge x1={400} y1={20} x2={400} y2={40} />
        <Node x={400 - 10} y={40} />
        <Edge x1={400} y1={60} x2={340} y2={80} />
        <Node x={400 + 50} y={80} />
        <Edge x1={400} y1={60} x2={460} y2={80} />
        <Node x={400 - 70} y={80} />

      </svg>
    </div>
  );
}

export default App;
const Edge = ({ x1, y1, x2, y2 }: { x1: number, y1: number, x2: number, y2: number }) => {
  return (
    <g>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        fill="none"
        stroke="white"
      />
      <path
        d={`M ${x2} ${y2} L ${x2 - 10} ${y2 - 10} L ${x2 + 10} ${y2 - 10}`}
        fill="none"
        stroke="white"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
        </marker>
      </defs>



    </g>
  )
}
const Node = ({ x, y }: { x: number, y: number }) => {
  return (
    <rect
      x={x}
      y={y}
      width={20}
      height={20}
      fill="teal"
      stroke="white"
    />
  )
}