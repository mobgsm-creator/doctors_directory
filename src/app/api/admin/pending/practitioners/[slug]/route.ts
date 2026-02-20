import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/admin/file-utils'



export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {

    const data = await request.json()
    const newData = { ...data, status: "pending" }

    const practitioners = await readJsonFile('pending_practitioners.json')
    const index = practitioners.findIndex((p: any) => p.practitioner_name === params.slug)

    if (index === -1) {
      const updated = [...practitioners, newData]
      await writeJsonFile('pending_practitioners.json', updated)
      return NextResponse.json({ success: true })
    }
    
    const updated = [...practitioners]
    updated[index] = newData
    await writeJsonFile('pending_practitioners.json', updated)
    

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update clinic:', error)
    return NextResponse.json({ error: 'Failed to update clinic' }, { status: 500 })
  }
}