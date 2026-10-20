import Image from "next/image"
import Link from "next/link"
import { Clock, Star, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatPrice, formatDuration } from "@/lib/format"
import type { Service } from "@/lib/services"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type ServiceCardProps = {
  service: Service
  className?: string
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden py-0 transition-all hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={service.imageUrl}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground shadow-sm backdrop-blur">
          {service.category}
        </Badge>
      </div>

      <CardContent className="p-5">
        <div className="flex items-center gap-1.5">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{service.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({service.reviewCount} reviews)
          </span>
        </div>

        <h3 className="mt-2 text-lg font-semibold leading-snug">
          {service.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {service.shortDescription}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">
              {formatPrice(service.price)}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {formatDuration(service.durationMinutes)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/70 p-5 pt-4">
        <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
          <Link href={`/services/${service.id}`}>
            View details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
