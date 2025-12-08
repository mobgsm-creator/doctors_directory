import { Clinic } from "@/lib/types";
import { Hospital } from "lucide-react";
export default function ClinicLabels({ clinic }: { clinic: Clinic }) {
  return (
    <div className="flex justify-center align-items-center gap-2 flex-col">
      {clinic.isDoctor && (
        <div className="px-3 py-1 flex items-center gap-1 rounded-full bg-green-100 text-green-800 border border-green-300 text-xs">
          <span>Certified Medic</span>
        </div>
      )}
      {clinic.isCQC?.[0] && (
        <a href={clinic.isCQC?.[1]} target="_blank" rel="noopener noreferrer">
          <img
            src="/directory/qcc.jpg"
            alt="CQC"
            className="w-14 h-8 rounded-full"
          />
        </a>
      )}
      {clinic.isHIW?.[0] && (
        <a href={clinic.isHIW?.[1]} target="_blank" rel="noopener noreferrer">
          <img
            src="/directory/HIW.jpg"
            alt="HIW"
            className="w-20 h-8 rounded-full"
          />
        </a>
      )}
      {clinic.isHIS?.[0] && (
        <a href={clinic.isHIS?.[1]} target="_blank" rel="noopener noreferrer">
          <img
            src="/directory/HIS.jpg"
            alt="HIS"
            className="w-12 h-8 rounded-full"
          />
        </a>
      )}
      {clinic.isJCCP?.[0] && (
        <img
          src="/directory/jccp.jpg"
          alt="CQC"
          className="w-8 h-8 rounded-full"
        />
      )}

      {clinic.isRQIA?.[0] && (
        <img
          src="/directory/rqia.jpg"
          alt="RQIA"
          className="w-16 h-8 rounded-full"
        />
      )}
      {clinic.isSaveFace && (
        <img
          src="/directory/save-face-partner.jpg"
          alt="Save Face"
          className="w-8 h-8 rounded-full"
        />
      )}
      
    </div>
  );
}
