// New component rewriting markdown renderer into section-based layout
// Matching the design shown in the reference image (clean sections, headings, lists, tables)

import { Clinic } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Section } from "../ui/section";
import { count } from "console";
interface PractitionerDetails {
  "Full Name": string;
  Title?: string;
  Specialty?: string;
  Education?: string;
  "Professional Affiliations"?: string;
  LinkedInURL?: string;
  ProfileURL?: string;
  "name"?: string;
  "role"?: string;
}



export default function ClinicDetailsSections({ clinic }: { clinic: Clinic }) {
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
    //console.log("edge_case_accreditations error: ",error)
  }

  return (
    <div className="">
      {/* ABOUT */}
      <Section title={`About ${clinic.slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}`} id="about">
        {clinic.about_section || "Not publicly listed"}
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
      
      
      {Array.isArray(parseList(clinic.accreditations)) && flag ? (
        <Section title="Accreditations" id="accreditations">
        {Array.isArray(parseList(clinic.accreditations)) ? (
          <ul className="list-disc ml-6 space-y-1">
            {parseList(clinic.accreditations).map((a: string, i: number) => (
              <li key={i}>{a}</li>
            ))} 
          </ul>) : "Not listed"}
         
        <div className="border-t border-gray-300 my-6"></div>
         
      </Section>) : <Section title="Accreditations" id="accreditations">
        
          <ul className="list-disc ml-6 space-y-1">
            {edge_case_accreditations ? edge_case_accreditations : "Not listed"}
          </ul>
         
        <div className="border-t border-gray-300 my-6"></div>
         
      </Section>}
      
     

      {/* Practitioners */}
      
      <Section title="Practitioners" id="practitioners">
        <div className="flex flex-col gap-4">
          {Object.entries(clinic.Practitioners).map(
            ([k, v]) =>{

            if (typeof v === "object" && v !== null) {
              const practitioner = v as PractitionerDetails;
              return (

 

              
              k !== "Source" && (
                <article
                  key={k}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-md hover:border-primary/50"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {practitioner["Full Name"]?.charAt(0) || practitioner["name"]?.charAt(0) || (practitioner as any)["Full Name/Title"]?.charAt(0)}
                        </span>
                        </div>
                   
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {v["Full Name"] || v["name"] || (v as any)["Full Name/Title"]}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {v["Title"] || v["role"]}
                        </p>
                      </div>
                      
                    </div>

                    <div className="space-y-3">
                      {
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-muted-foreground w-16 flex-shrink-0 pt-0.5">
                            Specialty
                          </span>
                          <span className="text-sm text-foreground">{v["Specialty"]}</span>
                        </div>
                      }

                      {
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-muted-foreground w-16 flex-shrink-0 pt-0.5">
                            Education
                          </span>
                          <span className="text-sm text-foreground">{v["Education"]}</span>
                        </div>
                      }

                      {
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-muted-foreground w-16 flex-shrink-0 pt-0.5">
                            Affiliations
                          </span>
                          <span className="text-sm text-foreground">{v["Professional Affiliations"]}</span>
                        </div>
                      }
                    </div>
                  </div>

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
