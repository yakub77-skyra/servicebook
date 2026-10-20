import Link from "next/link"
import { Construction, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

// Used for routes that are part of the roadmap but built in a later phase.
// Keeps the site navigable during early phases without broken links.
export function PagePlaceholder({
  title,
  phase,
  description,
}: {
  title: string
  phase: string
  description: string
}) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Construction className="size-8" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
        Planned for {phase}
      </span>
      <Button asChild variant="outline" className="mt-8">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </Button>
    </section>
  )
}
