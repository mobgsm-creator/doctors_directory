import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/admin/file-utils'
import { validatePractitioner } from '@/lib/admin/validators'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const practitioners = await readJsonFile('derms_processed_new_5403.json')
    
    const practitioner = practitioners.find((p: any) => p.practitioner_name === params.slug)

    if (!practitioner) {
      return NextResponse.json({ error: 'Practitioner not found' }, { status: 404 })
    }

    return NextResponse.json(practitioner)
  } catch (error) {
    console.error('Failed to read practitioner:', error)
    return NextResponse.json({ error: 'Failed to read practitioner' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await request.json()
    const validation = validatePractitioner(data)

    if (!validation.success) {
      console.error('Validation error:', validation.error.errors)
      return NextResponse.json({ error: 'Invalid practitioner data', details: validation.error.errors }, { status: 400 })
    }

    const practitioners = await readJsonFile('derms_processed_new_5403.json')
    const index = practitioners.findIndex((p: any) => p.slug === params.slug)

    if (index === -1) {
      return NextResponse.json({ error: 'Practitioner not found' }, { status: 404 })
    }

    const updated = [...practitioners]
    updated[index] = validation.data
    await writeJsonFile('derms_processed_new_5403.json', updated)

    return NextResponse.json(validation.data)
  } catch (error) {
    console.error('Failed to update practitioner:', error)
    return NextResponse.json({ error: 'Failed to update practitioner' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const practitioners = await readJsonFile('derms_processed_new_5403.json')
    const filtered = practitioners.filter((p: any) => p.slug !== params.slug)

    if (practitioners.length === filtered.length) {
      return NextResponse.json({ error: 'Practitioner not found' }, { status: 404 })
    }

    await writeJsonFile('derms_processed_new_5403.json', filtered)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete practitioner:', error)
    return NextResponse.json({ error: 'Failed to delete practitioner' }, { status: 500 })
  }
}
