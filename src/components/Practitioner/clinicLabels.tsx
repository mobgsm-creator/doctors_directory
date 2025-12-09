import { Clinic } from "@/lib/types";
import { Hospital } from "lucide-react";
export default function ClinicLabels({ clinic }: { clinic: Clinic }) {
  return (
    <div className="flex justify-center align-items-center gap-2 flex-col">
      {clinic.isDoctor && (
        <div className="px-3 py-1 flex items-center gap-1 rounded-full bg-green-100 text-green-800 border border-green-300 text-xs">
          <span>Licensed Medical Practitioner</span>
        </div>
      )}
      {clinic.isCQC?.[0] || clinic.isHIW?.[0] || clinic.isHIS?.[0] || clinic.isJCCP?.[0] || clinic.isRQIA?.[0] || clinic.isSaveFace && (
      <div className="flex gap-2 items-center justify-center">
        {clinic.isCQC?.[0] && (
          <a
            className="text-center"
            href={clinic.isCQC?.[1]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/directory/qcc.jpg"
              alt="CQC"
              className="w-14 h-auto rounded-full inline"
            />
          </a>
        )}
        {clinic.isHIW?.[0] && (
          <a
            className="text-center"
            href={clinic.isHIW?.[1]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/directory/HIW.jpg"
              alt="HIW"
              className="w-20 h-auto inline"
            />
          </a>
        )}
        {clinic.isHIS?.[0] && (
          <a
            className="text-center"
            href={clinic.isHIS?.[1]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/directory/HIS.jpg"
              alt="HIS"
              className="w-12 h-auto inline"
            />
          </a>
        )}
        {clinic.isJCCP?.[0] && (
          <img
            src="/directory/jccp.jpg"
            alt="CQC"
            className="w-8 h-auto inline"
          />
        )}

        {clinic.isRQIA?.[0] && (
          <img
            src="/directory/rqia.jpg"
            alt="RQIA"
            className="w-16 h-auto inline"
          />
        )}
        {clinic.isSaveFace && (
          <img
            src="/directory/save-face-partner.jpg"
            alt="Save Face"
            className="w-8 h-auto inline"
          />
        )}
      </div>)}
      
    </div>
  );
}
