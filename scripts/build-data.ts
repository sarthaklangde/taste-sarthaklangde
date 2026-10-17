// Bundles data/places/*.json and data/dishes.json into one file that the
// site, the middleware and the OG image endpoint all import.
import { readdirSync, readFileSync, writeFileSync } from "node:fs"

const read = (f: string) => JSON.parse(readFileSync(f, "utf8"))
const places = readdirSync("data/places")
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((f) => read(`data/places/${f}`))
const dishes = read("data/dishes.json")

writeFileSync("src/generated/data.json", JSON.stringify({ places, dishes }, null, 2) + "\n")
console.log(`✓ src/generated/data.json: ${places.length} places, ${Object.keys(dishes).length} dishes`)
