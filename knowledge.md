# TA — Project Knowledge

Last updated: 2026-10-18. This file tracks the current state of the project so a
fresh session (or future me) can pick up context fast. It is not design docs —
see `docs/STRATEGY.md` for the original full spec and `README.md` for dev setup.

## What this repo contains (two separate products, one deploy)

1. **TA Arena** — the main React/Vite/TypeScript app (`src/`). A 7-world,
   42-level Transactional Analysis mastery game with a mastery/unlock engine,
   IndexedDB progress (Dexie), and three content engines (Diagnose, ChoiceStory,
   Fields) reused across every level.
2. **First Transaction** (`public/first-transaction/`) — a separate, standalone
   5-game series for people with *zero* TA background. Plain static HTML/CSS/JS,
   its own installable PWA (own manifest.json + sw.js, scope
   `/TA/first-transaction/`), deliberately independent of the React app's
   service worker so the two never fight over caching the same pages.

Both deploy together via GitHub Pages from the same repo
(`vaibhav-labs/TA` → `https://vaibhav-labs.github.io/TA/`), triggered by
`.github/workflows/deploy.yml` on every push to `main`.

- TA Arena: `https://vaibhav-labs.github.io/TA/`
- First Transaction: `https://vaibhav-labs.github.io/TA/first-transaction/`

## TA Arena: content status

**All 42 levels have real written content** (built 2026-10-18, then put
through a full beginner-persona playtest-and-fix pass the same day — see
"Beginner playtest pass" below). Previously only level `3-3` ("Cross It") was
built; the other 41 were raw stubs that leaked internal design notes
(`playsLike` field) straight at players — fixed, see "Known gotchas."

- `src/content/worlds.json` — the 7-world, 42-level curriculum map (design doc,
  not itself rendered to players).
- `src/content/concepts.json` — all 61 TA concepts with id/tier/source/confusion.
  Concepts 26 and 38 are defined but not referenced by any level's `concepts`
  array (a gap in the original design) — no lesson card exists for them, by design.
- `src/content/levels/<id>.json` — one file per level, conforming to
  `LevelContent` in `src/content/types.ts`.
- `src/content/lessons/<conceptId>.json` — one `LessonCard` per concept actually
  used by a level (59 of 61).
- Both directories are picked up automatically via `import.meta.glob` in
  `src/content/registry.ts` — no code changes needed to add/edit content.

### Player-facing book citations were removed — here's where they went

