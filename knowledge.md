# TA — Project Knowledge

Last updated: 2026-10-18 (Product 3 section added). This file tracks the current state of the project so a
fresh session (or future me) can pick up context fast. It is not design docs —
see `docs/STRATEGY.md` for the original full spec and `README.md` for dev setup.

## What this repo contains (two products that deploy, plus a third folder of artifacts)

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

**A second citation-removal pass was needed** after the first one — the
first pass only removed the dedicated citation *panels/footers* (the "Book
Source" toggle, the end-screen "From: …" blocks). It missed two other
places citations had leaked in:

1. **A hardcoded "• Berne's Rule" badge** on every single `Callout` in
   `src/ui/Dialogue.tsx` — shown on *every* L1/L2 answer's feedback across
   the whole game, regardless of label ("Insight"/"Tell"/"Why"). Beyond
   being a citation, it was often simply wrong (plenty of the content it
   labeled is Steiner's, Karpman's, Ernst's, or Dusay's work, not Berne's).
   Removed entirely.
2. **~36 level/lesson JSON files** had a book title used as the *grammatical
   subject* of a sentence inside player-facing prose (`lesson`,
   `expand.otherFraming`, `expand.definition`, `expand.tryThisToday` fields)
   — e.g. "TA Today notes rituals are perceived from Child as riskier than
   withdrawal…", "Games People Play shows the same freedom as…". These are
   different from the `source`/`fromBook` *fields themselves* (which are
   fine, and untouched) — this was prose elsewhere in the same files citing
   a book as the source of a claim. Reworded to state the same point
   directly without the book as subject, same meaning, same tone. Two similar
   inline mentions were also found and fixed in First Transaction's
   `01-strokes.html` and `04-games.html`.

**If a new citation panel or inline "Book X says…" sentence gets added back
in later** (by new content, a new UI component, or an edit that reintroduces
the pattern), it needs removing again — grep for `"TA Today"`,
`"Games People Play"`, `"Scripts People Live"`, `"Stewart and Joines"` /
`"Stewart & Joines"` across `src/content/**/*.json` (excluding the
`source`/`fromBook` field values, which are supposed to have them) and
`src/**/*.tsx`, `public/first-transaction/*.html` to check.

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
- **World 2 (Three Voices):** this world teaches CP/NP/FC/AC for the first
  time, and reviewed last — initially missed entirely in the first pass (see
  "Workflow notes" below on verifying background work rather than trusting a
  completion summary at face value). `2-5.json`'s L3 field tested the Latin
  phrase "in statu nascendi" without ever defining it anywhere in the level —
  added an inline gloss ("literally, 'while it's still being born'") right in
  the question. `2-6.json`'s boss L3 field tested "exclusion" (constant-Adult
  exclusion specifically) despite the level's entire L1/L2 content only
  covering contamination, never exclusion — added a self-contained
  definition directly in the question so the player isn't tested on a term
  the level never taught. All other World 2 content (all 6 levels, all 10
  lesson cards) held up well on review — no other changes needed.
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
- **Don't trust a background fork's final summary at face value — verify
  with real tool calls before building on it.** In the 2026-10-18 pass, one
  fork (dispatched to review World 2) returned a "completed" result whose
  text read like an overall project-status handoff ("Commit `0e559a3`, live
  at both URLs… I'll land it as a follow-up") rather than an actual World 2
  content review. It turned out World 2's files had genuinely never been
  touched (file mtimes predated the whole review pass, and it wasn't in
  `knowledge.md`'s per-world list). The fix was cheap — `git log`/`git show
  --stat`/file mtimes/grep all independently confirmed the real state in
  under a minute — but skipping that check and trusting the summary would
  have silently shipped one of seven worlds unreviewed.
- Playwright (not pre-installed; `npm install playwright --no-save` in a
  scratch dir, or `npx playwright install chromium`) is the standard way to
  actually drive and screenshot the app for verification before shipping UI
  changes — static lint/build/test passing is necessary but not sufficient,
  several real bugs in this project were only caught by actually looking at
  rendered screenshots or clicking through real interaction sequences.
- Deploys are verified by polling
  `https://api.github.com/repos/vaibhav-labs/TA/actions/runs?per_page=1`
  after a push, not assumed to have succeeded just because `git push` returned.

## Product 3: TA Arena Artifacts (added 2026-10-18)

A third, separate product lives in `ta-arena-artifacts/`: 42 standalone single-file HTML games plus a hub, written to the First Transaction standard (story opener, Spot/Play/Analyse rounds, an explained example for every answer, debrief, reflection, navigation). They are published as Claude Artifacts, not deployed to GitHub Pages, and are not part of the Vite build (the folder is outside `src/` and `public/`). Unlike the React app, they show book sources to players on the end card, because they were audited against the books (see "Book audit" below). All commands below run from `ta-arena-artifacts/`; its own README-style files are `BRIEF.md` and `GLOBAL-NAMES.md`.

Discrepancies found by the audit that affect the older products: the stroke economy chapter in *Scripts People Live* is ch. 8, so the First Transaction `01-strokes` citation of "ch. 9" and the `knowledge.md` rows quoting *TA Today* ch. 8 to 9 for some Wild/Child content are worth re-checking; the table above for 7-3 says *TA Today* ch. 28, which does not exist in the contents page (the three P's are in *Scripts People Live* ch. 21); 6-4's "ch. 8" should be ch. 6 to 10; 7-4 cites *Scripts People Live* ch. 21 but the antithesis idea is *Games People Play* ch. 5 and 11. Those older entries were not changed.

### What this is

TA Arena is a set of 42 standalone browser games that teach Transactional Analysis (TA), the psychology of how people talk to each other, built as 7 worlds of 6 games. Each game is one self-contained HTML file published as a Claude Artifact, plus one hub page that shows a route map of all 42.

The artifacts are the product. They are not a conversion of the earlier GitHub PWA (vaibhav-labs.github.io/TA). The brief was to match the detail of the earlier "First Transaction" artifact: a story opener, rounds, an explanation with a real conversation example for every right and wrong answer, a debrief, a reflection and series navigation.

Audience: anyone, worldwide. English only, British spelling, no Hindi, no Pune, no currency, a global cast.

### Game structure (every game)

1. Story opener (a short scene that sets the problem).
2. Three rounds: Spot (3 to 5 items), Play (2 to 3 items), Analyse (1 to 2 items). The build tool prints an advisory when a count is outside these ranges.
3. Every item has a `why` for the right answer and a `traps` entry for each wrong answer, each with a real example line.
4. Debrief card: `debrief.nadia` (two to four plain sentences in Nadia's voice), `debrief.bookTerm`, `debrief.bookNote`.
5. End card shows `bookTerm`, `bookIdea`, `bookSource`.
6. Reflection prompt and a link to the next game and the hub.

Item types: `pick`, `scene` (branching beats with meters), `sort` (drop lines into bins), `counter`. Scene lines carry tags `best`, `ok`, `game`.

Plain-words rule: weeks 1 to 4 show no book terms in body text (terms appear only in the debrief and end card). Weeks 5 to 7 may use book terms in Analyse.

### Worlds and games (slot, title, book term, source)

World 1 Hunger (week "Invisible"): strokes and time.
- 1.1 Spinal Cord, Stroke; Games People Play (GPP) Introduction, Scripts People Live (SPL) ch. 1
- 1.2 Stroke Sorter, Stroke filter; SPL ch. 8 and 22; TA Today (TAT) ch. 8
- 1.3 Hi-Hi, Ritual; GPP ch. 3
- 1.4 The Party, Time structuring; GPP Introduction and ch. 3 to 5; SPL ch. 1; TAT ch. 9
- 1.5 PTA Three Ways, Pastime; GPP ch. 4
- 1.6 Boss: The Stroke Economy, Stroke economy; SPL ch. 8

World 2 Three Voices: ego states.
- 2.1 Who Said That, Ego state; GPP ch. 1; Transactional Analysis in Psychotherapy (TAP) ch. 2; TAT ch. 2
- 2.2 Five Faces, Functional model; TAT ch. 3
- 2.3 Egogram, Egogram; TAT ch. 3
- 2.4 Four Ways to Know, Four diagnoses; TAT ch. 5; TAP ch. 7
- 2.5 Little Professor; GPP ch. 5; SPL ch. 2; TAT ch. 4
- 2.6 Boss: The Contaminated Adult, Contamination; TAP ch. 4; TAT ch. 6

World 3 Vectors (week "Volleys"): transactions.
- 3.1 Draw the Arrow, Transaction; GPP ch. 2; TAT ch. 7
- 3.2 Keep It Going, Complementary; GPP ch. 2; TAT ch. 7
- 3.3 Cross It, Crossed; GPP ch. 2; TAT ch. 7
- 3.4 Cuff Links, Crossed Types I and II; GPP ch. 2; TAP ch. 9
- 3.5 The Barn, Duplex; GPP ch. 2
- 3.6 Boss: The Salesman, Angular; GPP ch. 2

World 4 The Thesaurus (week "Traps"): games.
- 4.1 Is It a Game?; GPP ch. 5; TAT ch. 1
- 4.2 Formula G; TAT ch. 23; SPL ch. 11
- 4.3 Life Games; GPP ch. 6
- 4.4 Home Games, Marital games; GPP ch. 7
- 4.5 Room Games, Good games; GPP ch. 12
- 4.6 Boss: Why Don't You, Yes But; GPP ch. 8

World 5 Underneath: feelings, stamps, discounts, symbiosis.
- 5.1 Real or Racket; TAT ch. 1 and 21; SPL ch. 1
- 5.2 Stamp Book, Trading stamps; SPL ch. 1; TAT ch. 1 and 21
- 5.3 Four Levels, Discounting; TAT ch. 1, 17, 18; SPL ch. 9
- 5.4 Doing Nothing, Passivity; TAT ch. 17; SPL ch. 9
- 5.5 Two Halves, Symbiosis; TAT ch. 1 and 20
- 5.6 Boss: The Discount Matrix; TAT ch. 18

World 6 The Plan: scripts.
- 6.1 OK Corral, Life positions; TAT ch. 12; SPL ch. 5 and 6
- 6.2 Hear the Driver, Drivers; TAT ch. 16
- 6.3 Don't, Injunctions; SPL ch. 4, 6, 7, 21; TAT ch. 14
- 6.4 Three Banal Scripts; SPL ch. 6 to 10
- 6.5 Script Process; TAT ch. 15
- 6.6 Boss: The Script Matrix; SPL ch. 4, 6, 21; TAT ch. 13

World 7 Autonomy (week "Your Own Person"):
- 7.1 Help or Rescue, Rescue; SPL ch. 11, 16, 19
- 7.2 The Contract; SPL ch. 20; TAT ch. 26
- 7.3 Three P's, Permission, protection and potency; SPL ch. 21
- 7.4 Despair to Laughter, Antithesis; GPP ch. 5 and 11
- 7.5 Awareness, Spontaneity, Intimacy; GPP ch. 16 and 17
- 7.6 After Games, What?; GPP ch. 18

Mechanics by game (the `mechanic` field): choice-story, sort-it, counter, floor-plan, rule-breaker, diagnose, build, spot-the-leak, vector, replay, two-track, sequence, many-handed, collect, ladder, quadrant, match, open. See `content/<slot>.json`.

### Repository layout

- `content/<world>-<n>.json`: the 42 game definitions (the source of truth for all text).
- `engine/template.html`: the game player. Markers `/*__TA_DATA__*/null/*__TA_DATA__*/` and `/*__TA_NAV__*/.../*__TA_NAV__*/` are replaced at build time.
- `engine/hub-template.html`: the home-screen route map.
- `engine/build.py`: validates content, writes `out/`. Standard library only.
- `engine/nav.json`: hub URL and the URL and title for each of the 42 slots (generated by `make_nav.py`).
- `world-intro.json`: per-world text for the hub (`name`, `weekName`, `intro`, `why`, `can`, `boss`).
- `out/`: built HTML (42 games plus `hub.html`). This is what gets published.
- `BRIEF.md`: the content contract and writing rules. `GLOBAL-NAMES.md`: the cast and rename map.
- `source/`: the original design documents (`bible.txt`, `world-map-and-mechanics.txt`, `scenes-weeks-1-3.txt`). They still contain old names and places and carry a note saying GLOBAL-NAMES.md supersedes them.
- `check_plain.py`, `check_global.py`, `qa/smoke.py`, `qa/hub_check.py`: checkers and browser tests.
- `audit/cluster-A.md` to `cluster-D.md`: the per-game book audit tables.
- Not in the repo on purpose: the four book PDFs and their extracted text (copyright). They live in a `books/` folder that is git-ignored.

### Build, check, test, publish

From `ta-arena-artifacts/`:

```
python3 engine/build.py          # all games into out/
python3 engine/build.py --hub    # out/hub.html
python3 check_plain.py           # weeks 1 to 4 must show no book terms in body text (expect hits: 0)
python3 check_global.py          # old names, Hindi words, places, currency (expect hits: 0)
for f in content/*.json; do python3 -m json.tool $f > /dev/null; done
python3 qa/smoke.py              # 42 games in headless Chromium, about 120 s
python3 qa/hub_check.py          # hub layout at 1280 and 390 px, focus ring
```

Build options: `--content-dir`, `--out-dir`, `--nav`, `--intro`. A game that fails validation is reported and not written; exit status is 1 on any error.

Allowed inline tags in content: `<b>`, `<i>`, `<br>`. The build rejects others.

Publishing: each file in `out/` is published with the Artifact tool, passing `url` to update the existing artifact in place (no icon on updates). Games were first published as Version 1, then Version 2 (nav links, intro, global names) and now Version 3 (book audit).

### PWA and live URL

`python3 make_pwa.py` (from `ta-arena-artifacts/`) builds the 42 games and the hub with absolute GitHub Pages links (`engine/nav-pwa.json`), adds manifest, theme colour and service-worker registration, and writes everything to `public/arena/` (hub = `index.html`, games = `1-1.html` to `7-6.html`, plus `manifest.json` and `sw.js`). The existing deploy workflow publishes it. Live at `https://vaibhav-labs.github.io/TA/arena/` (installable; scope `/TA/arena/`). `public/arena/` is generated: change `ta-arena-artifacts/content/*.json`, rerun `make_pwa.py`, and bump `VERSION` in `make_pwa.py` so installed clients refresh. The service worker is network first with cache fallback, like First Transaction. `vite.config.ts` lists `arena/**` in `globIgnores` so the root service worker leaves these pages to their own. Google Fonts load from the network and fall back to system fonts offline.

### Visual refresh of the PWA games (branch `visual-refresh`, tag `pre-visual-refresh`)

`docs/VISUAL_GUIDE.md` describes the React app's look, and the React app already implements it (tokens, avatars, PAC orbs, laser vectors, Web Audio sounds). The refresh brings that look to the 42 PWA games and their hub, as a presentation layer only: no content, answers, scoring or book sources changed (`content/*.json` untouched; smoke test still 42 of 42).

Applied: dark obsidian background with glass cards; a signature accent colour per world (1 ember, 2 cyan, 3 violet, 4 ruby, 5 teal, 6 emerald, 7 gold) set through `data-world`; Inter plus IBM Plex Mono instead of Fraunces and IBM Plex Sans; light speech bubbles with tails for the dialogue lines; option buttons with an accent bar, hover lift, and a shake on trap or wrong picks (off when reduced motion is requested); synthesized sounds (tap, success, thud, victory) with an SFX toggle remembered on the device; route stops and chips coloured per world on the hub. The sound and shake are driven by a MutationObserver watching for the existing feedback boxes, so no game logic changed.

**Rename and icons (added after the first look).** The PWA product is now called **You** (page titles, masthead, hub heading, manifest name, `<title>` suffix). The React app in `src/` is still called TA Arena; only the `public/arena/` pages and `ta-arena-artifacts/` engine were renamed. Icons: the seven world emblems ported from `src/ui/WorldIcon.tsx` live in `engine/emblems.py` (shown on the hub world cards and route stops, in each game's masthead, opener card and end card), plus 16 line icons drawn as CSS masks from the same file (eye, play and magnifier on the Spot, Play and Analyse round labels; check and cross on feedback stamps; spark on real examples; trophy on the end card; pencil on reflection; book on the source line; crown on boss tags; lock on "Opening soon"; home and speaker on the top bar). App icons (a yellow person inside a ring of seven world-coloured dots on obsidian, matching the home map; 192, 512, 180 apple-touch and SVG) for installing the PWA are in `ta-arena-artifacts/pwa-icons/` (yellow "You" on obsidian, 192 and 512 px plus an SVG favicon) and are copied by `make_pwa.py`. Service worker cache version is `arena-v7`.

**Circular map and plain-English world names (second look).** The hub (`engine/hub-template.html`, filled by `build.py` `map_html` and `worlds_html`) no longer lists all worlds in a column. The home view has the title "You", a longer introduction (what TA is, the Spot, Play and Analyse steps, who the books are by, "not therapy"), and a map: a person in the centre, seven world discs on an ellipse clockwise from the top, dashed spokes, a "Start here" pill on world 1. Tapping a disc goes to `hub#world-N`, which shows only that world (intro, why it comes here, what you can do after, final challenge, six game chips, previous/next world buttons). Routing is a small hash script; `#home` or no hash shows the map. The games' top-bar link and end-card link now go to `hub#world-N` ("World map", "Back to the world"). "Sunday boss" became "Final challenge" and the week kicker was dropped. World names changed in `world-intro.json` and in `worldName`/`weekName` of the 42 content files (no other content touched): 1 Being Noticed, 2 Who's Talking, 3 Back and Forth, 4 Conversation Traps, 5 Under the Surface, 6 The Story You Wrote, 7 Free to Choose. Checks after this change: check_plain and check_global 0 hits, smoke 42 of 42.

**Plain-English game titles (third look).** 39 of the 42 campaign games' `title` fields were rewritten from book-jargon or cryptic names to plain, descriptive ones (`engine/nav.json`, `engine/nav-pwa.json` and `make_nav.py`'s `ART` map updated to match; the book terms themselves are untouched inside the games). Examples: Spinal Cord → A Day With No Hellos, Stroke Sorter → Sort the Nods, Egogram → Your Voice Bars, Formula G → Six Steps of a Trap, OK Corral → Four Corners of OK, The Script Matrix → The Plan Board. Boss-slot titles also dropped their "Boss:" prefix (the hub already shows a separate Boss tag), both in each game's `title` and in `world-intro.json`'s `boss` field. 3-1, 3-2 and 7-1 were already plain enough and were left as is. This was originally done on a separate `visual-refresh` continuation (commit `719ff62`, cache `arena-v6`) and merged into the settings-library work afterwards; cache bumped again to `arena-v7` to cover both.

Deliberately not copied from the guide: the "Berne's rule" citation badge (removed from the UI by request), the old character names in its examples (Priya is now Ella), and its gold-gradient option cards (dark glass is easier to read for long answers). Avatars, PAC orbs and world emblem art were not ported to the PWA. All the CSS lives in the "Visual refresh" blocks at the end of `engine/template.html` and `engine/hub-template.html`.

Roll back: `git checkout main` keeps the old look (the branch is not merged until you choose), or `git checkout pre-visual-refresh -- public/arena ta-arena-artifacts` to restore the earlier files. To adopt it: merge `visual-refresh` into `main` and push. After any change, rerun `make_pwa.py` and bump `VERSION` in it.

### Writing rules (humanize)

No em dashes. Curly quotes in dialogue. British spelling. No triads, no "not X but Y", no drumroll openers, no participial tails, no significance inflation. Vary sentence length. The score script (`humanize-writing/scripts/score.js`, line "AI-likeness N/100") must stay under 30 per game. Current scores are 0 to 6 for all 42 games.

### Cast and names (global)

Sam (was Rohan), Maya (Tanvi), Daniel (Vikram), Omar (Dev), Clara (Sana), Leo (Kabir), Nadia (Meera, the debrief voice), Grace (Reshma), Hannah (Priyanka), Ella (Priya), Peter (Anil), Mei (Asha). Tara unchanged. Mum, Dad, Gran replace Ma, Papa, Aai. "love" replaces the endearment. Places: no Pune, Mumbai or Goa ("the city", "the coast"); the cafe is The Corner Table; the company is Halden; Hawthorn Court and apartment 3B; tea not chai; no currency (use counts, "a bill", "a fee"). The debrief JSON key is `nadia` (it was `meera`). The full rules and the banned-word list are in GLOBAL-NAMES.md and enforced by `check_global.py` (case-insensitive, whole-word).

### The book audit (October 2026)

Sources, all from the user's Google Drive: *Games People Play* (Berne, 82 pp, full text), *Scripts People Live* (Steiner, 408 pp, full text), *Transactional Analysis in Psychotherapy* (Berne, scanned, OCR text for ch. 1 to 14), *TA Today* (Stewart and Joines, only front matter, contents page and ch. 1 to 7 readable; the PDF is over the 10 MB Drive download limit and the read tool truncates at about page 64).

Method: four parallel reviewers, one per cluster (A worlds 1, B worlds 2 and 3, C worlds 4 to 6, D world 7), each read every game and checked term, idea, source line and every implied claim and answer key against the book text. Verdicts VERIFIED, CORRECTED or UNVERIFIABLE with evidence are in `audit/cluster-*.md`. SPL page numbers there are PDF page positions, because the SPL text has no printed page numbers.

Main corrections:
- Chapter cites: the stroke economy is SPL ch. 8 (not 9); many source lines were corrected to the checked chapters only.
- 7.2: the four contract requirements are Steiner's (mutual consent, consideration, competency, lawful object; SPL ch. 20), not Berne's. The game was rebuilt on them.
- 7.3: Permission, Protection and Potency are Steiner's three P's (SPL ch. 21); Protection was first postulated by Patricia Crossman; potency is the giver's strength, not the receiver's reason.
- 7.1: Steiner gives a two-part summary plus a no-help-without-a-request rule, not a list of three; the game now sorts 12 helping acts.
- 7.4: laughter after refusing a game "may" follow in a good outcome (GPP ch. 5, p. 21); it is not guaranteed. 7.6 now covers GPP ch. 18 instead of duplicating 7.5.
- 4.3 and 4.4: game names and details fixed to GPP ch. 6 and 7. 3.4, 3.5, 3.6: transaction types and the duplex and angular definitions fixed (GPP ch. 2). 5.5: symbiosis fixed. 6.4: the three basic scripts follow Steiner's training in Lovelessness, Mindlessness and Joylessness. 6.5: source is TA Today ch. 15.
- 1.3: Berne's example of about thirty nods is after a month away, so the two-night trip counter was rescaled to about a dozen (target 12, tolerance 3).
- 3.6: redundant third Analyse question removed to match "two questions" and the brief.
- Play and Analyse counts brought into range for 1.1, 1.5, 2.4, 7.1, 7.6.
- Flag renames and a "Beta" leftover in 3.4 ("Love") fixed during the global-names pass.

Not verifiable (TA Today ch. 8 onward unreadable): Formula G as TA Today states it, the four discount levels and four passive behaviours as written there, the six process scripts, the five drivers, the OK Corral applied to adults, symbiosis beyond ch. 1, the term "counter-injunction", the "stroke filter" term and the warm/cold grid for doing versus being. These keep only what the contents page and standard TA theory support. To close this, supply those chapters as text or a split PDF.

Known adaptations (deliberate, not errors): 3.5 flirtation softened to wanting company; 4.5 "Want Out" set at work; 4.4 marital games applied to flatmates. Rebellion belongs to the Adapted Child in TA Today ch. 3 but to the natural Child in TAP ch. 7; the games follow TA Today, and no game labels a sulk as the Wild Kid (checked). The design table's "Steiner's three Rescue rules" and "Berne's four requirements" are table errors, not book statements.

### QA status (18 October 2026)

- JSON valid for all 42 files.
- Build: no errors or warnings; no Play/Analyse count advisories.
- `check_plain.py`: 0 hits. `check_global.py`: 0 hits.
- Humanize score: every game 0 to 6.
- `qa/smoke.py`: 42 of 42 pass, 0 page errors (about 121 s).
- `qa/hub_check.py`: PASS at 1280 and 390 px.
- All 42 games and the hub published as Version 3.

### Published artifact map

Base: https://claude.ai/artifact/ followed by the id. Artifacts are private to the owner until shared from the page's Share menu. Hub: FzdEytVBojsBteGVMXXV4K.

1-1 GchqGmxabuBvvig2uWewn1; 1-2 2FG67GodMyXHnVkSLgX6F1; 1-3 FQZTE26Tetb3Cqe7pBztVU; 1-4 PvVDedNSfj1X7PLJHdeJJr; 1-5 DTmRPSymTnbjSLs7LSwg6H; 1-6 W6MRqhzsHbP4sTJ8Nqirp2;
2-1 NHi7rFVjpwWgTUGCFLdcfJ; 2-2 TgGgALj5WQgSvbU1YQcrMd; 2-3 GDViWJ3SgtLWcASu7hCDtL; 2-4 3c6qN2P5rn7JP6dEPuLptv; 2-5 3SZLhBJuzD2UqneYgNbf94; 2-6 5FsXiRoMRB4anxTPuHmMa4;
3-1 8nEQcyqpxd1UpWwRsnpXjV; 3-2 Bq2wTtJbNR58JADVMzx4p6; 3-3 5JmSViMCTnndnUwR8s8ZAj; 3-4 JxFsmUfmYHHSfLgvhnqkHu; 3-5 UVN6pxYARCV84hSNzvFQTn; 3-6 FpRyhcmjZ7AJwNxvXrwack;
4-1 P5Musr4vb1yGbVUwtRftbk; 4-2 7cTckACt6F8SNPuVgaBYDU; 4-3 GZFLfTyw2M8TBA1GVgt4Xb; 4-4 NpMzNHMxHxAeLB615QKBBX; 4-5 CiZTLP1gdtjsKkXr7uuvrk; 4-6 33B9mjWmYM2HqhaNhfmoL9;
5-1 U2PuUcjP1ZoFZFpHQrFNQm; 5-2 Han4DXPaRMHX5fE2FXai9J; 5-3 XFTvLmBDuQ6zuY3Wwp5N8u; 5-4 5SEWcMFkZqqcPGTiDWLJ8T; 5-5 MZ84ez7MSZVgrUGML58jVF; 5-6 BYTUPGB8c7aFFCU4JBJeFj;
6-1 5eAxqr1fS5RN7aLnxkVjdV; 6-2 3ckXKZfxfkrm5q1SAyGrqW; 6-3 Brhq7keSkDpZQM8AnkfkT5; 6-4 8yPoVaZnJyJqeeygNaEER8; 6-5 3k5L13vbHQbjDEWwa3m6YV; 6-6 6ohNLgWTiVsxZKktMYnqJR;
7-1 Fq1W1u5y6FYvjQ7Rg2AczR; 7-2 A4qJnVuGrgm46BSSVW4rXE; 7-3 RgmJcyETexdoYozhtgrAJv; 7-4 1MRVBfvZaDLPVqkX8TW4W1; 7-5 Xa8N3tZ8C3rvb1vkPgNETz; 7-6 DNdVvbWSwdGBpAPTavJQuF.

The earlier "First Transaction" artifact (6r9B6FmMHnvWfVHJP53EQ9) is not linked from the hub.

### Decisions and gotchas

- Stroke titles unchanged; "flat" kept (British English).
- The hub reads URLs from `engine/nav.json`; regenerate with `make_nav.py` if an artifact URL ever changes, then rebuild everything, because every game embeds the nav.
- Republishing needs the `url` of the existing artifact; omitting it creates a new artifact and breaks the links.
- The smoke test takes about two minutes; run it with a long timeout and separately from the hub check.
- Do not paste book text into games. Paraphrase only.
- Weeks 1 to 4: do not add book terms to body text; `check_plain.py` will fail.
- Case-sensitive name checks miss "Beta", `meera` keys and flag names such as `tanvi_offered_1`; `check_global.py` is case-insensitive for that reason.
- The humanizer-evolution pipeline (research, implement, verify against the Humanize app engine) was never run for this project: the engine repository was not available.

### Open items

1. Verify the TA Today ch. 8+ claims listed in section 8 once those chapters are available.
2. Optionally link the First Transaction artifact from the hub.
3. Source docs in `source/` still hold old names (marked as superseded); clean them only if they are reused.
4. Several games cite a combined range of book chapters; if a reader needs exact pages, add page numbers from the audit files.

## Scripts

```
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run lint     # oxlint
npm run test     # vitest (mastery.ts unit tests)
npm run preview  # preview the production build
```
