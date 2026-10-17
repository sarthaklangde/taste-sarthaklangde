import { cn } from "@/lib/utils"

export type Tile = {
  id: string
  emoji: string
  label: string
  count: number
  color: string
}

/** Lu.ma-style "browse by" grid: icon, name, count. */
export function TileGrid({
  tiles,
  active,
  onSelect,
}: {
  tiles: Tile[]
  active?: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {tiles.map((t) => {
        const on = active === t.id
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            aria-pressed={on}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all active:scale-[0.97]",
              on
                ? "border-foreground bg-card shadow-[3px_3px_0_0_var(--foreground)]"
                : "border-foreground/10 bg-card/70 hover:-translate-y-0.5 hover:border-foreground hover:shadow-[3px_3px_0_0_var(--foreground)]",
            )}
          >
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full text-2xl transition-transform group-hover:rotate-12",
                t.color,
              )}
            >
              {t.emoji}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-heading font-bold leading-tight">{t.label}</span>
              <span className="block text-sm text-muted-foreground">
                {t.count === 0 ? "Coming soon" : `${t.count} ${t.count === 1 ? "place" : "places"}`}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
