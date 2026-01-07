'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, Trash2 } from 'lucide-react'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onAdd?: () => void
}

export function DataTable<T>({ data, columns, onEdit, onDelete, onAdd }: DataTableProps<T>) {
  console.log("here")
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = data.filter((item: any) =>
    Object.entries(item).some(([_, value]) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
  const [visibleCount, setVisibleCount] = useState(50);
  console.log("visable count",visibleCount);

  const visibleData = filteredData.slice(0, visibleCount);


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visibleData.map((item: any, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3 text-sm">
                      {column.render ? column.render(item[column.key], item) : String(item[column.key]) ?? ''}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          Edit
                        </Button>
                      )}
                      {/* {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )} */}
                    </div>
                  </td>
                </tr>
              ))}
              
            </tbody>
          </table>
          <button
  onClick={() => setVisibleCount(v => v + 50)}
  disabled={visibleCount >= filteredData.length}
>
  Load more
</button>

        </div>
      </div>
    </div>
  )
}
