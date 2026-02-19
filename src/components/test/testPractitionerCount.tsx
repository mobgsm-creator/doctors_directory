import ProfilePage from "@/app/practitioners/[cityslug]/profile/[slug]/page";
interface ProfilePageProps {
  params: {
    cityslug: string;
    slug: string;
  };
}
export default function TestPractitionerCount({ params }: ProfilePageProps) {
  return (
    <div>
      <ProfilePage
        params={params}
      />
    </div>
  );
}