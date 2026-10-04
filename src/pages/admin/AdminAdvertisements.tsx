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
import { getAdColumns, type AdvertisementItem } from "./advertisement-columns"

interface AdFormState {
  title: string
  banner_url: string
  target_url: string
  placement: string
  start_date: string
  end_date: string
  is_active: string
}

const emptyAd: AdFormState = {
  title: "",
  banner_url: "",
  target_url: "",
  placement: "homepage_hero",
  start_date: "",
  end_date: "",
  is_active: "true",
}

const AdminAdvertisement = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [ads, setAds] = useState<AdvertisementItem[]>([])
  const [form, setForm] = useState<AdFormState>(emptyAd)
  const [error, setError] = useState<string | null>(null)
  const [editingAd, setEditingAd] = useState<AdvertisementItem | null>(null)

  async function fetchAds() {
    const { data, error: fetchError } = await supabase
      .from("advertisements")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      toast.error(`Error loading banners: ${fetchError.message}`)
    } else {
      setAds(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    void fetchAds()
  }, [])

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setForm(emptyAd)
      setEditingAd(null)
      setError(null)
    }
  }

  const columns = getAdColumns({
    onDeleteSuccess: () => {
      toast.success("Advertisement banner removed")
      void fetchAds()
    },
    onEditTrigger: (ad) => {
      setEditingAd(ad)
      // Format timestamps cleanly to local datetime-local format matching HTML pickers (YYYY-MM-DDTHH:MM)
      const formatTime = (isoString: string) => isoString.slice(0, 16)
      
      setForm({
        title: ad.title,
        banner_url: ad.banner_url,
        target_url: ad.target_url || "",
        placement: ad.placement,
        start_date: formatTime(ad.start_date),
        end_date: formatTime(ad.end_date),
        is_active: String(ad.is_active),
      })
      setOpen(true)
    },
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Form Validation rules block
    if (new Date(form.start_date) >= new Date(form.end_date)) {
      setError("Expiration end date must happen AFTER the start time.")
      setIsSubmitting(false)
      return
    }

    const adValues = {
      title: form.title.trim(),
      banner_url: form.banner_url.trim(),
      target_url: form.target_url.trim() || null,
      placement: form.placement,
      start_date: new Date(form.start_date).toISOString(),
      end_date: new Date(form.end_date).toISOString(),
      is_active: form.is_active === "true",
    }

    const result = editingAd
      ? await supabase
          .from("advertisements")
          .update(adValues)
          .eq("id", editingAd.id)
      : await supabase.from("advertisements").insert([adValues])

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error.message)
      toast.error(`Failed to execute campaign database update`)
      return
    }

    toast.success(editingAd ? "Campaign updated successfully" : "New offer banner live!")
    setOpen(false)
    setForm(emptyAd)
    setEditingAd(null)
    void fetchAds()
  }

  if (isLoading) return <div className="p-8 text-center">Loading advertisement systems...</div>

  return (
    <div className="flex flex-col gap-6 pt-6 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing Banners & Offers</h1>
          <p className="text-sm text-muted-foreground">{ads.length} campaigns configured</p>
        </div>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger render={<Button className="h-10 gap-2" size="sm" />}>
              <span className="hidden lg:inline">Create Advertisement</span>
              <PlusIcon className="size-4" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>{editingAd ? "Modify Campaign Layout" : "Add Advertisement Banner"}</DialogTitle>
                <DialogDescription>Schedule and configure your client offer banner timelines.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 py-1">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ad-title">Campaign Title</Label>
                  <Input
                    id="ad-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Diwali Festive Offer 20% Off"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ad-banner">Banner Image URL</Label>
                  <Input
                    id="ad-banner"
                    type="url"
                    value={form.banner_url}
                    onChange={(e) => setForm({ ...form, banner_url: e.target.value })}
                    placeholder="https://example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ad-target">Destination Target Route (Optional)</Label>
                  <Input
                    id="ad-target"
                    value={form.target_url}
                    onChange={(e) => setForm({ ...form, target_url: e.target.value })}
                    placeholder="e.g. /products?category=kurtas"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ad-start">Start Date & Time</Label>
                    <Input
                      id="ad-start"
                      type="datetime-local"
                      value={form.start_date}
                      onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ad-end">End Expiration Date</Label>
                    <Input
                      id="ad-end"
                      type="datetime-local"
                      value={form.end_date}
                      onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ad-placement">Banner Placement</Label>
                    <Select
                      value={form.placement}
                      onValueChange={(val) => {
                        if (val !== null) setForm({ ...form, placement: val })
                      }}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="ad-placement">
                        <SelectValue placeholder="Select placement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homepage_hero">Main Homepage Slider</SelectItem>
                        <SelectItem value="top_announcement">Top Alert Header Strip</SelectItem>
                        <SelectItem value="sidebar_promo">Product Page Sidebar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ad-status">Master Status Toggle</Label>
                    <Select
                      value={form.is_active}
                      onValueChange={(val) => {
                        if (val !== null) setForm({ ...form, is_active: val })
                      }}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="ad-status">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active (Live)</SelectItem>
                        <SelectItem value="false">Paused (Hidden)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}

                            <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose render={<Button type="button" variant="outline" disabled={isSubmitting} />}>
                  Cancel
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : editingAd ? "Update Banner" : "Deploy Campaign"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🏆 The main dynamic data table view that lists all configuration rows */}
      <div className="rounded-md bg-white">
        <DataTable 
            columns={columns} 
            data={ads} 
            meta={{
                onDeleteSuccess: () => fetchAds(),
                onEditTrigger: (ad: AdvertisementItem) => setEditingAd(ad)
            }}
        />
      </div>
    </div>
  )
}

export default AdminAdvertisement