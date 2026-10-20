import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"

// POST /api/webhooks/booking-notification
// This route is called BY n8n (or any external automation) to update a
// booking's status after sending email notifications, reminders, etc.
//
// Example n8n flow:
//   1. Booking created → n8n receives webhook from /api/bookings
//   2. n8n sends confirmation email to customer
//   3. n8n sends notification email to admin
//   4. n8n calls THIS route to mark the booking as "confirmed"
//
// Auth: requires a shared secret passed as ?key=WEBHOOK_SECRET env var.
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")
    const expectedKey = process.env.WEBHOOK_SECRET

    // If WEBHOOK_SECRET is configured, require it. If not configured (dev),
    // allow without auth so testing works.
    if (expectedKey && key !== expectedKey) {
      return fail("Unauthorized", 401)
    }

    const body = await request.json().catch(() => null)
    if (!body) return fail("Invalid JSON body", 400)

    const bookingId = String(body.bookingId ?? "").trim()
    const action = String(body.action ?? "").trim()

    if (!bookingId) return fail("bookingId is required", 422)
    if (!action) return fail("action is required", 422)

    const booking = await db.booking.findUnique({ where: { id: bookingId } })
    if (!booking) return fail("Booking not found", 404)

    // Supported actions n8n can trigger.
    switch (action) {
      case "confirm":
        await db.booking.update({
          where: { id: bookingId },
          data: { status: "confirmed" },
        })
        return ok({ bookingId, status: "confirmed" })

      case "complete":
        await db.booking.update({
          where: { id: bookingId },
          data: { status: "completed" },
        })
        return ok({ bookingId, status: "completed" })

      case "reminder_sent":
        // Just a log — no DB change. n8n uses this to confirm reminder sent.
        console.log(`[webhook] Reminder sent for booking ${bookingId}`)
        return ok({ bookingId, reminderSent: true })

      default:
        return fail(
          `Unknown action: ${action}. Supported: confirm, complete, reminder_sent`,
          422
        )
    }
  } catch (error) {
    console.error("[POST /api/webhooks/booking-notification] error:", error)
    return fail("Webhook processing failed", 500)
  }
}
