// Thin wrapper around the client Navbar. Kept as a server component so the
// public layout can stay a server component (Navbar reads session client-side
// via /api/auth/me to avoid server-component cookie caching issues).
import { Navbar } from "@/components/site/navbar"

export function SiteHeader() {
  return <Navbar />
}
