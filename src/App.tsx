import './App.css'
import { useState } from 'react'
interface Node {
  id: string
  label: string
  connections: Set<string>
}
function saveToLocalStorage(nodes: Node[]) {
  const converted = nodes.map(node => ({
    ...node,
    connections: Array.from(node.connections),
  }))
  localStorage.setItem('nodes', JSON.stringify(converted))
  console.log("saved to local storage")
}

function loadFromLocalStorage(): Node[] {
  const nodes = localStorage.getItem('nodes')
  if (nodes) {
     return JSON.parse(nodes).map((node: Node) => ({
      ...node,
      connections: node.connections ? new Set<string>(node.connections) : new Set<string>(),
    }));
  }
  return []
}
function clearLocalStorage() {
  localStorage.removeItem('nodes')
}
function getUUID() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}


const initialNodes: Node[] = [
  { id: getUUID(), label: 'unnamed', connections: new Set() },
  { id: getUUID(), label: 'unnamed', connections: new Set() },
  { id: getUUID(), label: 'unnamed', connections: new Set() },
]
function App() {
  const [nodes, setNodes] = useState<Node[]>(loadFromLocalStorage().length ? loadFromLocalStorage() : initialNodes)
  const [markedNode, setMarkedNode] = useState<string | null>(null)
  return (
    <>
      <h1>Wire2</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => {
          saveToLocalStorage(nodes)

        }}>Save</button>

        <button onClick={() => {
          clearLocalStorage()
          setNodes([])
        }}>Clear</button>

        <button onClick={() => setNodes([...nodes, { id: getUUID(), label: `unnamed`, connections: new Set() }])}>
          Add Node
        </button>


        <output id="currentlyMarkedNodes">
          {markedNode ? `Currently marked node: ${markedNode}` : 'No node marked'}
        </output>
      </div>

      <output style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
        {nodes.map((node) => (
          <div key={node.id} className="node" style={{ fontFamily: "monospace", border: '1px solid white', padding: '1rem', borderRadius: '5px' }}>


            <h2>{node.id}</h2>
            <h3>Connections</h3>

            <button onClick={() => {
              if (!markedNode) {
                setMarkedNode(node.id)
                return;
              }

              if (markedNode === node.id) {
                setMarkedNode(null)
                return;
              }

              nodes.forEach((entry) => {
                if (markedNode === entry.id) {
                  console.log("found marked node")
                  console.log(entry)
                  entry.connections.add(node.id)

                }

              })


              setMarkedNode(null)
              console.log(node.id)

            }}>

              mark for connection
            </button>
            <ul>
              {node.connections.size === 0 ? <li>no connections</li> : null}
              {Array.from(node.connections).map((connection) => (
                <li key={"li_" + connection}>{connection}</li>
              ))}
            </ul>
          </div>
        ))}

      </output>



    </>
  )
}

export default App
