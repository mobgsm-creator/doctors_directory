"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Minimal d3-force without heavy viz libs
import { forceSimulation, forceManyBody, forceCollide, forceX, forceY } from "d3-force"

type NodeDatum = {
  id: string
  label: string
  group: string
  r: number
  x?: number
  y?: number
  vx?: number
  vy?: number
}

type Props = {
  data: Array<{ header: string; keywords: string[] }>
  className?: string
  width?: number
  height?: number
}

export function TagGalaxy({ data, className, width = 800, height = 600 }: Readonly<Props>) {
  const svgRef = React.useRef<SVGSVGElement | null>(null)
  const [nodes, setNodes] = React.useState<NodeDatum[]>([])
  const [hover, setHover] = React.useState<string | null>(null)

  // Prepare nodes
  React.useEffect(() => {
    const all: NodeDatum[] = []
    data.forEach((group, gi) => {
      group.keywords.forEach((k) => {
        // radius by word length, bounded
        const r = Math.max(6, Math.min(16, 6 + k.length * 0.7))
        all.push({
          id: `${group.header}:${k}`,
          label: k,
          group: group.header,
          r,
          x: Math.random() * width,
          y: Math.random() * height,
        })
      })
    })
    setNodes(all)
  }, [data, width, height])

  // Run force simulation
  React.useEffect(() => {
    if (!nodes.length) return
    const groups = Array.from(new Set(nodes.map((n) => n.group)))

    // Map group to gentle columns (spatial clustering)
    const xSlots = groups.map((_, i) => ((i + 0.5) / groups.length) * width)

    const sim = forceSimulation(nodes as any)
      .force("charge", forceManyBody().strength(-16))
      .force(
        "collide",
        forceCollide<NodeDatum>().radius((d) => d.r + 2),
      )
      .force(
        "x",
        forceX<NodeDatum>()
          .x((d) => {
            const idx = groups.indexOf(d.group)
            return xSlots[idx] ?? width / 2
          })
          .strength(0.06),
      )
      .force("y", forceY<NodeDatum>(height / 2).strength(0.06))
      .alpha(0.9)
      .alphaDecay(0.02)
      .on("tick", () => {
        // shallow copy to trigger render
        setNodes((prev) => prev.map((p, i) => ({ ...nodes[i] })))
      })

    return () => {
      sim.stop()
    }
  }, [nodes, width, height]) // Updated to include nodes, width, and height as dependencies

  // Keep palette within 4 hues + neutrals
  function fillFor(group: string) {
    const idx = Array.from(group).reduce((a, c) => a + (c.codePointAt(0) ?? 0), 0) % 4
    return ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-5)"][idx]
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <svg
        width={width}
        height={height}
        className="rounded-xl bg-muted/30 border border-border/50 min-w-[1080px] w-full"
        role="img"
        aria-label="Tag Galaxy"
        
      >
        <g>
          {nodes.map((n) => {
            const isHovered = hover === n.id
            const faded = hover && !isHovered

            return (
              <g
                key={n.id}
                transform={`translate(${(n.x ?? 0)+100}, ${n.y ?? 0})`}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer transition-all duration-200"
                
              >
                <circle
                  r={n.r}
                  fill={fillFor(n.group)}
                  fillOpacity={isHovered ? 1 : faded ? 0.3 : 0.7}
                  stroke="var(--color-border)"
                  strokeOpacity={0.4}
                />
                <text
                  y={-n.r - 2}
                  textAnchor="middle"
                  className="text-[10px] text-wrap"
                  style={{
                    pointerEvents: "none",
                    fontWeight: isHovered ? 700 : 400,
                    fill: faded ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.85)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {n.label}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
