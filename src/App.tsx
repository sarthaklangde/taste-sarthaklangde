import { Search, X } from "lucide-react"
import { useEffect, useMemo } from "react"
import { CuisineRail } from "@/components/cuisine-rail"
import { PlaceCard } from "@/components/place-card"
import { ShareButton } from "@/components/share-button"
import { CITIES } from "@/lib/catalog"
import { useUrlState } from "@/lib/url-state"
import { resolveView } from "@/lib/view"
import { cn } from "@/lib/utils"

export default function App() {
  const [state, update] = useUrlState()
  const view = useMemo(() => resolveView(state), [state])
  const { city, cuisines, inCity, results } = view
  const cityName = city.name

  useEffect(() => {
    document.title = view.title
  }, [view.title])

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
          const on = c.id === city.id
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

      {view.filtered && results.length > 0 && (
        <div className="mt-4">
          <ShareButton
            title={view.title}
            url={`${window.location.origin}/${view.search}`}
            count={results.length}
          />
        </div>
      )}

      <div className="mt-4">
        <CuisineRail
          cuisines={cuisines}
          active={view.cuisine}
          onSelect={(cuisine) => update({ cuisine })}
        />
      </div>

      <main className="mt-6 space-y-7">
        {results.map((p, i) => (
          <PlaceCard key={p.id} place={p} index={i} highlight={view.query} />
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
