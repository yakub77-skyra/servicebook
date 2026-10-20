// Layout for all public-facing pages.
// Uses a min-h-screen flex column so the Footer sticks to the bottom
// on short pages and gets pushed down naturally on long pages.
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
