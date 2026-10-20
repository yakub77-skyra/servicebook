"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { BookingStatusBadge } from "@/components/site/status-badges"

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const

export function BookingStatusSelector({
  bookingId,
  currentStatus,
  customerName,
  serviceTitle,
}: {
  bookingId: string
  currentStatus: string
  customerName: string
  serviceTitle: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [busy, setBusy] = React.useState(false)
  const [status, setStatus] = React.useState(currentStatus)

  async function changeStatus(newStatus: string) {
    if (newStatus === status) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
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

      setStatus(newStatus)
      setBusy(false)
      toast({
        title: "Status updated",
        description: `${serviceTitle} for ${customerName} → ${newStatus}.`,
      })
      router.refresh()
    } catch (err) {
      console.error("[status change] error:", err)
      setBusy(false)
      toast({ title: "Network error", variant: "destructive" })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full disabled:opacity-50"
          aria-label={`Change status for ${serviceTitle}`}
        >
          <BookingStatusBadge status={status} />
          {busy ? (
            <Loader2 className="size-3 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDown className="size-3 text-muted-foreground" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Change status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUSES.map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => changeStatus(s)}
            className="flex items-center justify-between capitalize"
          >
            {s}
            {s === status && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