The player-facing UI (TA Arena's Level/Lesson screens, and First Transaction's
hub footer + each game's end screen) **no longer displays "From: Book X, ch.
Y" citations.** This was a deliberate request: keep the game's voice clean of
academic citation clutter, but don't lose the provenance — it lives here
instead.

The underlying `source`/`fromBook` fields are **still present in every level
and lesson JSON file** (untouched) — only the UI rendering of them was
removed, so the data is one `git grep` away if citations are ever wanted back
on-screen.

**TA Arena — per-level source citation (all 42 levels):**

| Level | Title | Book | Ch. | Quote |
|---|---|---|---|---|
| 1-1 | Spinal Cord | TA Today | 8 | "the need for physical and mental stimulation. Berne called this stimulus-hunger." |
| 1-2 | Stroke Sorter | TA Today | 8 | "A stroke is defined as a unit of recognition." |
| 1-3 | Hi-Hi | TA Today | 9 | "The participants in a ritual will often keep a close count of the strokes exchanged." |
| 1-4 | The Party | TA Today | 9 | "there are six different ways in which they can spend their time" |
| 1-5 | PTA Three Ways | TA Today | 9 | "there's usually a session of 'P.T.A.'" |
| 1-6 | The Stroke Economy | Scripts People Live | 8 | "Don't give strokes if you have them to give." |
| 2-1 | Who Said That | TA Today | 2 | "An ego-state is a set of related behaviors, thoughts and feelings." |
| 2-2 | Five Faces | TA Today | 3 | "Positive Nurturing Parent implies caring which is provided from a position of genuine regard for the person helped." |
| 2-3 | Egogram | TA Today | 3 | "The idea is to draw a vertical bar above each ego-state label. The height of the bar shows how much of the time you use that functional part." |
| 2-4 | Four Ways to Know | TA Today | 5 | "Behavioral diagnosis is the most important of the four. The other three act as checks upon it." |
| 2-5 | Little Professor | TA Today | 4 | "I relied more on intuition, instant impressions." |
| 2-6 | The Contaminated Adult | TA Today | 6 | "Eric Berne named these two problems contamination and exclusion." |
| 3-1 | Draw the Arrow | TA Today | 7 | "the opening communication is called the stimulus. The reply is called the response." |
| 3-2 | Keep It Going | TA Today | 7 | "So long as transactions remain complementary, communication can continue indefinitely." |
| 3-3 | Cross It | GPP | 2 | "communication is broken off when a crossed transaction occurs" |
| 3-4 | Why Did You Do That? | TA Today | 7 | "Eric Berne calculated that in theory there are 72 possible varieties of crossed transaction." |
| 3-5 | The Barn | TA Today | 7 | "an A→A social message overlies a psychological-level exchange between P and C (less often, C→C or P→P)" |
| 3-6 | The Salesman | TA Today | 7 | "The textbook example is that of a salesperson hoping to hook a customer into an impulse purchase." |
| 4-1 | Is It a Game? | TA Today | 23 | "Games are played without Adult awareness." |
| 4-2 | Formula G | TA Today | 23 | "Con + Gimmick = Response → Switch → Crossup → Payoff" |
| 4-3 | Life Games | TA Today | 23 | "Jack is playing the game called Kick Me." |
| 4-4 | Home Games | TA Today | 25 | "the one-time Rescuer changes to an accusing Persecutor instead of a woeful Victim" |
| 4-5 | Room Games | TA Today | 25 | "In Blemish, the player finds fault with others, criticizing their appearance, work, dress, etc." |
| 4-6 | Why Don't You — Yes But | TA Today | 25 | "You sound like you have a problem. What do you want me to do about it?" |
| 5-1 | Real or Racket | TA Today | 21 | "racket feelings never help finish the situation." |
| 5-2 | Stamp Book | TA Today | 21 | "by cashing in the stamps, they can move towards their script payoff." |
| 5-3 | Four Levels | TA Today | 18 | "a discount in any box also entails discounts in the boxes below it and to its right." |
| 5-4 | Doing Nothing | TA Today | 17 | "There are four types of behavior which always indicate that the person concerned is discounting." |
| 5-5 | Two Halves | TA Today | 20 | "two or more individuals behave as though between them they form a single person." |
| 5-6 | The Discount Matrix | TA Today | 18 | "a discount in any box also entails discounts in the boxes below it and to its right." |
| 6-1 | OK Corral | TA Today | 12 | "Though we switch between quadrants on the Corral, we each have one 'favorite' quadrant where we spend most of our time while in script." |
| 6-2 | Hear the Driver | TA Today | 16 | "The five drivers are the functional manifestations of not-OK (structural) counterscripts." |
| 6-3 | Don't | TA Today | 14 | "these names for the injunctions and permissions are only verbal labels... conveyed to the child in ways that are mainly non-verbal." |
| 6-4 | Three Banal Scripts | Scripts People Live | 8 | "a systematic attack on three primary human potentials... I have called the end result Lovelessness, Mindlessness, and Joylessness." |
| 6-5 | Script Process | TA Today | 15 | "there seem to be only six main patterns of script process." |
| 6-6 | The Script Matrix | TA Today | 10 | "a life plan made in childhood, reinforced by the parents, justified by subsequent events, and culminating in a chosen alternative" |
| 7-1 | Help or Rescue | Scripts People Live | 19 | "whether by going along with something she doesn't want to do, by doing more than 50% of the work, or by not asking for what is wanted" |
| 7-2 | The Contract | TA Today | 26 | "Berne defined a contract as an explicit bilateral commitment to a well-defined course of action." |
| 7-3 | Three P's | TA Today | 28 | "Pat Crossman has suggested three P's... permission, protection and potency." |
| 7-4 | Despair to Laughter | Scripts People Live | 21 | "games such as 'Why Don't You—Yes, But'" |
| 7-5 | Awareness / Spontaneity / Intimacy | Games People Play | 17 | "autonomy" |
| 7-6 | After Games, What? | Games People Play | 18 | "After games, what?" |

(Each level's `lessons/<conceptId>.json` carries its own parallel, shorter
`fromBook` citation for the same underlying idea — not duplicated here.)

**First Transaction — citations removed from the player-facing UI:**

| Page | Removed citation |
|---|---|
| hub (`index.html`) footer | Built from *TA Today* (Stewart & Joines, 1987), *Scripts People Live* (Claude Steiner, 1974), and *Transactional Analysis in Psychotherapy* (Eric Berne, 1961). |
| `01-strokes.html` end screen | Ian Stewart & Vann Joines, *TA Today* (ch. 8, "Strokes") · Claude Steiner, *Scripts People Live* (ch. 9, "The Stroke Economy") |
| `02-ego-states.html` end screen | Ian Stewart & Vann Joines, *TA Today* (ch. 2–3, "The Ego-State Model" & "Functional Analysis") |
| `03-transactions.html` end screen | Ian Stewart & Vann Joines, *TA Today* (ch. 7, "Transactions") |
| `04-games.html` end screen | Ian Stewart & Vann Joines, *TA Today* (ch. 23–25, "Games and Game Analysis") |
| `05-life-positions.html` end screen | Ian Stewart & Vann Joines, *TA Today* (ch. 12, "Life Positions," and Franklin Ernst's OK Corral) |

Narrative mentions of Berne/Steiner as the people who originated an idea
(e.g. "Psychiatrist Eric Berne noticed…") were deliberately **left in** —
those are teaching content, not citations, and removing them would have made
the games read as if the ideas came from nowhere.

### Source PDFs and their real usability (don't re-litigate this)

Three source PDFs live at the repo root (gitignored, `*.pdf`):
- **TA Today** (Stewart & Joines) — full OCR text layer, the main usable source
  for most quotes across the whole curriculum.
- **Scripts People Live** (Steiner) — full OCR text layer, used for World 1's
  Stroke Economy, World 6's banal scripts/Pig Parent, World 7's Rescue
  triangle/contracts.
- **Transactional Analysis in Psychotherapy** (Berne, 1961) — **scanned images,
  no OCR text layer at all.** Cannot be used as a quote source. Where
  `concepts.json`'s `source` field cites "Berne 1961," the actual written
  content re-sources the same idea from TA Today's synthesis instead, and
  `fromBook.book` is attributed honestly to whichever book the quote actually
  came from — not blindly copied from `concepts.json`'s `source` field.
- **Games People Play** (Berne, 1964) — cited throughout `worlds.json`/
  `concepts.json` as a source, but **this PDF is not present in the repo at
  all.** No GPP quotes were fabricated; content either re-sources from TA
  Today's parallel coverage, or (for games/ideas unique to GPP with no TA Today
  equivalent) uses only a short, safe fragment like the concept's own
  established name (e.g. `"quote": "Kick Me"`, `"quote": "autonomy"`) rather
  than an invented sentence. Level `3-3` (the original pre-existing template,
  predating this session's content-writing work) is the one exception still
  citing a longer GPP-attributed quote — it was deliberately left untouched by
  every reviewer as the reference template, so its provenance wasn't
  re-verified against this rule; worth a look if GPP sourcing is ever audited.

## Beginner playtest pass (2026-10-18)

After all 42 levels were written, the whole game (TA Arena's 7 worlds +
First Transaction's 5 games) was played and fixed by a panel of reviewers each
adopting the same persona: **a complete newcomer to psychology/TA, curious,
enjoys games, learns visually** — not a trained content reviewer. Each world
was reviewed end-to-end (every line a player would see), fixed in place, then
re-read once more to confirm the fix actually reads clearly. Full per-world
reports existed as `.review-world{1..7}.md` / `.review-first-transaction.md`
during the pass; their substance is folded in below and the files themselves
were deleted afterward (scratch artifacts, not meant to ship).

### Content fixes made (by world)

- **World 1 (Hunger):** `1-2.json`'s L1 options were bare jargon labels
  ("Positive, unconditional.") with no embedded reasoning, the one outlier in
  an otherwise self-explanatory world — rewritten to match the rest of the
  world's pattern (every option a self-contained sentence a newcomer can
  reason through before knowing the term).
- **World 3 (Vectors):** `lessons/20.json` had an internal production note
  leaking into player-facing text (removed) and designer-voice `confusion`
  text (rewritten player-facing). Added inline glosses the first time GPP's
  numbered "rule 1/2/3" convention appears in `3-1/3-2/3-4/3-5/3-6`. Softened
  `3-4`'s opening to re-ground what "crossed" means before drilling the two
  named shapes.
- **World 4 (The Thesaurus):** `4-2.json` and `4-3.json`'s wrong-answer
  feedback explained only why an option was wrong, not what the actually-right
  answer was — fixed so every path through the question teaches the right
  answer, not just eliminates one guess.
- **World 5 (Underneath):** `5-2.json` + `lessons/37.json` added a universal
  "last straw" framing alongside the era-specific "trading stamps" metaphor.
  `lessons/39.json` / `40.json` (Discounting / Discount Matrix) led with the
  full 2-axis matrix the actual gameplay never tests — rewritten to lead with
  the practical 4-level ladder the levels actually use, matrix pushed to a
  parenthetical aside.
- **World 6 (The Plan):** every level's L1 question used brand-new jargon
  (e.g. "Get-On-With" as a literal answer-choice label) with zero prior
  definition anywhere on screen. Added a one-sentence "Quick primer:" to the
  front of each level's L1 `question` (`6-1` through `6-6`), defining the
  term(s) that level's options actually use, so a first-time player can make
  an *informed* first guess instead of a blind one.
- **World 7 (Autonomy):** no fixes needed — every term explained inline at
  first use, already working well.
- **First Transaction:** fixed a near-invisible selected-answer button
  (~1.24:1 contrast, same bug class as an earlier fix — see "Known gotchas"),
  and guarded the service-worker registration against throwing on `file://`
  during local testing.

### Game-wide architecture bugs found and fixed (shared engine code)

Two independent reviewers (World 6 and World 7) separately converged on the
same deeper finding, and a third (World 4) found two more — all four were
real, shared-code bugs, not content issues, so they're fixed centrally rather
than per-level:

1. **`Diagnose.tsx` never rendered `DiagnoseLevel.lesson`.** Only the
   per-option `feedback` was shown; the `lesson` field (written on every
   single L1 block in the game) was dead content. Fixed: it now renders in
   its own `Callout` alongside the per-option feedback, the same way
   `ChoiceStory.tsx` already renders `option.lesson`.
2. **`ChoiceStory.tsx` ended the whole scenario on *any* `"game-move"` pick,
   on any beat**, not just the last one. Harmless for single-beat levels
   (3-3), but broke every multi-vignette level: `4-3` (4 independent friends'
   stories), `4-5` (3 vignettes), and critically `4-6`'s boss (whose *second*
   beat exists specifically to test whether the player re-applies the lesson
   on purpose to a new person — unreachable if beat 1 ended the scene). Fixed:
   only the actual final beat ends the scenario now; a game-move earlier on
   is a bad outcome for that beat (0 points), not a hard stop. Verified live
   via Playwright: a game-move on `4-3`'s first vignette (Omar) now correctly
   continues to the second (Leah).
3. **The non-"best"/non-"game-move" ("ok") outcome banner was hardcoded to
   Transactions-specific text** ("Complementary • Keeps pattern alive") and
   the "best" banner said "Adult-to-Adult Established" — both only actually
   true for World 3's content, nonsensical for the other six worlds (e.g. a
   Rescue-triangle "ok" option in World 7 showing a transactions-vocabulary
   badge). Rewritten to generic, tag-semantic language that's true everywhere:
   "Best move" / "Okay, but not the best move" / "That's an old pattern
   repeating."
