// Temporary in-memory services data for Phase 2.
// In Phase 3 this file will be replaced with real Prisma queries
// (db.service.findMany / findUnique), so every consumer already
// uses this same shape to make the swap trivial.

export type Service = {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  price: number
  durationMinutes: number
  imageUrl: string
  category: string
  rating: number
  reviewCount: number
  isActive: true
  createdAt: string
}

export const mockServices: Service[] = [
  {
    id: "srv_home_cleaning",
    title: "Home Cleaning",
    slug: "home-cleaning",
    shortDescription: "Deep clean for every room by trained professionals.",
    description:
      "Our home cleaning service covers every room in your house — kitchen, bathrooms, bedrooms, and living areas. Trained professionals use eco-friendly products and modern equipment to leave your home spotless. Includes dusting, mopping, sanitizing surfaces, and trash removal. Book in minutes and relax while we do the heavy lifting.",
    price: 499,
    durationMinutes: 60,
    imageUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d110abb7ea41.jpg",
    category: "Cleaning",
    rating: 4.9,
    reviewCount: 842,
    isActive: true,
    createdAt: "2024-09-01T00:00:00.000Z",
  },
  {
    id: "srv_ac_repair",
    title: "AC Repair",
    slug: "ac-repair",
    shortDescription: "Fast diagnosis and repair for all AC brands.",
    description:
      "Get your air conditioner running like new with our certified technicians. We service all major brands and handle gas refilling, coil cleaning, compressor issues, and general maintenance. Same-day service available in most areas. Every repair comes with a 30-day service warranty for your peace of mind.",
    price: 699,
    durationMinutes: 45,
    imageUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5d76403b59ae.jpg",
    category: "Appliances",
    rating: 4.8,
    reviewCount: 519,
    isActive: true,
    createdAt: "2024-09-02T00:00:00.000Z",
  },
  {
    id: "srv_salon_home",
    title: "Salon at Home",
    slug: "salon-at-home",
    shortDescription: "Premium beauty and grooming services at your doorstep.",
    description:
      "Enjoy a full salon experience without leaving your home. Our certified beauticians offer facials, waxing, threading, manicures, pedicures, and hairstyling using premium branded products. Hygiene is our top priority — every tool is sanitized before each appointment. Perfect for busy professionals and special occasions.",
    price: 899,
    durationMinutes: 90,
    imageUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c4d373162c51.jpg",
    category: "Beauty",
    rating: 4.9,
    reviewCount: 1267,
    isActive: true,
    createdAt: "2024-09-03T00:00:00.000Z",
  },
  {
    id: "srv_math_tutoring",
    title: "Math Tutoring",
    slug: "math-tutoring",
    shortDescription: "1-on-1 personalized math sessions for grades 6–12.",
    description:
      "Boost your child's confidence in mathematics with personalized 1-on-1 tutoring. Our experienced tutors cover algebra, geometry, trigonometry, and calculus, aligned with CBSE, ICSE, and state board syllabi. Each session includes concept explanation, practice problems, and homework help. Suitable for students from grade 6 to 12.",
    price: 399,
    durationMinutes: 60,
    imageUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e6e20ef68483.jpg",
    category: "Education",
    rating: 4.7,
    reviewCount: 384,
    isActive: true,
    createdAt: "2024-09-04T00:00:00.000Z",
  },
]

// Helper used by the service details page and API routes later.
export function getServiceById(id: string): Service | undefined {
  return mockServices.find((s) => s.id === id || s.slug === id)
}

export function getActiveServices(): Service[] {
  return mockServices.filter((s) => s.isActive)
}

// Unique category list for the services page filter.
export function getServiceCategories(): string[] {
  return Array.from(new Set(mockServices.map((s) => s.category))).sort()
}
