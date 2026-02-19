import AccreditedPractitionersPage from "@/app/accredited/[accreditation]/practitioners/[cityslug]/page";
interface AccreditedPractitionersPageProps {
  params: {
    accreditation: string;
    cityslug: string;
  };
}
export default function TestAccreditedPractitioners({ params }: AccreditedPractitionersPageProps) {
  return (
    <div>
      <AccreditedPractitionersPage
        params={params}
      />
    </div>
  );
}
