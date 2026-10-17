// Prebuilds link-preview images for the homepage, every city and every
// city + cuisine combo into public/og/, so shared links preview instantly.
// Free-text searches fall back to the live api/og endpoint.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { Resvg } from "@resvg/resvg-js"
import satori from "satori"
import { CITIES } from "../src/lib/catalog"
import { PLACES } from "../src/lib/data"
import { resolveView, type ViewParams } from "../src/lib/view"
import { ogCard, ogKey } from "../src/og/card"
import { emojiDataUrl } from "../src/og/emoji"

const fonts = [
  { name: "Bricolage", data: readFileSync("api/_assets/bricolage-500.ttf"), weight: 500 as const, style: "normal" as const },
  { name: "Bricolage", data: readFileSync("api/_assets/bricolage-800.ttf"), weight: 800 as const, style: "normal" as const },
]
const photo = `data:image/jpeg;base64,${readFileSync("api/_assets/sarthak.jpg").toString("base64")}`

const views: ViewParams[] = [{ city: null, cuisine: null, q: "" }]
for (const c of CITIES) {
  views.push({ city: c.id, cuisine: null, q: "" })
  for (const cuisine of new Set(PLACES.filter((p) => p.city === c.id).map((p) => p.cuisine)))
    views.push({ city: c.id, cuisine, q: "" })
}

rmSync("public/og", { recursive: true, force: true })
mkdirSync("public/og", { recursive: true })

const prebuilt = views.map(resolveView).filter((v) => ogKey(v))
await Promise.all(
  prebuilt.map(async (view) => {
    const svg = await satori(ogCard(view, photo) as never, {
      width: 1200,
      height: 630,
      fonts,
      loadAdditionalAsset: async (code, segment) => (code === "emoji" ? emojiDataUrl(segment) : []),
    })
    const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng()
    writeFileSync(`public/og/${ogKey(view)}.png`, png)
  }),
)
console.log(`✓ public/og: ${prebuilt.length} preview images`)
