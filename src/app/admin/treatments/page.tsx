'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TreatmentsList() {
  const [treatments, setTreatments] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/treatments')
      .then(res => res.json())
      .then(setTreatments)
      .catch(error => {
        console.error('Failed to load treatments:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-8">Loading...</div>

  const treatmentNames = Object.keys(treatments)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Treatments</h1>
        <button
          onClick={() => {
            const slug = prompt('Enter treatment name:')
            if (slug) {
              window.location.href = `/admin/treatments/${encodeURIComponent(slug)}`
            }
          }}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Add Treatment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {treatmentNames.map(name => (
          <div
            key={name}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">{name}</h3>
            <Link
              href={`/admin/treatments/${encodeURIComponent(name)}`}
              className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Treatment
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
