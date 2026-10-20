import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CalendarDays,
} from "lucide-react"

import { getServiceById, getActiveServices } from "@/lib/services"
import { formatPrice, formatDuration } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ServiceCard } from "@/components/site/service-card"

// Pre-generate the static params for each service (helps SEO + perf).
export async function generateStaticParams() {
  const services = await getActiveServices()
  return services.map((s) => ({ id: s.id }))
}

// Per-service metadata for SEO.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const service = await getServiceById(id)
  if (!service) {
    return { title: "Service not found — ServiceBook AI" }
  }
  return {
    title: `${service.title} — ServiceBook AI`,
    description: service.shortDescription,
  }
}

// What's included list — shown on every service for a cleaner UI.
const includedItems = [
  "Verified & background-checked professional",
  "All tools and materials included",
  "Instant booking confirmation by email",
  "Secure online payment with receipt",
  "100% satisfaction guarantee",
]

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const service = await getServiceById(id)

  if (!service) {
    notFound()
  }

  // Related services (same category, exclude current).
  const allActive = await getActiveServices()
  const related = allActive
    .filter((s) => s.category === service.category && s.id !== service.id)
    .slice(0, 3)
  // Fallback: if no siblings, show other categories.
  const fallback = allActive.filter((s) => s.id !== service.id).slice(0, 3)
  const relatedServices = related.length > 0 ? related : fallback

  return (
    <>
      {/* Back link */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link href="/services">
            <ArrowLeft className="size-4" />
            All services
          </Link>
        </Button>
      </div>

      {/* Main grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            <Image
              src={service.imageUrl}
              alt={service.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Summary card */}
          <div className="flex flex-col">
            <Badge className="w-fit">{service.category}</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {service.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{service.rating}</span>
                <span className="text-muted-foreground">
                  ({service.reviewCount} reviews)
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4" />
                {formatDuration(service.durationMinutes)}
              </span>
            </div>

            <p className="mt-5 text-muted-foreground">
              {service.description}
            </p>

            {/* Booking summary card */}
            <Card className="mt-6 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Starting at</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(service.price)}
                    </p>
                  </div>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    {formatDuration(service.durationMinutes)}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button asChild size="lg" className="h-12 flex-1 text-base">
                    <Link href={`/booking?service=${service.id}`}>
                      <CalendarDays className="size-4" />
                      Book this service
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 text-base">
                    <Link href="/contact">Ask a question</Link>
                  </Button>
                </div>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  Free cancellation up to 2 hours before your slot
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What's included */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight">What&apos;s included</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {includedItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3.5"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-4 text-primary" />
                Why book with us
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                <li>· Verified, trained professionals</li>
                <li>· Transparent, upfront pricing</li>
                <li>· Secure online payments</li>
                <li>· Instant email confirmation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      {relatedServices.length > 0 && (
        <section className="border-t border-border/60 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                You might also like
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/services">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
