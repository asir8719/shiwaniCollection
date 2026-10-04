import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import { PlusIcon } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { getProductColumns, type ProductItem } from "./product-columns"

interface CategoryOption {
  id: number
  name: string
  is_active: boolean
}

const emptyProduct = {
  name: "",
  price: "",
  image: "",
  quantity: "0",
  category_id: "",
  status: "Active",
}

const AdminProduct = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [form, setForm] = useState(emptyProduct)
  const [error, setError] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const [categoriesOptions, setCategoriesOptions] = useState<CategoryOption[]>([])

  async function fetchProducts() {
    const { data, error: fetchError } = await supabase
      .from("products")
      .select("id, name, price, image, quantity, category_id, status")
      .order("id", { ascending: true })

    if (fetchError) {
      toast.error(`Error fetching products: ${fetchError.message}`)
    } else {
      setProducts((data ?? []) as ProductItem[])
    }
    setIsLoading(false)
  }

  async function fetchCategoriesOptions() {
    const { data, error: catError } = await supabase
      .from("categories")
      .select("id, name, is_active")
      .order("name", { ascending: true })

    if (catError) {
      console.error("Error loading category options:", catError.message);
    } else {
      setCategoriesOptions(data || [])
    }
  }

  useEffect(() => {
    let isMounted = true

    // const loadProducts = async () => {
    //   const { data, error: fetchError } = await supabase
    //     .from("products")
    //     .select("id, name, price, image, quantity, status")
    //     .order("id", { ascending: true })

    //   if (!isMounted) return
    //   if (fetchError) {
    //     toast.error(`Error fetching products: ${fetchError.message}`)
    //   } else {
    //     setProducts((data ?? []) as ProductItem[])
    //   }
    //   setIsLoading(false)
    // }

    const loadInitialData = async () => {
      // Run both network queries concurrently to speed up admin load time
      await Promise.all([fetchProducts(), fetchCategoriesOptions()])
      if (isMounted) {
        setIsLoading(false)
      }
    }

    void loadInitialData()
    return () => {
      isMounted = false
    }
  }, [])

  const resetForm = () => {
    setForm(emptyProduct)
    setEditingProduct(null)
    setError(null)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) resetForm()
  }

  const columns = getProductColumns({
    categoryNames: new Map(categoriesOptions.map(({ id, name }) => [id, name])),
    onDeleteSuccess: () => {
      toast.success("Product deleted successfully")
      void fetchProducts()
    },
    onEditTrigger: (product) => {
      setEditingProduct(product)
      setForm({
        name: product.name,
        price: String(product.price),
        image: product.image ?? "",
        quantity: String(product.quantity),
        category_id: product.category_id != null ? String(product.category_id) : "",
        status: product.status,
      })
      setOpen(true)
    },
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const productValues = {
      name: form.name.trim(),
      price: Number(form.price),
      image: form.image.trim() || null,
      quantity: Number(form.quantity),
      category_id: form.category_id ? Number(form.category_id) : null,
      status: form.status,
    }

    const result = editingProduct
      ? await supabase
          .from("products")
          .update(productValues)
          .eq("id", editingProduct.id)
      : await supabase.from("products").insert([productValues])

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error.message)
      toast.error(`Failed to ${editingProduct ? "update" : "create"} product`)
      return
    }

    toast.success(
      editingProduct ? "Product updated successfully" : "Product created successfully",
    )
    setOpen(false)
    resetForm()
    void fetchProducts()
  }

  if (isLoading) return <div className="p-8 text-center">Loading products...</div>

  return (
    <div className="flex flex-col gap-6 pt-6 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} products</p>
        </div>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger render={<Button className="h-10 gap-2" size="sm" />}>
            <span className="hidden lg:inline">Add product</span>
            <PlusIcon className="size-4" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit product" : "Add product"}
                </DialogTitle>
                <DialogDescription>Enter the product details below.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="product-name">Name</Label>
                  <Input
                    id="product-name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="e.g. Casual shirt"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product-price">Price</Label>
                    <Input
                      id="product-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) => setForm({ ...form, price: event.target.value })}
                      placeholder="0.00"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-quantity">Quantity</Label>
                    <Input
                      id="product-quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={form.quantity}
                      onChange={(event) => setForm({ ...form, quantity: event.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product-image">Image URL</Label>
                  <Input
                    id="product-image"
                    type="url"
                    value={form.image}
                    onChange={(event) => setForm({ ...form, image: event.target.value })}
                    placeholder="https://example.com/product.jpg"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product-category">Category (Optional)</Label>
                  <Select
                    value={form.category_id || null}
                    onValueChange={(value) => setForm({
                      ...form,
                      category_id: value && value !== "none" ? value : "",
                    })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="product-category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Uncategorized)</SelectItem>
                      {categoriesOptions.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}{category.is_active ? "" : " (Inactive)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product-status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) => value && setForm({ ...form, status: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="product-status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <p role="alert" className="text-center text-sm text-destructive">
                  {error}
                </p>
              )}

              <DialogFooter>
                <DialogClose
                  render={<Button type="button" variant="outline" disabled={isSubmitting} />}
                >
                  Cancel
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : editingProduct
                      ? "Update product"
                      : "Save product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={products} />
    </div>
  )
}

export default AdminProduct