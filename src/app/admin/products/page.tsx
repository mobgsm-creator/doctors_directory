'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/DataTable'
import type { Product } from '@/lib/types'

const columns = [
  { key: 'image_url' as any, label: 'Image',
    render: (value: string) => (
      <img src={value} alt="" className="w-10 h-10 rounded-full object-cover" />
    )
   },
  { key: 'product_name' as any, label: 'Product Name' },
  { key: 'product_category' as any, label: 'Category' },
  { key: 'brand' as any, label: 'Brand' },
]

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/directory/api/admin/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(error => {
        console.error('Failed to load products:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <DataTable
      data={products}
      columns={columns}
      onEdit={(product) => router.push(`/admin/products/${product.slug}`)}
      onDelete={async (product) => {
        if (confirm(`Delete product "${product.product_name}"?`)) {
          await fetch(`/directory/api/admin/products/${product.slug}`, { method: 'DELETE' })
          setProducts(products.filter(p => p.slug !== product.slug))
        }
      }}
      onAdd={() => router.push('/admin/products/new')}
    />
  )
}
