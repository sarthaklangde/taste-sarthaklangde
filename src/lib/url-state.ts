import { useCallback, useEffect, useState } from "react"

export type UrlState = { city: string | null; cuisine: string | null; q: string }

function read(): UrlState {
  const p = new URLSearchParams(window.location.search)
  return { city: p.get("city"), cuisine: p.get("cuisine"), q: p.get("q") ?? "" }
}

/** Filters live in the URL so any view can be shared as a link. */
export function useUrlState() {
  const [state, setState] = useState<UrlState>(read)

  useEffect(() => {
    const onPop = () => setState(read())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  const update = useCallback((patch: Partial<UrlState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      const p = new URLSearchParams()
      if (next.city) p.set("city", next.city)
      if (next.cuisine) p.set("cuisine", next.cuisine)
      if (next.q) p.set("q", next.q)
      const qs = p.toString()
      window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
      return next
    })
  }, [])

  return [state, update] as const
}
