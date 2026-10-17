import { CITIES, CUISINES, VERDICTS } from "./catalog"
import { DISHES } from "./data"
import type { CityId, Place } from "./types"

const STOPWORDS = new Set(
  "a an the in at for to of and or with where can i get eat find best good great nice some me my want place places spot spots restaurant restaurants food near around is are".split(
    " ",
  ),
)

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")

/** Pulls a city name out of free text, e.g. "burger in lisbon". */
export function cityInQuery(q: string): { city: CityId | null; rest: string } {
  let rest = norm(q)
  for (const c of CITIES) {
    for (const a of c.aliases) {
      if (rest.includes(a)) {
        return { city: c.id, rest: rest.replace(a, " ") }
      }
    }
  }
  return { city: null, rest }
}

export function terms(q: string): string[] {
  return norm(q)
    .split(/[^a-z0-9]+/)
    .filter((t) => t && !STOPWORDS.has(t))
}

function dishText(place: Place): string[] {
  return place.dishes.map(({ id }) => {
    const d = DISHES[id]
    return norm([d?.name ?? id, ...(d?.aliases ?? [])].join(" "))
  })
}

// Closed places always sort after open ones.
const rank = (p: Place) => VERDICTS[p.verdict].rank + (p.status === "closed" ? 10 : 0)

/** Returns matching places, best first. Every term must match somewhere. */
export function search(places: Place[], q: string): Place[] {
  const ts = terms(q)
  const sorted = [...places].sort(
    (a, b) => rank(a) - rank(b),
  )
  if (ts.length === 0) return sorted

  const scored: { place: Place; score: number }[] = []
  for (const place of sorted) {
    const dishes = dishText(place)
    const other = norm(
      [
        place.name,
        place.neighborhood ?? "",
        place.cuisine,
        CUISINES[place.cuisine]?.name ?? "",
        place.tags.join(" "),
        place.take,
        place.note ?? "",
        place.dishes.flatMap((d) => [...d.labels.map((l) => l.text), d.myWay ?? ""]).join(" "),
      ].join(" "),
    )
    let score = 0
    let ok = true
    for (const t of ts) {
      const dishIdx = dishes.findIndex((d) => d.includes(t))
      if (dishIdx >= 0) score += 10 - dishIdx
      else if (other.includes(t)) score += 1
      else {
        ok = false
        break
      }
    }
    if (ok) scored.push({ place, score })
  }
  return scored
    .sort(
      (a, b) =>
        Number(a.place.status === "closed") - Number(b.place.status === "closed") ||
        b.score - a.score ||
        rank(a.place) - rank(b.place),
    )
    .map((s) => s.place)
}
