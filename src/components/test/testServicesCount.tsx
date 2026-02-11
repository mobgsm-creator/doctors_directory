import ProfilePage from "@/app/clinics/[cityslug]/services/[serviceslug]/page";
interface ProfilePageProps {
  params: {
    cityslug: string;
    serviceslug: string;
  };
}
export default function TestServicesCount({ params }: ProfilePageProps) {
  return (
    <div>
      <ProfilePage
        params={params}
      />
    </div>
  );
}