// Turns URL params into what's on screen. Shared by the app, the middleware
// (for link previews) and the OG image endpoint, so they always agree.
// Keep imports relative: the Vercel functions can't resolve "@/".
import { CITIES, CUISINES } from "./catalog"
import { PLACES } from "./data"
import { cityInQuery, search, terms } from "./search"
import type { Place } from "./types"

export type ViewParams = { city: string | null; cuisine: string | null; q: string }

export type View = {
  city: (typeof CITIES)[number]
  cuisine: string | null
  query: string
  cuisines: string[]
  inCity: Place[]
  results: Place[]
  filtered: boolean
  title: string
  description: string
  search: string
}

export const SITE_TITLE = "Sarthak's taste"
export const SITE_DESCRIPTION =
  "Restaurants I like in Lisbon, Mumbai and Ho Chi Minh City, and what to order."

export function paramsFrom(sp: URLSearchParams): ViewParams {
  return { city: sp.get("city"), cuisine: sp.get("cuisine"), q: sp.get("q") ?? "" }
}

export function resolveView(params: ViewParams): View {
  // "burger in lisbon" picks the city and searches for "burger".
  const fromQuery = cityInQuery(params.q)
  const city =
    CITIES.find((c) => c.id === fromQuery.city) ??
    CITIES.find((c) => c.id === params.city) ??
    CITIES[0]
  const query = fromQuery.rest.replace(/\s+/g, " ").trim()

  const inCity = PLACES.filter((p) => p.city === city.id)
  const cuisines = [...new Set(inCity.map((p) => p.cuisine))].sort()
  const cuisine = params.cuisine && CUISINES[params.cuisine] ? params.cuisine : null
  const pool = cuisine ? inCity.filter((p) => p.cuisine === cuisine) : inCity
  const results = search(pool, query)

  const filtered = Boolean(params.city || cuisine || params.q.trim())
  const what = terms(query).join(" ") || (cuisine ? CUISINES[cuisine].name : "")
  const title = filtered
    ? `Sarthak's ${what ? `${what.toLowerCase()} ` : ""}picks in ${city.name}`
    : SITE_TITLE
  const names = results.slice(0, 3).map((p) => p.name)
  const description = !filtered
    ? SITE_DESCRIPTION
    : names.length
      ? `${names.join(", ")}${results.length > 3 ? ` and ${results.length - 3} more` : ""}. What to order and what to skip.`
      : `Nothing for that in ${city.name} yet.`

  const sp = new URLSearchParams({ city: city.id })
  if (cuisine) sp.set("cuisine", cuisine)
  const cleanQuery = terms(query).join(" ")
  if (cleanQuery) sp.set("q", cleanQuery)

  return {
    city,
    cuisine,
    query,
    cuisines,
    inCity,
    results,
    filtered,
    title,
    description,
    search: filtered ? `?${sp}` : "",
  }
}
