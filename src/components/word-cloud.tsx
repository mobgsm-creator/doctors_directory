"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Word = {
  text: string
  weight?: number // 0..1
  tone?: "positive" | "neutral" | "negative" // optional semantic color hint
  group?: string // header/category name
}

export function WordCloud({
  words,
  className,
  onWordClick,
  colorBy = "group", // "group" | "tone" | "none"
}: {
  words: Word[]
  className?: string
  onWordClick?: (word: Word) => void
  colorBy?: "group" | "tone" | "none"
}) {
  // Normalize weight into 0..1
  const normalized = React.useMemo(() => {
    if (!words.length) return []
    const w = words.map((d) => d.weight ?? 0)
    const min = Math.min(...w)
    const max = Math.max(...w)
    const range = max - min || 1
    return words.map((d) => ({
      ...d,
      _w: range === 0 ? 0.5 : (d.weight ?? 0 - min) / range,
    }))
  }, [words])

  // Map weight to discrete font sizes for predictable Tailwind classes
  function sizeClass(w: number) {
    if (w > 0.85) return "text-xl"
    if (w > 0.65) return "text-lg"
    if (w > 0.45) return "text-base"
    if (w > 0.25) return "text-sm"
    return "text-xs"
  }

  // Keep palette ≤ 5 colors total (tokens): foreground, muted-foreground, chart-1..3, accent
  function colorClass(word: Word) {
    if (colorBy === "tone") {
      if (word.tone === "positive") return "text-[color:var(--color-chart-2)]"
      if (word.tone === "negative") return "text-[color:var(--color-destructive)]"
      return "text-muted-foreground"
    }
    if (colorBy === "group") {
      // cycle a small palette across groups
      const key = word.group || ""
      const hash = Array.from(key).reduce((a, c) => a + c.charCodeAt(0), 0)
      const idx = hash % 3 // 0..2 fit within 3 accent hues
      return [
        "text-[color:var(--color-chart-1)]",
        "text-[color:var(--color-chart-2)]",
        "text-[color:var(--color-chart-3)]",
      ][idx]
    }
    return "text-foreground"
  }

  return (
    <div
      className={cn("flex flex-wrap gap-2 leading-relaxed", "select-none", className)}
      aria-label="Word cloud"
      role="list"
    >
      {normalized.map((w, i) => (
        <button
          key={`${w.text}-${i}`}
          type="button"
          role="listitem"
          className={cn(
            "px-1.5 py-0.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
            "hover:bg-accent/30",
            sizeClass(w._w),
            colorClass(w),
          )}
          onClick={() => onWordClick?.(w)}
          title={w.group ? `${w.text} • ${w.group}` : w.text}
          aria-label={w.group ? `${w.text} in ${w.group}` : w.text}
        >
          {w.text}
        </button>
      ))}
    </div>
  )
}
