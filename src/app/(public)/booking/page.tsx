import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Clock, IndianRupee, ArrowLeft, ArrowRight, Search, ShieldCheck } from "lucide-react"

import { getServiceById, getActiveServices } from "@/lib/services"
import { formatPrice, formatDuration } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BookingForm } from "@/components/site/booking-form"

export const metadata: Metadata = {
  title: "Book an appointment — ServiceBook AI",
  description: "Select a date and time to book your service appointment.",
}

export const dynamic = "force-dynamic"

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const { service: serviceParam } = await searchParams

  // No service selected — show a picker.
  if (!serviceParam) {
    const services = await getActiveServices()
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground">
          <Link href="/services">
            <ArrowLeft className="size-4" />
            Back to services
          </Link>
        </Button>

        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Search className="size-7" />
          </span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Choose a service to book
          </h1>
          <p className="mt-2 text-muted-foreground">
            Select from our available services below to start your booking.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/booking?service=${s.id}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={s.imageUrl}
                  alt={s.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(s.price)} · {formatDuration(s.durationMinutes)}
                </p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>
    )
  }

  // Service selected — show booking form.
  const service = await getServiceById(serviceParam)

  if (!service) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <p className="mt-2 text-muted-foreground">
          The service you&apos;re trying to book is no longer available.
        </p>
        <Button asChild className="mt-6">
          <Link href="/services">Browse all services</Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground">
        <Link href={`/services/${service.id}`}>
          <ArrowLeft className="size-4" />
          Back to {service.title}
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: service summary */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="relative aspect-[16/10] w-full bg-muted">
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <Badge>{service.category}</Badge>
              <h2 className="mt-2 text-xl font-bold">{service.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {service.shortDescription}
              </p>

              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <IndianRupee className="size-4" />
                    Price
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(service.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-4" />
                    Duration
                  </span>
                  <span className="font-medium">
                    {formatDuration(service.durationMinutes)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
                Free cancellation up to 2 hours before your slot
              </div>
            </div>
          </div>
        </div>

        {/* Right: booking form */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6 sm:p-7">
              <h1 className="text-2xl font-bold tracking-tight">
                Book your appointment
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a date and time below. Takes less than a minute.
              </p>

              <div className="mt-6">
                <BookingForm
                  service={{
                    id: service.id,
                    title: service.title,
                    price: service.price,
                    durationMinutes: service.durationMinutes,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
