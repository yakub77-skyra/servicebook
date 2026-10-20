import { format } from "date-fns"
import { Users, Mail, Phone, CalendarDays, IndianRupee } from "lucide-react"

import { db } from "@/lib/db"
import { formatPrice } from "@/lib/format"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function AdminCustomersPage() {
  let customers: Awaited<ReturnType<typeof db.profile.findMany>> = []
  try {
    customers = await db.profile.findMany({
      where: { role: "customer" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        bookings: {
          select: { id: true, status: true, service: { select: { price: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[admin/customers] DB unavailable, showing empty state:", error)
    customers = []
  }

  // Shape the data: add computed bookingCount + totalSpent.
  const shaped = customers.map((c) => {
    const bookingCount = c.bookings.length
    const totalSpent = c.bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + b.service.price, 0)
    const { bookings, ...rest } = c
    return { ...rest, bookingCount, totalSpent }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Customers
        </h1>
        <p className="mt-1 text-muted-foreground">
          All registered customer accounts and their booking history.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">{shaped.length} customers</Badge>
      </div>

      {shaped.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
            <Users className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">No customers yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            When customers sign up, they will appear here with their booking
            history.
          </p>
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium">Bookings</th>
                    <th className="px-4 py-3 font-medium">Total spent</th>
                  </tr>
                </thead>
                <tbody>
                  {shaped.map((c) => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                            {c.name
                              .split(" ")
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </span>
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="flex items-center gap-1.5 text-xs">
                          <Mail className="size-3.5 text-muted-foreground" />
                          {c.email}
                        </p>
                        {c.phone && (
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="size-3.5" />
                            {c.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <CalendarDays className="size-3.5" />
                          {format(c.createdAt, "d MMM yyyy")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{c.bookingCount}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 font-medium">
                          <IndianRupee className="size-3.5 text-muted-foreground" />
                          {formatPrice(c.totalSpent).replace("₹", "")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
