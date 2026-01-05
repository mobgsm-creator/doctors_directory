// New component rewriting markdown renderer into section-based layout
// Matching the design shown in the reference image (clean sections, headings, lists, tables)

import { Clinic } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
export default function ClinicDetailsSections({ clinic }: { clinic: Clinic }) {
  const parseList = (val: any) => {
    if (!val) return [];
    try {
      if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
        return JSON.parse(val.replace(/'/g, '"'));
      }
      if (Array.isArray(val)) return val;
      return [val];
    } catch {
      return [val];
    }
  };

  const Section = ({ id, title, children }: any) => (
    <section id={id} className="mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
      <div className="text-base leading-7">{children}</div>
    </section>
  );

  return (
    <div className="">
      {/* ABOUT */}
      <Section title="About" id="about">
        {clinic.about_section || "Not publicly listed"}
      </Section>

      <div className="border-t border-gray-300 my-6"></div>

      {/* Treatments */}
      <Section title="Treatments" id="treatments">
        <div className="flex flex-wrap gap-1">
          {true &&
            clinic.Treatments?.map(
              (modality, index) => 
                { 
                  const treatments = modality.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
                  
                  return (
                  
                <Link key={modality} href={`/treatments/${treatments}`}>
                  <Badge variant="outline" className="text-md bg-gray-100 border-0">
                    {treatments}
                  </Badge>
                </Link> )}
              
            )}
        </div>
      </Section>

      <div className="border-t border-gray-300 my-6"></div>

      {/* ACCREDITATIONS */}
      <Section title="Accreditations" id="accreditations">
        {parseList(clinic.accreditations).length ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(clinic.accreditations).map((a: string, i: number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        ) : (
          "Not publicly listed"
        )}
      </Section>

      <div className="border-t border-gray-300 my-6"></div>

      {/* AWARDS */}
      <Section title="Awards" id="awards">
        {parseList(clinic.awards).length ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(clinic.awards).map((a: string, i: number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        ) : (
          "Not publicly listed"
        )}
      </Section>

      <div className="border-t border-gray-300 my-6"></div>

      {/* AFFILIATIONS */}
      <Section title="Affiliations" id="affiliations">
        {parseList(clinic.affiliations).length ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(clinic.affiliations).map((a: string, i: number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        ) : (
          "Not publicly listed"
        )}
      </Section>

      <div className="border-t border-gray-300 my-6"></div>

      {/* INSURANCE */}
      <Section title="Insurance Accepted" id="insurance">
        {Array.isArray(clinic.Insurace) ? (
          <ul className="list-disc ml-6 space-y-1">
            {clinic.Insurace.map((i: any, idx: number) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        ) : clinic.Insurace && typeof clinic.Insurace === "object" ? (
          <div className="overflow-x-auto shadow-none">
            <table className="w-full text-sm bg-white">
              <tbody>
                {Object.entries(clinic.Insurace).map(
                  ([k, v]) =>
                    k !== "Source" && (
                      <tr key={k}>
                        <td className="align-top border-0 px-1 py-1 font-medium">
                          {k?.toString()}
                        </td>
                        <td className="align-top border-0 px-1 py-1">{v?.toString()}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          clinic.Insurace || "Not listed"
        )}
      </Section>

      <div className="border-t border-gray-300 my-6"></div>

      {/* FEES */}
      <Section title="Estimated Fees" id="fees">
        {clinic.Fees && typeof clinic.Fees === "object" ? (
          <div className="overflow-x-auto shadow-none">
            <table className="w-full text-sm bg-white">
              <tbody>
                {Object.entries(clinic.Fees).map(
                  ([k, v]) =>
                    k !== "Source" && (
                      <tr key={k}>
                        <td className="align-top border-0 px-1 py-1 font-medium">{k}</td>
                        <td className="align-top border-0 px-1 py-1">
                          {typeof v === "object" && v !== null
                            ? JSON.stringify(v)
                            : String(v ?? "Not listed")}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          clinic.Fees || "Not listed"
        )}
      </Section>
    </div>
  );
}
