import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy getter: creating PrismaClient can itself throw when DATABASE_URL is
// missing/malformed, so we never construct it at import time. The first DB
// call creates it; if that fails, callers' try/catch handles it.
function createClient(): PrismaClient {
  return new PrismaClient({
    // Only log queries in development to keep Vercel logs clean.
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

function getClient(): PrismaClient {
  // Lazy singleton cached on globalThis in all envs: creating PrismaClient
  // can throw when DATABASE_URL is missing, so we defer it until the first
  // DB access (inside callers' try/catch). Caching avoids exhausting
  // connections on warm serverless invocations.
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient()
  return globalForPrisma.prisma
}

// `db` stays a PrismaClient-shaped object so existing imports keep working.
// Only the model delegates are proxied; each access lazily creates the client.
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient() as unknown as Record<string | symbol, unknown>
    return client[prop]
  },
})