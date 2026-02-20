import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/admin/file-utils'
import { validatePractitioner } from '@/lib/admin/validators'

export async function GET() {
  try {
    const practitioners = await readJsonFile('derms_processed_new_5403.json')
    return NextResponse.json(practitioners)
  } catch (error) {
    console.error('Failed to read practitioners:', error)
    return NextResponse.json({ error: 'Failed to read practitioners' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validation = validatePractitioner(data)

    if (!validation.success) {
      console.error('Validation error:', validation.error.errors)
      return NextResponse.json({ error: 'Invalid practitioner data', details: validation.error.errors }, { status: 400 })
    }

    const practitioners = await readJsonFile('derms_processed_new_5403.json')
    const updated = [...practitioners, validation.data]
    await writeJsonFile('derms_processed_new_5403.json', updated)

    return NextResponse.json(validation.data, { status: 201 })
  } catch (error) {
    console.error('Failed to create practitioner:', error)
    return NextResponse.json({ error: 'Failed to create practitioner' }, { status: 500 })
  }
}
