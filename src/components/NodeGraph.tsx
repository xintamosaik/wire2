import type { Node } from '../types/Node.ts'


type Coordinate = {
  x: number
  y: number
}

type Line = {
  start: Coordinate
  end: Coordinate
}
type LayoutNode = {
  id: string
  level: number
  index: number
  children: string[]
  parents: string[]
}

const spacingX = 120
const spacingY = 100
const nodeSize = 30

const SvgHeight = ({ layout }: { layout: Record<string,LayoutNode>}) => Math.max(...Object.values(layout).map(n => n.level)) * spacingY + 100

const computeLayout = (nodes: Node[], start: string): Record<string, LayoutNode> => {

  const layout: Record<string, LayoutNode> = {}
  const visited = new Set<string>()
  const queue: Array<{ id: string; level: number }> = [{ id: start, level: 0 }]

  while (queue.length > 0) {
    const currentNode = nodes.find(node => node.id === queue[0].id)
 
    const { id, level } = queue.shift()!
    if (visited.has(id)) continue
    visited.add(id)

    const children = currentNode?.connections ? Array.from(currentNode.connections) : []


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
  for (const [, ids] of Object.entries(levels)) {

    ids.sort() // optional: makes layout stable
    ids.forEach((id, i) => {
      layout[id].index = i
    })
  }


  return layout
}

const getXY = ({layout, node}:{layout: Record<string,LayoutNode>, node: LayoutNode}) => {
  const levelNodes = Object.values(layout).filter(n => n.level === node.level)
  const totalWidth = (levelNodes.length - 1) * spacingX
  const offsetX = (800 - totalWidth) / 2 // Center within 800px
  const x = offsetX + node.index * spacingX
  const y = 50 + node.level * spacingY
  return { x, y }
}


function NodeGraph({ nodes }: { nodes: Node[] }) {

  const start = nodes[0]?.id || ''
  const layout = computeLayout(nodes, start)
  console.log('layout', layout) // {mam6lhoatcu9pnxu6jl: {…}, mam6lhoatcu9pnxu6jl: {…}, mam6lhoatcu9pnxu6jl: {…}, mam6lhoatcu9pnxu6jl: {…}}
  const svgHeight = SvgHeight({ layout })



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
            markerWidth="4"
            markerHeight="4"
            refX="6"
            refY="2"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M 0 0 L 4 2 L 0 4 Z"
              fill="white"
              stroke="white"
              strokeWidth="0.2"

            />
          </marker>
        </defs>


   
        {Object.values(layout).flatMap((node) =>
          node.children.map((childId) => {
            const from = getXY({ layout, node })
            const to = getXY({ layout, node: layout[childId] })
            return (
              <Edge
                key={`${node.id}-${childId}`}
                start={{ x: from.x + nodeSize / 2, y: from.y + nodeSize / 2 }}
                end={{ x: to.x + nodeSize / 2, y: to.y + nodeSize / 2 }}
              />
            )
          })
        )}

        {/* Nodes */}
        {Object.values(layout).map((node) => {
          const { x, y } = getXY( {layout, node})
          return <Node key={node.id} coordinate={{x,y}} label={node.id} size={nodeSize} />
        })}
      </svg>
    </div>
  )
}




const Node = ({ coordinate, label, size }: { coordinate: Coordinate; label: string; size: number }) => (
  <>
    <rect x={coordinate.x} y={coordinate.y} width={size} height={size} fill="teal" stroke="white" rx="5" />
    <text
      x={coordinate.x + size / 2}
      y={coordinate.y + size / 2 + 4}
      textAnchor="middle"
      fill="white"
      fontSize="12"
      fontFamily="Arial"
    >
      {label}
    </text>
  </>
)



/**
 * 
 * @param 
 * @returns 
 */
const Edge = (line: Line) => (
  <line
    x1={line.start.x}
    y1={line.start.y + 20}
    x2={line.end.x}
    y2={line.end.y + 20}
    stroke="white"
    strokeWidth={2}
    markerEnd="url(#arrowhead)"
  />
)

export default NodeGraph;