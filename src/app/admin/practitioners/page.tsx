'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/DataTable'
import type { Practitioner } from '@/lib/types'
import practitionersJson from "@/../public/derms_processed_new_5403.json";
const practitionersJsonData = practitionersJson as unknown as Practitioner[];

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

export default function PractitionersList() {
  const [practitioners, setPractitioners] = useState<Practitioner[]>(practitionersJsonData)
  
  const router = useRouter()

  

  return (
    <DataTable
      data={practitioners}
      columns={columns}
      onEdit={(practitioner) => router.push(`/admin/practitioners/${practitioner.slug}`)}
      onDelete={async (practitioner) => {
        if (confirm(`Delete practitioner "${practitioner.slug}"?`)) {
          await fetch(`/directory/api/admin/practitioners/${practitioner.slug}`, { method: 'DELETE' })
          setPractitioners(practitioners.filter(p => p.slug !== practitioner.slug))
        }
      }}
      onAdd={() => router.push('/admin/practitioners/new')}
    />
  )
}
