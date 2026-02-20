'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import type { Practitioner, Clinic } from '@/lib/types'
import pendingClinicsJson from "@/../public/pending_clinics.json";
type PartialClinic = Partial<Clinic>;
const pendingClinicsJsonData = pendingClinicsJson as unknown as PartialClinic[];


type Status = 'pending' | 'approved' | 'rejected'

const statusColors: Record<Status, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const columns = [
  {
    key: 'image' as any,
    label: 'Image',
    render: (value: string) => (
      <img src={value} alt="" className="w-10 h-10 rounded-full object-cover" />
    )
  },
  { key: 'practitioner_name' as any, label: 'Name' },
  { key: 'category' as any, label: 'Category' },
  { key: 'City' as any, label: 'City' },
  { key: 'status' as any, label: 'Status'}]

export default function PendingClinicsPage() {
  const [clinics, setClinics] = useState<PartialClinic[]>(pendingClinicsJsonData)
  const router = useRouter()
  return (
  <DataTable
        data={pendingClinicsJsonData}
        columns={columns}
        onEdit={(clinic) => router.push(`/admin/clinics/${clinic.slug}`)}
        onApprove={async (clinic: PartialClinic) => {
          const res = await fetch(`/directory/api/admin/pending/clinics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clinic)
          })
         
        }}
      />
    )
  
}
