"use client"
import { scaleBand, scaleLinear } from "@visx/scale"
import type React from "react"

import { AxisLeft } from "@visx/axis"
import { Group } from "@visx/group"
import { ParentSize } from "@visx/responsive"
import { useTooltip, TooltipWithBounds } from "@visx/tooltip"
import { localPoint } from "@visx/event"
import type { BoxPlotDatum, BoxStats, ItemMeta } from "@/lib/data"

// Simple, accessible visx BoxPlot renderer with overlays for mean and item value
export interface VisxBoxPlotProps {
  data: BoxPlotDatum[]
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

function BoxPlotSvg({
  data,
  width,
  height,
  margin = { top: 20, right: 24, bottom: 72, left: 60 },
  onHover,
  onLeave,
}: VisxBoxPlotProps & {
  width: number
  height: number
  onHover?: (d: BoxPlotDatum, evt: React.MouseEvent<SVGElement, MouseEvent>) => void
  onLeave?: () => void
}) {
  const xMax = Math.max(0, width - margin.left - margin.right)
  const yMax = Math.max(0, height - margin.top - margin.bottom)

  const labels = data.map((d) => d.label)

  // Compute global y-domain across stats and overlays
  const globalMin = Math.min(...data.map((d) => Math.min(d.stats.min, d.item.weighted_score, d.stats.mean)))
  const globalMax = Math.max(...data.map((d) => Math.max(d.stats.max, d.item.weighted_score, d.stats.mean)))

  const xScale = scaleBand<string>({
    domain: labels,
    range: [0, xMax],
    padding: 0.4,
  })

  const yScale = scaleLinear<number>({
    domain: [globalMin, globalMax],
    nice: true,
    range: [yMax, 0],
  })

  const qColors = {
    q1: "#1a1a1a", // Min → Q1
    q2: "#4a4a4a", // Q1 → Median
    q3: "#7a7a7a", // Median → Q3
    q4: "#b0b0b0", // Q3 → Max
  }

  const categoryColorByLabel: Record<string, string> = {
    "Clinical Expertise": "#E63946",
    "Communication": "#F77F00",
    "Treatment Results": "#FCBF49",
    "Bedside Manner": "#06A77D",
    "Trust & Safety": "#118AB2",
    "Environment": "#073B4C",
    "Personalization": "#9B59B6",
    "Post-Care": "#E91E63",
    "Professionalism": "#2E7D32",
    "Staff Support": "#00BCD4",
    "Value & Transparency": "#FF6F00",
    "Pain Management & Comfort": "#8B4789",
    "Anxiety & Nervousness Management": "#7CB342",
    "Booking & Accessibility": "#FFB300",
    "Honesty & Realistic Expectations": "#5C6BC0",
    "Long-term Relationship & Loyalty": "#D32F2F",
  }

  const categoryColorFor = (label: string) => categoryColorByLabel[label] ?? "#888888"

  const axisColor = "var(--color-muted-foreground)"
  const medianStroke = "var(--color-primary)"
  const meanFill = "var(--color-chart-4)"
  const itemMarkerStroke = "var(--color-background)"

  return (
    
    <svg width={width} height={height} role="img" aria-label="Box plot of categories">
  
      <Group left={margin.left} top={margin.top}>
       
         
          
        {/* Quartile stacks, median/mean markers, item fills and in-box labels */}
        {data.map((d, idx) => {
          const x = xScale(d.label) ?? 0
          const bw = xScale.bandwidth()
          const cx = x + bw / 2

          const yMin = yScale(d.stats.min)
          const yQ1 = yScale(d.stats.q1)
          const yMedian = yScale(d.stats.median)
          const yQ3 = yScale(d.stats.q3)
          const yMaxV = yScale(d.stats.max)
          const yMean = yScale(d.stats.mean)
          const yItem = yScale(d.item.weighted_score)

          // Heights for the four quartile segments (account for SVG Y direction)
          const hQ4 = Math.max(0, yQ3 - yMaxV) // Q4: max -> Q3
          const hQ3 = Math.max(0, yMedian - yQ3) // Q3: Q3 -> median
          const hQ2 = Math.max(0, yQ1 - yMedian) // Q2: median -> Q1
          const hQ1 = Math.max(0, yMin - yQ1) // Q1: Q1 -> min

          // Item fill from global min baseline up to item value
          const yBaseline = yScale(globalMin)
          const itemBarY = Math.min(yItem, yBaseline)
          const itemBarH = Math.max(0, Math.abs(yBaseline - yItem))

          const labelYInsideIqr = yQ3 + (yQ1 - yQ3) / 2

          return (
            <Group
              key={d.key}
              left={0}
              top={0}
              onMouseMove={(evt) => onHover?.(d, evt)}
              onMouseLeave={() => onLeave?.()}
            >
              {/* Item fill up to the item value uses per-category color */}
              <rect
                x={x}
                y={itemBarY}
                width={bw}
                height={itemBarH}
                fill={categoryColorFor(d.label)}
                opacity={0.25}
                rx={3}
                aria-label={`${d.label} item fill up to value`}
              />

              {/* Quartile segments use fixed hex greys */}
              <rect
                x={x}
                y={yMaxV}
                width={bw}
                height={hQ4}
                fill={qColors.q4}
                rx={3}
                aria-label={`${d.label} Q4 (Q3→Max)`}
              />
              <rect x={x} y={yQ3} width={bw} height={hQ3} fill={qColors.q3} aria-label={`${d.label} Q3 (Median→Q3)`} />
              <rect
                x={x}
                y={yMedian}
                width={bw}
                height={hQ2}
                fill={qColors.q2}
                aria-label={`${d.label} Q2 (Q1→Median)`}
              />
              <rect
                x={x}
                y={yQ1}
                width={bw}
                height={hQ1}
                fill={qColors.q1}
                rx={3}
                aria-label={`${d.label} Q1 (Min→Q1)`}
              />

              {/* Median line */}
              <line
                x1={x}
                x2={x + bw}
                y1={yMedian}
                y2={yMedian}
                stroke={medianStroke}
                strokeWidth={2}
                aria-label={`${d.label} median`}
              />

              {/* Item weighted_score marker uses the per-category color */}
              <circle
                cx={cx}
                cy={yItem}
                r={4}
                fill={categoryColorFor(d.label)}
                stroke={itemMarkerStroke}
                strokeWidth={1.25}
                aria-label={`${d.label} item value`}
              />
            </Group>
          )
        })}

        {/* Y Axis retained for values */}
        <AxisLeft
          scale={yScale}
          tickStroke={axisColor}
          stroke={axisColor}
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 12,
            textAnchor: "end",
            dy: "0.33em",
          })}
        />


      </Group>
    </svg>
  )
}

