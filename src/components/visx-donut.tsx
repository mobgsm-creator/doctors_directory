"use client";
import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
import { ParentSize } from "@visx/responsive";
import type { BoxPlotDatum } from "@/lib/data";
import { useMemo } from "react";
export interface VisxDonutChartProps {
  data: BoxPlotDatum[];
}

interface DonutSegment {
  label: string;
  value: number;
  color: string;
  isActive: boolean;
}

export function Stats({ data }: VisxDonutChartProps) {
  const screenwidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const height = screenwidth > 640 ? 200 : 400;

  const categoryColorByLabel: Record<string, string> = {
    "Clinical Expertise": "#B5E3E8",
    Communication: "#F7C59F",
    "Treatment Results": "#F8B883",
    "Bedside Manner": "#A8E6CF",
    "Trust & Safety": "#B3D9FF",
    Environment: "#C7E8AC",
    Personalization: "#D7B3E8",
    "Post-Care": "#F5A9C0",
    Professionalism: "#B4D6A8",
    "Staff Support": "#D4B3E8",
    "Value & Transparency": "#FFD6A5",
    "Pain Management & Comfort": "#E8B5D3",
    "Anxiety & Nervousness Management": "#D2E8B5",
    "Booking & Accessibility": "#FFE5A5",
    "Honesty & Realistic Expectations": "#C5C8F5",
    "Long-term Relationship & Loyalty": "#F5B5B5",
  };
  

  const categoryColorFor = (label: string) =>
    categoryColorByLabel[label] ?? "#888888";
  const skip = [
    "Clinical Expertise",
    "Treatment Results",
    "Environment",
    "Staff Support",
  ];
  const getDonutSegments = (d: BoxPlotDatum): DonutSegment[] => {
    const percentage = (30 * d.item.weighted_score) / d.stats.max + 70;
    const baseColor = categoryColorFor(d.label);

    return [
      { label: d.label, value: percentage, color: baseColor, isActive: true },
      {
        label: d.label,
        value: 100 - percentage,
        color: "#E5E7EB",
        isActive: false,
      },
    ];
  };
  const filtered = useMemo(
    () => data.filter((d) => skip.includes(d.label)),
    [data]
  );

  const rows = filtered.map((d) => {
    const max = d.stats?.max ?? 1;
    const percentage = Math.max(
      0,
      Math.min(100, (30 * d.item.weighted_score) / max + 70)
    );
    return {
      label: d.label,
      percentage,
      color: categoryColorFor(d.label),
    };
  });

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="bg-white p-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-800">{row.label}</p>
            <span className="text-sm font-semibold">
              {Math.round(row.percentage)}%
            </span>
          </div>

          {/* shadcn style progress bar */}
          <div className="w-full h-10 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="h-full rounded-lg transition-all"
              style={{ width: `${row.percentage}%`, background: row.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
