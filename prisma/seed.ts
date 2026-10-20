// ServiceBook AI — database seed script
// Run with: bun run db:seed
// Creates: 4 services, 1 demo admin, 1 demo customer (with hashed passwords).
// Safe to run multiple times — it upserts instead of duplicating.

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

const services = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
]

async function main() {
  console.log("🌱 Seeding database...")

  // --- Services (upsert by slug so re-running doesn't duplicate) ---
  for (const s of services) {
    await db.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    })
    console.log(`  ✓ Service: ${s.title}`)
  }

  // --- Demo admin user ---
  const adminPassword = await bcrypt.hash("admin123", 10)
  await db.profile.upsert({
    where: { email: "admin@servicebook.com" },
    update: { password: adminPassword },
    create: {
      email: "admin@servicebook.com",
      name: "ServiceBook Admin",
      phone: "+91 90000 00001",
      role: "admin",
      password: adminPassword,
    },
  })
  console.log("  ✓ Admin user: admin@servicebook.com")

  // --- Demo customer user ---
  const customerPassword = await bcrypt.hash("customer123", 10)
  await db.profile.upsert({
    where: { email: "customer@servicebook.com" },
    update: { password: customerPassword },
    create: {
      email: "customer@servicebook.com",
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      role: "customer",
      password: customerPassword,
    },
  })
  console.log("  ✓ Customer user: customer@servicebook.com")

  console.log("\n✅ Seed complete!")
  console.log("   Admin login:    admin@servicebook.com / admin123")
  console.log("   Customer login: customer@servicebook.com / customer123")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
