"use client"
import { Group } from "@visx/group"
import { Pie } from "@visx/shape"
import { ParentSize } from "@visx/responsive"
import type { BoxPlotDatum } from "@/lib/data"

export interface VisxDonutChartProps {
  data: BoxPlotDatum[]
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

interface DonutSegment {
  label: string
  value: number
  color: string
  isActive: boolean
}

function DonutChartSvg({
  data,
  width,
  height,
  margin = { top: 20, right: 24, bottom: 20, left: 24 },
}: VisxDonutChartProps & {
  width: number
  height: number
}) {
  const categoryColorByLabel: Record<string, string> = {
    "Clinical Expertise": "#E63946",
    Communication: "#F77F00",
    "Treatment Results": "#FCBF49",
    "Bedside Manner": "#06A77D",
    "Trust & Safety": "#118AB2",
    Environment: "#073B4C",
    Personalization: "#9B59B6",
    "Post-Care": "#E91E63",
    Professionalism: "#2E7D32",
    "Staff Support": "#00BCD4",
    "Value & Transparency": "#FF6F00",
    "Pain Management & Comfort": "#8B4789",
    "Anxiety & Nervousness Management": "#7CB342",
    "Booking & Accessibility": "#FFB300",
    "Honesty & Realistic Expectations": "#5C6BC0",
    "Long-term Relationship & Loyalty": "#D32F2F",
  }

  const categoryColorFor = (label: string) => categoryColorByLabel[label] ?? "#888888"
    const skip =["Clinical Expertise",
        "Treatment Results",
        "Environment",
        "Staff Support",
        ] 
  const getDonutSegments = (d: BoxPlotDatum): DonutSegment[] => {
    const percentage = (30*d.item.weighted_score/d.stats.max)+70
    const baseColor = categoryColorFor(d.label)

    return [
      { label: d.label, value: percentage, color: baseColor, isActive: true },
      { label: d.label, value: 100 - percentage, color: "#E5E7EB", isActive: false },
    ]
  }
  const filtered_data = data.filter(d => skip.includes(d.label))


  return (
    <svg width={width} height={height} role="img" aria-label="Percentage donut charts">
      {filtered_data.map((d, idx) => {
   
        const segments = getDonutSegments(d)

        // Calculate grid position
        const cols = filtered_data.length
        const col = idx % cols
        const row = Math.floor(idx / cols)
        const cellWidth = width / cols
        const cellHeight = (height / Math.ceil(filtered_data.length / cols))*0.8
        const centerX = cellWidth * col + cellWidth / 2
        const centerY = cellHeight * row + cellHeight / 2
        const chartRadius = Math.min(cellWidth, cellHeight) / 2 - 20

        return (
          <Group key={d.key} left={centerX} top={centerY}>
            <Pie
              data={segments}
              pieValue={(d) => d.value}
              outerRadius={chartRadius}
              innerRadius={chartRadius * 0.65}
              cornerRadius={4}
              padAngle={0}
            >
              {(pie) => {
                return pie.arcs.map((arc, arcIdx) => {
                  const segment = segments[arcIdx]

                  return (
                    <path
                      key={`arc-${arcIdx}`}
                      d={pie.path(arc) || ""}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth={2}
                      aria-label={`${segment.label} ${segment.isActive ? "filled" : "empty"}`}
                    />
                  )
                })
              }}
            </Pie>

            {/* Percentage text in center */}
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dy="0.33em"
              fill="var(--color-foreground)"
              fontSize={24}
              fontWeight="bold"
            >
              {((30*d.item.weighted_score/d.stats.max)+70).toFixed(0)}%
              
            </text>

            {/* Category label below */}
            <text
              x={0}
              y={chartRadius + 30}
              textAnchor="middle"
              fill="var(--color-foreground)"
              fontSize={12}
              fontWeight={500}
            >
              {d.label}
            </text>
          </Group>
        )
      })}
    </svg>
  )
}

export default function VisxDonutChart({ data, height = 600, margin }: VisxDonutChartProps) {
  return (
    <div className="w-full rounded-lg border bg-card p-4" style={{ borderColor: "var(--color-border)" }}>
      <div style={{ width: "100%", height, position: "relative" }}>
        <ParentSize>
          {({ width, height }) => <DonutChartSvg data={data} width={width} height={height} margin={margin} />}
        </ParentSize>
      </div>
    </div>
  )
}
