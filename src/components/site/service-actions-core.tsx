"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2, AlertTriangle } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DeleteServiceButton({
  serviceId,
  serviceTitle,
}: {
  serviceId: string
  serviceTitle: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        setDeleting(false)
        setOpen(false)
        toast({
          title: "Delete failed",
          description: json?.error || "Please try again.",
          variant: "destructive",
        })
        return
      }

      setDeleting(false)
      setOpen(false)
      toast({
        title: "Service deleted",
        description: `"${serviceTitle}" has been removed${
          json.data?.cascadedBookings
            ? ` (and ${json.data.cascadedBookings} booking(s))`
            : ""
        }.`,
      })
      router.refresh()
    } catch (err) {
      console.error("[delete service] error:", err)
      setDeleting(false)
      setOpen(false)
      toast({ title: "Network error", variant: "destructive" })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/5"
          aria-label={`Delete ${serviceTitle}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-500" />
            Delete this service?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{serviceTitle}</strong> and all
            its bookings. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={deleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function ToggleServiceActive({
  serviceId,
  isActive,
  serviceTitle,
}: {
  serviceId: string
  isActive: boolean
  serviceTitle: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [busy, setBusy] = React.useState(false)

  async function handleToggle(checked: boolean) {
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: checked }),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        setBusy(false)
        toast({
          title: "Update failed",
          description: json?.error || "Please try again.",
          variant: "destructive",
        })
        return
      }

      setBusy(false)
      toast({
        title: checked ? "Service activated" : "Service deactivated",
        description: `"${serviceTitle}" is now ${checked ? "bookable" : "hidden"}.`,
      })
      router.refresh()
    } catch (err) {
      console.error("[toggle active] error:", err)
      setBusy(false)
      toast({ title: "Network error", variant: "destructive" })
    }
  }

  return (
    <Switch
      checked={isActive}
      disabled={busy}
      onCheckedChange={handleToggle}
      aria-label={`Toggle ${serviceTitle} active`}
    />
  )
}
