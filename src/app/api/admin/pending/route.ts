import { NextResponse } from 'next/server'
import { readJsonFile } from '@/lib/admin/file-utils'

export async function GET() {
  try {
    const pending_practitioners = await readJsonFile('pending_practitioners.json')
    const pending_clinics = await readJsonFile('pending_clinics.json')
    const pending = { ...pending_practitioners, ...pending_clinics }
    return NextResponse.json(pending)
  } catch (error) {
    console.error('Failed to read pending practitioners:', error)
    return NextResponse.json({ error: 'Failed to read pending practitioners' }, { status: 500 })
  }
}
