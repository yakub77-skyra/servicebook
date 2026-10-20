import { Wrench } from "lucide-react"

import { db } from "@/lib/db"
import { ServicesTable } from "@/components/site/services-table"

export const dynamic = "force-dynamic"

export default async function AdminServicesPage() {
  let services: Awaited<ReturnType<typeof db.service.findMany>> = []
  try {
    services = await db.service.findMany({
      orderBy: { createdAt: "asc" },
    })
  } catch (error) {
    console.error("[admin/services] DB unavailable, showing empty state:", error)
    services = []
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Services
        </h1>
        <p className="mt-1 text-muted-foreground">
          Add, edit, or remove services from your catalog.
        </p>
      </div>

      <ServicesTable services={services} />
    </div>
  )
}
