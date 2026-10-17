import { Info, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CUISINES, VERDICTS } from "@/lib/catalog"
import { DISHES, isStale } from "@/lib/data"
import type { Place } from "@/lib/types"
import { cn } from "@/lib/utils"

function formatMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number)
  return new Date(y, m - 1).toLocaleDateString("en", {
    month: "short",
    year: "numeric",
  })
}

export function PlaceCard({ place, highlight }: { place: Place; highlight?: string }) {
  const verdict = VERDICTS[place.verdict]
  const cuisine = CUISINES[place.cuisine]
  const stale = isStale(place)
  const meta = [
    place.neighborhood,
    cuisine?.name ?? place.cuisine,
    place.price ? "€".repeat(place.price) : null,
  ].filter(Boolean)

  return (
    <Card className={cn("gap-3 px-4", stale && "opacity-70")}>
      {place.photo && (
        <img
          src={place.photo}
          alt=""
          loading="lazy"
          className="-mx-4 -mt-4 aspect-[16/9] w-[calc(100%+2rem)] max-w-none object-cover"
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg leading-tight font-semibold">{place.name}</h2>
          <p className="text-sm text-muted-foreground">{meta.join(" · ")}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
            verdict.className,
          )}
        >
          {verdict.label}
        </span>
      </div>

      <p className="text-[15px]">{place.take}</p>

      {place.dishes.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Order
          </p>
          <ol className="space-y-1">
            {place.dishes.map((id, i) => {
              const dish = DISHES[id]
              const name = dish?.name ?? id
              const hit =
                highlight && name.toLowerCase().includes(highlight.toLowerCase())
              return (
                <li key={id} className="flex items-center gap-2 text-[15px]">
                  <span className="w-4 text-muted-foreground tabular-nums">{i + 1}</span>
                  <span className={cn(hit && "font-semibold")}>{name}</span>
                  {dish?.explainer && (
                    <Popover>
                      <PopoverTrigger
                        aria-label={`What is ${name}?`}
                        className="-m-2 p-2 text-muted-foreground hover:text-foreground"
                      >
                        <Info className="size-4" />
                      </PopoverTrigger>
                      <PopoverContent className="w-64 text-sm">
                        <p className="font-medium">{name}</p>
                        <p className="text-muted-foreground">{dish.explainer}</p>
                      </PopoverContent>
                    </Popover>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {place.skip && (
        <p className="text-sm">
          <span className="font-medium text-muted-foreground">Skip: </span>
          {place.skip}
        </p>
      )}

      <div className="flex items-center justify-between border-t pt-3 text-sm">
        <a
          href={place.maps}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium hover:underline"
        >
          <MapPin className="size-4" />
          Open in Maps
        </a>
        <span className="text-muted-foreground">
          {stale ? "Might have changed · " : ""}Visited {formatMonth(place.lastVisited)}
        </span>
      </div>
    </Card>
  )
}
