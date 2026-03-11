"use client";
import type { BoxPlotDatum } from "@/lib/data";
import { useMemo } from "react";
export interface VisxDonutChartProps {
  data: BoxPlotDatum[];
}

export function Stats({ data }: Readonly<VisxDonutChartProps>) {
  const categoryColorByLabel: Record<string, string> = {
    "Clinic Visibility": "#C7EAEF",
    Communication: "#F2B26E",
    "Pricing Transparency": "#C4DFA7",
    "Bedside Manner": "#D3A9CF",
    "Trust & Safety": "#F5D1CC",
    "Safety and Trust": "#E8D6F7",
    Personalization: "#F7E3A1",
    "Post-Care": "#C9F2E7",
    Professionalism: "#F8C8DC",
    "Overall Aggregation": "#D0E4F5",
    "Value & Transparency": "#F6E8C5",
    "Pain Management & Comfort": "#DFE8C9",
    "Anxiety & Nervousness Management": "#F4CBB7",
    "Booking & Accessibility": "#E6CBDC",
    "Honesty & Realistic Expectations": "#C8D7E1",
    "Long-term Relationship & Loyalty": "#FFE6F2",
  };
  

  const categoryColorFor = (label: string) =>
    categoryColorByLabel[label] ?? "#888888";
  const skip = [
    "Clinic Visibility",
    "Pricing Transparency",
    "Safety and Trust",
    "Overall Aggregation",
  ];

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
