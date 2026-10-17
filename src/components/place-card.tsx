import { ChevronDown, Globe, Info, MapPin } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CUISINES, tagEmoji, VERDICTS } from "@/lib/catalog"
import { DISHES, isStale } from "@/lib/data"
import type { Place } from "@/lib/types"
import { cn } from "@/lib/utils"

const RANK_COLORS = ["bg-yellow-300", "bg-orange-200", "bg-pink-200"]
const TAG_COLORS = ["bg-violet-200", "bg-amber-200", "bg-teal-200", "bg-pink-200"]
const LABEL_COLORS = [
  "bg-lime-200",
  "bg-pink-200",
  "bg-sky-200",
  "bg-yellow-200",
  "bg-violet-200",
  "bg-orange-200",
]

function formatMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number)
  if (!m) return String(y)
  return new Date(y, m - 1).toLocaleDateString("en", { month: "short", year: "numeric" })
}

type Props = {
  place: Place
  highlight?: string
  index: number
  open: boolean
  onToggle: () => void
}

/** Compact list row, Lu.ma style. Tapping it expands the full card in place. */
export function PlaceCard({ place, highlight, index, open, onToggle }: Props) {
  const verdict = VERDICTS[place.verdict]
  const cuisine = CUISINES[place.cuisine]
  const closed = place.status === "closed"
  const stale = !closed && isStale(place)
  const meta = [
    place.neighborhood,
    cuisine ? `${cuisine.emoji} ${cuisine.name}` : place.cuisine,
    place.price ? "€".repeat(place.price) : null,
  ].filter(Boolean)
  const terms = (highlight ?? "").toLowerCase().split(/\s+/).filter((t) => t.length > 2)
  const topDish = place.dishes[0] ? (DISHES[place.dishes[0].id]?.name ?? place.dishes[0].id) : null

  return (
    <article
      style={{ animationDelay: `${index * 50}ms` }}
      className={cn(
        "rounded-3xl border-2 transition-all duration-200 fill-mode-both animate-in fade-in slide-in-from-bottom-2",
        open
          ? "border-foreground bg-card shadow-[5px_5px_0_0_var(--foreground)]"
          : "border-transparent hover:border-foreground/15 hover:bg-card/60",
        stale && "opacity-75",
        closed && "opacity-60 grayscale",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-3 text-left"
      >
        {place.photo ? (
          <img
            src={place.photo}
            alt=""
            loading="lazy"
            className="size-18 shrink-0 rounded-2xl border-2 border-foreground object-cover"
          />
        ) : (
          <span
            className={cn(
              "flex size-18 shrink-0 items-center justify-center rounded-2xl border-2 border-foreground text-4xl transition-transform",
              cuisine?.color ?? "bg-muted",
              open ? "-rotate-6" : "group-hover:rotate-3",
            )}
          >
            {cuisine?.emoji ?? "🍽️"}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-muted-foreground">
            {closed ? (
              <span className="mr-1.5 inline-block -rotate-2 rounded-full border-2 border-foreground bg-stone-300 px-2 text-xs font-bold text-foreground">
                🪦 Closed
              </span>
            ) : null}
            {verdict.emoji} {closed ? `Was ${verdict.label.toLowerCase()}` : verdict.label}
          </span>
          <span className="block truncate font-heading text-xl leading-tight font-extrabold tracking-tight">
            {place.name}
          </span>
          <span className="block truncate text-sm text-muted-foreground">
            {open ? meta.join("  ·  ") : topDish ? `Get the ${topDish.toLowerCase()}` : meta.join("  ·  ")}
          </span>
        </span>
        <ChevronDown
          className={cn("size-5 shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
      <div className="flex flex-col gap-4 px-5 pt-1 pb-5 animate-in fade-in slide-in-from-top-1">
      {(place.tags.length > 0 || place.multipleLocations) && (
        <div className="flex flex-wrap gap-1.5">
          {place.tags.map((t, i) => (
            <span
              key={t}
              className={cn(
                "rounded-full border-2 border-foreground px-2.5 py-0.5 text-xs font-bold",
                TAG_COLORS[i % TAG_COLORS.length],
                i % 2 === 0 ? "rotate-1" : "-rotate-1",
              )}
            >
              {tagEmoji(t.toLowerCase())} {t[0].toUpperCase() + t.slice(1)}
            </span>
          ))}
          {place.multipleLocations && (
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold">
              📍 Several locations
            </span>
          )}
        </div>
      )}

      <p className="font-heading text-lg leading-snug font-semibold">“{place.take}”</p>

      {place.dishes.length > 0 && (
        <ol className="space-y-3">
          {place.dishes.map(({ id, labels, myWay }, i) => {
            const dish = DISHES[id]
            const name = dish?.name ?? id
            const hit = terms.some((t) => name.toLowerCase().includes(t))
            return (
              <li key={id} className="flex gap-3">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-sm font-bold",
                    RANK_COLORS[i] ?? "bg-muted",
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center gap-2">
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
                  </div>
                  {labels.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {labels.map((l, j) => (
                        <span
                          key={l.text}
                          className={cn(
                            "rounded-full border-2 border-foreground px-2 py-0.5 text-xs font-bold transition-transform hover:scale-110",
                            LABEL_COLORS[(i + j) % LABEL_COLORS.length],
                            j % 2 === 0 ? "-rotate-2" : "rotate-2",
                          )}
                        >
                          {l.emoji} {l.text}
                        </span>
                      ))}
                    </div>
                  )}
                  {myWay && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">My way:</span> {myWay}
                    </p>
                  )}
                </div>
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

      {place.note && (
        <p className="-rotate-1 rounded-xl border-2 border-dashed border-foreground/30 bg-yellow-50 px-3 py-2 text-sm">
          <span className="mr-1">✍️</span>
          {place.note}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-foreground/20 pt-3 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={place.maps}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3 py-1.5 font-bold transition-all hover:bg-foreground hover:text-background"
          >
            <MapPin className="size-4" />
            {place.multipleLocations ? "My usual spot" : "Open in Maps"}
          </a>
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3 py-1.5 font-bold transition-all hover:bg-foreground hover:text-background"
            >
              <Globe className="size-4" />
              Website
            </a>
          )}
        </div>
        <span className="text-right text-xs text-muted-foreground">
          {closed ? "Closed · last visit " : stale ? "Might have changed · Visited " : "Visited "}
          {formatMonth(place.lastVisited)}
        </span>
      </div>
      </div>
      )}
    </article>
  )
}
