import AccreditedClinicsPage from "@/app/accredited/[accreditation]/clinics/[cityslug]/page";
interface AccreditedClinicsPageProps {
  params: {
    accreditation: string;
    cityslug: string;
  };
}
export default function TestAccreditedClinics({ params }: AccreditedClinicsPageProps) {
  return (
    <div>
      <AccreditedClinicsPage
        params={params}
      />
    </div>
  );
}
