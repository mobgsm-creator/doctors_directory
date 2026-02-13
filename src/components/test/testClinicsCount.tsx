import ProfilePage from "@/app/clinics/[cityslug]/clinic/[slug]/page";
interface ProfilePageProps {
  params: {
    cityslug: string;
    slug: string;
  };
}
export default function TestClinicsCount({ params }: ProfilePageProps) {
  return (
    <div>
      <ProfilePage
        params={params}
      />
    </div>
  );
}