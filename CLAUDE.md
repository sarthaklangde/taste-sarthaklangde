# taste.sarthaklangde.com

Sarthak's restaurant picks. Fully static Vite + React + Tailwind + shadcn site, deployed on Vercel from `main`.

## Data
- `data/places/<id>.json`: one published place each. Shape in `src/lib/types.ts`.
- `data/dishes.json`: shared dish explainers, keyed by dish id. One explainer per dish, reused by every place.
- `inbox/<id>.json`: drafts waiting for Sarthak's review. Same shape plus `newDishes`.
- Cuisines, cities and verdict labels live in `src/lib/catalog.ts`.

## Adding places
1. Sarthak dictates raw notes, often several at once.
2. Spawn one `enricher` subagent (Haiku) per place, in parallel. Each writes `inbox/<id>.json`.
3. Run `pnpm check-inbox`, fix anything invalid, then show Sarthak each draft as a short card.
4. Apply his revisions to the inbox file.
5. When he approves: `pnpm publish-place <id>`, then branch, commit and open a PR.

Never publish without his approval. Never add opinions he didn't give.

## URL
Filters are query params so any view is shareable: `?city=lisbon&cuisine=indian&q=tikka+masala`.
