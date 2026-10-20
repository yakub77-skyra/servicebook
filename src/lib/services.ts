// Service data access layer.
// Phase 3: backed by Prisma (SQLite). The function signatures match the
// previous mock version so the UI components don't need any changes.
//
// Vercel-safe: every query is wrapped in try/catch. If the database is
// missing/unreachable (e.g. no DATABASE_URL on Vercel, SQLite file absent,
// Postgres not provisioned yet), we fall back to static seed data so public
// pages never throw a server-side exception (Digest error).

import { db } from "@/lib/db"
import type { Service as PrismaService } from "@prisma/client"

// Re-export the DB row type so consumers keep using the same `Service` type.
export type Service = PrismaService

const now = new Date()

// Static fallback — mirrors prisma/seed.ts so the site renders even
// when the DB is unavailable. Never throws.
export const fallbackServices: Service[] = [
  {
    id: "fallback-home-cleaning",
    title: "Home Cleaning",
    slug: "home-cleaning",
    shortDescription: "Deep clean for every room by trained professionals.",
    description:
      "Our home cleaning service covers every room in your house — kitchen, bathrooms, bedrooms, and living areas. Trained professionals use eco-friendly products and modern equipment to leave your home spotless.",
    price: 499,
    durationMinutes: 60,
    imageUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d110abb7ea41.jpg",
    category: "Cleaning",
    rating: 4.9,
    reviewCount: 842,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fallback-ac-repair",
    title: "AC Repair",
    slug: "ac-repair",
    shortDescription: "Fast diagnosis and repair for all AC brands.",
    description:
      "Get your air conditioner running like new with our certified technicians. We service all major brands and handle gas refilling, coil cleaning, compressor issues, and general maintenance.",
    price: 699,
    durationMinutes: 45,
    imageUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5d76403b59ae.jpg",
    category: "Appliances",
    rating: 4.8,
    reviewCount: 519,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fallback-salon-at-home",
    title: "Salon at Home",
    slug: "salon-at-home",
    shortDescription: "Premium beauty and grooming services at your doorstep.",
    description:
      "Enjoy a full salon experience without leaving your home. Our certified beauticians offer facials, waxing, threading, manicures, pedicures, and hairstyling using premium branded products.",
    price: 899,
    durationMinutes: 90,
    imageUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c4d373162c51.jpg",
    category: "Beauty",
    rating: 4.9,
    reviewCount: 1267,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fallback-math-tutoring",
    title: "Math Tutoring",
    slug: "math-tutoring",
    shortDescription: "1-on-1 personalized math sessions for grades 6–12.",
    description:
      "Boost your child's confidence in mathematics with personalized 1-on-1 tutoring. Our experienced tutors cover algebra, geometry, trigonometry, and calculus.",
    price: 399,
    durationMinutes: 60,
    imageUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e6e20ef68483.jpg",
    category: "Education",
    rating: 4.7,
    reviewCount: 384,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
]

// Get all active services (ordered oldest-first, matching seed order).
export async function getActiveServices(): Promise<Service[]> {
  try {
    return await db.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    })
  } catch (error) {
    console.error("[services] DB unavailable, using fallback data:", error)
    return fallbackServices
  }
}

// Get unique, sorted list of service categories (for the filter chips).
export async function getServiceCategories(): Promise<string[]> {
  try {
    const rows = await db.service.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
    })
    return rows.map((r) => r.category).sort()
  } catch (error) {
    console.error("[services] DB unavailable for categories, using fallback:", error)
    return [...new Set(fallbackServices.map((s) => s.category))].sort()
  }
}

// Look up a single service by id OR slug (the [id] route accepts both).
export async function getServiceById(idOrSlug: string): Promise<Service | null> {
  try {
    const found = await db.service.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        isActive: true,
      },
    })
    if (found) return found
  } catch (error) {
    console.error("[services] DB unavailable for getServiceById, checking fallback:", error)
  }
  // Fallback lookup (also covers the case where DB returned null).
  return (
    fallbackServices.find((s) => s.id === idOrSlug || s.slug === idOrSlug) ??
    null
  )
}
