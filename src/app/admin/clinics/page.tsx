'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/DataTable'
import type { Clinic } from '@/lib/types'
import { loadData } from '@/app/actions/search'

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
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    
  const fetchData = async () => {
    const { clinics } = await loadData();
    setClinics(clinics)
    setLoading(false)
  }
  fetchData()
  }, [])

  if (loading) return <div className="text-center py-8">Loading...</div>

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
