export type CityId = "lisbon" | "mumbai" | "ho-chi-minh-city"

export type Verdict = "go-out-of-your-way" | "good-if-nearby" | "skip"

export type Place = {
  id: string
  name: string
  city: CityId
  neighborhood: string | null
  cuisine: string
  verdict: Verdict
  take: string
  skip: string | null
  dishes: string[]
  tags: string[]
  price: 1 | 2 | 3 | null
  lastVisited: string
  status: "active" | "closed"
  maps: string
  photo: string | null
}

export type Dish = {
  name: string
  explainer: string
  aliases: string[]
}