type TooltipData = {
  label: string
  stats: BoxStats
  item: ItemMeta
}

export default function VisxBoxPlot({ data, height = 520, margin }: VisxBoxPlotProps) {
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<TooltipData>()

  return (
    <div className="w-full rounded-lg border bg-card p-4" style={{ borderColor: "var(--color-border)" }}>
      <div style={{ width: "100%", height, position: "relative" }}>
        <ParentSize>
          {({ width, height }) => (
            <>
              <BoxPlotSvg
                data={data}
                width={width}
                height={height}
                margin={margin}
                onHover={(d, evt) => {
                  const pt = (evt && localPoint(evt)) || { x: 0, y: 0 }
                  showTooltip({
                    tooltipLeft: evt.clientX-200,
                    tooltipTop: evt.clientY-200,
                    tooltipData: {
                      label: d.label,
                      stats: d.stats,
                      item: d.item,
                    },
                  })
                }}
                onLeave={() => hideTooltip()}
              />
              {tooltipOpen && tooltipData ? (
                    <div className='flex flex-wrap'>
                    <TooltipWithBounds
                    left={tooltipLeft}
                    top={tooltipTop}
                    style={{
                        background: "var(--color-background)",
                        color: "var(--color-foreground)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        boxShadow: "0 4px 20px rgb(0 0 0 / 0.15)",
                        padding: "8px 10px",
                        fontSize: 12,
                        transform: `translate(${tooltipLeft}px, ${tooltipTop}px)`,
                        position: "absolute",
                    }}
                    >
                    <div className="space-y-1">
                        <div className="font-medium">{tooltipData.label}</div>
                        <div className="text-muted-foreground">Q1: {tooltipData.stats.q1.toFixed(2)}</div>
                        <div className="text-muted-foreground">Q2 (Median): {tooltipData.stats.median.toFixed(2)}</div>
                        <div className="text-muted-foreground">Q3: {tooltipData.stats.q3.toFixed(2)}</div>
                        <div className="text-muted-foreground">Q4 (Max): {tooltipData.stats.max.toFixed(2)}</div>
                        <div className="text-muted-foreground">Mean: {tooltipData.stats.mean.toFixed(2)}</div>
                        <div className="text-muted-foreground">
                        Item Value: {tooltipData.item.weighted_score.toFixed(2)}
                        </div>
                    </div>
                    </TooltipWithBounds></div>
              ) : null}
            </>
          )}
        </ParentSize>
      </div>
    </div>
  )
}
