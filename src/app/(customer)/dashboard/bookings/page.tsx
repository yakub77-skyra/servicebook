import Link from "next/link"
import Image from "next/image"
import {
  CalendarDays,
  Clock,
  IndianRupee,
  ArrowRight,
  Sparkles,
  StickyNote,
} from "lucide-react"
import { format, parseISO } from "date-fns"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { formatPrice, formatDuration } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/site/status-badges"
import { CancelBookingButton } from "@/components/site/cancel-booking-button"
import { PaymentButton } from "@/components/site/payment-button"

export const dynamic = "force-dynamic"

export default async function MyBookingsPage() {
  const user = await getCurrentUser()

  const bookings = await db.booking.findMany({
    where: { customerId: user!.id },
    include: { service: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Bookings
          </h1>
          <p className="mt-1 text-muted-foreground">
            View and manage your past and upcoming appointments.
          </p>
        </div>
        <Button asChild>
          <Link href="/services">
            Book a service
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
            <CalendarDays className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">No bookings yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Browse our services and book your first appointment in under two
            minutes.
          </p>
          <Button asChild className="mt-5">
            <Link href="/services">
              Browse services
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const canCancel =
              booking.status === "pending" || booking.status === "confirmed"

            return (
              <Card key={booking.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {/* Service image */}
                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24 sm:aspect-square">
                      <Image
                        src={booking.service.imageUrl}
                        alt={booking.service.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">
                            {booking.service.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(booking.service.price)} ·{" "}
                            {formatDuration(booking.service.durationMinutes)}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <BookingStatusBadge status={booking.status} />
                          <PaymentStatusBadge status={booking.paymentStatus} />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <CalendarDays className="size-4" />
                          {format(parseISO(booking.bookingDate), "EEE, d MMM yyyy")}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="size-4" />
                          {booking.bookingTime}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <IndianRupee className="size-4" />
                          {formatPrice(booking.service.price)}
                        </span>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm">
                          <StickyNote className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {booking.notes}
                          </span>
                        </div>
                      )}

                      <p className="mt-3 text-xs text-muted-foreground">
                        Booked on{" "}
                        {format(booking.createdAt, "d MMM yyyy 'at' h:mm a")}
                      </p>

                      {/* Action buttons: Pay (if unpaid) + Cancel (if cancellable) */}
                      {(booking.paymentStatus === "pending" || canCancel) && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {booking.paymentStatus === "pending" &&
                            booking.status !== "cancelled" && (
                              <PaymentButton
                                bookingId={booking.id}
                                serviceTitle={booking.service.title}
                                amount={booking.service.price}
                                variant="compact"
                              />
                            )}
                          {canCancel && (
                            <CancelBookingButton
                              bookingId={booking.id}
                              bookingLabel={booking.service.title}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
