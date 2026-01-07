'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TreatmentEditor() {
  const [treatmentData, setTreatmentData] = useState<Record<string, any>>({})
  const [viewMode, setViewMode] = useState<'form' | 'json'>('form')
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (params.slug === 'new') {
      return
    }

    fetch('/api/admin/treatments')
      .then(res => res.json())
      .then(data => {
        const treatment = data[decodeURIComponent(params.slug as string)]
        if (treatment) {
          setTreatmentData(treatment)
        } else {
          alert('Treatment not found')
          router.push('/admin/treatments')
        }
      })
      .catch(error => {
        console.error('Failed to load treatment:', error)
        router.push('/admin/treatments')
      })
  }, [params.slug, router])

  const handleChange = (key: string, value: any) => {
    setTreatmentData({ ...treatmentData, [key]: value })
  }

  const handleSubmit = async () => {
    const slug = params.slug === 'new' ? treatmentData['name'] || 'new-treatment' : params.slug

    try {
      const res = await fetch(`/api/admin/treatments/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treatmentData)
      })

      if (res.ok) {
        router.push('/admin/treatments')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to save')
      }
    } catch (error) {
      console.error('Failed to save treatment:', error)
      alert('Failed to save')
    }
  }

  const renderFormField = (key: string, value: any) => {
    if (typeof value === 'string' && value.length > 100) {
      return (
        <div key={key} className="space-y-2">
          <Label>{key}</Label>
          <textarea
            className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </div>
      )
    }

    if (Array.isArray(value)) {
      return (
        <div key={key} className="space-y-2">
          <Label>{key}</Label>
          <div className="space-y-2">
            {value.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const updated = [...value]
                    updated[index] = e.target.value
                    handleChange(key, updated)
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updated = value.filter((_, i) => i !== index)
                    handleChange(key, updated)
                  }}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div key={key} className="space-y-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-lg mb-2">{key}</h3>
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="space-y-2">
              <Label>{subKey}</Label>
              {renderFormField(subKey, subValue)}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div key={key} className="space-y-2">
        <Label>{key}</Label>
        <Input
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
        />
      </div>
    )
  }

  const previewContent = (
    <div className="prose max-w-none space-y-4">
      {Object.entries(treatmentData).map(([key, value]) => (
        <div key={key}>
          <h2 className="text-xl font-bold mt-4">{key}</h2>
          {typeof value === 'string' && (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Treatment: {decodeURIComponent(params.slug as string)}</h1>
        <Button onClick={handleSubmit}>Save</Button>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="json">Raw JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4 mt-4">
          <Tabs value={viewMode} className="w-full">
            <TabsList>
              <TabsTrigger value="form" onClick={() => setViewMode('form')}>
                Form View
              </TabsTrigger>
              <TabsTrigger value="json" onClick={() => setViewMode('json')}>
                JSON View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="space-y-4">
              {Object.entries(treatmentData).map(([key, value]) =>
                renderFormField(key, value)
              )}
            </TabsContent>

            <TabsContent value="json">
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                {JSON.stringify(treatmentData, null, 2)}
              </pre>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="preview">
          {previewContent}
        </TabsContent>
      </Tabs>
    </div>
  )
}
