import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CITIES } from "@/lib/catalog"
import { PLACES } from "@/lib/data"
import { cn } from "@/lib/utils"

export function CityPicker({ city, onSelect }: { city: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const current = CITIES.find((c) => c.id === city)!
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3 py-1 font-heading text-lg font-extrabold transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--foreground)] data-[state=open]:bg-foreground data-[state=open]:text-background">
        {current.flag} {current.name}
        <ChevronDown className="size-4" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 rounded-2xl border-2 border-foreground p-1.5 shadow-[4px_4px_0_0_var(--foreground)]"
      >
        {CITIES.map((c) => {
          const count = PLACES.filter((p) => p.city === c.id).length
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onSelect(c.id)
                setOpen(false)
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-medium hover:bg-muted",
                c.id === city && "bg-muted font-bold",
              )}
            >
              <span>
                {c.flag} {c.name}
              </span>
              <span className="text-sm text-muted-foreground">{count || "soon"}</span>
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
