import { Search, X } from "lucide-react"
import { useMemo } from "react"
import { CuisineRail } from "@/components/cuisine-rail"
import { PlaceCard } from "@/components/place-card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CITIES } from "@/lib/catalog"
import { PLACES } from "@/lib/data"
import { cityInQuery, search } from "@/lib/search"
import { useUrlState } from "@/lib/url-state"

export default function App() {
  const [state, update] = useUrlState()

  // "burger in lisbon" switches the city tab and searches for "burger".
  const fromQuery = cityInQuery(state.q)
  const city =
    fromQuery.city ??
    CITIES.find((c) => c.id === state.city)?.id ??
    CITIES[0].id

  const inCity = useMemo(() => PLACES.filter((p) => p.city === city), [city])
  const cuisines = useMemo(
    () => [...new Set(inCity.map((p) => p.cuisine))].sort(),
    [inCity],
  )
  const results = useMemo(() => {
    const pool = state.cuisine
      ? inCity.filter((p) => p.cuisine === state.cuisine)
      : inCity
    return search(pool, fromQuery.rest)
  }, [inCity, state.cuisine, fromQuery.rest])

  const cityName = CITIES.find((c) => c.id === city)!.name

  return (
    <div className="mx-auto min-h-svh max-w-2xl px-4 pt-8 pb-16">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Sarthak's taste</h1>
        <p className="text-muted-foreground">
          Where I eat when I'm in town. My picks only.
        </p>
      </header>

      <Tabs
        value={city}
        onValueChange={(v) => update({ city: v, cuisine: null, q: "" })}
        className="mb-4"
      >
        <TabsList className="w-full">
          {CITIES.map((c) => (
            <TabsTrigger key={c.id} value={c.id}>
              {c.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="relative mb-5">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={state.q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Biryani, date night, quiet..."
          className="h-11 rounded-full pr-10 pl-9 text-base"
          aria-label="Search"
        />
        {state.q && (
          <button
            type="button"
            onClick={() => update({ q: "" })}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <CuisineRail
        cuisines={cuisines}
        active={state.cuisine}
        onSelect={(cuisine) => update({ cuisine })}
      />

      <main className="mt-4 space-y-4">
        {results.map((p) => (
          <PlaceCard key={p.id} place={p} highlight={fromQuery.rest.trim()} />
        ))}
        {results.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            {inCity.length === 0
              ? `Nothing in ${cityName} yet.`
              : `Nothing for that in ${cityName}. Try a dish or a cuisine.`}
          </p>
        )}
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        Picked by{" "}
        <a href="https://sarthaklangde.com" className="underline underline-offset-4">
          Sarthak Langde
        </a>
        . No ads, no paid listings.
      </footer>
    </div>
  )
}
