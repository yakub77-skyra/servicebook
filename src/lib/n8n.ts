// n8n webhook forwarding utilities.
// Sends event data to n8n workflows (booking notifications, lead capture).
// Webhook URLs are read from env vars — if not set, forwarding is skipped
// silently so the app works with or without n8n connected.

type BookingPayload = {
  bookingId: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  serviceTitle: string
  servicePrice: number
  durationMinutes: number
  bookingDate: string
  bookingTime: string
  notes: string | null
  status: string
  paymentStatus: string
  createdAt: string
}

type LeadPayload = {
  leadId: string
  name: string
  email: string
  phone: string | null
  message: string
  source: string
  createdAt: string
}

// Forward a booking event to the n8n booking-notification workflow.
// Non-blocking: logs errors but never throws (so booking creation isn't
// affected if n8n is down or not configured).
export async function forwardBookingToN8n(payload: BookingPayload): Promise<void> {
  const webhookUrl = process.env.N8N_BOOKING_WEBHOOK_URL
  if (!webhookUrl) {
    // n8n not configured — skip silently.
    return
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5s timeout

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "booking.created",
        data: payload,
        sentAt: new Date().toISOString(),
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)
    console.log(`[n8n] Booking ${payload.bookingId} forwarded to n8n`)
  } catch (error) {
    // Don't let n8n failures break the booking flow.
    console.error("[n8n] Failed to forward booking:", error)
  }
}

// Forward a lead event to the n8n lead-capture workflow.
export async function forwardLeadToN8n(payload: LeadPayload): Promise<void> {
  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL
  if (!webhookUrl) {
    return
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "lead.created",
        data: payload,
        sentAt: new Date().toISOString(),
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)
    console.log(`[n8n] Lead ${payload.leadId} forwarded to n8n`)
  } catch (error) {
    console.error("[n8n] Failed to forward lead:", error)
  }
}

// Check whether n8n webhooks are configured (for the admin status indicator).
export function getN8nStatus() {
  return {
    bookingWebhookConfigured: !!process.env.N8N_BOOKING_WEBHOOK_URL,
    leadWebhookConfigured: !!process.env.N8N_LEAD_WEBHOOK_URL,
  }
}
