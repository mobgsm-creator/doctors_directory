import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import remarkAutolinkHeadings from "remark-autolink-headings";
import { Practitioner } from "@/lib/types";
const fixPythonArrayString = (str: string) => {
  if (!str) return null

  try {
    // 1. remove broken outer quotes
    let fixed = str.trim().replace(/^"\[|\]"$/g, (m) => (m === '"[' ? "[" : "]"))

    // 2. convert single-quoted Python list → JSON list
    fixed = fixed.replaceAll(/'([^']*)'/g, '"$1"')

    return JSON.parse(fixed)
  } catch {
    return null
  }
}

function mapKeyValueToMarkdown(obj: Record<string, any>, depth = 0): string {
    if (!obj || typeof obj !== "object") return "";
  
    const rows: string[] = [];
  
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "object" && v !== null) {
        // Render nested object
        rows.push(`| ${" ".repeat(depth)}**${k}** | |`);
        rows.push(mapKeyValueToMarkdown(v, depth + 1));
      } else {
        // Render key-value pair
        rows.push(`| ${" ".repeat(depth)}${k} | ${v ?? "Not listed"} |`);
      }
    }
  
    // Only add table header for top-level objects
    return depth === 0
      ? `| Key | Value |\n|------|--------|\n${rows.join("\n")}`
      : rows.join("\n");
  }
  
export default function ClinicDetailsMarkdown({ clinic}:{clinic: Practitioner}) {
  const markdownContent = `

## 📜 Practitioner Roles
${
  (() => {
    const parsed = fixPythonArrayString(clinic.practitioner_roles)

    return parsed
      ? `- ${parsed.join("\n- ")}`
      : clinic.practitioner_roles
      ? `- ${clinic.practitioner_roles}`
      : "- Not publicly listed"
  })()
}

---

## Qualifications 
${
  (() => {
    const parsed = fixPythonArrayString(clinic.practitioner_qualifications)

    return parsed
      ? `- ${parsed.join("\n- ")}`
      : clinic.practitioner_roles
      ? `- ${clinic.practitioner_roles}`
      : "- Not publicly listed"
  })()
}

---
## Experience
${
  (() => {
    const parsed = fixPythonArrayString(clinic.practitioner_experience)

    return parsed
      ? `- ${parsed.join("\n- ")}`
      : clinic.practitioner_experience
      ? `- ${clinic.practitioner_experience}`
      : "- Not publicly listed"
  })()
}

---
## News & Media 
${
  (() => {
    const parsed = fixPythonArrayString(clinic.practitioner_media)

    return parsed
      ? `- ${parsed.join("\n- ")}`
      : clinic.practitioner_media
      ? `- ${clinic.practitioner_media}`
      : "- Not publicly listed"
  })()
}

---
## Awards
${
  (() => {
    const parsed = fixPythonArrayString(clinic.practitioner_awards)

    return parsed
      ? `- ${parsed.join("\n- ")}`
      : clinic.practitioner_awards
      ? `- ${clinic.practitioner_awards}`
      : "- Not publicly listed"
  })()
}

---

## ⏰ Hours

${
  clinic.hours && typeof clinic.hours === "object"
    ? `| Day | Time |\n|------|------|\n${Object.entries(clinic.hours)
        .map(([day, time]) => `| ${day} | ${time} |`)
        .join("\n")}`
    : ""
}

---

## 🩺 Insurance Accepted
${
  Array.isArray(clinic.Insurace)
    ? clinic.Insurace.map((i) => `- ${i}`).join("\n")
    : clinic.Insurace && typeof clinic.Insurace === "object"
    ? `| Type | Details |\n|------|----------|\n${Object.entries(clinic.Insurace)
        .map(([k, v]) => `| ${k} | ${v} |`)
        .join("\n")}`
    : clinic.Insurace || "Not listed"
}

---

## 💳 Payment Options
${
  Array.isArray(clinic.Payments)
    ? clinic.Payments.map((p) => `- ${p}`).join("\n")
    : clinic.Payments && typeof clinic.Payments === "object"
    ? `| Method | Details |\n|---------|----------|\n${Object.entries(
        clinic.Payments
      )
        .map(([k, v]) => `| ${k} | ${v} |`)
        .join("\n")}`
    : clinic.Payments || "Not listed"
}

---

## 💰 Estimated Fees
${
  clinic.Fees && typeof clinic.Fees === "object"
    ? mapKeyValueToMarkdown(clinic.Fees)
    : clinic.Fees || "Not listed"
}

  `;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-border/20 items-center">
      <ReactMarkdown
        // @ts-expect-error vfile deps for remark-slug and remark-autolink-headings+
        remarkPlugins={[remarkGfm, remarkSlug, remarkAutolinkHeadings]}
        components={{
          h1: (props) => (
            <h1 className="text-4xl font-bold my-16 text-foreground" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-2xl font-semibold my-6 text-foreground flex items-center gap-2 border-b border-border/20 pb-2 text-center">
              {props.children}
            </h2>
          ),
          p: (props) => (
            <p className="text-base leading-7 my-3 text-muted-foreground" {...props} />
          ),
          li: (props) => (
            <li className="list-disc ml-6 text-muted-foreground" {...props} />
          ),
          table: (props) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm sm:text-base border-collapse bg-white">
                {props.children}
              </table>
            </div>
          ),
          th: (props) => (
            <th
              className="border border-gray-200 px-4 py-2 font-semibold bg-gray-50 text-left text-foreground"
              {...props}
            />
          ),
          td: (props) => (
            <td
              className="border border-gray-200 px-4 py-2 text-muted-foreground"
              {...props}
            />
          ),
          hr: () => <hr className="my-8 border-border/40" />,
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
