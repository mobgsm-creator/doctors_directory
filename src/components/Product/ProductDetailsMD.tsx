// New component rewriting markdown renderer into section-based layout
// Matching the design shown in the reference image (clean sections, headings, lists, tables)

import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import PractitionerTabs from "./ProductTabs";


export default function PractitionerDetailsSections({
  clinic,
}: {
  clinic: Product;
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

  function renderList(val: any) {
  if (!val) return "Not publicly listed";

  const list = parseList(fixPythonArrayString(val));
  if (!list.length) return "Not publicly listed";

  return (
    <ul className="list-disc ml-6 space-y-1">
      {list.map((a: string, i: number) => (
        <li key={i}>{a}</li>
      ))}
    </ul>
  );
}


  const Section = ({ id, title, children }: any) => (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="text-base leading-7">{children}</div>
    </section>
  );

  return (
    <div>
      {/* Desc */}

      <Section title="Description" id="description">
        {clinic.description}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      {/* key_benefits*/}
      <Section title="Bnefits" id="benefits">
         {renderList(clinic.key_benefits)}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      {/* Qualifications */}
      <Section title="Indications" id="indications">
        {renderList(clinic.indications)}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      {/* Experience */}
      <Section title="Composition" id="composition">
        {renderList(clinic.composition)}
      </Section>
      {/* Experience */}
      <Section title="Formulation" id="formulation">
        {renderList(clinic.formulation)}
      </Section>
      {/* Experience */}
      <Section title="Packaging" id="packaging">
        {renderList(clinic.packaging)}
      </Section>
      {/* Experience */}
      <Section title="Usage" id="usage">
        {renderList(clinic.usage_instructions)}
      </Section>
      <Section title="Usage" id="usage">
        {renderList(clinic.contraindications)}
      </Section>
      <Section title="Usage" id="usage">
        {renderList(clinic.adverse_effects)}
      </Section>
      <Section title="Usage" id="usage">
        {renderList(clinic.storage_conditions)}
      </Section>
      <Section title="Duration" id="duration">
        {clinic.treatment_duration}
      </Section>
      <Section title="Onset" id="onset_of_effect">
        {clinic.onset_of_effect}
      </Section>


    </div>
  );
}

