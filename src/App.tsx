type Node = Array<string>
type Nodes = Record<string, Node>

type LayoutNode = {
  id: string
  level: number
  index: number
  children: string[]
  parents: string[]
}

const computeLayout = (nodes: Nodes, start: string): Record<string, LayoutNode> => {
  const layout: Record<string, LayoutNode> = {}
  const visited = new Set<string>()
  const queue: Array<{ id: string; level: number }> = [{ id: start, level: 0 }]

  while (queue.length > 0) {
    const { id, level } = queue.shift()!
    if (visited.has(id)) continue
    visited.add(id)

    const children = nodes[id] || []

    layout[id] = {
      id,
      level,
      index: 0,
      children,
      parents: layout[id]?.parents || []
    }

    for (const child of children) {
      layout[child] = layout[child] || {
        id: child,
        level: level + 1,
        index: 0,
        children: [],
        parents: []
      }
      layout[child].parents.push(id)
      queue.push({ id: child, level: level + 1 })
    }
  }

  // Assign horizontal index per level (but centered)
  const levels: Record<number, string[]> = {}
  for (const node of Object.values(layout)) {
    levels[node.level] = levels[node.level] || []
    levels[node.level].push(node.id)
  }

  // Sort each level for consistent order, then assign index
  for (const [levelStr, ids] of Object.entries(levels)) {
    const level = parseInt(levelStr)
    ids.sort() // optional: makes layout stable
    ids.forEach((id, i) => {
      layout[id].index = i
    })
  }


  return layout
}

const App = () => {
  const nodes: Nodes = {
    a: ['b'],
    b: ['c', 'd'],
    c: ['e', 'f', 'g'],
    d: ['f', 'g', 'h'],
    e: [],
    f: [],
    g: [],
    h: []
  }

  const start = 'a'
  const layout = computeLayout(nodes, start)

  const spacingX = 120
  const spacingY = 100
  const nodeSize = 30

  const getXY = (node: LayoutNode) => {
    const levelNodes = Object.values(layout).filter(n => n.level === node.level)
    const totalWidth = (levelNodes.length - 1) * spacingX
    const offsetX = (800 - totalWidth) / 2 // Center within 800px
    const x = offsetX + node.index * spacingX
    const y = 50 + node.level * spacingY
    return { x, y }
  }

  const svgHeight = Math.max(...Object.values(layout).map(n => n.level)) * spacingY + 100

  return (
    <div>
      <svg
        width="800"
        height={svgHeight}
        viewBox={`0 0 800 ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ border: '1px solid black' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="6"
            markerHeight="6"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M 0 0 L 6 3 L 0 6 Z"
              fill="white"
              stroke="white"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          </marker>
        </defs>


        {/* Edges */}
        {Object.values(layout).flatMap((node) =>
          node.children.map((childId) => {
            const from = getXY(node)
            const to = getXY(layout[childId])
            return (
              <Edge
                key={`${node.id}-${childId}`}
                x1={from.x + nodeSize / 2}
                y1={from.y + nodeSize / 2}
                x2={to.x + nodeSize / 2}
                y2={to.y + nodeSize / 2}
              />
            )
          })
        )}

        {/* Nodes */}
        {Object.values(layout).map((node) => {
          const { x, y } = getXY(node)
          return <Node key={node.id} x={x} y={y} label={node.id} size={nodeSize} />
        })}
      </svg>
    </div>
  )
}

const Node = ({ x, y, label, size }: { x: number; y: number; label: string; size: number }) => (
  <>
    <rect x={x} y={y} width={size} height={size} fill="teal" stroke="white" rx="5" />
    <text
      x={x + size / 2}
      y={y + size / 2 + 4}
      textAnchor="middle"
      fill="white"
      fontSize="12"
      fontFamily="Arial"
    >
      {label}
    </text>
  </>
)

const Edge = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
  <line
    x1={x1}
    y1={y1 + 20}
    x2={x2}
    y2={y2 - 20}
    stroke="white"
    strokeWidth={2}
    markerEnd="url(#arrowhead)"
  />
)

export default App
