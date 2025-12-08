// New component rewriting markdown renderer into section-based layout
// Matching the design shown in the reference image (clean sections, headings, lists, tables)

import { Clinic } from "@/lib/types";
import { Separator } from "@radix-ui/react-separator";
import { Divide } from "lucide-react";

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
      <h2 className="text-xl font-semibold text-foreground mb-4">
        {title}
      </h2>
      <div className="text-base leading-7">
        {children}
      </div>
    </section>
  );

  return (
    <div className="">
      {/* ABOUT */}
      <Section title="About" id='about'>
        {clinic.about_section || "Not publicly listed"}
      </Section>

      <div className="border-t border-gray-300 my-6"></div>

      {/* ACCREDITATIONS */}
      <Section title="Accreditations" id='accreditations'>
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
      <Section title="Awards" id='awards'>
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
      <Section title="Affiliations" id='affiliations'>
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

      {/* HOURS */}
      {clinic.hours && typeof clinic.hours === "object" && (
        <Section title="Hours" id='hours'>
          <div className="overflow-x-auto shadow-none">
            <table className="w-full text-sm bg-white border-collapse">
              <tbody>
                {Object.entries(clinic.hours).map(([day, time]) => (
                  <tr key={day}>
                    <td className="border border-gray-200 px-4 py-2 font-medium text-foreground">
                      {day?.toString()}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 ">
                      {time?.toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* INSURANCE */}
      <Section title="Insurance Accepted" id='insurance'>
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
                {Object.entries(clinic.Insurace).map(([k, v]) => (
                  <tr key={k}>
                    <td className="border px-4 py-2 font-medium">
                      {k?.toString()}
                    </td>
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

      <div className="border-t border-gray-300 my-6"></div>

      {/* PAYMENTS */}
      <Section title="Payment Options" id='payments'>
        {Array.isArray(clinic.Payments) ? (
          <ul className="list-disc ml-6 space-y-1">
            {clinic.Payments.map((p: any, idx: number) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        ) : clinic.Payments && typeof clinic.Payments === "object" ? (
          <div className="overflow-x-auto shadow-none">
            <table className="w-full text-sm bg-white">
              <tbody>
                {Object.entries(clinic.Payments).map(([k, v]) => (
                  <tr key={k}>
                    <td className="border px-4 py-2 font-medium">
                      {k?.toString()}
                    </td>
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

      <div className="border-t border-gray-300 my-6"></div>

      {/* FEES */}
      <Section title="Estimated Fees" id='fees'>
        {clinic.Fees && typeof clinic.Fees === "object" ? (
          <div className="overflow-x-auto shadow-none">
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
  );
}
