'use client'

import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Markdown Editor</label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[400px] font-mono text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Live Preview</label>
        <Card className="p-4 min-h-[400px] prose max-w-none overflow-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value}
          </ReactMarkdown>
        </Card>
      </div>
    </div>
  )
}
