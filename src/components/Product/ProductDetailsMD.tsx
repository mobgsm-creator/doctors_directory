// New component rewriting markdown renderer into section-based layout
// Matching the design shown in the reference image (clean sections, headings, lists, tables)

import { Product } from "@/lib/types";
import { decodeUnicodeEscapes } from "@/lib/utils";

export default function PractitionerDetailsSections({
  clinic,
}: {
  clinic: Product;
}) {
  
  const parseList = (val: any) => {
    if (!val) return [];
    try {
      if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
        return JSON.parse(val.replaceAll("'", '"'));
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
  

      <Section title="Description" id="description">
        {decodeUnicodeEscapes(clinic.description)}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
 
      <Section title="Bnefits" id="benefits">
         {renderList(clinic.key_benefits)}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
     
      <Section title="Indications" id="indications">
        {renderList(clinic.indications)}
      </Section> 
      <div className="border-t border-gray-300 my-6"></div>

      <Section title="Composition" id="composition">
        {JSON.parse(clinic?.composition as string)[0]['component'] !== undefined ? JSON.parse(clinic?.composition as string).map((item: any, index: number) => (
          <div key={index}>
             <ul className="list-disc ml-6 space-y-1">
          
             
                {item['ingredients_INCI']?.map((a: string, i: number) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
          
           
          </div>
        )) : renderList(clinic.composition)}
        
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
  
      <Section title="Formulation" id="formulation">
        {renderList(clinic.formulation)}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>

      <Section title="Packaging" id="packaging">
        {renderList(clinic.packaging)}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
 
      <Section title="Usage" id="usage">
        {renderList(clinic.usage_instructions)}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      <Section title="Contraindications" id="contraindications">
        {renderList(clinic.contraindications)}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      <Section title="Adverse Effects" id="adverse_effects">
        {renderList(clinic.adverse_effects)}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      <Section title="Storage Conditions" id="storage_conditions">
        {renderList(clinic.storage_conditions)}
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      <Section title="Duration" id="duration">
        {clinic.treatment_duration}
      </Section>
      <div className="border-t border-gray-300 my-6"></div> 
      <Section title="Onset" id="onset_of_effect">
        {clinic.onset_of_effect}
      </Section>
      {true &&
              clinic.all_prices
                .map((value: any, index:number) => (
                
                    <div key={index}>
                      <table className="w-full mb-6 table-fixed">
                        <thead>
                          <tr>
                            <th className="border-none md:w-[20%] border-gray-300 p-2 text-left">
                              Price
                            </th>
                            <th className="border-none border-gray-300 p-2 text-left">
                              Link
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border-none md:w-[20%] border-gray-300 p-2 text-left">
                              {value.price}
                            </td>
                            <td className="border-none border-gray-300 p-2 text-left">
                              <a href={value.url} className="break-words whitespace-normal" target="_blank" rel="noreferrer">
                                {value.url}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                ))}
    </div>
  );
}

