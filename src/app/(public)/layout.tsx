// Layout for all public-facing pages.
// Uses a min-h-screen flex column so the Footer sticks to the bottom
// on short pages and gets pushed down naturally on long pages.
import { SiteHeader } from "@/components/site/site-header"
import { Footer } from "@/components/site/footer"

// Always re-render so the Navbar reflects the current session cookie
// (otherwise the logged-in/out state gets cached).
export const dynamic = "force-dynamic"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
