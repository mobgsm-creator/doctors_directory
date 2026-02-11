import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/admin/file-utils'
import { validateClinic } from '@/lib/admin/validators'

export async function GET() {
  try {
    const clinics = await readJsonFile('clinics_processed_new.json')

    return NextResponse.json(clinics)
  } catch (error) {
    console.error('Failed to read clinics:', error)
    return NextResponse.json({ error: 'Failed to read clinics' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validation = validateClinic(data)

    if (!validation.success) {
      console.error('Validation error:', validation.error.errors)
      return NextResponse.json({ error: 'Invalid clinic data', details: validation.error.errors }, { status: 400 })
    }

    const clinics = await readJsonFile('clinics_processed_new.json')
    const updated = [...clinics, validation.data]
    await writeJsonFile('clinics_processed_new.json', updated)

    return NextResponse.json(validation.data, { status: 201 })
  } catch (error) {
    console.error('Failed to create clinic:', error)
    return NextResponse.json({ error: 'Failed to create clinic' }, { status: 500 })
  }
}
