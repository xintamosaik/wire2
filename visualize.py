nodes = {
    'a': ['b',],
    'b': ['c', 'd'],
    'c': ['e', 'f', 'g'],
    'd': ['f', 'g', 'h'],
    'e': [],
    'f': [],
    'g': [],
    'h': [],
}


queue = ['a']
step = 0

while queue:
    node = queue.pop(0) # this removes the first element from the queue
    step += 1
    print("------")
    print("Step:", step)
    print("Queue:", queue)
    print("Node:", node)
    print("Neighbors:", nodes[node])
    neighbors = nodes[node]
    queue.extend(neighbors) # this adds the neighbors to the queue

print("Queue after adding neighbors:", queue)

html = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<svg width="2000" height="2000">
"""
queue = ['a']
max_width = 2000
step_height = 50
step = 0
while queue:
    node = queue.pop(0) # this removes the first element from the queue
    step += 1
    neighbors = nodes[node]

    
        
    queue.extend(neighbors) # this adds the neighbors to the queue

html += """
</svg>
</body>
</html>
"""

with open("graph.html", "w") as f:
    f.write(html)
print("Graph saved to graph.html")