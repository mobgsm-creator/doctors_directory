'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Product } from '@/lib/types'

export default function ClinicEditor() {
  const [clinic, setClinic] = useState<Partial<Product>>({})
  const [keys, setKeys] = useState<(keyof Product)[]>([])
  const [loading, setLoading] = useState(true)
  const [isNew, setIsNew] = useState(false)
  const router = useRouter()
  const params = useParams()
  console.log(keys)
 



  useEffect(() => {
    if (params.slug === 'new') {
      setIsNew(true)
      return
    }

    fetch(`/directory/api/admin/products/${params.slug}`)
      .then(res => res.json())
      .then(setClinic)
      .catch(() => router.push('/admin/products'))
      .finally(() => 
       
        setLoading(false))
  }, [params.slug, router])


  useEffect(() => {
  if (!clinic || Object.keys(clinic).length === 0) return
  setKeys(Object.keys(clinic) as (keyof Product)[])
}, [clinic])
  

  const handleChange = (field: keyof Product, value: any) => {
    setClinic({ ...clinic, [field]: value })
  }

  const handleSubmit = async () => {
    const url = isNew ? '/api/admin/products' : `/api/admin/products/${params.slug}`
    const method = isNew ? 'POST' : 'PUT'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clinic)
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to save')
      }
    } catch (error) {
      console.error('Failed to save clinic:', error)
      alert('Failed to save clinic')
    }
  }

  if (!isNew && !clinic.slug) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isNew ? 'New Clinic' : `Edit: ${clinic.slug}`}
        </h1>
        <Button onClick={handleSubmit}>Save</Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {keys.map((key, index) => (
            <div key={index}>
              <Label htmlFor={key}>{key}</Label>
              <Input
                id={key}
                value={clinic[key] as number || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))}
          
        </div>
      </div>
    </div>
  )
}
