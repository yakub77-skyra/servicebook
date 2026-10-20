import { Wrench, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Services</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your service catalog.
          </p>
        </div>
        <Button disabled>
          <Wrench className="size-4" />
          Add service
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
          <Wrench className="size-7" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Service management coming soon</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Full CRUD for services (add, edit, delete, toggle active) is built in
          Phase 6.
        </p>
        <Button asChild variant="outline" className="mt-5">
          <Link href="/services">
            View public services
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
