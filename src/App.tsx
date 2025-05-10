import './App.css'
import { useState } from 'react'
interface Node {
  id: string
  label: string
  connections: string[]
}
function saveToLocalStorage(nodes: Node[]) {
  localStorage.setItem('nodes', JSON.stringify(nodes))
}

function loadFromLocalStorage(): Node[] {
  const nodes = localStorage.getItem('nodes')
  if (nodes) {
    return JSON.parse(nodes)
  }
  return []
}
function getUUID() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
const initialNodes: Node[] = [
  { id: getUUID(), label: 'unnamed', connections: [] },
  { id: getUUID(), label: 'unnamed', connections: [] },
  { id: getUUID(), label: 'unnamed', connections: [] },
]
function App() {
  const [nodes, setNodes] = useState<Node[]>(loadFromLocalStorage().length ? loadFromLocalStorage() : initialNodes)
  return (
    <>
      <h1>Wire2</h1>
      <button onClick={() => {
        saveToLocalStorage(nodes)
        
      }}>Save</button>

      {nodes.map((node) => (
        <div key={node.id} className="node">

          <h2>{node.label}</h2>
          <h3>{node.id}</h3>
          <p>Connections: {node.connections.join(', ')}</p>
        </div>
      ))}
      <button onClick={() => setNodes([...nodes, { id: getUUID(), label: `unnamed`, connections: [] }])}>
        Add Node
      </button>

    </>
  )
}

export default App
