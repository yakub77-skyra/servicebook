"use client"

import * as React from "react"
import Image from "next/image"
import { Plus, Pencil, Clock, IndianRupee } from "lucide-react"

import type { Service } from "@prisma/client"
import { cn } from "@/lib/utils"
import { formatPrice, formatDuration } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ServiceFormDialog } from "@/components/site/service-form-dialog"
import { DeleteServiceButton, ToggleServiceActive } from "@/components/site/service-actions-core"

type Props = {
  services: Service[]
}

export function ServicesTable({ services }: Props) {
  const [addOpen, setAddOpen] = React.useState(false)
  const [editService, setEditService] = React.useState<Service | null>(null)

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {services.length} {services.length === 1 ? "service" : "services"} total
        </p>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="size-4" />
          Add service
        </Button>
      </div>

      {/* Table / empty state */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <h3 className="text-lg font-semibold">No services yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add your first service to start accepting bookings.
          </p>
          <Button onClick={() => setAddOpen(true)} className="mt-5">
            <Plus className="size-4" />
            Add service
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={s.imageUrl}
                          alt={s.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{s.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {s.shortDescription}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{s.category}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 font-medium">
                      <IndianRupee className="size-3.5 text-muted-foreground" />
                      {formatPrice(s.price).replace("₹", "")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3.5" />
                      {formatDuration(s.durationMinutes)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ToggleServiceActive
                      serviceId={s.id}
                      isActive={s.isActive}
                      serviceTitle={s.title}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:bg-accent"
                        onClick={() => setEditService(s)}
                        aria-label={`Edit ${s.title}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <DeleteServiceButton
                        serviceId={s.id}
                        serviceTitle={s.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add dialog */}
      <ServiceFormDialog open={addOpen} onOpenChange={setAddOpen} />

      {/* Edit dialog (shared) */}
      <ServiceFormDialog
        open={!!editService}
        onOpenChange={(o) => !o && setEditService(null)}
        service={editService}
      />
    </>
  )
}
