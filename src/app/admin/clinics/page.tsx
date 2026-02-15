'use client'

import {  useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/DataTable'
import type { Clinic } from '@/lib/types'
import clinicsJson from "@/../public/clinics_processed_new_data.json";
const clinicsJsonData = clinicsJson as unknown as Clinic[];
const columns = [
  {
    key: 'image' as any,
    label: 'Image',
    render: (value: string) => (
      <img src={value} alt="" className="w-10 h-10 rounded-full object-cover" />
    )
  },
  { key: 'slug' as any, label: 'Slug' },
  { key: 'category' as any, label: 'Category' },
  { key: 'City' as any, label: 'City' },
  { key: 'rating' as any, label: 'Rating' },
]

export default function ClinicsList() {
  const [clinics, setClinics] = useState<Clinic[]>(clinicsJsonData)
  const router = useRouter()
 

  return (
    <DataTable
      data={clinics}
      columns={columns}
      onEdit={(clinic) => router.push(`/admin/clinics/${clinic.slug}`)}
      onDelete={async (clinic) => {
        if (confirm(`Delete clinic "${clinic.slug}"?`)) {
          await fetch(`/directory/api/admin/clinics/${clinic.slug}`, { method: 'DELETE' })
          setClinics(clinics.filter(c => c.slug !== clinic.slug))
        }
      }}
      onAdd={() => router.push('/admin/clinics/new')}
    />
  )
}
