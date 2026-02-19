import ProfilePage from "@/app/treatments/[slug]/page";
interface ProfilePageProps {
  params: {
    slug: string;
  };
}
export default function TestTreatments({ params }: ProfilePageProps) {
  return (
    <div>
      <ProfilePage
        params={params}
      />
    </div>
  );
}
