import './App.css'
import { useState, useEffect } from 'react'

interface Node {
  id: string
  label: string
  connections: Set<string>
}

function saveNodesToLocalStorage(nodes: Node[]) {
  const converted = nodes.map(node => ({
    ...node,
    connections: Array.from(node.connections),
  }))

  localStorage.setItem('nodes', JSON.stringify(converted))
}

function getLocalNodes(): Node[] {

  const nodes = localStorage.getItem('nodes')
  if (!nodes) {
    return []
  }

  return JSON.parse(nodes).map((node: Node) => ({
    ...node,
    connections: node.connections ? new Set<string>(node.connections) : new Set<string>(),
  }));
}

function generateUUID() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function createEmptyNode(): Node {
  return {
    id: generateUUID(),
    label: 'unnamed',
    connections: new Set(),
  }
}

function App() {

  const [nodes, setNodes] = useState<Node[]>(getLocalNodes())
  const [markedNode, setMarkedNode] = useState<string | null>(null)

  useEffect(() => {
    saveNodesToLocalStorage(nodes);
  }, [nodes]);

  function handleMark(id: string) {
    if (!markedNode) {
      setMarkedNode(id)
      return;
    }

    if (markedNode === id) {
      setMarkedNode(null)
      return;
    }

    const updated = nodes.map((entry) => {
      if (markedNode === entry.id) {
        return {
          ...entry,
          connections: new Set([...entry.connections, id]),
        }
      }
      return entry
    })

    setNodes(updated)
    setMarkedNode(null)
  }

  return (
    <>
      <h1>Wire2</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>

        <button onClick={() => setNodes([])}>
          Clear
        </button>

        <button onClick={() => setNodes([...nodes, createEmptyNode()])}>
          Add Node
        </button>

      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
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
  )
}

function NodeCard(
  { node, markedNode, onMark }: {
    node: Node
    markedNode: string | null
    onMark: (id: string) => void
  }
) {
  const connections = node.connections.size
  const disconnected = connections === 0
  console.log('connections', connections)
  console.log('hasConnections', disconnected)
  const activeColor = disconnected ? 'grey' : 'white'
  const borderColor = markedNode === node.id ? 'yellow' : activeColor
  const style = {
    fontFamily: "monospace",
    border: '1px solid ' + borderColor,
    padding: '1rem',
    borderRadius: '5px'
  }
  return (
    <div className="node" style={style} onClick={() => onMark(node.id)}>
      <h2 style={{color: borderColor}}>{node.id}</h2>
      { disconnected ? <h3 style={{ color: 'grey'}}> Disconnected</h3> :
        <h3 style={{ color: 'green' }}>
          {connections} connections
        </h3>
      }

      <ul>
        {Array.from(node.connections).map((connection) => (
          <li key={"li_" + connection}>{connection}</li>
        ))}
      </ul>
    </div>
  )

}
export default App
