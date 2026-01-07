import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/admin/file-utils'
import { validateClinic } from '@/lib/admin/validators'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const clinics = await readJsonFile('clinics_processed_new.json')
    const clinic = clinics.find((c: any) => c.slug === params.slug)

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    return NextResponse.json(clinic)
  } catch (error) {
    console.error('Failed to read clinic:', error)
    return NextResponse.json({ error: 'Failed to read clinic' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await request.json()
    const validation = validateClinic(data)

    if (!validation.success) {
      console.error('Validation error:', validation.error.errors)
      return NextResponse.json({ error: 'Invalid clinic data', details: validation.error.errors }, { status: 400 })
    }

    const clinics = await readJsonFile('clinics_processed_new.json')
    const index = clinics.findIndex((c: any) => c.slug === params.slug)

    if (index === -1) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    const updated = [...clinics]
    updated[index] = validation.data
    await writeJsonFile('clinics_processed_new.json', updated)

    return NextResponse.json(validation.data)
  } catch (error) {
    console.error('Failed to update clinic:', error)
    return NextResponse.json({ error: 'Failed to update clinic' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const clinics = await readJsonFile('clinics_processed_new.json')
    const filtered = clinics.filter((c: any) => c.slug !== params.slug)

    if (clinics.length === filtered.length) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    await writeJsonFile('clinics_processed_new.json', filtered)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete clinic:', error)
    return NextResponse.json({ error: 'Failed to delete clinic' }, { status: 500 })
  }
}
