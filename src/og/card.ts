// The link-preview image (1200x630) as a satori element tree, in the site's
// sticker style. Used by api/og.ts (live, for searches) and
// scripts/build-og.ts (prebuilt, for city and cuisine links).
// Keep imports relative: the Vercel function can't resolve "@/".
import { CITIES, CUISINES, VERDICTS } from "../lib/catalog"
import { DISHES, PLACES } from "../lib/data"
import type { Place } from "../lib/types"
import type { View } from "../lib/view"

type El = { type: string; props: Record<string, unknown> }
type Style = Record<string, string | number>

const h = (style: Style, ...children: unknown[]): El => ({
  type: "div",
  props: { style: { display: "flex", ...style }, children },
})

const INK = "#1c1917"
const MUTED = "#78716c"
const CREAM = "#fdf6e9"
const shadow = (n: number) => `${n}px ${n}px 0 0 ${INK}`

// Hex values for the Tailwind classes used in catalog.ts.
const HEX: Record<string, string> = {
  "bg-orange-100": "#ffedd5", "bg-orange-200": "#fed7aa", "bg-orange-300": "#fdba74",
  "bg-amber-100": "#fef3c7", "bg-amber-200": "#fde68a", "bg-yellow-100": "#fef9c3",
  "bg-yellow-200": "#fef08a", "bg-yellow-300": "#fde047", "bg-lime-100": "#ecfccb",
  "bg-lime-200": "#d9f99d", "bg-lime-300": "#bef264", "bg-green-200": "#bbf7d0",
  "bg-emerald-200": "#a7f3d0", "bg-teal-200": "#99f6e4", "bg-cyan-200": "#a5f3fc",
  "bg-sky-200": "#bae6fd", "bg-violet-200": "#ddd6fe", "bg-fuchsia-200": "#f5d0fe",
  "bg-pink-100": "#fce7f3", "bg-pink-200": "#fbcfe8", "bg-rose-200": "#fecdd3",
  "bg-red-100": "#fee2e2", "bg-red-200": "#fecaca", "bg-stone-300": "#d6d3d1",
}
const hex = (cls?: string) => (cls && HEX[cls]) || "#f5f5f4"
const LABEL_HEX = ["#d9f99d", "#fbcfe8", "#bae6fd", "#fef08a", "#ddd6fe"]

const sticker = (text: string, bg: string, rotate: number, size = 26): El =>
  h(
    {
      background: bg,
      border: `4px solid ${INK}`,
      borderRadius: 999,
      padding: "6px 18px",
      fontSize: size,
      fontWeight: 800,
      whiteSpace: "nowrap",
      transform: `rotate(${rotate}deg)`,
      boxShadow: shadow(3),
    },
    text,
  )

const bubble = (emoji: string, bg: string, size: number): El =>
  h(
    {
      width: size,
      height: size,
      borderRadius: 999,
      border: `4px solid ${INK}`,
      background: bg,
      alignItems: "center",
      justifyContent: "center",
      fontSize: Math.round(size * 0.52),
    },
    emoji,
  )

const dishName = (id: string) => DISHES[id]?.name ?? id
const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) && !/^Korean|^Thai|^Indian/.test(s) ? s[0].toLowerCase() + s.slice(1) : s)

/** Mini version of the site's place card. */
function placeCard(p: Place, i: number, width: number, detailed: boolean): El {
  const cuisine = CUISINES[p.cuisine]
  const verdict = VERDICTS[p.verdict]
  const dishes = detailed ? p.dishes.slice(0, 3) : []
  return h(
    {
      flexDirection: "column",
      width,
      gap: 10,
      background: "#fff",
      border: `4px solid ${INK}`,
      borderRadius: 28,
      padding: "20px 22px",
      boxShadow: shadow(6),
      transform: `rotate(${detailed ? -0.6 : ([-1.5, 1.2, -0.8][i] ?? 0)}deg)`,
    },
    h(
      { alignItems: "center", justifyContent: "space-between" },
      bubble(cuisine?.emoji ?? "🍽️", hex(cuisine?.color), 58),
      sticker(`${verdict.emoji} ${verdict.label}`, hex(verdict.className), 3, width < 400 ? 16 : 18),
    ),
    h({ fontSize: 34, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1 }, p.name),
    detailed
      ? h(
          { flexDirection: "column", gap: 8 },
          ...dishes.map((d, j) =>
            h(
              { alignItems: "center", gap: 10, flexWrap: "wrap" },
              h({ fontSize: 24, fontWeight: 800, color: MUTED }, `${j + 1}`),
              h({ fontSize: 26, fontWeight: 500 }, dishName(d.id)),
              ...d.labels.slice(0, 3).map((l, k) =>
                h(
                  {
                    background: LABEL_HEX[(j + k) % LABEL_HEX.length],
                    border: `3px solid ${INK}`,
                    borderRadius: 999,
                    padding: "2px 10px",
                    fontSize: 18,
                    fontWeight: 800,
                    transform: `rotate(${k % 2 ? 2 : -2}deg)`,
                  },
                  `${l.emoji} ${l.text}`,
                ),
              ),
            ),
          ),
        )
      : p.dishes[0]
        ? h({ fontSize: 22, color: MUTED }, `Get the ${lowerFirst(dishName(p.dishes[0].id))}`)
        : h({}),
  )
}

