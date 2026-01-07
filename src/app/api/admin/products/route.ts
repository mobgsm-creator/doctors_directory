import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/admin/file-utils'
import { validateProduct } from '@/lib/admin/validators'

export async function GET() {
  try {
    const products = await readJsonFile('products_processed_new.json')
    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to read products:', error)
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validation = validateProduct(data)

    if (!validation.success) {
      console.error('Validation error:', validation.error.errors)
      return NextResponse.json({ error: 'Invalid product data', details: validation.error.errors }, { status: 400 })
    }

    const products = await readJsonFile('products_processed_new.json')
    const updated = [...products, validation.data]
    await writeJsonFile('products_processed_new.json', updated)

    return NextResponse.json(validation.data, { status: 201 })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
