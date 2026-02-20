'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/DataTable'
import type { Practitioner, Clinic } from '@/lib/types'
import practitionersJson from "@/../public/derms_processed_new_5403.json";
import clinicsJson from "@/../public/clinics_processed_new_data.json";
const clinicsJsonData = clinicsJson as unknown as Clinic[];
const practitionersJsonData = practitionersJson as unknown as Practitioner[];
const clinics = clinicsJsonData
const clinicIndex = new Map(
  clinics.filter(c=>c.slug !== undefined).map(c => [c.slug!, c])
)
const enrichedPractitionersJsonData = practitionersJsonData.map(p => {
  const clinic = clinicIndex.get(JSON.parse(p.Associated_Clinics!)[0])
  return {...p,...clinic}
})

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
  { key: 'rating' as any, label: 'Rating' },
]

export default function PractitionersList() {
  const [practitioners, setPractitioners] = useState<Practitioner[]>(enrichedPractitionersJsonData)
  
  const router = useRouter()

  

  return (
    <DataTable
      data={practitioners}
      columns={columns}
      onEdit={(practitioner) => router.push(`/admin/practitioners/${practitioner.practitioner_name}`)}
      onDelete={async (practitioner) => {
        if (confirm(`Delete practitioner "${practitioner.practitioner_name}"?`)) {
          await fetch(`/directory/api/admin/practitioners/${practitioner.slug}`, { method: 'DELETE' })
          setPractitioners(practitioners.filter(p => p.slug !== practitioner.slug))
        }
      }}
      onAdd={() => router.push('/admin/practitioners/new')}
    />
  )
}
