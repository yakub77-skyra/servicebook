import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react"

import { SignupForm } from "@/components/site/signup-form"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Sign up — ServiceBook AI",
  description: "Create your free ServiceBook AI account and start booking trusted local services.",
}

const perks = [
  "Book services in under 2 minutes",
  "Track all your bookings in one place",
  "Secure payments with instant receipts",
  "Free cancellation up to 2 hours before",
]

export default function SignupPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 w-fit text-muted-foreground">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </Button>

      <div className="grid items-center gap-8 lg:grid-cols-2">
        {/* Left: form */}
        <div className="order-2 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:order-1">
          <div className="mb-6">
            <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="size-6" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Free to join. No credit card required.
            </p>
          </div>

          <SignupForm />
        </div>

        {/* Right: perks */}
        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            Why join ServiceBook AI?
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Book trusted local services in minutes
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of customers who save time every week with our
            verified professionals and instant booking system.
          </p>
          <ul className="mt-6 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
