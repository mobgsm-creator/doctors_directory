import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/admin/file-utils'
import { validateProduct } from '@/lib/admin/validators'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const products = await readJsonFile('products_processed_new.json')
    const product = products.find((p: any) => p.slug === params.slug)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to read product:', error)
    return NextResponse.json({ error: 'Failed to read product' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await request.json()
    const validation = validateProduct(data)

    if (!validation.success) {
      console.error('Validation error:', validation.error.errors)
      return NextResponse.json({ error: 'Invalid product data', details: validation.error.errors }, { status: 400 })
    }

    const products = await readJsonFile('products_processed_new.json')
    const index = products.findIndex((p: any) => p.slug === params.slug)

    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const updated = [...products]
    updated[index] = validation.data
    await writeJsonFile('products_processed_new.json', updated)

    return NextResponse.json(validation.data)
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const products = await readJsonFile('products_processed_new.json')
    const filtered = products.filter((p: any) => p.slug !== params.slug)

    if (products.length === filtered.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await writeJsonFile('products_processed_new.json', filtered)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
