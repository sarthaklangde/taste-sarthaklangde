import { Check, Link } from "lucide-react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Older browsers: copy via a hidden textarea.
    const el = document.createElement("textarea")
    el.value = text
    el.style.position = "fixed"
    el.style.opacity = "0"
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    el.remove()
  }
}

/** Copies the link to this exact view. Instant, no share sheet. */
export function ShareButton({ url, count }: { url: string; count: number }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)

  async function onClick() {
    await copy(url)
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-2 border-foreground px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_var(--foreground)] transition-all hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none animate-in fade-in zoom-in-95",
        copied ? "bg-lime-300" : "bg-yellow-300",
      )}
    >
      {copied ? (
        <Check key="check" className="size-4 animate-in zoom-in-50 spin-in-12" />
      ) : (
        <Link className="size-4" />
      )}
      {copied
        ? "Link copied! Paste it anywhere"
        : `Copy link to ${count === 1 ? "this pick" : `these ${count} picks`}`}
    </button>
  )
}
