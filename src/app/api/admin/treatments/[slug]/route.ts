import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/admin/file-utils'
import { validateTreatment } from '@/lib/admin/validators'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const treatments = await readJsonFile('treatments.json')
    const treatment = treatments[params.slug]

    if (!treatment) {
      return NextResponse.json({ error: 'Treatment not found' }, { status: 404 })
    }

    return NextResponse.json(treatment)
  } catch (error) {
    console.error('Failed to read treatment:', error)
    return NextResponse.json({ error: 'Failed to read treatment' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await request.json()
    const validation = validateTreatment(data)

    if (!validation.success) {
      console.error('Validation error:', validation.error.errors)
      return NextResponse.json({ error: 'Invalid treatment data', details: validation.error.errors }, { status: 400 })
    }

    const treatments = await readJsonFile('treatments.json')
    const updated = { ...treatments, [params.slug]: validation.data }
    await writeJsonFile('treatments.json', updated)

    return NextResponse.json(validation.data)
  } catch (error) {
    console.error('Failed to update treatment:', error)
    return NextResponse.json({ error: 'Failed to update treatment' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const treatments = await readJsonFile('treatments.json')
    const { [params.slug]: _, ...rest } = treatments

    await writeJsonFile('treatments.json', rest)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete treatment:', error)
    return NextResponse.json({ error: 'Failed to delete treatment' }, { status: 500 })
  }
}
