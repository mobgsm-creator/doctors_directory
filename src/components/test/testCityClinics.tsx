import ProfilePage from "@/app/clinics/[cityslug]/page";
interface ProfilePageProps {
  params: {
    cityslug: string;
    slug: string;
  };
}
export default function TestCityClinics({ params }: ProfilePageProps) {
  return (
    <div>
      <ProfilePage
        params={params}
      />
    </div>
  );
}
