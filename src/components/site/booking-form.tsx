"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  Clock,
  Loader2,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import { format, parseISO } from "date-fns"

import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Time slots — kept in sync with the API route.
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
  "17:30", "18:00",
]

type Props = {
  service: {
    id: string
    title: string
    price: number
    durationMinutes: number
  }
}

export function BookingForm({ service }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  // Default to tomorrow so the user doesn't have to think about it.
  const tomorrow = React.useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return format(d, "yyyy-MM-dd")
  }, [])
  const [date, setDate] = React.useState<string>(tomorrow)
  const [time, setTime] = React.useState<string>("")
  const [notes, setNotes] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [createdBookingId, setCreatedBookingId] = React.useState<string | null>(
    null
  )

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!date) {
      toast({ title: "Pick a date", description: "Please choose a date for your appointment.", variant: "destructive" })
      return
    }
    if (!time) {
      toast({ title: "Pick a time", description: "Please select a time slot.", variant: "destructive" })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          bookingDate: date,
          bookingTime: time,
          notes: notes.trim() || undefined,
        }),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        setSubmitting(false)
        toast({
          title: "Booking failed",
          description: json?.error || "Could not create your booking.",
          variant: "destructive",
        })
        return
      }

      setCreatedBookingId(json.data.id)
      setSubmitting(false)
      setDone(true)
      toast({
        title: "Booking created!",
        description: "Your appointment is pending confirmation.",
      })
    } catch (err) {
      console.error("[booking] error:", err)
      setSubmitting(false)
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
    }
  }

  // Success state
  if (done && createdBookingId) {
    const formattedDate = date ? format(parseISO(date), "EEE, d MMM") : ""
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
          <CheckCircle2 className="size-8" />
        </span>
        <h3 className="mt-4 text-xl font-semibold">Booking confirmed!</h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Your <span className="font-medium text-foreground">{service.title}</span> appointment
          on <span className="font-medium text-foreground">{formattedDate}</span> at{" "}
          <span className="font-medium text-foreground">{time}</span> has been created.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Status: <span className="font-medium text-amber-600">Pending confirmation</span> · Payment: pending
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => router.push("/dashboard/bookings")}>
            View my bookings
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" onClick={() => router.push("/services")}>
            Browse more services
          </Button>
        </div>
      </div>
    )
  }

  // Today's date as min for the date input
  const today = format(new Date(), "yyyy-MM-dd")

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Date picker (native input — reliable + mobile-friendly) */}
      <div className="space-y-2">
        <Label htmlFor="booking-date">
          <CalendarDays className="mr-1.5 inline size-4" />
          Select date
        </Label>
        <Input
          id="booking-date"
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">
          Open Mon–Sat. Same-day bookings available.
        </p>
      </div>

      {/* Time slot picker */}
      <div className="space-y-2">
        <Label>
          <Clock className="mr-1.5 inline size-4" />
          Select time slot
        </Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {TIME_SLOTS.map((slot) => {
            const hour = parseInt(slot.split(":")[0])
            const isAfternoon = hour >= 12
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={cn(
                  "rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors",
                  time === slot
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent"
                )}
              >
                <span className="block text-xs text-muted-foreground">
                  {isAfternoon ? "PM" : "AM"}
                </span>
                {format(parseISO(`2000-01-01T${slot}:00`), "h:mm")}
              </button>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Any special instructions for the professional? e.g. 'Bring extra cleaning supplies'"
        />
        <p className="text-xs text-muted-foreground">{notes.length}/500 characters</p>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-900/50 dark:bg-amber-950/20">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800 dark:text-amber-400">
          Your booking will be created with <strong>pending</strong> status.
          Payment is collected after confirmation. Free cancellation up to 2 hours before your slot.
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full text-base"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating booking...
          </>
        ) : (
          <>
            <CheckCircle2 className="size-4" />
            Confirm booking
          </>
        )}
      </Button>
    </form>
  )
}
