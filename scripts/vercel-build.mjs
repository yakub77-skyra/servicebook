// Vercel build script.
// Runs before `next build` on Vercel. Does two things:
//  1. If DATABASE_URL points to PostgreSQL (starts with "postgres"), swaps
//     the Prisma schema provider from "sqlite" to "postgresql" so the build
//     generates the correct Prisma Client.
//  2. Runs `prisma generate` to produce the client.
//
// This lets the same codebase use SQLite for local dev and PostgreSQL on
// Vercel without manually editing the schema.

import { readFileSync, writeFileSync } from "node:fs"
import { execSync } from "node:child_process"

const SCHEMA_PATH = "prisma/schema.prisma"
const dbUrl = process.env.DATABASE_URL || ""

const isPostgres = dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")

if (isPostgres) {
  console.log("🔗 PostgreSQL DATABASE_URL detected — switching schema provider to postgresql")
  let schema = readFileSync(SCHEMA_PATH, "utf8")
  schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"')
  writeFileSync(SCHEMA_PATH, schema)
  console.log("✅ Schema provider updated to postgresql")
} else {
  console.log("📁 SQLite DATABASE_URL detected (or missing) — keeping schema provider as sqlite")
}

// prisma generate is also run by the postinstall hook, but running it here
// too ensures the client matches the (possibly swapped) schema.
console.log("⚙️  Running prisma generate...")
try {
  execSync("npx prisma generate", { stdio: "inherit" })
  console.log("✅ Prisma client generated")
} catch (err) {
  console.error("❌ prisma generate failed:", err)
  // Don't hard-fail the build — Next can still build pages; runtime
  // DB calls are wrapped in try/catch with static fallbacks.
}
