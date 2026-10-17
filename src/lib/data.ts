import dishesJson from "../../data/dishes.json"
import { STALE_AFTER_MONTHS } from "./catalog"
import type { Dish, Place } from "./types"

const files = import.meta.glob<Place>("../../data/places/*.json", {
  eager: true,
  import: "default",
})

export const DISHES = dishesJson as Record<string, Dish>

export const PLACES: Place[] = Object.values(files).filter(
  (p) => p.status !== "closed",
)

export function isStale(place: Place, now = new Date()): boolean {
  const [y, m] = place.lastVisited.split("-").map(Number)
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
  return months > STALE_AFTER_MONTHS
}
