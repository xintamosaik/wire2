import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
interface Node {
    id: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

interface Link {
    source: string | Node;
    target: string | Node;
}
interface Props {
    nodes: Node[];
    links: Link[];
}

const ForceGraph: React.FC<Props> = ({ nodes, links }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const simulationRef = useRef<d3.Simulation<Node, undefined> | null>(null); // Add this
    const restartRef = useRef<(() => void) | null>(null); // Add this

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = window.innerWidth;
        const height = window.innerHeight;

        svg.selectAll("*").remove(); // Clear previous renders

        // Marker
        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 20)
            .attr("refY", 0)
            .attr("markerWidth", 10)
            .attr("markerHeight", 120)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#a3e");

        const simulation = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(120))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("radial", d3.forceRadial(Math.min(width, height) / 3, width / 2, height / 2).strength(0.05));

        simulationRef.current = simulation; // Store simulation in ref

        const link = svg.append("g")
            .attr("stroke", "#a3e")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("marker-end", "url(#arrow)");

        const node = (svg.append("g")
            .attr("stroke", "#3e3")
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 10) as d3.Selection<SVGCircleElement, Node, SVGGElement, unknown>)
            .call(drag(simulation));

        const label = svg.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .attr("dy", -15)
            .attr("font-size", 12)
            .attr("font-family", "sans-serif")
            .attr("fill", "white")
            

        simulation.on("tick", () => {
            link
                .attr("x1", d => (d.source as Node).x!)
                .attr("y1", d => (d.source as Node).y!)
                .attr("x2", d => (d.target as Node).x!)
                .attr("y2", d => (d.target as Node).y!);

            node
                .attr("cx", d => {
                    // Clamp x to stay within [radius, width-radius]
                    d.x = Math.max(10, Math.min(width - 10, d.x!));
                    return d.x!;
                })
                .attr("cy", d => {
                    // Clamp y to stay within [radius, height-radius]
                    d.y = Math.max(10, Math.min(height - 10, d.y!));
                    return d.y!;
                });

            label
                .attr("x", d => d.x!)
                .attr("y", d => d.y!);
        });
        function restart() {
            simulation.nodes(nodes);
            simulation.force<d3.ForceLink<Node, Link>>("link")!.links(links);
            simulation.alpha(1).restart();
        }
        restartRef.current = restart; // Store restart in ref

        function drag(simulation: d3.Simulation<Node, undefined>) {
            return d3.drag<SVGCircleElement, Node>()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                });
        }

    }, [nodes, links]);

    return (
        <>
        <div>
           <button
                onClick={() => {
                   
               
      
                    if (restartRef.current) restartRef.current(); // Call restart here
                }}
            >
                Reset Simulation
            </button>
        </div>
        <svg ref={svgRef} width="1000" height="1000"  style={{border: "1px solid hotpink", margin: "1rem 0", width: "100%"}} />
        </>
    );
};

export default ForceGraph;
