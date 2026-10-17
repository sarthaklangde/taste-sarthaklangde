import { Info, MapPin } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CUISINES, VERDICTS } from "@/lib/catalog"
import { DISHES, isStale } from "@/lib/data"
import type { Place } from "@/lib/types"
import { cn } from "@/lib/utils"

const RANK_COLORS = ["bg-yellow-300", "bg-orange-200", "bg-pink-200"]

function formatMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number)
  return new Date(y, m - 1).toLocaleDateString("en", { month: "short", year: "numeric" })
}

type Props = { place: Place; highlight?: string; index: number }

export function PlaceCard({ place, highlight, index }: Props) {
  const verdict = VERDICTS[place.verdict]
  const cuisine = CUISINES[place.cuisine]
  const stale = isStale(place)
  const meta = [
    place.neighborhood,
    cuisine ? `${cuisine.emoji} ${cuisine.name}` : place.cuisine,
    place.price ? "€".repeat(place.price) : null,
  ].filter(Boolean)
  const terms = (highlight ?? "").toLowerCase().split(/\s+/).filter((t) => t.length > 2)

  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        "relative flex flex-col gap-4 rounded-3xl border-2 border-foreground bg-card p-5 shadow-[5px_5px_0_0_var(--foreground)] transition-transform duration-200 fill-mode-both animate-in fade-in slide-in-from-bottom-3 hover:-translate-y-0.5",
        stale && "opacity-75",
      )}
    >
      <span
        className={cn(
          "absolute -top-3.5 right-4 rotate-3 rounded-full border-2 border-foreground px-3 py-1 text-xs font-bold shadow-[2px_2px_0_0_var(--foreground)]",
          verdict.className,
        )}
      >
        {verdict.emoji} {verdict.label}
      </span>

      {place.photo && (
        <img
          src={place.photo}
          alt=""
          loading="lazy"
          className="aspect-[16/9] w-full rounded-2xl border-2 border-foreground object-cover"
        />
      )}

      <div>
        <h2 className="font-heading text-2xl leading-tight font-extrabold tracking-tight">
          {place.name}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{meta.join("  ·  ")}</p>
      </div>

      <p className="font-heading text-lg leading-snug font-semibold">“{place.take}”</p>

      {place.dishes.length > 0 && (
        <ol className="space-y-2">
          {place.dishes.map((id, i) => {
            const dish = DISHES[id]
            const name = dish?.name ?? id
            const hit = terms.some((t) => name.toLowerCase().includes(t))
            return (
              <li key={id} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-sm font-bold",
                    RANK_COLORS[i] ?? "bg-muted",
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "text-[15px] font-medium",
                    hit && "rounded bg-yellow-200 px-1 font-bold",
                  )}
                >
                  {name}
                </span>
                {dish?.explainer && (
                  <Popover>
                    <PopoverTrigger
                      aria-label={`What is ${name}?`}
                      className="-m-2 p-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Info className="size-4" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 rounded-2xl border-2 border-foreground text-sm shadow-[3px_3px_0_0_var(--foreground)]">
                      <p className="font-heading font-bold">{name}</p>
                      <p className="text-muted-foreground">{dish.explainer}</p>
                    </PopoverContent>
                  </Popover>
                )}
              </li>
            )
          })}
        </ol>
      )}

      {place.skip && (
        <p className="rounded-2xl bg-rose-100 px-3 py-2 text-sm">
          <span className="font-bold">🙅 Skip: </span>
          {place.skip}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 border-t-2 border-dashed border-foreground/20 pt-3 text-sm">
        <a
          href={place.maps}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3 py-1.5 font-bold transition-all hover:bg-foreground hover:text-background"
        >
          <MapPin className="size-4" />
          Open in Maps
        </a>
        <span className="text-right text-xs text-muted-foreground">
          {stale ? "Might have changed · " : ""}Visited {formatMonth(place.lastVisited)}
        </span>
      </div>
    </article>
  )
}
