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
import { features } from "@/components/data-table" // Ensure this path points to your features export

export type AdvertisementItem = {
  id: number
  title: string
  banner_url: string
  target_url: string | null
  placement: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}

interface ColumnMetaProps {
  onDeleteSuccess: () => void
  onEditTrigger: (ad: AdvertisementItem) => void
}

export const getAdColumns = ({ onDeleteSuccess, onEditTrigger }: ColumnMetaProps): ColumnDef<typeof features, AdvertisementItem>[] => [
  {
    id: "banner",
    header: "Preview",
    cell: ({ row }) => {
      const bannerUrl = row.getValue("banner") as string || row.original.banner_url
      return (
        <div className="h-10 w-24 overflow-hidden rounded border bg-gray-50 flex items-center justify-center">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted-foreground">No Image</span>
          )}
        </div>
      )
    }
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Campaign Title",
    cell: ({ row }) => <div className="font-semibold text-gray-950">{row.getValue("title")}</div>,
  },
  {
    id: "placement",
    accessorKey: "placement",
    header: "Placement Location",
    cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.getValue("placement")}</Badge>,
  },
  {
    id: "duration",
    header: "Active Timeline",
    cell: ({ row }) => {
      const start = new Date(row.original.start_date).toLocaleDateString("en-IN")
      const end = new Date(row.original.end_date).toLocaleDateString("en-IN")
      
      // Live check against the current client system date
      const isExpired = new Date() > new Date(row.original.end_date)

      return (
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="text-gray-700">Live: {start} - {end}</span>
          {isExpired && <span className="text-red-500 font-medium">⚠️ Expired</span>}
        </div>
      )
    }
  },
  {
    id: "is_active",
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean
      return (
        <Badge className={isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
          {isActive ? "Active" : "Paused"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const ad = row.original

      const handleDelete = async () => {
        if (confirm(`Delete advertisement campaign "${ad.title}"?`)) {
          const { supabase } = await import("@/lib/supabaseClient")
          const { error } = await supabase.from("advertisements").delete().eq("id", ad.id)
          
          if (error) {
            alert(`Error: ${error.message}`)
          } else {
            onDeleteSuccess()
          }
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${ad.title}`}
            render={<Button variant="ghost" className="h-8 w-8 p-0" />}
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEditTrigger(ad)} className="flex items-center gap-2 cursor-pointer">
                <Pencil className="w-3.5 h-3.5 text-blue-600" /> Edit Banner
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
