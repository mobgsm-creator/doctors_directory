// New component rewriting markdown renderer into section-based layout
// Matching the design shown in the reference image (clean sections, headings, lists, tables)

import { Clinic, Practitioner } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Section } from "../ui/section";
import { decodeUnicodeEscapes,fixMojibake } from "@/lib/utils";
import practitionersJson from "@/../public/derms_processed_new_5403.json";
const practitionersData = practitionersJson as unknown as Practitioner[];
const practitionersIndex = new Map<string, Practitioner[]>();

for (const p of practitionersData) {
  const clinics = JSON.parse(p.Associated_Clinics as string) as string[];

  for (const clinic of clinics) {
    const bucket = practitionersIndex.get(clinic) ?? [];
    bucket.push(p);
    practitionersIndex.set(clinic, bucket);
  }
}







export default function ClinicDetailsSections({ clinic }: { clinic: Clinic }) {

  const practitioners = practitionersIndex.get(clinic.slug as string)

  
  const countOccurrences = (str: string, substr: string) => {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.substr(i, substr.length) === substr) {
        count++;
      }
    }
    return count;
  };
  const parseList = (val: any) => {
    if (!val) return [];
    try {
       if (Array.isArray(val)) {
        console.log("isArray")
        return val;
      }
      
      if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
        if (countOccurrences(val, '"') > 0) {
          val = val.replaceAll("'", '').replaceAll('"', '').replaceAll("[","['").replaceAll("]","']").replaceAll(".,",".','")
        }
        return JSON.parse(val.replaceAll("'", '"'));
      }
     
    } catch (error) {
      console.log("parseList error: ",val,error)
      return [val];
    }
  };

  let flag = true;
  let edge_case_accreditations: any = [];
  try {
    edge_case_accreditations = JSON.parse(clinic.accreditations.replaceAll("'", '"'))[0]['Details']
    flag = edge_case_accreditations.length === 0 ? true : false;
  } catch (error) {
    flag = false;
  }
 
  

  return (
    <div className="">
      {/* ABOUT */}
      <Section title={`About ${clinic.slug!.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}`} id="about">
        {decodeUnicodeEscapes(clinic.about_section) || "Not publicly listed"}
      </Section>

      <div className="border-t border-gray-300 my-6"></div>

      {/* Treatments */}
      {clinic?.Treatments!.length > 0 && (
      <Section title="Treatments" id="treatments">
        <div className="flex flex-wrap gap-1">
          {clinic.Treatments &&
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
        <div className="border-t border-gray-300 my-6"></div>
      </Section>
    )}

      

      {/* ACCREDITATIONS */}
      
      <Section title="Accreditations" id="accreditations">
      {flag === false ? (
        Array.isArray(parseList(clinic.accreditations)) ? (
          <ul className="list-disc ml-6 space-y-1" data-testid="accreditations-list">
            {parseList(clinic.accreditations).map((a: string, i: number) => (
              <li key={i}>{fixMojibake(decodeUnicodeEscapes(a)).replaceAll("—", '')}</li>
            ))} 
          </ul>) : <ul className="list-disc ml-6 space-y-1" data-testid="accreditations-list">
            <li> "Not listed"</li></ul>
      ) : (
          <ul className="list-disc ml-6 space-y-1" data-testid="accreditations-list">
            <li> 
            {edge_case_accreditations ? decodeUnicodeEscapes(edge_case_accreditations) : "Not listed"}</li>
          </ul>
      ) 
      }
      </Section>
      <div className="border-t border-gray-300 my-6"></div>
      
     

      {/* Practitioners */}
      
      <Section title="Practitioners" id="practitioners">
        <div className="flex flex-col gap-4">
          {Object.entries(practitioners as Practitioner[]).map(
            ([k, v]) =>{

            if (typeof v === "object" && v !== null) {
              const slug = v["practitioner_name"] 
              const name = v["practitioner_name"]?.replaceAll("-", ' ').split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
              return (

 

              
              k !== "Source" && (
                <article
                  key={k}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-md hover:border-primary/50"
                >
                  <Link prefetch={false} href={`/profile/${slug}`}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {name?.charAt(0)}
                        </span>
                        </div>
                   
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {name }
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {v["Title"] }
                        </p>
                      </div>
                      
                    </div>

                   
                  </div></Link>

                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </article>
              )
          )}}          )}
        </div>
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
                        <td className="align-top border-0 px-1 py-1">{
                        v?.toString()}</td>
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
                        <td className="align-top border-0 px-1 py-1 font-medium">{k.replaceAll("ProcedureRange","Pricing")}</td>
                        <td className="align-top border-0 px-1 py-1">
                          {typeof v === "object" && v !== null
                            ?  Object.entries(v).map(([key,val]) =>
                              (key !== "Source" && key !== "Notes") && (
                              <li key={key}>{key}: {val}</li>))
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
