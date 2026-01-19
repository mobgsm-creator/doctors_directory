import type { BoxPlotDatum } from "@/lib/data"

interface PerformanceSummaryProps {
  data: BoxPlotDatum[]
}

export default function PerformanceSummary({ data }: Readonly<PerformanceSummaryProps>) {
  const skip =["Clinical Expertise",
        "Treatment Results",
        "Environment",
        "Staff Support",
        ] 
  const filtered_data = data.filter(d => skip.includes(d.label))
  const totalMentions = filtered_data.reduce((acc, d) => acc + (d.item.num_mentions || 0), 0)
  //const totalFiveStars = filtered_data.reduce((acc, d) => acc + (d.item.num_five_stars || 0), 0)
  

 // Function to generate a 3-line summary based on all 15 patterns
  // Generate holistic 3-line summary for all items together
  const generateCombinedSummary = () => {
   
 
    const topPerformers: string[] = []
    const midPerformers: string[] = []
    const lowPerformers: string[] = []
    const inconsistent: string[] = []

    filtered_data.forEach(d => {
      const label = d.label
      const { weighted_score } = d.item

      const { q1, q3, median, min, max } = d.stats
      const variability = max - min

      // Quartile-based classification
      if (weighted_score > q3) topPerformers.push(label)
      else if (weighted_score < q1) lowPerformers.push(label)
      else midPerformers.push(label)

      // Variability check
      if (variability > 0.4 * median) inconsistent.push(label)
    })

    const line1 = topPerformers.length
  ? `They are getting lots of good reviews and possibly goes the extra mile, ensuring patient satisfaction.`
  : midPerformers.length
  ? `They are doing okay, we have seen better reviews in the dataset but the clinic is showing steady performance.`
  : ""

const line2 = inconsistent.length
  ? `All businesses have some ups and downs, so their performance can change from one review to another.`
  : "Most reviews are steady and predictable, indicating consistent results."

const line3Parts = [
  lowPerformers.length ? `Not many positive reviews compared to their peers but business may be good and the clinic doesn't rely on the reviews.` : "",
  topPerformers.length && !inconsistent.length
    ? `They still do well even when things are a bit harder, showing they are reliable.` 
    : ""
].filter(Boolean)

    const line3 = line3Parts.join(" ")

    return [line1, line2, line3].filter(Boolean)
  }

  const summaryLines = generateCombinedSummary()

  return (
    <div className="flex flex-col mt-12 border-t border-border pt-8 items-center">
      <h2 className="mb-2 text-2xl font-bold text-foreground">Community Sentiment</h2>
    
      {/* 3-Line Combined Summary */}
      <div className="mb-4 mt-4 space-y-1 text-sm text-muted-foreground">
        {summaryLines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* Overall Totals */}
     {/* <div className="mt-10 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <p>
          <strong>Total Mentions:</strong> {totalMentions.toLocaleString()} |{" "}
           <strong>Total 5-Star Reviews:</strong> {totalFiveStars.toLocaleString()} */}
       {/**  </p>
      </div>*/}
    </div>
  )
}