function header(photo: string, right?: El): El {
  return h(
    { alignItems: "center", justifyContent: "space-between" },
    h(
      { alignItems: "center", gap: 18 },
      {
        type: "img",
        props: {
          src: photo,
          width: 76,
          height: 76,
          style: { borderRadius: 999, border: `4px solid ${INK}`, objectFit: "cover" },
        },
      },
      h(
        { flexDirection: "column" },
        h({ fontSize: 28, fontWeight: 800 }, "Sarthak's taste 🍛"),
        h({ fontSize: 20, color: MUTED }, "taste.sarthaklangde.com"),
      ),
    ),
    right ?? h({}),
  )
}

function frame(...children: El[]): El {
  return h(
    { width: 1200, height: 630, background: CREAM, padding: 28, fontFamily: "Bricolage", color: INK, boxSizing: "border-box" },
    h(
      {
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        // 1200 - 2 * 28 padding - 12 shadow, so the offset shadow stays in frame.
        width: 1132,
        height: 562,
        background: "#fffdf8",
        border: `6px solid ${INK}`,
        borderRadius: 40,
        boxShadow: shadow(12),
        padding: "36px 48px 44px",
      },
      ...children,
    ),
  )
}

export function ogCard(view: View, photo: string): El {
  if (!view.filtered) {
    const cities = CITIES.map((c) => ({
      c,
      n: PLACES.filter((p) => p.city === c.id && p.status !== "closed").length,
    })).filter((x) => x.n > 0)
    const cuisines = [...new Set(PLACES.map((p) => p.cuisine))].slice(0, 8)
    return frame(
      header(photo),
      h(
        { flexDirection: "column", gap: 14 },
        h({ fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }, "Where I eat when I'm in town."),
        h({ fontSize: 32, color: MUTED }, "My picks only, and what to order there."),
      ),
      h(
        { alignItems: "center", justifyContent: "space-between" },
        h(
          { gap: 12 },
          ...cuisines.map((id) => bubble(CUISINES[id]?.emoji ?? "🍽️", hex(CUISINES[id]?.color), 72)),
        ),
        h(
          { gap: 14 },
          ...cities.slice(0, 3).map((x, i) => sticker(`${x.c.flag} ${x.c.name}`, ["#bae6fd", "#fed7aa", "#a7f3d0"][i], i % 2 ? 3 : -3)),
        ),
      ),
    )
  }

  const city = view.city
  const open = view.open
  const cuisine = view.cuisine ? CUISINES[view.cuisine] : null
  const big = view.what ? `${cuisine && !view.query ? `${cuisine.emoji} ` : ""}${view.what}` : `${city.flag} ${city.name}`
  const sub = !open.length
    ? view.results.length
      ? `Only a closed spot for that in ${city.name}. 🪦`
      : `Nothing here yet in ${city.name}.`
    : view.what
      ? `${open.length} ${open.length === 1 ? "pick" : "picks"} in ${city.name}`
      : `${open.length} ${open.length === 1 ? "place" : "places"} I'd send you to`

  const shown = open.slice(0, 3)
  const width = shown.length === 1 ? 1020 : shown.length === 2 ? 497 : 324
  const cards = shown.length
    ? h({ gap: 26, alignItems: "flex-start" }, ...shown.map((p, i) => placeCard(p, i, width, shown.length === 1)))
    : h({ fontSize: 120 }, "🧳")

  return frame(
    header(photo, view.what ? sticker(`${city.flag} ${city.name}`, "#bae6fd", 3) : undefined),
    h(
      { flexDirection: "column", gap: 4 },
      h({ fontSize: big.length > 22 ? 64 : 84, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }, big),
      h(
        { alignItems: "center", gap: 16 },
        h({ fontSize: 30, color: MUTED }, sub),
        open.length > 3 ? sticker(`+${open.length - 3} more`, "#fde047", -3, 20) : h({}),
      ),
    ),
    cards,
  )
}

/** Stable file name for prebuilt images, or null when the view needs a live render. */
export function ogKey(view: View): string | null {
  if (!view.filtered) return "default"
  if (view.query || view.open.length === 0) return null
  return view.cuisine ? `${view.city.id}--${view.cuisine}` : view.city.id
}
