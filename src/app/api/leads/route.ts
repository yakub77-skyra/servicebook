import { db } from "@/lib/db"
import { ok, fail, isValidEmail, isValidPhone } from "@/lib/api"
import { forwardLeadToN8n } from "@/lib/n8n"

// POST /api/leads
// Body: { name, email, phone, message, source? }
// Creates a lead record. In Phase 8 this will also forward to an n8n webhook.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body) return fail("Invalid JSON body", 400)

    const name = String(body.name ?? "").trim()
    const email = String(body.email ?? "").trim()
    const phone = String(body.phone ?? "").trim()
    const message = String(body.message ?? "").trim()
    const source = String(body.source ?? "contact_form").trim()

    // --- Validation ---
    if (!name) return fail("Name is required", 422)
    if (name.length < 2) return fail("Name is too short", 422)

    if (!email) return fail("Email is required", 422)
    if (!isValidEmail(email)) return fail("Please enter a valid email", 422)

    if (!phone) return fail("Phone number is required", 422)
    if (!isValidPhone(phone))
      return fail("Please enter a valid phone number", 422)

    if (!message) return fail("Message is required", 422)
    if (message.length < 10)
      return fail("Message should be at least 10 characters", 422)

    // --- Save to database ---
    const lead = await db.lead.create({
      data: { name, email, phone, message, source },
    })

    // --- Forward lead data to n8n (non-blocking) ---
    await forwardLeadToN8n({
      leadId: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      source: lead.source,
      createdAt: lead.createdAt.toISOString(),
    })

    return ok(lead, 201)
  } catch (error) {
    console.error("[POST /api/leads] error:", error)
    return fail("Failed to submit your message", 500)
  }
}
