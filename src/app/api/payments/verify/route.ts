import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { getSession } from "@/lib/session"

// POST /api/payments/verify
// Body: { paymentId, transactionId }
// In production this would verify the Razorpay/Stripe signature server-side.
// Here we simulate a successful payment: mark the Payment row as paid, update
// the booking's paymentStatus, and confirm the booking.
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return fail("Please log in", 401)
    if (session.role !== "customer")
      return fail("Only customers can make payments", 403)

    const body = await request.json().catch(() => null)
    if (!body) return fail("Invalid JSON body", 400)

    const paymentId = String(body.paymentId ?? "").trim()
    const transactionId = String(body.transactionId ?? "").trim()

    if (!paymentId) return fail("Payment ID is required", 422)
    if (!transactionId) return fail("Transaction ID is required", 422)

    // --- Fetch the payment + booking ---
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: { booking: { include: { service: true } } },
    })

    if (!payment) return fail("Payment not found", 404)
    if (payment.transactionId !== transactionId)
      return fail("Transaction ID mismatch", 422)
    if (payment.booking.customerId !== session.userId)
      return fail("Not authorized", 403)
    if (payment.paymentStatus === "paid")
      return fail("This payment is already completed", 409)

    // --- Simulate gateway verification (always succeeds in test mode) ---
    // In production: verify razorpay_signature / stripe webhook signature.
    await new Promise((r) => setTimeout(r, 600)) // fake processing delay

    // --- Update payment + booking in a transaction ---
    const [updatedPayment, updatedBooking] = await db.$transaction([
      db.payment.update({
        where: { id: paymentId },
        data: { paymentStatus: "paid" },
      }),
      db.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: "paid",
          // Auto-confirm the booking when paid.
          status:
            payment.booking.status === "pending" ? "confirmed" : payment.booking.status,
        },
      }),
    ])

    return ok({
      payment: updatedPayment,
      booking: updatedBooking,
      service: payment.booking.service,
      // Mock receipt data for the success screen.
      receipt: {
        transactionId,
        amount: updatedPayment.amount,
        method: updatedPayment.paymentMethod,
        paidAt: updatedPayment.createdAt,
        serviceTitle: payment.booking.service.title,
      },
    })
  } catch (error) {
    console.error("[POST /api/payments/verify] error:", error)
    return fail("Payment verification failed", 500)
  }
}
