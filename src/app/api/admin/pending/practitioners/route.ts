import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/admin/file-utils'


export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newData = { ...data, status: "approved" }

    if (!data.slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 })
    }
    
    const pending = await readJsonFile('pending_practitioners.json')
    const index = pending.findIndex((p: any) => p.slug === newData.slug)
    if (index !== -1) {
      const updated = [...pending]
      updated[index] = newData
      await writeJsonFile('pending_practitioners.json', updated)
      return NextResponse.json({ success: true })
    }
    
    const clinics = await readJsonFile('derms_processed_new_5403.json')
    const indexClinic = clinics.findIndex((p: any) => p.slug === newData.slug)
    if (indexClinic !== -1) {
      const updated = [...clinics]
      updated[indexClinic] = newData
      await writeJsonFile('derms_processed_new_5403.json', updated)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Failed to approve clinic:', error)
  }
    return NextResponse.json({ error: 'Failed to approve clinic' }, { status: 500 })
}