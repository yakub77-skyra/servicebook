import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { getSession } from "@/lib/session"

// GET /api/bookings/[id]
// Returns a single booking (only if it belongs to the current user, or admin).
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) return fail("Please log in", 401)

    const { id } = await params
    const booking = await db.booking.findUnique({
      where: { id },
      include: { service: true },
    })

    if (!booking) return fail("Booking not found", 404)

    // Only the owner or an admin can view it.
    if (booking.customerId !== session.userId && session.role !== "admin") {
      return fail("Not authorized", 403)
    }

    return ok(booking)
  } catch (error) {
    console.error("[GET /api/bookings/:id] error:", error)
    return fail("Failed to fetch booking", 500)
  }
}

// PATCH /api/bookings/[id]
// Body: { action: "cancel" }
// Lets a customer cancel their own booking (only if not completed).
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) return fail("Please log in", 401)

    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const action = String(body.action ?? "")

    if (action !== "cancel")
      return fail("Only 'cancel' action is supported here", 422)

    const booking = await db.booking.findUnique({ where: { id } })
    if (!booking) return fail("Booking not found", 404)

    // Only the owner can cancel their booking.
    if (booking.customerId !== session.userId)
      return fail("Not authorized to cancel this booking", 403)

    // Can't cancel a completed booking.
    if (booking.status === "completed")
      return fail("Completed bookings cannot be cancelled", 422)
    if (booking.status === "cancelled")
      return fail("This booking is already cancelled", 422)

    const updated = await db.booking.update({
      where: { id },
      data: { status: "cancelled" },
      include: { service: true },
    })

    return ok(updated)
  } catch (error) {
    console.error("[PATCH /api/bookings/:id] error:", error)
    return fail("Failed to cancel booking", 500)
  }
}
