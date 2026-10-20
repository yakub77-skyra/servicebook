import { format, parseISO } from "date-fns"
import { CalendarCheck, IndianRupee } from "lucide-react"

import { db } from "@/lib/db"
import { formatPrice } from "@/lib/format"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/site/status-badges"
import { BookingStatusSelector } from "@/components/site/booking-status-selector"

export const dynamic = "force-dynamic"

export default async function AdminBookingsPage() {
  let bookings: Awaited<ReturnType<typeof db.booking.findMany>> = []
  try {
    bookings = await db.booking.findMany({
      include: {
        service: true,
        customer: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[admin/bookings] DB unavailable, showing empty state:", error)
    bookings = []
  }

  // Count by status for the summary chips.
  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Bookings
        </h1>
        <p className="mt-1 text-muted-foreground">
          View and update the status of all customer bookings.
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", counts.all],
            ["pending", counts.pending],
            ["confirmed", counts.confirmed],
            ["completed", counts.completed],
            ["cancelled", counts.cancelled],
          ] as const
        ).map(([label, count]) => (
          <Badge
            key={label}
            variant="outline"
            className="gap-1.5 capitalize"
          >
            {label === "all" ? "All" : label}
            <span className="rounded-full bg-muted px-1.5 text-xs font-semibold">
              {count}
            </span>
          </Badge>
        ))}
      </div>

      {/* Table / empty state */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
            <CalendarCheck className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">No bookings yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Once customers start booking, all appointments will appear here for
            status management.
          </p>
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Date & Time</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <p className="font-medium">{b.customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.customer.email}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{b.service.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.service.category}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p>{format(parseISO(b.bookingDate), "d MMM yyyy")}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.bookingTime}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 font-medium">
                          <IndianRupee className="size-3.5 text-muted-foreground" />
                          {formatPrice(b.service.price).replace("₹", "")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <BookingStatusSelector
                          bookingId={b.id}
                          currentStatus={b.status}
                          customerName={b.customer.name}
                          serviceTitle={b.service.title}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <PaymentStatusBadge status={b.paymentStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
