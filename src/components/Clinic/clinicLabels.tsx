import { Clinic } from "@/lib/types";

export default function ClinicLabels({ clinic }: Readonly<{ readonly clinic: Clinic }>) {
  const labels = clinic.isCQC?.[0] || clinic.isHIW?.[0] || clinic.isHIS?.[0] || clinic.isJCCP?.[0] || clinic.isRQIA?.[0] || clinic.isSaveFace
      
  return (
    <div className="flex justify-center align-items-center gap-2 flex-col">
      {clinic.isDoctor && (
        <div className="flex items-center gap-1 rounded-full bg-green-100 text-green-800 border border-green-300 text-xs px-3 py-1">
          <span>Licensed Medical Practitioner</span>
        </div>
      )}
      { labels && (
      <div className="flex gap-2 items-center justify-center">
        {clinic.isCQC?.[0] && (
          
            <img
              src="/directory/qcc.jpg"
              alt="CQC"
              className="w-14 h-auto rounded-full inline"
            />
 
        )}
        {clinic.isHIW?.[0] && (
       
            <img
              src="/directory/HIW.jpg"
              alt="HIW"
              className="w-20 h-auto inline"
            />

        )}
        {clinic.isHIS?.[0] && (
        
            <img
              src="/directory/HIS.jpg"
              alt="HIS"
              className="w-12 h-auto inline"
            />

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
