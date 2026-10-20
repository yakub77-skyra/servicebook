"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Service = {
  id: string
  title: string
  shortDescription: string
  description: string
  price: number
  durationMinutes: number
  imageUrl: string
  category: string
  isActive: boolean
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  // When provided, we're editing; otherwise creating.
  service?: Service | null
}

const EMPTY = {
  title: "",
  shortDescription: "",
  description: "",
  price: "",
  durationMinutes: "",
  imageUrl: "",
  category: "",
  isActive: true,
}

export function ServiceFormDialog({ open, onOpenChange, service }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = React.useState(EMPTY)
  const [saving, setSaving] = React.useState(false)

  // Sync form state when the dialog opens.
  React.useEffect(() => {
    if (open) {
      if (service) {
        setForm({
          title: service.title,
          shortDescription: service.shortDescription,
          description: service.description,
          price: String(service.price),
          durationMinutes: String(service.durationMinutes),
          imageUrl: service.imageUrl,
          category: service.category,
          isActive: service.isActive,
        })
      } else {
        setForm(EMPTY)
      }
    }
  }, [open, service])

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Basic validation
    if (!form.title.trim()) return toast({ title: "Title is required", variant: "destructive" })
    if (!form.shortDescription.trim()) return toast({ title: "Short description is required", variant: "destructive" })
    if (!form.description.trim()) return toast({ title: "Description is required", variant: "destructive" })
    if (!form.price || Number(form.price) < 0) return toast({ title: "Valid price is required", variant: "destructive" })
    if (!form.durationMinutes || Number(form.durationMinutes) < 5)
      return toast({ title: "Duration must be 5+ minutes", variant: "destructive" })
    if (!form.imageUrl.trim()) return toast({ title: "Image URL is required", variant: "destructive" })
    if (!form.category.trim()) return toast({ title: "Category is required", variant: "destructive" })

    setSaving(true)
    try {
      const url = service
        ? `/api/admin/services/${service.id}`
        : "/api/admin/services"
      const method = service ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          shortDescription: form.shortDescription.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          durationMinutes: Number(form.durationMinutes),
          imageUrl: form.imageUrl.trim(),
          category: form.category.trim(),
          isActive: form.isActive,
        }),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        setSaving(false)
        toast({
          title: service ? "Update failed" : "Create failed",
          description: json?.error || "Please try again.",
          variant: "destructive",
        })
        return
      }

      setSaving(false)
      onOpenChange(false)
      toast({
        title: service ? "Service updated" : "Service created",
        description: `"${form.title.trim()}" has been ${service ? "updated" : "added"}.`,
      })
      router.refresh()
    } catch (err) {
      console.error("[service form] error:", err)
      setSaving(false)
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" })
    }
  }

  const isEdit = !!service

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit service" : "Add new service"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the service details below."
              : "Fill in the details for the new service."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Home Cleaning"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="499"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                value={form.durationMinutes}
                onChange={(e) => set("durationMinutes", e.target.value)}
                placeholder="60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="Cleaning"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="shortDescription">Short description</Label>
            <Input
              id="shortDescription"
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              placeholder="Deep clean for every room."
              maxLength={120}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Full description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              placeholder="Detailed description of what the service includes..."
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="isActive" className="cursor-pointer">
                Active (bookable)
              </Label>
              <p className="text-xs text-muted-foreground">
                Inactive services are hidden from customers.
              </p>
            </div>
            <Switch
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(v) => set("isActive", v)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isEdit ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {isEdit ? "Save changes" : "Create service"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
