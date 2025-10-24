"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit2, Trash2 } from "lucide-react"
import type { DocumentTemplate } from "@/lib/types"

interface TemplateManagerProps {
  templates: DocumentTemplate[]
  onAdd?: () => void
  onEdit?: (template: DocumentTemplate) => void
  onDelete?: (templateId: string) => void
}

export function TemplateManager({ templates, onAdd, onEdit, onDelete }: TemplateManagerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="border border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Document Templates</CardTitle>
          <CardDescription>Manage predefined document templates</CardDescription>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setIsOpen(!isOpen)}>
          <Plus className="h-4 w-4" />
          Add Template
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">{template.name}</p>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit?.(template)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete?.(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
