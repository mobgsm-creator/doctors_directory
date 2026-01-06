// New component rewriting markdown renderer into section-based layout
// Matching the design shown in the reference image (clean sections, headings, lists, tables)

import { Practitioner } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import PractitionerTabs from "./PractitionerTabs";
import Link from "next/link";
export default function PractitionerDetailsSections({
  clinic,
}: {
  clinic: Practitioner;
}) {
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
  const fixPythonArrayString = (str: string) => {
    if (!str) return null;

    try {
      // 1. remove broken outer quotes
      let fixed = str
        .trim()
        .replace(/^"\[|\]"$/g, (m) => (m === '"[' ? "[" : "]"));

      // 2. convert single-quoted Python list → JSON list
      fixed = fixed.replaceAll(/'([^']*)'/g, '"$1"');

      return JSON.parse(fixed);
    } catch {
      return null;
    }
  };

  const Section = ({ id, title, children }: any) => (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="text-base leading-7">{children}</div>
    </section>
  );

  return (
    <div>
      {/* Roles */}

      <Section title="Roles" id="roles">
        {parseList(fixPythonArrayString(clinic.practitioner_roles)).length ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(fixPythonArrayString(clinic.practitioner_roles)).map(
              (a: string, i: number) => (
                <li key={i}>{a}</li>
              )
            )}
          </ul>
        ) : (
          "Not publicly listed"
        )}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      {/* Treatments */}
      <Section title="Treatmetnts" id="treatmetnts">
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
      {/* Qualifications */}
      <Section title="Qualifications" id="qualifications">
        {parseList(fixPythonArrayString(clinic.practitioner_qualifications))
          .length ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(
              fixPythonArrayString(clinic.practitioner_qualifications)
            ).map((a: string, i: number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        ) : (
          "Not publicly listed"
        )}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      {/* Experience */}
      <Section title="Experience" id="experience">
        {parseList(fixPythonArrayString(clinic.practitioner_experience))
          .length ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(
              fixPythonArrayString(clinic.practitioner_experience)
            ).map((a: string, i: number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        ) : (
          "Not publicly listed"
        )}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      {/* News */}
      <Section title="News" id="news">
        {parseList(fixPythonArrayString(clinic.practitioner_media)).length ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(fixPythonArrayString(clinic.practitioner_media)).map(
              (a: string, i: number) => (
                <li key={i}>{a}</li>
              )
            )}
          </ul>
        ) : (
          "Not publicly listed"
        )}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      {/* AWARDS */}
      <Section title="Awards" id="awards">
        {parseList(fixPythonArrayString(clinic.practitioner_awards)).length ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(fixPythonArrayString(clinic.practitioner_awards)).map(
              (a: string, i: number) => (
                <li key={i}>{a}</li>
              )
            )}
          </ul>
        ) : (
          "Not publicly listed"
        )}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      {/* HOURS */}
      {/* {clinic.hours && typeof clinic.hours === "object" && (
        <Section title="Hours" id='hours'>
          <div className="overflow-x-auto shadow-none">
            <table className="w-full text-sm bg-white border-collapse">
              <tbody>
                {Object.entries(clinic.hours).map(([day, time]) => (
                  <tr key={day}>
                    <td className="border border-gray-200 px-4 py-2 font-medium ">{day?.toString()}</td>
                    <td className="border border-gray-200 px-4 py-2 ">{time?.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )} */}
      {/* INSURANCE */}
      <Section title="Insurance Accepted" id="insurance">
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
                    <td className="align-top border-0 px-1 py-1 font-medium">
                      {k?.toString()}
                    </td>
                    <td className="align-top border-0 px-1 py-1">{v?.toString()}</td>
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
      {/* <Section title="Payment Options" id='payments'>
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
      </Section> */}
      <div className="border-t border-gray-300 my-6"></div>
      {/* FEES */}
      <Section title="Estimated Fees" id="fees">
        {clinic.Fees && typeof clinic.Fees === "object" ? (
          <div className="overflow-x-auto shadow-none">
            <table className="w-full text-sm bg-white">
              <tbody>
                {Object.entries(clinic.Fees).map(([k, v]) =>
                  k !== "Source" ? (
                    <tr key={k}>
                      <td className="align-top border-0 px-1 py-1 font-medium">{k}</td>
                      <td className="align-top border-0 px-1 py-1">
                        {(() => {
                          // 1. If value is already an object → convert to bullets
                          if (typeof v === "object" && v !== null) {
                            return (
                              <ul className="list-disc ml-6 space-y-1">
                                {Object.entries(v).map(([key, value]: any) => (
                                  <li key={key}>
                                    <span className="font-medium">{key}</span>:{" "}
                                    {String(value)}
                                  </li>
                                ))}
                              </ul>
                            );
                          }

                          // 2. If value is a JSON string → try parsing it
                          if (typeof v === "string") {
                            try {
                              const parsed = JSON.parse(v);

                              if (
                                typeof parsed === "object" &&
                                parsed !== null
                              ) {
                                return (
                                  <ul className="list-disc ml-6 space-y-1">
                                    {Object.entries(parsed).map(
                                      ([key, value]: any) => (
                                        <li key={key}>
                                          <span className="font-medium">
                                            {key}
                                          </span>
                                          : {String(value)}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                );
                              }
                            } catch (e) {
                              // If parse fails → fall back to raw string
                              return String(v);
                            }
                          }

                          // 3. Primitive fallback
                          return String(v ?? "Not listed");
                        })()}
                      </td>
                    </tr>
                  ) : null
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
