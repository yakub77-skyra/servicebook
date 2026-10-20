import { format } from "date-fns"
import { MessageSquare, Mail, Phone, Calendar, ExternalLink } from "lucide-react"

import { db } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function AdminLeadsPage() {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Leads</h1>
        <p className="mt-1 text-muted-foreground">
          Contact form submissions captured from the website.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">{leads.length} total</Badge>
        <span>· newest first</span>
      </div>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
            <MessageSquare className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">No leads yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            When visitors submit the contact form, their messages will appear
            here.
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
                    <th className="px-4 py-3 font-medium">Message</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-t border-border align-top">
                      <td className="px-4 py-3">
                        <p className="font-medium">{lead.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                        >
                          <Mail className="size-3.5" />
                          {lead.email}
                        </a>
                        {lead.phone && (
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="size-3.5" />
                            {lead.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-3 text-xs text-muted-foreground">
                          {lead.message}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {lead.source}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="size-3.5" />
                          {format(lead.createdAt, "d MMM yyyy")}
                          <br />
                          {format(lead.createdAt, "h:mm a")}
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
