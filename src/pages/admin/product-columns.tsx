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

export type ProductItem = {
  id: number
  name: string
  price: number
  image: string | null
  quantity: number
  category_id: number | null
  status: string
}

type ProductColumnActions = {
  categoryNames: ReadonlyMap<number, string>
  onDeleteSuccess: () => void
  onEditTrigger: (product: ProductItem) => void
}

export const getProductColumns = ({
  categoryNames,
  onDeleteSuccess,
  onEditTrigger,
}: ProductColumnActions): ColumnDef<typeof features, ProductItem>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => Number(row.original.price).toFixed(2),
  },
  {
    accessorKey: "image",
    header: "Image",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.image ? (
        <img
          src={row.original.image}
          alt={row.original.name}
          loading="lazy"
          className="size-10 rounded object-cover"
        />
      ) : (
        <span className="text-muted-foreground">No image</span>
      ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "category_id",
    header: "Category",
    cell: ({ row }) => {
      const categoryId = row.original.category_id
      if (categoryId == null) {
        return <span className="text-muted-foreground">Uncategorized</span>
      }

      return categoryNames.get(categoryId) ?? (
        <span className="text-muted-foreground">Category #{categoryId}</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "Active" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original
      const handleDelete = async () => {
        if (!confirm(`Delete the product "${product.name}"?`)) return

        const { supabase } = await import("@/lib/supabaseClient")
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", product.id)

        if (error) {
          alert(`Unable to delete product: ${error.message}`)
          return
        }
        onDeleteSuccess()
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${product.name}`}
            render={<Button variant="ghost" className="size-8 p-0" />}
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEditTrigger(product)}>
                <Pencil className="size-4" />
                Edit product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} variant="destructive">
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]