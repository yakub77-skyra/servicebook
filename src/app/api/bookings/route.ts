import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { getSession } from "@/lib/session"

// Time slots offered for booking (30-min gaps during business hours).
export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

// Validate a date string is YYYY-MM-DD and not in the past.
function isValidBookingDate(dateStr: string): boolean {
  const d = new Date(dateStr + "T00:00:00")
  if (isNaN(d.getTime())) return false
  // Compare against today (ignoring time)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d >= today
}

// POST /api/bookings
// Body: { serviceId, bookingDate, bookingTime, notes? }
// Creates a booking for the logged-in customer.
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return fail("Please log in to book a service", 401)
    if (session.role !== "customer")
      return fail("Admins cannot book services", 403)

    const body = await request.json().catch(() => null)
    if (!body) return fail("Invalid JSON body", 400)

    const serviceId = String(body.serviceId ?? "").trim()
    const bookingDate = String(body.bookingDate ?? "").trim()
    const bookingTime = String(body.bookingTime ?? "").trim()
    const notes = body.notes ? String(body.notes).trim().slice(0, 500) : null

    // --- Validation ---
    if (!serviceId) return fail("Please select a service", 422)
    if (!bookingDate) return fail("Please pick a date", 422)
    if (!isValidBookingDate(bookingDate))
      return fail("Please pick today or a future date", 422)
    if (!bookingTime) return fail("Please pick a time slot", 422)
    if (!TIME_SLOTS.includes(bookingTime))
      return fail("Please pick a valid time slot", 422)

    // --- Check service exists + active ---
    const service = await db.service.findFirst({
      where: { id: serviceId, isActive: true },
    })
    if (!service) return fail("Service not found or unavailable", 404)

    // --- Prevent double-booking the same slot for the same service ---
    const existing = await db.booking.findFirst({
      where: {
        serviceId,
        bookingDate,
        bookingTime,
        status: { not: "cancelled" },
      },
    })
    if (existing)
      return fail("That time slot is already booked. Please pick another.", 409)

    // --- Create the booking ---
    const booking = await db.booking.create({
      data: {
        customerId: session.userId,
        serviceId,
        bookingDate,
        bookingTime,
        notes,
        status: "pending",
        paymentStatus: "pending",
      },
      include: { service: true },
    })

    // Phase 8 will forward this booking to the n8n webhook here:
    //   await forwardBookingToN8n(booking)
    // For now we just create the record.

    return ok(booking, 201)
  } catch (error) {
    console.error("[POST /api/bookings] error:", error)
    return fail("Failed to create your booking", 500)
  }
}

// GET /api/bookings
// Returns the current customer's bookings (newest first), with service details.
export async function GET() {
  try {
    const session = await getSession()
    if (!session) return fail("Please log in", 401)

    // Admins can see all bookings via /api/admin/bookings (Phase 6).
    // Here we only return the current user's bookings.
    const bookings = await db.booking.findMany({
      where: { customerId: session.userId },
      include: { service: true },
      orderBy: { createdAt: "desc" },
    })

    return ok(bookings)
  } catch (error) {
    console.error("[GET /api/bookings] error:", error)
    return fail("Failed to fetch your bookings", 500)
  }
}