4. **No beat-progress indicator** on multi-beat `ChoiceStory` scenes — a
   player in a 6-beat finale had no sense of "beat 3 of 6," which the
   reviewers flagged as the one real contributor to "do I feel lost in a long
   scene." Added a slim progress bar + "`X`/`Y`" label, shown only when a
   scene actually has more than one beat.

All four fixes are in `src/engines/Diagnose.tsx` and
`src/engines/ChoiceStory.tsx` — touched by no world-specific content review,
verified with lint/build/test plus a live Playwright click-through after.

## Known gotchas / fixed bugs (so they don't get "fixed" again)

- **The `playsLike` field in `worlds.json` is an internal design note, never
  meant for players.** `Level.tsx` used to render it verbatim on the
  "Coming soon" placeholder for unbuilt levels. Moot now that all 42 levels
  are built, but if new stub levels are ever added, don't reintroduce this —
  the placeholder pattern that replaced it (plain "not built yet" + link to a
  finished level) is still in `Level.tsx` for that scenario.
- **`worlds.json`'s `mechanic` field is flavor text, not a real engine
  dispatch key.** Strings like `"sort-it"`, `"ladder"`, `"replay"`,
  `"many-handed"` etc. do **not** correspond to real UI components. The app
  only has three real content engines — `Diagnose` (L1), `ChoiceStory` (L2),
  `Fields` (L3) — selected purely by which keys (`options`/`beats`/`fields`)
  are present in a level JSON's `levels.L1/L2/L3` blocks (see the dispatch
  logic in `src/screens/Level.tsx`). Every level's creative "mechanic" idea
  gets mapped onto this trio.
