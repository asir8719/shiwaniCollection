"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { features } from "@/components/data-table"

// Define the type to match your categories state data
export type CategoryItem = {
  id: number
  name: string
  slug: string
  is_active: boolean
  created_at: string
  image_url: string
}

interface ColumnMetaProps {
  onDeleteSuccess: () => void
  onEditTrigger: (category: CategoryItem) => void
}

export const getColumns = ({ onDeleteSuccess, onEditTrigger }: ColumnMetaProps): ColumnDef<typeof features, CategoryItem>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "image_url",
    header: "Preview",
    cell: ({ row }) => {
      const imageUrl = row.original.image_url
      return (
        <div className="h-10 w-10 overflow-hidden rounded-md border bg-gray-50 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt="Category Thumbnail" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted-foreground text-center">No Image</span>
          )}
        </div>
      )
    }
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => <div className="font-semibold text-gray-900">{row.getValue("name")}</div>,
  },
  {
    id: "slug",
    accessorKey: "slug",
    header: "URL Route",
    cell: ({ row }) => <code className="text-xs text-muted-foreground font-mono">/{row.getValue("slug")}</code>,
  },
  {
    id: "is_active",
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean
      return (
        <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original

      const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete the "${category.name}" category?`)) {
          const { supabase } = await import("@/lib/supabaseClient")
          const { error } = await supabase.from("categories").delete().eq("id", category.id)
          
          if (error) {
            alert(`Error deleting row: ${error.message}`)
          } else {
            onDeleteSuccess()
          }
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${category.name}`}
            render={<Button variant="ghost" className="h-8 w-8 p-0" />}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEditTrigger(category)} className="flex items-center gap-2 cursor-pointer">
                <Pencil className="w-3.5 h-3.5 text-blue-600" /> Edit Category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
