import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/admin/file-utils'



export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {

    const data = await request.json()
    const newData = { ...data, status: "pending" }

    const clinics = await readJsonFile('pending_clinics.json')
    const index = clinics.findIndex((c: any) => c.slug === params.slug)

    if (index === -1) {
      const updated = [...clinics, newData]
      await writeJsonFile('pending_clinics.json', updated)
      return NextResponse.json({ success: true })
    }
    
    const updated = [...clinics]
    updated[index] = newData
    await writeJsonFile('pending_clinics.json', updated)
    

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update clinic:', error)
    return NextResponse.json({ error: 'Failed to update clinic' }, { status: 500 })
  }
}