- **A level's `L1`/`L2`/`L3` are three difficulty *tracks* (Spot/Play/
  Analyse), not three sequential stages of one playthrough.** Which one
  renders depends entirely on the player's globally-chosen `playerLevel`
  (set via the difficulty selector on Home) — a player on "Spot" (L1) only
  ever sees the `Diagnose` engine for every level, never `ChoiceStory`/
  `Fields` from the same level, until they switch difficulty. Easy to forget
  when testing — seed/verify against the *matching* `level` value in
  IndexedDB `results` rows, and switch the in-app difficulty selector to
  actually exercise L2/L3 content.
- **`Vector.tsx`'s ego-state → P/A/C bucketing was buggy for compound codes**
  (`"NP"` doesn't start with `"P"` or `"C"`, so it silently fell through to
  `"A"` — wrong, Nurturing Parent is Parent). Fixed to use the existing
  `structuralOf()` helper in `src/content/types.ts`. Content should still pass
  pure `"P"`/`"A"`/`"C"` to vector `pairs` where possible; the fallback is
  defense-in-depth, not an invitation to pass compound codes freely.
- **First Transaction's service worker never bumped its cache version between
  deploys.** Browsers only re-check a service worker by diffing its own
  bytes, so an installed/cached client could get frozen on its very first
  snapshot indefinitely and never see later fixes. Fixed: `sw.js` now has a
  comment flagging this, bumped to `v2`, and switched from cache-first to
  network-first-with-offline-fallback so this class of bug can't recur
  silently. **If First Transaction content changes again, bump the `CACHE`
  version string in `public/first-transaction/sw.js`, or the fix won't reach
  anyone with it already installed.**
