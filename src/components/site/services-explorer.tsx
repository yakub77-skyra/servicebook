"use client"

import * as React from "react"
import { Search, SlidersHorizontal, PackageOpen } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Service } from "@/lib/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ServiceCard } from "@/components/site/service-card"

type Props = {
  services: Service[]
  categories: string[]
}

export function ServicesExplorer({ services, categories }: Props) {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<string>("All")
  const [sort, setSort] = React.useState<"popular" | "price-low" | "price-high">("popular")

  // Filter + search + sort, all client-side (data set is small in Phase 2).
  const filtered = React.useMemo(() => {
    let result = services

    if (category !== "All") {
      result = result.filter((s) => s.category === category)
    }

    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      )
    }

    result = [...result]
    if (sort === "price-low") result.sort((a, b) => a.price - b.price)
    else if (sort === "price-high") result.sort((a, b) => b.price - a.price)
    else result.sort((a, b) => b.rating - a.rating)

    return result
  }, [services, query, category, sort])

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services..."
            className="h-11 pl-9"
            aria-label="Search services"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-accent"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-9 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Sort services"
            >
              <option value="popular">Most popular</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "service" : "services"}
      </p>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState
          hasQuery={!!query || category !== "All"}
          onReset={() => {
            setQuery("")
            setCategory("All")
          }}
        />
      )}
    </div>
  )
}

function EmptyState({
  hasQuery,
  onReset,
}: {
  hasQuery: boolean
  onReset: () => void
}) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
        <PackageOpen className="size-7" />
      </span>
      <h3 className="mt-4 text-lg font-semibold">No services found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasQuery
          ? "Try a different search term or category."
          : "There are no active services right now. Please check back soon."}
      </p>
      {hasQuery && (
        <Button variant="outline" className="mt-5" onClick={onReset}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
