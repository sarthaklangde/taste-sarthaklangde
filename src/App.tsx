import { Search, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { CityPicker } from "@/components/city-picker"
import { PlaceCard } from "@/components/place-card"
import { ShareButton } from "@/components/share-button"
import { TileGrid } from "@/components/tile-grid"
import { CITIES, CUISINES } from "@/lib/catalog"
import { PLACES } from "@/lib/data"
import { useUrlState } from "@/lib/url-state"
import { resolveView } from "@/lib/view"

const CITY_COLORS = ["bg-sky-200", "bg-orange-200", "bg-emerald-200", "bg-pink-200", "bg-yellow-200"]
const PREVIEW_COUNT = 6

function SectionTitle({ title, sub }: { title: string; sub?: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h2 className="font-heading text-2xl font-extrabold tracking-tight">{title}</h2>
      {sub && <div className="text-muted-foreground">{sub}</div>}
    </div>
  )
}

export default function App() {
  const [state, update] = useUrlState()
  const view = useMemo(() => resolveView(state), [state])
  const { city, cuisines, inCity, results } = view
  const browsing = Boolean(view.cuisine || view.query)

  // Cards start open when there are only one or two results. Taps flip that,
  // and reset whenever the result list changes.
  const resultsKey = results.map((p) => p.id).join(",")
  const [toggled, setToggled] = useState({ key: "", ids: new Set<string>(), showAll: false })
  const current = toggled.key === resultsKey ? toggled : { key: resultsKey, ids: new Set<string>(), showAll: false }
  const openByDefault = results.length <= 2
  const isOpen = (id: string) => openByDefault !== current.ids.has(id)
  const toggle = (id: string) => {
    const ids = new Set(current.ids)
    if (ids.has(id)) ids.delete(id)
    else ids.add(id)
    setToggled({ ...current, ids })
  }
  const showAll = current.showAll
  const setShowAll = () => setToggled({ ...current, showAll: true })

  useEffect(() => {
    document.title = view.title
  }, [view.title])

  const shown = browsing || showAll ? results : results.slice(0, PREVIEW_COUNT)
  const cuisineTiles = cuisines
    .map((id) => ({
      id,
      emoji: CUISINES[id]?.emoji ?? "🍽️",
      label: CUISINES[id]?.name ?? id,
      color: CUISINES[id]?.color ?? "bg-muted",
      count: inCity.filter((p) => p.cuisine === id).length,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
  const cityTiles = CITIES.map((c, i) => ({
    id: c.id,
    emoji: c.flag,
    label: c.name,
    color: CITY_COLORS[i % CITY_COLORS.length],
    count: PLACES.filter((p) => p.city === c.id).length,
  })).sort((a, b) => b.count - a.count)

  const goCity = (id: string) => {
    update({ city: id, cuisine: null, q: "" })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const listTitle = view.cuisine
    ? `${CUISINES[view.cuisine].emoji} ${CUISINES[view.cuisine].name}`
    : view.query
      ? `“${view.query}”`
      : "My picks"

  return (
    <div className="mx-auto min-h-svh max-w-3xl px-4 pt-10 pb-16">
      <header className="mb-6">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
          Sarthak's taste{" "}
          <span className="inline-block cursor-default hover:animate-wiggle">🍛</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Where I eat when I'm in town. My picks only, no ads.
        </p>
      </header>

      <div className="mb-4 flex items-center gap-2 text-muted-foreground">
        Eating in <CityPicker city={city.id} onSelect={goCity} />
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2" />
        <input
          type="search"
          value={state.q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Biryani, shawarma, date night..."
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

      <section className="mt-9">
        <div className="flex items-start justify-between gap-3">
          <SectionTitle title={listTitle} sub={`in ${city.name}`} />
          {browsing && (
            <button
              type="button"
              onClick={() => update({ cuisine: null, q: "" })}
              className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-foreground/15 px-3 py-1 text-sm font-bold hover:border-foreground"
            >
              <X className="size-3.5" /> Clear
            </button>
          )}
        </div>

        <div className="-mx-3 space-y-1">
          {shown.map((p, i) => (
            <PlaceCard
              key={p.id}
              place={p}
              index={i}
              highlight={view.query}
              open={isOpen(p.id)}
              onToggle={() => toggle(p.id)}
            />
          ))}
        </div>

        {!browsing && !showAll && results.length > PREVIEW_COUNT && (
          <button
            type="button"
            onClick={setShowAll}
            className="mt-3 w-full rounded-full border-2 border-foreground bg-card py-2.5 font-bold transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--foreground)]"
          >
            Show all {results.length} in {city.name}
          </button>
        )}

        {results.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-5xl">{inCity.length === 0 ? "🧳" : "🤷"}</p>
            <p className="mt-3 font-heading text-lg font-bold">
              {inCity.length === 0 ? `Nothing in ${city.name} yet.` : "Nothing for that."}
            </p>
            <p className="text-muted-foreground">
              {inCity.length === 0
                ? "Still eating my way through it."
                : `Try a dish or a cuisine in ${city.name}.`}
            </p>
          </div>
        )}
      </section>

      {cuisineTiles.length > 0 && (
        <section className="mt-12">
          <SectionTitle title="Browse by cuisine" sub={`in ${city.name}`} />
          <TileGrid
            tiles={cuisineTiles}
            active={view.cuisine}
            onSelect={(id) => {
              update({ cuisine: view.cuisine === id ? null : id, q: "" })
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          />
        </section>
      )}

      <section className="mt-12">
        <SectionTitle title="Explore cities" />
        <TileGrid tiles={cityTiles} active={city.id} onSelect={goCity} />
      </section>

      <footer className="mt-14 text-center text-sm text-muted-foreground">
        Picked by{" "}
        <a
          href="https://sarthaklangde.com"
          className="font-bold text-foreground underline underline-offset-4"
        >
          Sarthak Langde
        </a>
        . No ads, no paid listings.
      </footer>
    </div>
  )
}
