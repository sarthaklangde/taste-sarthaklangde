// Moves a reviewed draft from inbox/ to data/places/ and merges its new dishes.
// Usage: pnpm publish-place <id> [<id> ...]   or   pnpm check-inbox
import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"

const CITIES = ["lisbon", "mumbai", "ho-chi-minh-city"]
const VERDICTS = ["go-out-of-your-way", "good-if-nearby", "skip"]

type Draft = Record<string, unknown> & {
  id: string
  dishes: { id: string; labels: { text: string; emoji: string }[]; myWay: string | null }[]
  newDishes?: Record<string, { name: string; explainer: string; aliases: string[] }>
}

const read = (f: string) => JSON.parse(readFileSync(f, "utf8"))
const write = (f: string, d: unknown) => writeFileSync(f, JSON.stringify(d, null, 2) + "\n")

function validate(d: Draft, dishes: Record<string, unknown>): string[] {
  const errs: string[] = []
  const str = (k: string) => typeof d[k] === "string" && (d[k] as string).length > 0
  for (const k of ["id", "name", "cuisine", "take", "maps", "lastVisited"])
    if (!str(k)) errs.push(`${k} is required`)
  if (!CITIES.includes(d.city as string)) errs.push(`city must be one of ${CITIES.join(", ")}`)
  if (!VERDICTS.includes(d.verdict as string)) errs.push(`verdict must be one of ${VERDICTS.join(", ")}`)
  if (!/^\d{4}(-\d{2})?$/.test(String(d.lastVisited))) errs.push("lastVisited must be YYYY-MM or YYYY")
  if (!["active", "closed"].includes(d.status as string)) errs.push("status must be active or closed")
  if (![null, 1, 2, 3].includes(d.price as number)) errs.push("price must be null, 1, 2 or 3")
  if (!Array.isArray(d.tags)) errs.push("tags must be an array")
  if (typeof d.multipleLocations !== "boolean") errs.push("multipleLocations must be true or false")
  for (const k of ["note", "website", "skip", "neighborhood", "photo"])
    if (d[k] !== null && typeof d[k] !== "string") errs.push(`${k} must be a string or null`)
  for (const dish of d.dishes ?? []) {
    if (typeof dish !== "object" || !dish.id) {
      errs.push("each dish must be { id, labels, myWay }")
      continue
    }
    if (!dishes[dish.id] && !d.newDishes?.[dish.id]) errs.push(`dish "${dish.id}" has no explainer`)
    if (!Array.isArray(dish.labels) || dish.labels.some((l) => !l.text || !l.emoji))
      errs.push(`dish "${dish.id}" labels must be [{ text, emoji }]`)
    if (dish.myWay !== null && typeof dish.myWay !== "string")
      errs.push(`dish "${dish.id}" myWay must be a string or null`)
  }
  return errs
}

const dishesFile = "data/dishes.json"
const dishes = read(dishesFile)
const args = process.argv.slice(2)
const checkOnly = args[0] === "--check"
const ids = checkOnly
  ? readdirSync("inbox").filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5))
  : args

if (ids.length === 0) {
  console.log(checkOnly ? "Inbox is empty." : "Usage: pnpm publish-place <id>")
  process.exit(0)
}

let failed = false
for (const id of ids) {
  const src = `inbox/${id}.json`
  if (!existsSync(src)) {
    console.error(`✗ ${src} not found`)
    failed = true
    continue
  }
  const draft: Draft = read(src)
  const errs = validate(draft, dishes)
  if (errs.length) {
    console.error(`✗ ${id}\n  - ${errs.join("\n  - ")}`)
    failed = true
    continue
  }
  if (checkOnly) {
    console.log(`✓ ${id} is valid`)
    continue
  }
  const { newDishes = {}, ...place } = draft
  for (const [k, v] of Object.entries(newDishes)) if (!dishes[k]) dishes[k] = v
  write(`data/places/${id}.json`, place)
  rmSync(src)
  console.log(`✓ published ${id}`)
}
if (!checkOnly) {
  write(dishesFile, Object.fromEntries(Object.entries(dishes).sort()))
  execFileSync(process.execPath, ["scripts/build-data.ts"], { stdio: "inherit" })
}
process.exit(failed ? 1 : 0)
