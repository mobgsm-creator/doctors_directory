"use client";
import AdminForm from "@/components/admin/AdminForm";

export default function ClinicEditor() {
  return (
    <AdminForm
      entityType="clinics"
      apiBasePath="/api/admin/clinics"
      redirectPath="/admin/clinics"
    />
  );
}