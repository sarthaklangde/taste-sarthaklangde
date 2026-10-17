import data from "../generated/data.json"
import { STALE_AFTER_MONTHS } from "./catalog"
import type { Dish, Place } from "./types"

export const DISHES = data.dishes as Record<string, Dish>

/** Includes closed places; they show with a "Closed" badge and sort last. */
export const PLACES: Place[] = data.places as Place[]

export const isClosed = (p: Place) => p.status === "closed"

export function isStale(place: Place, now = new Date()): boolean {
  const [y, m = 12] = place.lastVisited.split("-").map(Number)
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
  return months > STALE_AFTER_MONTHS
}