- **Three separate "content is there but invisible" bugs have now hit this
  project** — all different root causes, same symptom (a user reports
  "explanations/content disappeared" when actually the data was always
  there): (1) First Transaction's why/example boxes mixed a background tint
  so lightly into the card it was ~1.15:1 contrast; (2) First Transaction's
  selected-answer button highlight was ~1.24:1 contrast against its
  neighbors; (3) TA Arena's `Diagnose.tsx` genuinely never rendered the
  `lesson` field at all (not a contrast bug — dead code). **When a report
  says content is "missing," check rendering/contrast/dead-code before
  assuming the data itself is gone** — it hasn't been yet.

## Visual/UX conventions

- **TA Arena** uses a dark slate/glass aesthetic (Tailwind, `slate-900/90`
  cards, `ta-yellow` accent, backdrop blur) with per-world accent colors
  (`WORLD_THEMES` in `World.tsx`). A zero-dependency Web Audio sound layer
  (`src/ui/sound.ts`) provides chimes/taps, toggled from Home.
- **First Transaction** uses a distinct, deliberately calmer cool palette
  (deep indigo/violet background `#171233`, lavender surface `#f2eefb`,
  violet/blue/pink accents for Parent/Adult/Child), Fraunces serif for
  display type, no hard borders/ruled lines — separation comes from soft
  shadows and filled color blocks. Every game ends with a private
  localStorage-only reflection prompt before the lesson recap.
- The user has explicitly asked for this cooler palette treatment on First
  Transaction and was unhappy with an earlier warm "case file" (dark ink +
  cream paper + amber stamps) look — don't revert to that style there.

## Workflow notes

- **The user sometimes edits this codebase directly in a separate tool called
  "Antigravity,"** not only through Claude Code. This can leave large,
  finished-looking uncommitted diffs in the working tree that a Claude Code
  session didn't create (e.g. the `src/ui/Avatar.tsx` / `sound.ts` / PacStack
  polish pass in commit `f310aa9`). Don't assume such a diff is stray or
  foreign — verify (lint/build/visual check) before committing, but it's
  likely the user's own intentional work.
- **Parallel-fork review works well for this project's scale.** Splitting a
  large review/content task one-fork-per-world (7 worlds + 1 for First
  Transaction) and letting each read+fix+report independently was fast and
  caught genuinely different classes of bugs per world (content clarity in
  some, shared-engine bugs surfaced redundantly in others — a good
  cross-check signal when 2+ independent reviewers flag the same engine-level
  issue from different worlds, as happened twice in the 2026-10-18 pass).
- Playwright (not pre-installed; `npm install playwright --no-save` in a
  scratch dir, or `npx playwright install chromium`) is the standard way to
  actually drive and screenshot the app for verification before shipping UI
  changes — static lint/build/test passing is necessary but not sufficient,
  several real bugs in this project were only caught by actually looking at
  rendered screenshots or clicking through real interaction sequences.
- Deploys are verified by polling
  `https://api.github.com/repos/vaibhav-labs/TA/actions/runs?per_page=1`
  after a push, not assumed to have succeeded just because `git push` returned.

## Scripts

```
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run lint     # oxlint
npm run test     # vitest (mastery.ts unit tests)
npm run preview  # preview the production build
```
