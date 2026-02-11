import ProfilePage from "@/app/practitioners/[cityslug]/treatments/[treatmentslug]/page";
interface ProfilePageProps {
  params: {
    cityslug: string;
    treatmentslug: string;
  };
}
export default function TestTreatmentCount({ params }: ProfilePageProps) {
  return (
    <div>
      <ProfilePage
        params={params}
      />
    </div>
  );
}