// Dynamic link-preview image: 1200x630 PNG for whatever view the URL describes.
import { ImageResponse } from "@vercel/og"
import { CUISINES, VERDICTS } from "../src/lib/catalog"
import { paramsFrom, resolveView, SITE_DESCRIPTION } from "../src/lib/view"

export const config = { runtime: "edge" }

type Node = { type: string; props: Record<string, unknown> }
const h = (type: string, style: Record<string, unknown>, ...children: unknown[]): Node => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
})

const INK = "#1c1917"
const CREAM = "#fdf6e9"

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const view = resolveView(paramsFrom(url.searchParams))
  const [regular, bold] = await Promise.all(
    ["/fonts/bricolage-500.ttf", "/fonts/bricolage-800.ttf"].map((p) =>
      fetch(new URL(p, url)).then((r) => r.arrayBuffer()),
    ),
  )

  const top = view.results.slice(0, 3)
  const body = view.filtered
    ? top.length
      ? h(
          "div",
          { display: "flex", flexDirection: "column", gap: 18 },
          ...top.map((p, i) =>
            h(
              "div",
              { display: "flex", alignItems: "center", gap: 20 },
              h(
                "div",
                {
                  display: "flex",
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  border: `4px solid ${INK}`,
                  background: ["#fde047", "#fed7aa", "#fbcfe8"][i],
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 800,
                },
                String(i + 1),
              ),
              h("div", { display: "flex", fontSize: 44, fontWeight: 800 }, p.name),
              h("div", { display: "flex", fontSize: 36 }, VERDICTS[p.verdict].emoji),
            ),
          ),
          view.results.length > 3
            ? h("div", { display: "flex", fontSize: 28, color: "#78716c" }, `+ ${view.results.length - 3} more`)
            : h("div", { display: "flex" }),
        )
      : h("div", { display: "flex", fontSize: 40 }, `Nothing for that in ${view.city.name} yet. 🤷`)
    : h(
        "div",
        { display: "flex", flexDirection: "column", gap: 28 },
        h("div", { display: "flex", fontSize: 38, color: "#57534e", maxWidth: 820 }, SITE_DESCRIPTION),
        h(
          "div",
          { display: "flex", gap: 16 },
          ...[
            ["indian", "#fed7aa"],
            ["burger", "#fef08a"],
            ["vietnamese", "#a7f3d0"],
            ["pizza", "#fecaca"],
            ["japanese", "#fecdd3"],
            ["cafe", "#d6d3d1"],
          ].map(([id, bg]) =>
            h(
              "div",
              {
                display: "flex",
                width: 84,
                height: 84,
                borderRadius: 999,
                border: `4px solid ${INK}`,
                background: bg,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 44,
              },
              CUISINES[id].emoji,
            ),
          ),
        ),
      )

  const tree = h(
    "div",
    {
      display: "flex",
      width: "100%",
      height: "100%",
      background: CREAM,
      padding: 28,
      fontFamily: "Bricolage",
      color: INK,
    },
    h(
      "div",
      {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#fff",
        border: `6px solid ${INK}`,
        borderRadius: 40,
        boxShadow: `12px 12px 0 0 ${INK}`,
        padding: "48px 56px",
      },
      h(
        "div",
        { display: "flex", alignItems: "center", gap: 24 },
        {
          type: "img",
          props: {
            src: new URL("/sarthak.jpg", url).toString(),
            width: 96,
            height: 96,
            style: { borderRadius: 999, border: `5px solid ${INK}` },
          },
        },
        h(
          "div",
          { display: "flex", flexDirection: "column" },
          h("div", { display: "flex", fontSize: 30, fontWeight: 800 }, "Sarthak's taste 🍛"),
          h("div", { display: "flex", fontSize: 24, color: "#78716c" }, "taste.sarthaklangde.com"),
        ),
      ),
      h(
        "div",
        { display: "flex", fontSize: view.title.length > 34 ? 60 : 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 },
        view.filtered ? `${view.city.flag} ${view.title}` : "Where I eat when I'm in town.",
      ),
      body,
    ),
  )
  return new ImageResponse(tree as never, {
    width: 1200,
    height: 630,
    emoji: "twemoji",
    fonts: [
      { name: "Bricolage", data: regular, weight: 500, style: "normal" },
      { name: "Bricolage", data: bold, weight: 800, style: "normal" },
    ],
    headers: { "cache-control": "public, max-age=3600, s-maxage=86400" },
  })
}
