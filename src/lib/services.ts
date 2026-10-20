// Service data access layer.
// Phase 3: backed by Prisma (SQLite). The function signatures match the
// previous mock version so the UI components don't need any changes.

import { db } from "@/lib/db"
import type { Service as PrismaService } from "@prisma/client"

// Re-export the DB row type so consumers keep using the same `Service` type.
export type Service = PrismaService

// Get all active services (ordered oldest-first, matching seed order).
export async function getActiveServices(): Promise<Service[]> {
  return db.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  })
}

// Get unique, sorted list of service categories (for the filter chips).
export async function getServiceCategories(): Promise<string[]> {
  const rows = await db.service.findMany({
    where: { isActive: true },
    select: { category: true },
    distinct: ["category"],
  })
  return rows.map((r) => r.category).sort()
}

// Look up a single service by id OR slug (the [id] route accepts both).
export async function getServiceById(idOrSlug: string): Promise<Service | null> {
  return db.service.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      isActive: true,
    },
  })
}
