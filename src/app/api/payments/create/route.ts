import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { getSession } from "@/lib/session"

// POST /api/payments/create
// Body: { bookingId }
// Creates a mock "payment intent" for a booking. In production this would
// call Razorpay/Stripe to create an order; here we simulate it by creating a
// Payment row with status=pending and returning a fake transaction id +
// client-side instructions.
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return fail("Please log in", 401)
    if (session.role !== "customer")
      return fail("Only customers can make payments", 403)

    const body = await request.json().catch(() => null)
    if (!body) return fail("Invalid JSON body", 400)

    const bookingId = String(body.bookingId ?? "").trim()
    if (!bookingId) return fail("Booking ID is required", 422)

    // --- Fetch the booking (must belong to this customer) ---
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    })

    if (!booking) return fail("Booking not found", 404)
    if (booking.customerId !== session.userId)
      return fail("Not authorized to pay for this booking", 403)

    // --- Don't allow duplicate payments ---
    if (booking.paymentStatus === "paid")
      return fail("This booking is already paid", 409)

    // --- Check for an existing pending payment to reuse ---
    const existingPayment = await db.payment.findFirst({
      where: { bookingId, paymentStatus: "pending" },
    })

    if (existingPayment) {
      return ok({
        paymentId: existingPayment.id,
        transactionId: existingPayment.transactionId,
        amount: existingPayment.amount,
        currency: "INR",
        // Mock "order" id that the client will reference during verification.
        orderId: `order_${existingPayment.id}`,
      })
    }

    // --- Create a new pending payment ---
    const transactionId = `txn_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`

    const payment = await db.payment.create({
      data: {
        bookingId,
        amount: booking.service.price,
        paymentMethod: "card",
        paymentStatus: "pending",
        transactionId,
      },
    })

    return ok({
      paymentId: payment.id,
      transactionId,
      amount: payment.amount,
      currency: "INR",
      orderId: `order_${payment.id}`,
    })
  } catch (error) {
    console.error("[POST /api/payments/create] error:", error)
    return fail("Failed to initiate payment", 500)
  }
}
