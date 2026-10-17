import type { Tile } from "@/components/tile-grid"
import { cn } from "@/lib/utils"

/** One scrollable row of cuisine pills under the city picker. */
export function CuisineRow({
  tiles,
  active,
  onSelect,
}: {
  tiles: Tile[]
  active: string | null
  onSelect: (id: string | null) => void
}) {
  if (tiles.length === 0) return null
  return (
    // Vertical padding keeps the hover lift and shadow from being clipped by the scroller.
    <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none]">
      {tiles.map((t) => {
        const on = active === t.id
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(on ? null : t.id)}
            aria-pressed={on}
            className={cn(
              "group flex shrink-0 snap-start items-center gap-2 rounded-full border-2 py-1 pr-3.5 pl-1 text-sm font-bold whitespace-nowrap transition-all active:scale-95",
              on
                ? "border-foreground bg-foreground text-background shadow-[3px_3px_0_0_var(--foreground)]"
                : "border-foreground/15 bg-card hover:-translate-y-0.5 hover:border-foreground hover:shadow-[2px_2px_0_0_var(--foreground)]",
            )}
          >
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-lg transition-transform group-hover:rotate-12",
                t.color,
                on && "-rotate-6",
              )}
            >
              {t.emoji}
            </span>
            {t.label}
            <span className={cn("text-xs", on ? "text-background/70" : "text-muted-foreground")}>
              {t.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
