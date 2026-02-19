import ProfilePage from "@/app/practitioners/credentials/[cred]/page";
interface ProfilePageProps {
  params: {
    cred: string;
  };
}
export default function TestPractitionerCredentials({ params }: ProfilePageProps) {
  return (
    <div>
      <ProfilePage
        params={params}
      />
    </div>
  );
}
