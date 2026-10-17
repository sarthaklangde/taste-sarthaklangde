import type { CityId, Verdict } from "./types"

export const CITIES: { id: CityId; name: string; flag: string; aliases: string[] }[] = [
  { id: "lisbon", name: "Lisbon", flag: "🇵🇹", aliases: ["lisbon", "lisboa"] },
  { id: "mumbai", name: "Mumbai", flag: "🇮🇳", aliases: ["mumbai", "bombay"] },
  {
    id: "ho-chi-minh-city",
    name: "Ho Chi Minh City",
    flag: "🇻🇳",
    aliases: ["ho chi minh", "hcmc", "saigon", "hcm"],
  },
]

export const CUISINES: Record<string, { name: string; emoji: string; color: string }> = {
  indian: { name: "Indian", emoji: "🍛", color: "bg-orange-200" },
  goan: { name: "Goan", emoji: "🥥", color: "bg-teal-200" },
  "south-indian": { name: "South Indian", emoji: "🥞", color: "bg-amber-200" },
  burger: { name: "Burgers", emoji: "🍔", color: "bg-yellow-200" },
  pizza: { name: "Pizza", emoji: "🍕", color: "bg-red-200" },
  italian: { name: "Italian", emoji: "🍝", color: "bg-lime-200" },
  japanese: { name: "Japanese", emoji: "🍣", color: "bg-rose-200" },
  ramen: { name: "Ramen", emoji: "🍥", color: "bg-orange-100" },
  vietnamese: { name: "Vietnamese", emoji: "🍜", color: "bg-emerald-200" },
  macanese: { name: "Macanese", emoji: "🥢", color: "bg-red-200" },
  chinese: { name: "Chinese", emoji: "🥟", color: "bg-red-100" },
  thai: { name: "Thai", emoji: "🌶️", color: "bg-green-200" },
  "grilled-chicken": { name: "Grilled chicken", emoji: "🍗", color: "bg-amber-300" },
  "fried-chicken": { name: "Fried chicken", emoji: "🍗", color: "bg-orange-300" },
  korean: { name: "Korean", emoji: "🥘", color: "bg-pink-200" },
  mexican: { name: "Mexican", emoji: "🌮", color: "bg-lime-100" },
  portuguese: { name: "Portuguese", emoji: "🐟", color: "bg-sky-200" },
  seafood: { name: "Seafood", emoji: "🦐", color: "bg-cyan-200" },
  "middle-eastern": { name: "Middle Eastern", emoji: "🧆", color: "bg-yellow-100" },
  "street-food": { name: "Street food", emoji: "🥙", color: "bg-fuchsia-200" },
  breakfast: { name: "Breakfast", emoji: "🍳", color: "bg-yellow-200" },
  cafe: { name: "Coffee", emoji: "☕", color: "bg-stone-300" },
  bakery: { name: "Bakery", emoji: "🥐", color: "bg-amber-100" },
  dessert: { name: "Dessert", emoji: "🍨", color: "bg-pink-100" },
  bar: { name: "Drinks", emoji: "🍸", color: "bg-violet-200" },
}

export const VERDICTS: Record<Verdict, { label: string; emoji: string; rank: number; className: string }> = {
  "go-out-of-your-way": {
    label: "Go out of your way",
    emoji: "🔥",
    rank: 0,
    className: "bg-lime-300",
  },
  "good-if-nearby": {
    label: "Good if nearby",
    emoji: "👍",
    rank: 1,
    className: "bg-sky-200",
  },
  skip: { label: "Skip it", emoji: "🙅", rank: 2, className: "bg-rose-200" },
}

/** Emoji for place tags. Unknown tags get ✨. */
export const TAG_EMOJI: Record<string, string> = {
  "date night": "🕯️",
  "fancy dinner": "🥂",
  quiet: "🤫",
  solo: "🙋",
  group: "👯",
  "late night": "🌙",
  cheap: "💸",
  fusion: "🔀",
  "dine in": "🍽️",
  healthy: "🥗",
  delivery: "🛵",
  "delivery only": "🛵",
  "comfort food": "🫶",
  "sick day": "🤒",
}

export const tagEmoji = (tag: string) =>
  TAG_EMOJI[tag] ?? (tag.includes("fusion") ? TAG_EMOJI.fusion : "✨")

/** Places not visited for this many months show a "might have changed" note. */
export const STALE_AFTER_MONTHS = 18
