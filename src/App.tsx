import { Search, X } from "lucide-react"
import { useMemo } from "react"
import { CuisineRail } from "@/components/cuisine-rail"
import { PlaceCard } from "@/components/place-card"
import { ShareButton } from "@/components/share-button"
import { CITIES, CUISINES } from "@/lib/catalog"
import { PLACES } from "@/lib/data"
import { cityInQuery, search } from "@/lib/search"
import { useUrlState } from "@/lib/url-state"
import { cn } from "@/lib/utils"

export default function App() {
  const [state, update] = useUrlState()

  // "burger in lisbon" switches the city and searches for "burger".
  const fromQuery = cityInQuery(state.q)
  const city =
    fromQuery.city ?? CITIES.find((c) => c.id === state.city)?.id ?? CITIES[0].id
  const cityName = CITIES.find((c) => c.id === city)!.name

  const inCity = useMemo(() => PLACES.filter((p) => p.city === city), [city])
  const cuisines = useMemo(() => [...new Set(inCity.map((p) => p.cuisine))].sort(), [inCity])
  const results = useMemo(() => {
    const pool = state.cuisine ? inCity.filter((p) => p.cuisine === state.cuisine) : inCity
    return search(pool, fromQuery.rest)
  }, [inCity, state.cuisine, fromQuery.rest])

  const filtered = Boolean(state.city || state.cuisine || state.q.trim())
  const shareUrl = useMemo(() => {
    const p = new URLSearchParams({ city })
    if (state.cuisine) p.set("cuisine", state.cuisine)
    if (fromQuery.rest.trim()) p.set("q", fromQuery.rest.trim())
    return `${window.location.origin}/?${p}`
  }, [city, state.cuisine, fromQuery.rest])
  const what = fromQuery.rest.trim() || CUISINES[state.cuisine ?? ""]?.name || "food"
  const shareTitle = `Sarthak's ${what.toLowerCase()} picks in ${cityName}`

  return (
    <div className="mx-auto min-h-svh max-w-2xl px-4 pt-10 pb-16">
      <header className="mb-7">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
          Sarthak's taste{" "}
          <span className="inline-block cursor-default hover:animate-wiggle">🍛</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Where I eat when I'm in town. My picks only, no ads.
        </p>
      </header>

      <nav className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {CITIES.map((c) => {
          const on = c.id === city
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => update({ city: c.id, cuisine: null, q: "" })}
              aria-pressed={on}
              className={cn(
                "shrink-0 rounded-full border-2 border-foreground px-4 py-2 text-sm font-bold whitespace-nowrap transition-all active:scale-95",
                on
                  ? "bg-foreground text-background"
                  : "bg-card hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--foreground)]",
              )}
            >
              {c.flag} {c.name}
            </button>
          )
        })}
      </nav>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2" />
        <input
          type="search"
          value={state.q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Biryani, date night, quiet..."
          aria-label="Search"
          className="h-13 w-full rounded-full border-2 border-foreground bg-card pr-11 pl-12 text-base font-medium shadow-[4px_4px_0_0_var(--foreground)] outline-none transition-shadow placeholder:text-muted-foreground focus:shadow-[6px_6px_0_0_var(--foreground)] [&::-webkit-search-cancel-button]:hidden"
        />
        {state.q && (
          <button
            type="button"
            onClick={() => update({ q: "" })}
            aria-label="Clear search"
            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {filtered && results.length > 0 && (
        <div className="mt-4">
          <ShareButton title={shareTitle} url={shareUrl} count={results.length} />
        </div>
      )}

      <div className="mt-4">
        <CuisineRail
          cuisines={cuisines}
          active={state.cuisine}
          onSelect={(cuisine) => update({ cuisine })}
        />
      </div>

      <main className="mt-6 space-y-7">
        {results.map((p, i) => (
          <PlaceCard key={p.id} place={p} index={i} highlight={fromQuery.rest} />
        ))}
        {results.length === 0 && (
          <div className="py-14 text-center">
            <p className="text-5xl">{inCity.length === 0 ? "🧳" : "🤷"}</p>
            <p className="mt-3 font-heading text-lg font-bold">
              {inCity.length === 0 ? `Nothing in ${cityName} yet.` : "Nothing for that."}
            </p>
            <p className="text-muted-foreground">
              {inCity.length === 0
                ? "Still eating my way through it."
                : `Try a dish or a cuisine in ${cityName}.`}
            </p>
          </div>
        )}
      </main>

      <footer className="mt-14 text-center text-sm text-muted-foreground">
        Picked by{" "}
        <a href="https://sarthaklangde.com" className="font-bold text-foreground underline underline-offset-4">
          Sarthak Langde
        </a>
        . No ads, no paid listings.
      </footer>
    </div>
  )
}
