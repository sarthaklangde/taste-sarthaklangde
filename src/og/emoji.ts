// Twemoji lookup for satori, matching what @vercel/og does with emoji: "twemoji".
const ZWJ = String.fromCharCode(8205)

function toCodePoint(s: string): string {
  const out: string[] = []
  let high = 0
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    if (high) {
      out.push((0x10000 + ((high - 0xd800) << 10) + (c - 0xdc00)).toString(16))
      high = 0
    } else if (c >= 0xd800 && c <= 0xdbff) high = c
    else out.push(c.toString(16))
  }
  return out.join("-")
}

const cache = new Map<string, Promise<string>>()

/** Returns a data URL for the emoji's Twemoji SVG. */
export function emojiDataUrl(segment: string): Promise<string> {
  const code = toCodePoint(segment.includes(ZWJ) ? segment : segment.replace(/️/g, ""))
  if (!cache.has(code)) {
    cache.set(
      code,
      fetch(`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${code}.svg`)
        .then((r) => (r.ok ? r.text() : ""))
        .then((svg) => `data:image/svg+xml;base64,${btoa(svg)}`),
    )
  }
  return cache.get(code)!
}
