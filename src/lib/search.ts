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

/** Singular and plural forms, so "curry" finds "curries" and "burgers" finds "burger". */
function variants(t: string): string[] {
  const out = new Set([t])
  if (t.length > 3) {
    if (t.endsWith("ies")) out.add(t.slice(0, -3) + "y")
    else if (t.endsWith("s")) out.add(t.slice(0, -1))
    if (t.endsWith("y")) out.add(t.slice(0, -1) + "ies")
  }
  return [...out]
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
    // Name, cuisine and tags say what a place is; the take and notes only mention things.
    const core = norm(
      [place.name, place.cuisine, CUISINES[place.cuisine]?.name ?? "", place.tags.join(" ")].join(" "),
    )
    const other = norm(
      [
        place.neighborhood ?? "",
        place.take,
        place.note ?? "",
        place.dishes.flatMap((d) => [...d.labels.map((l) => l.text), d.myWay ?? ""]).join(" "),
      ].join(" "),
    )
    let score = 0
    let ok = true
    for (const t of ts) {
      const forms = variants(t)
      const has = (text: string) => forms.some((f) => text.includes(f))
      const dishIdx = dishes.findIndex(has)
      if (dishIdx >= 0) score += 10 - dishIdx
      else if (has(core)) score += 3
      else if (has(other)) score += 1
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
