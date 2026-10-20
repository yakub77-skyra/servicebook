import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  Star,
  ShieldCheck,
  Clock,
  CreditCard,
  Search,
  CalendarCheck,
  Bell,
  Home as HomeIcon,
  Wind,
  Scissors,
  GraduationCap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { siteConfig } from "@/lib/site"

// Small static data used only for the hero preview.
// Real services will come from the database in Phase 2/3.
const previewServices = [
  { icon: HomeIcon, label: "Home Cleaning", price: "₹499" },
  { icon: Wind, label: "AC Repair", price: "₹699" },
  { icon: Scissors, label: "Salon at Home", price: "₹899" },
  { icon: GraduationCap, label: "Math Tutoring", price: "₹399" },
]

const steps = [
  {
    icon: Search,
    title: "Find a service",
    description: "Browse trusted local services and compare prices and durations.",
  },
  {
    icon: CalendarCheck,
    title: "Pick a time slot",
    description: "Choose a date and time that works for you in just a few taps.",
  },
  {
    icon: Bell,
    title: "Get confirmed",
    description: "Receive instant booking confirmation and reminders by email.",
  },
]

const features = [
  {
    icon: ShieldCheck,
    title: "Verified professionals",
    description: "Every service provider is background-checked and rated by real customers.",
  },
  {
    icon: Clock,
    title: "On-time guarantee",
    description: "Arrive on time, every time. Track your booking status in real time.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    description: "Pay safely online with encrypted, test-mode checkout and instant receipts.",
  },
]

export default function HomePage() {
  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        {/* Decorative background blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-40 -left-24 size-96 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: copy */}
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                <Sparkles className="size-3.5 text-primary" />
                Trusted by 5,000+ happy customers
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Book trusted local{" "}
                <span className="text-primary">services</span> in minutes
              </h1>

              <p className="mt-5 text-lg text-muted-foreground">
                {siteConfig.name} makes it easy to discover, book, and pay for
                home services online. Cleaning, repairs, salon, tutoring — all
                in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-6 text-base">
                  <Link href="/services">
                    Browse services
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-base"
                >
                  <Link href="/contact">Talk to us</Link>
                </Button>
              </div>

              {/* Trust row */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="font-medium text-foreground">4.9/5</span>
                  <span>from 1,200+ reviews</span>
                </div>
              </div>
            </div>

            {/* Right: booking card mockup */}
            <div className="relative">
              <Card className="shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Upcoming booking
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Confirmed
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <HomeIcon className="size-6" />
                    </span>
                    <div>
                      <p className="font-semibold">Home Cleaning</p>
                      <p className="text-sm text-muted-foreground">
                        60 min · ₹499
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-border bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="mt-0.5 font-medium">Sat, 12 Oct</p>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="mt-0.5 font-medium">10:00 AM</p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border pt-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Popular services
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {previewServices.map((s) => (
                        <div
                          key={s.label}
                          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                        >
                          <s.icon className="size-4 text-primary" />
                          <span className="truncate text-xs font-medium">
                            {s.label}
                          </span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {s.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-border bg-card px-4 py-3 shadow-lg sm:block">
                <p className="text-xs text-muted-foreground">Paid securely</p>
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <CreditCard className="size-4 text-primary" />
                  ₹499 · Receipt sent
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Booking a service takes less than two minutes. Here is the simple
              three-step process.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <Card key={step.title} className="relative h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="size-5" />
                    </span>
                    <span className="text-3xl font-bold text-muted-foreground/30">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features strip ===== */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why choose {siteConfig.name}?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Built for trust, speed, and convenience — everything you need to
              manage home services online.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="border-t border-border/60 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to book your next service?
              </h2>
              <p className="mt-3 text-primary-foreground/80">
                Join thousands of customers who save time every week with{" "}
                {siteConfig.name}.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-12 px-6 text-base"
              >
                <Link href="/signup">
                  Create free account
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-primary-foreground/30 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/services">View services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
