import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/admin/file-utils'
import { validateTreatment } from '@/lib/admin/validators'

export async function GET() {
  try {
    const treatments = await readJsonFile('treatments.json')
    return NextResponse.json(treatments)
  } catch (error) {
    console.error('Failed to read treatments:', error)
    return NextResponse.json({ error: 'Failed to read treatments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { slug, data } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const validation = validateTreatment(data)

    if (!validation.success) {
      console.error('Validation error:', validation.error.errors)
      return NextResponse.json({ error: 'Invalid treatment data', details: validation.error.errors }, { status: 400 })
    }

    const treatments = await readJsonFile('treatments.json')
    const updated = { ...treatments, [slug]: validation.data }
    await writeJsonFile('treatments.json', updated)

    return NextResponse.json(validation.data, { status: 201 })
  } catch (error) {
    console.error('Failed to create treatment:', error)
    return NextResponse.json({ error: 'Failed to create treatment' }, { status: 500 })
  }
}
