'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EditPreviewTabsProps {
  editTab: React.ReactNode
  previewTab: React.ReactNode
}

export function EditPreviewTabs({ editTab, previewTab }: EditPreviewTabsProps) {
  return (
    <Tabs defaultValue="edit" className="w-full">
      <TabsList>
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="edit">{editTab}</TabsContent>
      <TabsContent value="preview">{previewTab}</TabsContent>
    </Tabs>
  )
}
