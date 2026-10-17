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
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
      {cuisines.map((id) => {
        const c = CUISINES[id] ?? { name: id, emoji: "🍽️" }
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
                "flex size-16 items-center justify-center rounded-full bg-muted text-3xl transition-all group-active:scale-95",
                on && "bg-foreground ring-2 ring-foreground ring-offset-2",
              )}
            >
              {c.emoji}
            </span>
            <span
              className={cn(
                "text-xs text-muted-foreground",
                on && "font-semibold text-foreground",
              )}
            >
              {c.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
