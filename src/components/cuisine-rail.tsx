import { CUISINES } from "@/lib/catalog"
import { cn } from "@/lib/utils"

type Props = {
  cuisines: string[]
  active: string | null
  onSelect: (id: string | null) => void
}

/** Horizontal row of round food icons, Uber Eats style. */
export function CuisineRail({ cuisines, active, onSelect }: Props) {
  if (cuisines.length === 0) return null
  return (
    // Vertical padding keeps the active ring and bounce from being clipped by the scroller.
    <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pt-3 pb-3 [scrollbar-width:none]">
      {cuisines.map((id) => {
        const c = CUISINES[id] ?? { name: id, emoji: "🍽️", color: "bg-muted" }
        const on = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(on ? null : id)}
            aria-pressed={on}
            className="group flex w-18 shrink-0 snap-start flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                "flex size-16 items-center justify-center rounded-full border-2 border-transparent text-3xl transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:rotate-6 group-active:scale-90",
                c.color,
                on && "-translate-y-1 -rotate-6 border-foreground shadow-[3px_3px_0_0_var(--foreground)]",
              )}
            >
              {c.emoji}
            </span>
            <span className={cn("text-xs font-medium", on ? "font-bold" : "text-muted-foreground")}>
              {c.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
