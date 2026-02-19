import ProfilePage from "@/app/practitioners/[cityslug]/page";
interface ProfilePageProps {
  params: {
    cityslug: string;
    slug: string;
  };
}
export default function TestPractitionersByCity({ params }: ProfilePageProps) {
  return (
    <div>
      <ProfilePage
        params={params}
      />
    </div>
  );
}
