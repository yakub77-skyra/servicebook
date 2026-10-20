import type { Metadata } from "next"

import { getActiveServices, getServiceCategories } from "@/lib/services"
import { ServicesExplorer } from "@/components/site/services-explorer"

// Always render on-demand — queries the DB for services.
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Services — ServiceBook AI",
  description:
    "Browse trusted local services — home cleaning, AC repair, salon at home, math tutoring and more. Book online in minutes.",
}

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    getActiveServices(),
    getServiceCategories(),
  ])

  return (
    <>
      {/* Page header */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            {services.length} services available
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Explore our services
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Hand-picked, verified professionals for your home and personal
            needs. Transparent pricing, instant booking, secure payments.
          </p>
        </div>
      </section>

      {/* Explorer (search + filter + grid) */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ServicesExplorer services={services} categories={categories} />
      </section>
    </>
  )
}
