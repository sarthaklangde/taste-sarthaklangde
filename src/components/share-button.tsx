import { Check, Share2 } from "lucide-react"
import { useState } from "react"

/** Uses the phone's share sheet when available, otherwise copies the link. */
export function ShareButton({ title, url, count }: { title: string; url: string; count: number }) {
  const [copied, setCopied] = useState(false)

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url })
        return
      } catch (e) {
        if ((e as Error).name === "AbortError") return
      }
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-yellow-300 px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_var(--foreground)] transition-all hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none animate-in fade-in zoom-in-95"
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      {copied ? "Link copied!" : `Share ${count === 1 ? "this pick" : `these ${count} picks`}`}
    </button>
  )
}
