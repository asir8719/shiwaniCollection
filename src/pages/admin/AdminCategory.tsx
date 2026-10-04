import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { getColumns, type CategoryItem } from "./columns";

const AdminCategory = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [isActive, setIsActive] = useState("true"); // Stores string "true" or "false"
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

    // Fetch implementation function extracted to allow re-fetching on success
    async function fetchCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true })

        if(error) {
            toast.error(`Error fetching data: ${error.message}`)
        } else {
            setCategories(data || [])
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const columns = getColumns({
        onDeleteSuccess: () => {
            toast.success("Category removed successfully")
            fetchCategories() // Auto refresh row lists view
        },
        onEditTrigger: (category) => {
            setEditingCategory(category)
            setCategoryName(category.name)
            setIsActive(String(category.is_active))
            setOpen(true)
            setCurrentImageUrl(category.image_url || null)
        }
    })
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(!categoryName.trim()) return 

        setIsSubmitting(true)
        setError(null)

        const cleanSlug = categoryName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")

        let finalImageUrl = currentImageUrl

        if (imageFile) {
            const uploadedUrl = await uploadImage(imageFile);
            if (uploadedUrl) finalImageUrl = uploadedUrl;
        }
        
        const categoryValues = {
            name: categoryName.trim(),
            slug: cleanSlug,
            is_active: isActive === "true",
            image_url: finalImageUrl
        }
        const { error: sbError } = editingCategory
            ? await supabase
                .from("categories")
                .update(categoryValues)
                .eq("id", editingCategory.id)
            : await supabase.from("categories").insert([categoryValues])

        setIsSubmitting(false)

        if (sbError) {
            setError(sbError.message)
            toast.error(`Failed to create category`)
        } else {
            toast.success(editingCategory ? "Category updated successfully!" : `Category "${categoryName}" created successfully!`)
            setCategoryName("")
            setIsActive("true")
            setEditingCategory(null)
            setOpen(false)
            fetchCategories() // Reloads list grid view automatically
        }
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) {
            setCategoryName("")
            setIsActive("true")
            setEditingCategory(null)
            setError(null)
            setImageFile(null)
            setCurrentImageUrl(null)
        }
    }

    const uploadImage = async (file: File): Promise<string | null> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `thumbnail/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('category-images')
            .upload(filePath, file);
        
        if (uploadError) {
            throw new Error(`Image Upload Error: ${uploadError.message}`);
        }

        const { data } = supabase.storage.from('category-images').getPublicUrl(filePath);
        return data.publicUrl
    }
    
    if (isLoading) return <div className="p-8 text-center">Connecting to database...</div>
    
  return (
    <div className="flex flex-col gap-6 pt-6 lg:p-6">
        <div className="flex justify-between items-center">
            <span>
                <h1 className="text-2xl font-bold">Categories</h1>
                {/* <p className="text-sm text-muted-foreground">Connected! Found {categories.length} categories.</p> */}
            </span>
            
            {/* Controlled dialog overlay wrapper */}
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger
                    render={<Button className="h-10 flex items-center gap-2" variant="default" size="sm" />}
                >
                    <span className="hidden lg:inline">Add Category</span>
                    <PlusIcon className="w-4 h-4" />
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-sm">
                    {/* The HTML <form> moves down inside Content to capture inputs properly */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                            <DialogDescription>
                                Create a new grouping structure for your menswear products here.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-3 py-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="categoryName">Category Name</Label>
                                <Input 
                                    id="categoryName" 
                                    name="categoryName" 
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="e.g., Casual Shirts"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="category-image">Category Thumbnail Graphic</Label>
                                {currentImageUrl && !imageFile && (
                                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                                        <span>Current:</span>
                                        <img src={currentImageUrl} alt="Current" className="h-6 w-12 object-cover border rounded" />
                                    </div>
                                )}
                                <div className="relative flex items-center">
                                    <Input 
                                        id="category-image" 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        disabled={isSubmitting}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="category-status">Status</Label>
                                <Select 
                                    value={isActive} 
                                    onValueChange={(value) => value && setIsActive(value)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger id="category-status" className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Value strings match true/false conversions evaluated inside handleSubmit */}
                                        <SelectItem value="true">Active</SelectItem>
                                        <SelectItem value="false">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        {error && (
                            <p className="text-sm font-medium text-destructive text-center">
                                {error}
                            </p>
                        )}
                        
                        <DialogFooter className="gap-2 sm:gap-0">
                            <DialogClose
                                render={<Button type="button" variant="outline" disabled={isSubmitting} />}
                            >
                                Cancel
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
        
        {/* Dynamic Display Area */}
        <div className="rounded-md">
            <DataTable 
                columns={columns} 
                data={categories} 
                // Pass meta listeners down so row buttons can reach the triggers cleanly
                meta={{
                    onDeleteSuccess: () => fetchCategories(),
                    onEditTrigger: (category: CategoryItem) => setEditingCategory(category)
                }}
            />
        </div>
    </div>
  )
}

export default AdminCategory;
