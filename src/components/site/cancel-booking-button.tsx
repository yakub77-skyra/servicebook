"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Ban, AlertTriangle } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
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

export function CancelBookingButton({
  bookingId,
  bookingLabel,
}: {
  bookingId: string
  bookingLabel: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [cancelling, setCancelling] = React.useState(false)

  async function handleCancel() {
    setCancelling(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        setCancelling(false)
        setOpen(false)
        toast({
          title: "Could not cancel",
          description: json?.error || "Please try again.",
          variant: "destructive",
        })
        return
      }

      setCancelling(false)
      setOpen(false)
      toast({
        title: "Booking cancelled",
        description: `Your ${bookingLabel} appointment has been cancelled.`,
      })
      // Re-fetch the page data from the server so the list updates.
      router.refresh()
    } catch (err) {
      console.error("[cancel booking] error:", err)
      setCancelling(false)
      setOpen(false)
      toast({
        title: "Network error",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5 hover:text-destructive">
          <Ban className="size-4" />
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-500" />
            Cancel this booking?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will cancel your <strong>{bookingLabel}</strong> appointment.
            You can rebook a new slot anytime. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelling}>Keep booking</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleCancel()
            }}
            disabled={cancelling}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {cancelling ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Yes, cancel booking"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
