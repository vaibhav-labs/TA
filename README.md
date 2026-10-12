# TA Arena

A Transactional Analysis mastery game: one curriculum, four source books, 7 worlds, 42 games, played at three difficulties (Spot / Play / Analyse). Full design spec: [`docs/STRATEGY.md`](docs/STRATEGY.md).

Static PWA, no backend — Vite + React + TypeScript, Tailwind for the five-token palette, Dexie (IndexedDB) for progress, Zustand for session state.

## Status

Phase 1 (shell) is built: navigation, tokens, the Diagnose / Choice-story / Fields engines, the PAC-stack and Vector diagrams, the mastery/unlock maths (`src/state/mastery.ts`, unit-tested), and `concepts.json` / `worlds.json` for all 61 concepts and 42 levels. Level **3-3 "Cross It"** (section 6.1 of the strategy doc) is fully built end to end at L1/L2/L3 as the worked template. The other 41 levels render as "Coming soon" stubs from their `worlds.json` metadata until their content JSON is written — see section 11's build roadmap.

## Scripts

```
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run test     # vitest (mastery.ts unit tests)
npm run preview  # preview the production build
```

## Adding a level

Drop a new `src/content/levels/<id>.json` (schema in strategy doc section 10) and, optionally, `src/content/lessons/<conceptId>.json` cards — both are picked up automatically via `import.meta.glob` in `src/content/registry.ts`. No code changes needed.
