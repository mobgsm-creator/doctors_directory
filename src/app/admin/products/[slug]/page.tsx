'use client'
import AdminForm from "@/components/admin/AdminForm"
export default function ProductEditor() {
  return (
    <AdminForm
      entityType="products"
      apiBasePath="/api/admin/products"
      redirectPath="/admin/products"
    />
  );
}