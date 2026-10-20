import Link from "next/link"
import {
  Zap,
  Mail,
  Bell,
  Webhook,
  CheckCircle2,
  XCircle,
  Copy,
  ArrowRight,
  Workflow,
} from "lucide-react"

import { getN8nStatus } from "@/lib/n8n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

// The payload n8n will receive for booking events (shown in the setup guide).
const bookingPayloadExample = `{
  "event": "booking.created",
  "sentAt": "2025-10-20T07:30:00.000Z",
  "data": {
    "bookingId": "cmvg...",
    "customerName": "Priya Sharma",
    "customerEmail": "customer@servicebook.com",
    "customerPhone": "+91 98765 43210",
    "serviceTitle": "Home Cleaning",
    "servicePrice": 499,
    "durationMinutes": 60,
    "bookingDate": "2025-10-21",
    "bookingTime": "10:00",
    "notes": "Please bring extra supplies",
    "status": "pending",
    "paymentStatus": "pending",
    "createdAt": "2025-10-20T07:30:00.000Z"
  }
}`

const leadPayloadExample = `{
  "event": "lead.created",
  "sentAt": "2025-10-20T07:30:00.000Z",
  "data": {
    "leadId": "cmvg...",
    "name": "Anita Patel",
    "email": "anita@example.com",
    "phone": "9123456780",
    "message": "I would like to know about bulk booking discounts.",
    "source": "contact_form",
    "createdAt": "2025-10-20T07:30:00.000Z"
  }
}`

export default async function AutomationPage() {
  const status = getN8nStatus()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <Zap className="size-7 text-amber-500" />
          n8n Automation
        </h1>
        <p className="mt-1 text-muted-foreground">
          Connect ServiceBook AI to n8n for email notifications, reminders, and
          lead routing.
        </p>
      </div>

      {/* Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Booking webhook
              </p>
              <p className="mt-1 font-semibold">
                {status.bookingWebhookConfigured ? "Connected" : "Not configured"}
              </p>
            </div>
            {status.bookingWebhookConfigured ? (
              <CheckCircle2 className="size-8 text-emerald-600" />
            ) : (
              <XCircle className="size-8 text-muted-foreground" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Lead webhook
              </p>
              <p className="mt-1 font-semibold">
                {status.leadWebhookConfigured ? "Connected" : "Not configured"}
              </p>
            </div>
            {status.leadWebhookConfigured ? (
              <CheckCircle2 className="size-8 text-emerald-600" />
            ) : (
              <XCircle className="size-8 text-muted-foreground" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Workflow className="size-4 text-primary" />
            How it works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                1
              </span>
              <div>
                <p className="font-medium">Customer creates a booking or submits a lead</p>
                <p className="text-sm text-muted-foreground">
                  ServiceBook AI saves it to the database and fires a POST to
                  your n8n webhook URL.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                2
              </span>
              <div>
                <p className="font-medium">n8n workflow triggers</p>
                <p className="text-sm text-muted-foreground">
                  Your n8n workflow receives the payload and can send emails,
                  Slack messages, or update a CRM.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                3
              </span>
              <div>
                <p className="font-medium">n8n calls back (optional)</p>
                <p className="text-sm text-muted-foreground">
                  After sending emails, n8n can call the webhook receiver to
                  update booking status (confirm, complete).
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Setup instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Setup instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">1. Add these to your <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.env.local</code>:</p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs"><code>{`# n8n webhook URLs (from your n8n workflow's Webhook node)
N8N_BOOKING_WEBHOOK_URL=https://your-n8n.app/webhook/booking-notification
N8N_LEAD_WEBHOOK_URL=https://your-n8n.app/webhook/lead-capture

# Optional: secret to protect the callback webhook
WEBHOOK_SECRET=your-secret-key-here`}</code></pre>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">2. Create two n8n workflows:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <p className="flex items-center gap-2 font-medium">
                  <Mail className="size-4 text-primary" />
                  Booking notification
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Trigger: Webhook node (POST).<br />
                  Actions: Send email to customer + admin, schedule reminder.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="flex items-center gap-2 font-medium">
                  <Bell className="size-4 text-primary" />
                  Lead capture
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Trigger: Webhook node (POST).<br />
                  Actions: Add to CRM, notify sales team, auto-reply email.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">3. Copy the Webhook URL from n8n and paste into your env vars.</p>
            <p className="text-xs text-muted-foreground">
              Restart the dev server after adding env vars. The status cards
              above will show &ldquo;Connected&rdquo; when configured.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payload examples */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Webhook className="size-4 text-primary" />
              Booking payload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-xs text-muted-foreground">
              Sent to <code className="rounded bg-muted px-1.5 py-0.5">N8N_BOOKING_WEBHOOK_URL</code> when a booking is created:
            </p>
            <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-muted/30 p-4 text-xs"><code>{bookingPayloadExample}</code></pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Webhook className="size-4 text-primary" />
              Lead payload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-xs text-muted-foreground">
              Sent to <code className="rounded bg-muted px-1.5 py-0.5">N8N_LEAD_WEBHOOK_URL</code> when the contact form is submitted:
            </p>
            <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-muted/30 p-4 text-xs"><code>{leadPayloadExample}</code></pre>
          </CardContent>
        </Card>
      </div>

      {/* Callback webhook */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Callback webhook (n8n → ServiceBook)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            After sending notifications, n8n can call this route to update a
            booking&apos;s status:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs"><code>{`POST /api/webhooks/booking-notification?key=YOUR_WEBHOOK_SECRET
Content-Type: application/json

{ "bookingId": "cmvg...", "action": "confirm" }

# Supported actions: "confirm", "complete", "reminder_sent"`}</code></pre>
        </CardContent>
      </Card>

      {/* What n8n workflows handle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">What the n8n workflows handle</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              "Email confirmation to customer",
              "Email notification to admin",
              "Booking reminder (scheduled)",
              "Lead auto-reply email",
              "Lead notification to sales team",
              "Add lead to CRM/Google Sheets",
              "Slack/Discord notification",
              "Booking status callback",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
