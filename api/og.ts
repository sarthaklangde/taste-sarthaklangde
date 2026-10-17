// Live link-preview image for free-text searches (e.g. ?q=biryani).
// City and cuisine links use images prebuilt by scripts/build-og.ts instead.
import { ImageResponse } from "@vercel/og"
import { ogCard } from "../src/og/card"
import { paramsFrom, resolveView } from "../src/lib/view"

export const config = { runtime: "edge" }

// Bundled with the function, so no network round trip on a cold start.
const assets = Promise.all([
  fetch(new URL("./_assets/bricolage-500.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
  fetch(new URL("./_assets/bricolage-800.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
  fetch(new URL("./_assets/sarthak.jpg", import.meta.url)).then((r) => r.arrayBuffer()),
])

function base64(buf: ArrayBuffer) {
  let s = ""
  const bytes = new Uint8Array(buf)
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s)
}

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const params = paramsFrom(url.searchParams)
  params.q = params.q.slice(0, 60)
  const view = resolveView(params)
  const [regular, bold, photo] = await assets

  return new ImageResponse(ogCard(view, `data:image/jpeg;base64,${base64(photo)}`) as never, {
    width: 1200,
    height: 630,
    emoji: "twemoji",
    fonts: [
      { name: "Bricolage", data: regular, weight: 500, style: "normal" },
      { name: "Bricolage", data: bold, weight: 800, style: "normal" },
    ],
    headers: { "cache-control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400" },
  })
}
