"use client"
import { Group } from "@visx/group"
import { Pie } from "@visx/shape"
import { ParentSize } from "@visx/responsive"
import type { BoxPlotDatum } from "@/lib/data"
import { useMemo } from "react"
export interface VisxDonutChartProps {
  data: BoxPlotDatum[]

}

interface DonutSegment {
  label: string
  value: number
  color: string
  isActive: boolean
}

export function Stats({
  data,

  
}: VisxDonutChartProps ) {
  const screenwidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const height = screenwidth > 640 ? 200 : 400;

  
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
  const filtered = useMemo(() => data.filter((d) => skip.includes(d.label)), [data])
  
  
  const rows = filtered.map((d) => {
  const max = d.stats?.max ?? 1
  const percentage = Math.max(0, Math.min(100, (30 * d.item.weighted_score) / max + 70))
  return {
  label: d.label,
  percentage,
  color: categoryColorFor(d.label),
  }
  })
  
  
  return (
  <div className="space-y-4 p-4">
  {rows.map((row) => (
  <div key={row.label} className="bg-white p-4 rounded-lg shadow-sm">
  <div className="flex items-center justify-between mb-2">
  <p className="text-sm font-medium text-gray-800">{row.label}</p>
  <span className="text-sm font-semibold">{Math.round(row.percentage)}%</span>
  </div>
  
  
  {/* shadcn style progress bar */}
  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
  <div
  className="h-full rounded-full transition-all"
  style={{ width: `${row.percentage}%`, background: row.color }}
  />
  </div>
  </div>
  ))}
  </div>
  )
  }