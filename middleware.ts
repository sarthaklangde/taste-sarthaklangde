// Rewrites the <head> link-preview tags so a shared filtered link
// (e.g. /?city=lisbon&q=biryani) previews as that exact list.
import { next } from "@vercel/functions"
import { paramsFrom, resolveView } from "./src/lib/view"

export const config = { matcher: "/" }

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export default async function middleware(req: Request) {
  const url = new URL(req.url)
  if (!url.search) return next()

  const params = paramsFrom(url.searchParams)
  params.q = params.q.slice(0, 60)
  const view = resolveView(params)
  if (!view.filtered) return next()

  const page = url.origin + "/" + view.search
  const image = `${url.origin}/api/og${view.search}`
  const tags = [
    `<title>${esc(view.title)}</title>`,
    `<meta name="description" content="${esc(view.description)}" />`,
    `<meta property="og:title" content="${esc(view.title)}" />`,
    `<meta property="og:description" content="${esc(view.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${esc(page)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(view.title)}" />`,
    `<meta name="twitter:description" content="${esc(view.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  ].join("\n    ")

  const res = await fetch(new URL("/index.html", url))
  if (!res.ok) return next()
  const html = (await res.text()).replace(
    /<!-- og:start -->[\s\S]*?<!-- og:end -->/,
    `<!-- og:start -->\n    ${tags}\n    <!-- og:end -->`,
  )
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  })
}
