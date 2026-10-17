export type CityId = "lisbon" | "mumbai" | "ho-chi-minh-city"

export type Verdict = "go-out-of-your-way" | "good-if-nearby" | "skip"

/** A playful tag on a dish, e.g. { text: "so fresh", emoji: "🌿" }. */
export type DishLabel = { text: string; emoji: string }

export type PlaceDish = {
  id: string
  labels: DishLabel[]
  /** How Sarthak orders it, e.g. "Ask for it extra spicy". */
  myWay: string | null
}

export type Place = {
  id: string
  name: string
  city: CityId
  neighborhood: string | null
  cuisine: string
  verdict: Verdict
  take: string
  skip: string | null
  dishes: PlaceDish[]
  /** Personal diary note about the place. */
  note: string | null
  tags: string[]
  price: 1 | 2 | 3 | null
  lastVisited: string
  status: "active" | "closed"
  maps: string
  website: string | null
  /** Chain with several branches; `maps` points to the one he goes to. */
  multipleLocations: boolean
  photo: string | null
}

export type Dish = {
  name: string
  explainer: string
  aliases: string[]
}
