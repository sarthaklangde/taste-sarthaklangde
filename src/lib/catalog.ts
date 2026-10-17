import type { CityId, Verdict } from "./types"

export const CITIES: { id: CityId; name: string; aliases: string[] }[] = [
  { id: "lisbon", name: "Lisbon", aliases: ["lisbon", "lisboa"] },
  { id: "mumbai", name: "Mumbai", aliases: ["mumbai", "bombay"] },
  {
    id: "ho-chi-minh-city",
    name: "Ho Chi Minh City",
    aliases: ["ho chi minh", "hcmc", "saigon", "hcm"],
  },
]

export const CUISINES: Record<string, { name: string; emoji: string }> = {
  indian: { name: "Indian", emoji: "🍛" },
  "south-indian": { name: "South Indian", emoji: "🥞" },
  burger: { name: "Burgers", emoji: "🍔" },
  pizza: { name: "Pizza", emoji: "🍕" },
  italian: { name: "Italian", emoji: "🍝" },
  japanese: { name: "Japanese", emoji: "🍣" },
  ramen: { name: "Ramen", emoji: "🍜" },
  vietnamese: { name: "Vietnamese", emoji: "🍲" },
  chinese: { name: "Chinese", emoji: "🥟" },
  thai: { name: "Thai", emoji: "🌶️" },
  korean: { name: "Korean", emoji: "🥘" },
  mexican: { name: "Mexican", emoji: "🌮" },
  portuguese: { name: "Portuguese", emoji: "🐟" },
  seafood: { name: "Seafood", emoji: "🦐" },
  "middle-eastern": { name: "Middle Eastern", emoji: "🧆" },
  "street-food": { name: "Street food", emoji: "🥙" },
  cafe: { name: "Coffee", emoji: "☕" },
  bakery: { name: "Bakery", emoji: "🥐" },
  dessert: { name: "Dessert", emoji: "🍨" },
  bar: { name: "Drinks", emoji: "🍸" },
}

export const VERDICTS: Record<Verdict, { label: string; rank: number; className: string }> = {
  "go-out-of-your-way": {
    label: "Go out of your way",
    rank: 0,
    className: "bg-emerald-100 text-emerald-900",
  },
  "good-if-nearby": {
    label: "Good if nearby",
    rank: 1,
    className: "bg-amber-100 text-amber-900",
  },
  skip: { label: "Skip", rank: 2, className: "bg-rose-100 text-rose-900" },
}

/** Places not visited for this many months show a "might have changed" note. */
export const STALE_AFTER_MONTHS = 18
