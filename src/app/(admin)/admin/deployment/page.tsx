import {
  Rocket,
  Server,
  Key,
  Database,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

const envVars = [
  { name: "DATABASE_URL", value: "file:./db/custom.db", required: true, note: "SQLite path (dev). Use PostgreSQL URL in production." },
  { name: "AUTH_SECRET", value: "openssl rand -base64 32", required: true, note: "Secret for signing JWT session tokens." },
  { name: "N8N_BOOKING_WEBHOOK_URL", value: "https://your-n8n.app/webhook/...", required: false, note: "n8n webhook for booking notifications." },
  { name: "N8N_LEAD_WEBHOOK_URL", value: "https://your-n8n.app/webhook/...", required: false, note: "n8n webhook for lead capture." },
  { name: "WEBHOOK_SECRET", value: "your-secret-key", required: false, note: "Protects the /api/webhooks/booking-notification callback." },
]

const testingChecklist = [
  { category: "Public Pages", items: [
    "Home page renders (hero, services, testimonials, CTA)",
    "Services page: search, category filter, sort all work",
    "Service detail page: image, description, price, Book button",
    "Contact form: validation + success toast + lead saved to DB",
    "Navbar: sticky, mobile menu, links work",
    "Footer: sticky to bottom, links work",
  ]},
  { category: "Authentication", items: [
    "Signup: creates account, redirects to /dashboard",
    "Login: customer → /dashboard, admin → /admin/dashboard",
    "Admin login page: rejects non-admin accounts",
    "Logout: clears session, navbar updates",
    "Protected routes: /dashboard redirects to /login when logged out",
    "Role guard: customer → /admin/dashboard redirects to /dashboard",
  ]},
  { category: "Booking Flow", items: [
    "Booking page: date picker, time slots, notes",
    "Create booking: saves to DB, shows success state",
    "Double-booking prevention works",
    "Past date validation works",
    "Dashboard: stats show correct counts",
    "My Bookings: list, cancel, status badges",
  ]},
  { category: "Payments", items: [
    "Pay button shows for unpaid bookings",
    "Checkout dialog: card form, test card pre-filled",
    "Payment processing: spinner, then success",
    "Receipt: amount, transaction ID, date",
    "Booking auto-confirms on payment",
    "Admin sees payment status + revenue updates",
  ]},
  { category: "Admin Dashboard", items: [
    "Stats: total bookings, revenue, customers, services",
    "Services: add, edit, delete, toggle active",
    "Bookings: change status (pending→confirmed→completed)",
    "Customers: list with booking counts",
    "Leads: table with contact info",
    "Automation page: n8n setup guide + status",
  ]},
  { category: "Automation", items: [
    "Booking creation forwards to n8n (if configured)",
    "Lead creation forwards to n8n (if configured)",
    "Callback webhook updates booking status",
    "Webhook secret auth works",
  ]},
]

export default function DeploymentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <Rocket className="size-7 text-primary" />
          Deployment Guide
        </h1>
        <p className="mt-1 text-muted-foreground">
          Step-by-step instructions to deploy ServiceBook AI to production.
        </p>
      </div>

      {/* Quick start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Rocket className="size-4 text-primary" />
            Deploy to Vercel (5 minutes)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="space-y-3">
            {[
              <>Push your code to a GitHub repository.</>,
              <>Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">vercel.com/new <ExternalLink className="size-3" /></a> and import your repo.</>,
              <>Vercel auto-detects Next.js — keep the default build settings.</>,
              <>Add all environment variables (see the table below).</>,
              <>Click <strong>Deploy</strong>. Your app will be live in ~2 minutes.</>,
              <>Run <code className="rounded bg-muted px-1.5 py-0.5 text-xs">bun run db:push &amp;&amp; bun run db:seed</code> against your production database (or use Vercel Postgres).</>,
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="size-4 text-primary" />
            Environment Variables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Add these in your Vercel project settings → Environment Variables,
            or in your local <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.env.local</code> file.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Variable</th>
                  <th className="px-3 py-2 font-medium">Example</th>
                  <th className="px-3 py-2 font-medium">Required?</th>
                  <th className="px-3 py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {envVars.map((v) => (
                  <tr key={v.name} className="border-t border-border">
                    <td className="px-3 py-2.5">
                      <code className="text-xs font-medium">{v.name}</code>
                    </td>
                    <td className="px-3 py-2.5">
                      <code className="text-xs text-muted-foreground">{v.value}</code>
                    </td>
                    <td className="px-3 py-2.5">
                      {v.required ? (
                        <Badge variant="default" className="text-xs">Required</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Optional</Badge>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{v.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Database */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="size-4 text-primary" />
            Database (Production)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <p className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-400">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>
                <strong>SQLite is for development only.</strong> For production on Vercel
                (serverless, read-only filesystem), switch to PostgreSQL:
              </span>
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">1. Update <code className="rounded bg-muted px-1.5 py-0.5 text-xs">prisma/schema.prisma</code>:</p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs"><code>{`datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}`}</code></pre>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">2. Set <code className="rounded bg-muted px-1.5 py-0.5 text-xs">DATABASE_URL</code> to your Vercel Postgres / Supabase / Neon URL:</p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs"><code>{`DATABASE_URL="postgresql://user:pass@host:5432/dbname"`}</code></pre>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">3. Push schema + seed:</p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs"><code>{`bun run db:push
bun run db:seed`}</code></pre>
          </div>
        </CardContent>
      </Card>

      {/* n8n Deployment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="size-4 text-primary" />
            n8n Deployment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Self-host n8n with Docker (recommended) or use n8n Cloud:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs"><code>{`# Docker quick-start
docker run -d --name n8n \\
  -p 5678:5678 \\
  -v ~/.n8n:/home/node/.n8n \\
  n8nio/n8n

# Access at http://localhost:5678`}</code></pre>
          <p className="text-sm text-muted-foreground">
            Then create 2 workflows (see the <a href="/admin/automation" className="text-primary hover:underline">Automation page</a> for setup details)
            and add the webhook URLs to your Vercel env vars.
          </p>
        </CardContent>
      </Card>

      {/* Testing Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="size-4 text-emerald-600" />
            Pre-Deployment Testing Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Run through this checklist before going live. Each item should be
            verified in the production environment.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {testingChecklist.map((section) => (
              <div key={section.category}>
                <h3 className="mb-2 text-sm font-semibold">{section.category}</h3>
                <ul className="space-y-1.5">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-0.5 size-4 shrink-0 rounded border border-border" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Post-deploy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Post-Deployment</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {[
              "Test signup + login with a fresh account",
              "Create a booking and verify it appears in admin dashboard",
              "Test the payment flow (mock) end-to-end",
              "Submit the contact form and verify the lead appears in admin",
              "Configure n8n webhooks and test booking/lead forwarding",
              "Set up a custom domain in Vercel (optional)",
              "Enable Vercel Analytics (optional)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
