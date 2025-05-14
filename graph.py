class Node:
    def __init__(self, id):
        self.id = id
        self.next = set()

    def add_next(self, id):
        self.next.add(id)

    def __repr__(self):
        return f"Node({self.id}, next={self.next})"

nodes = [Node(i) for i in range(7)]

nodes[0].add_next(1)
nodes[1].add_next(3)
nodes[3].add_next(5)
nodes[5].add_next(6)
nodes[6].add_next(0)
nodes[6].remove_next(0)

print(nodes[6])

def dfs(node):
    stack = []
    visited = set()

    stack.append(node)
    while stack:
        current_node = stack.pop()

        if current_node.id in visited:
            raise Exception("Cycle detected")
        
        visited.add(current_node.id)
        
        print(current_node.id)
        
        for next_id in current_node.next:
            stack.append(nodes[next_id])

    return visited

try:
    visited = dfs(nodes[0])
    print("Visited nodes:", visited)
except Exception as e:
    print(e)

