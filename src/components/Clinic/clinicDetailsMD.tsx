// New component rewriting markdown renderer into section-based layout
// Matching the design shown in the reference image (clean sections, headings, lists, tables)

import { Clinic } from "@/lib/types"

export default function ClinicDetailsSections({ clinic }: { clinic: Clinic }) {
  const parseList = (val: any) => {
    if (!val) return []
    try {
      if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
        return JSON.parse(val.replace(/'/g, '"'))
      }
      if (Array.isArray(val)) return val
      return [val]
    } catch {
      return [val]
    }
  }

  const Section = ({ title, children }: any) => (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-foreground border-b border-border/30 pb-2 mb-4">
        {title}
      </h2>
      <div className="text-muted-foreground text-base leading-7">{children}</div>
    </section>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-border/20">
      {/* ABOUT */}
      <Section title="About">
        {clinic.about_section || "Not publicly listed"}
      </Section>

      {/* ACCREDITATIONS */}
      <Section title="Accreditations">
        {parseList(clinic.accreditations).length ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(clinic.accreditations).map((a:string, i:number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        ) : (
          "Not publicly listed"
        )}
      </Section>

      {/* AWARDS */}
      <Section title="Awards">
        {parseList(clinic.awards).length ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(clinic.awards).map((a:string, i:number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        ) : (
          "Not publicly listed"
        )}
      </Section>

      {/* AFFILIATIONS */}
      <Section title="Affiliations">
        {parseList(clinic.affiliations).length ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(clinic.affiliations).map((a:string, i:number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        ) : (
          "Not publicly listed"
        )}
      </Section>

      {/* HOURS */}
      {clinic.hours && typeof clinic.hours === "object" && (
        <Section title="Hours">
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm bg-white border-collapse">
              <tbody>
                {Object.entries(clinic.hours).map(([day, time]) => (
                  <tr key={day}>
                    <td className="border border-gray-200 px-4 py-2 font-medium text-foreground">{day?.toString()}</td>
                    <td className="border border-gray-200 px-4 py-2 text-muted-foreground">{time?.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* INSURANCE */}
      <Section title="Insurance Accepted">
        {Array.isArray(clinic.Insurace) ? (
          <ul className="list-disc ml-6 space-y-1">
            {clinic.Insurace.map((i: any, idx: number) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        ) : clinic.Insurace && typeof clinic.Insurace === "object" ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm bg-white">
              <tbody>
                {Object.entries(clinic.Insurace).map(([k, v]) => (
                  <tr key={k}>
                    <td className="border px-4 py-2 font-medium">{k?.toString()}</td>
                    <td className="border px-4 py-2">{v?.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          clinic.Insurace || "Not listed"
        )}
      </Section>

      {/* PAYMENTS */}
      <Section title="Payment Options">
        {Array.isArray(clinic.Payments) ? (
          <ul className="list-disc ml-6 space-y-1">
            {clinic.Payments.map((p: any, idx: number) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        ) : clinic.Payments && typeof clinic.Payments === "object" ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm bg-white">
              <tbody>
                {Object.entries(clinic.Payments).map(([k, v]) => (
                  <tr key={k}>
                    <td className="border px-4 py-2 font-medium">{k?.toString()}</td>
                    <td className="border px-4 py-2">{v?.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          clinic.Payments || "Not listed"
        )}
      </Section>

      {/* FEES */}
      <Section title="Estimated Fees">
        {clinic.Fees && typeof clinic.Fees === "object" ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm bg-white">
              <tbody>
                {Object.entries(clinic.Fees).map(([k, v]) => (
                  <tr key={k}>
                    <td className="border px-4 py-2 font-medium">{k}</td>
                    <td className="border px-4 py-2">
  {typeof v === "object" && v !== null
    ? JSON.stringify(v)
    : String(v ?? "Not listed")}
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          clinic.Fees || "Not listed"
        )}
      </Section>
    </div>
  )
}
