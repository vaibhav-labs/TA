---
name: game-design
description: End-to-end game design, from concept to shipped game. Covers the high concept, pitch, and proposal; core loops and the five mechanic types; internal economies, feedback loops, and Machinations-style diagrams; movement, combat, characters, XP and leveling, monsters, items, magic and tech trees, puzzles, quests, levels, story, UI; data tables and algorithms; paper and interactive prototypes; simulation-based balancing; playtesting; and the full GDD and production lifecycle. Built on Moore's *Basics of Game Design* and Adams & Dormans' *Game Mechanics: Advanced Game Design*, with bundled simulators for dice odds, combat, economy, and XP curves. Use this skill whenever someone wants to design, plan, pitch, balance, prototype, document, or build a video game, board game, tabletop RPG system, serious or educational game, or gamified app, or any part of one ("design a combat system", "is my economy balanced", "write a GDD", "make my game more fun", "XP curve", "loot table", "tech tree", "level design", "game idea"), even if they don't say "game design".
---

# Game Design: Concept to Ship

This skill turns a game idea into a buildable, balanced, documented design, and then
into a playable game. It is organized as a **pipeline of phases**. Each phase has
deliverables and a quality gate, and points to deep references and tested scripts.

Two books underpin it:
- **Moore, *Basics of Game Design*.** The designer builds the *charts, tables, and
  algorithms* that make the game run. Describe mechanics precisely enough to code.
  Prototype on paper, then interactively. Balance continuously.
- **Adams & Dormans, *Game Mechanics: Advanced Game Design*.** Gameplay *emerges* from
  mechanics. Model the internal economy and its feedback loops, apply proven design
  patterns, and simulate before you build.

See `SOURCES.md` for exactly which material came from which book and what was outside the
provided text.

## How to use this skill

1. **Work out what the user needs** and pick an entry point (table below). Don't force the
   full pipeline on someone who wants one combat table.
2. **Read the reference files for the phase you're in** before producing that phase's
   deliverable. They hold the detailed rules, examples, and checklists. SKILL.md is only
   the map.
3. **Back numbers with evidence.** Whenever you propose odds, stats, prices, XP curves,
   or economy rates, run the matching script in `scripts/` and include its summary. A
   designer's intuition about probability and feedback loops is often wrong; a
   simulation is cheap and convincing.
4. **Write deliverables as files** (Markdown docs plus CSV or JSON data tables) the user
   can keep, using the templates in `assets/templates/`. Keep data separate from prose,
   as a real studio keeps data outside compiled code.
5. **End each phase with its gate checklist**, and say what is still `OPEN:`, along with
   the prototype or test that will settle it.

| User says something like… | Entry point |
|---|---|
| "I have an idea for a game…", "help me brainstorm", "pitch this" | Phase 1 |
| "What should the core loop be?", "make it more strategic / replayable" | Phase 2 |
| "Design the combat / movement / classes / loot / magic / tech tree / quests" | Phase 3 (that system only) |
| "Is this balanced?", "my economy snowballs", "one unit is OP", "XP curve" | Phase 4 |
| "Design the levels / story / UI" | Phase 5 |
| "Write the GDD", "document this for my team" | Phase 6 |
| "Build it", "make a playable prototype" | Phase 7 |
| "Plan production", "what are alpha/beta?", "scope for a solo dev" | Phase 8 |
| "Review my design / GDD" | Run the gate checklists of every phase present; report gaps by severity |

Ask the user a question only when the answer changes the design: platform, genre,
audience, team size, single- or multiplayer, real-time or turn-based. Otherwise state
your assumption and proceed. Momentum matters more than a perfect intake.

---

## Phase 1: Concept and pitch
**Read:** `references/concept-and-pitch.md`

Moore's first question is what the player will *do* that's fun. Start there, not with
story or art.

Deliverables:
1. **High concept** in 20 words or fewer: genre, core fun action, goal, twist.
2. **Fun-action vs. chore list**, with a mitigation for every chore (fast travel,
   auto-sort, gatherer units, tutorial pacing).
3. **Play-time budget**: percentage per play element, adding to 100. Moore's RPG baseline
   is 60% exploration, 15% combat, 10% NPCs, 5% puzzles, 5% story, 3% inventory,
   2% trade. This budget orders all later documentation.
4. **What is not gameplay** for this game (graphics, cutscenes, audio), so it doesn't eat
   the design budget.
5. **Realistic vs. fudged** lists. Never visibly fudge in the AI's favour.
6. **Pitch paper** (`assets/templates/pitch-paper.md`) and, if asked, a **proposal** with
   marketing analysis (`assets/templates/game-proposal.md`).

Gate: the core action is clear from the high concept alone; the budget adds to 100; 3–5
comparable titles are named, each with how this game differs.

## Phase 2: Core mechanics and systems architecture
**Read:** `references/mechanics-framework.md`, `references/internal-economy.md`,
`references/design-patterns.md`

Gameplay emerges from mechanics, so design the system that produces the fun, not a
feature list.

Deliverables:
1. **Mechanic-type profile.** Which of the five types dominate: physics, internal
   economy, progression, tactical maneuvering, social interaction? This decides what to
   prototype first and how.
2. **Core loop**: action → resource change → new options → action. Name the core
   mechanic (most frequent, most connected).
3. **Emergence vs. progression mix.** It sets replayability and content cost.
4. **Internal economy diagram** in text Machinations notation: resources, sources, drains,
   converters, traders, the player's decision points.
5. **Feedback-loop table**: each loop's type, effect, investment, return, speed, range,
   and durability.
6. **Patterns chosen**, named from the library (e.g. *Dynamic Engine + Stopping Mechanism +
   Escalating Challenge*), each with the problem it solves.
7. **Economy simulation**: encode the diagram as `economy_sim.py` JSON, one spec per
   player strategy, and run it. Report outcome percentages, game length, resource curves,
   and flags (runaway, dead option, swingy, no ending).

```bash
python scripts/economy_sim.py --example > design/econ.json   # then edit
python scripts/economy_sim.py design/econ.json --runs 500 --steps 60 --csv design/econ_traj.csv
```

Gate: every displayed resource has a source and a drain; at least one meaningful player
decision sits inside the core loop; no strategy dominates in simulation; the game ends in
the intended time range.

## Phase 3: Detailed system design (charts, tables, algorithms)
Design each play element in budget order. For each, produce: a description with
**relative values first**, the **chart(s)** as CSV, a **numbered algorithm** with every
term defined plus a worked example, where **randomness** enters and its odds, UI and
controls notes, edge cases and failure messages, the **tuning knobs** exposed as data,
and `OPEN:` questions.

| System | Read | Key outputs |
|---|---|---|
| Movement, scale, maps, encounters | `references/movement-and-space.md` | Scale choice, grid/hex/spline/waypoint method, Terrain Effects Chart, movement algorithm, fast travel, LOS/fog, encounter tables per area |
| Combat | `references/combat.md` | Attribute set, initiative/AV/DV formulas, combat + crit tables, magic and flee rules, CRT for wargames, RTS rules, AI intents |
| Characters, classes, XP, monsters, NPCs | `references/characters-and-entities.md` | Character Generation Chart, races/classes with compensating weaknesses, Skill Chart, starting kit, Experience Level Chart, entity roster by role, Entity Attribute Chart |
| Items, inventory, money, magic, tech trees, puzzles, quests | `references/content-systems.md` | Item Chart, inventory model, price ladder and gold sinks, Spell Chart, tech-tree node table, puzzle list with hint ladders, quest state machines |
| Probability and math (applies to all) | `references/probability-and-math.md` | Validated tables, chosen dice/ranges, readable numbers on screen |

Moore's principles to apply everywhere:
- **Write it so programmers can build it without guessing.** "There's a combat system" is
  not a design.
- **Don't over-specify before prototypes.** Tighten detail as tests settle questions.
- **Every powerful option needs a limiting factor** (cost, time, weight, scarcity,
  counter).
- **Freeze the attribute list early.** Late attributes unbalance content and break test
  saves.
- **Keep in-play numbers small**; use bars, colours, and timers; put big numbers on
  secondary screens.
- **Keep randomness legible**: about 3–7 outcomes per action, and no meaningless
  51/49 splits.

Validate as you go:
```bash
python scripts/dice_odds.py table data/combat_table.csv          # coverage, odds, warnings
python scripts/dice_odds.py roll 2d6 ; python scripts/dice_odds.py compare 2d6 1d12 3d4
python scripts/validate_tables.py data/*.csv --ref singular=data/entity_chart.csv:name
```
Starter CSVs live in `assets/templates/data/` (terrain effects, combat table, encounter
table, entity chart, item chart, XP levels). Copy them and adapt.

Gate: run that system's checklist at the end of its reference file.

## Phase 4: Balance through simulation
**Read:** `references/balancing-and-playtesting.md`

```bash
python scripts/combat_sim.py --example > data/units.json          # edit units, tables, RPS counters
python scripts/combat_sim.py data/units.json                      # win-rate matrix, fight length, flags
python scripts/xp_curve.py --model power --base 100 --exp 1.8 --levels 30 --xp-per-minute 15 --xp-growth 1.08
python scripts/economy_sim.py data/econ_rush.json && python scripts/economy_sim.py data/econ_boom.json
```
Targets: no dominant or dominated unit or class (every row of the matrix loses
somewhere); fight lengths per tier (trash quick, bosses long but not a slog); first level-up
within minutes and no late-game grind cliff; income vs. price ladder per chapter; luck
smaller than skill. Change **one value at a time** and re-run. Record results in a
**balance report** (template in the reference).

Gate: balance reports exist for every core system, with no unresolved DOMINANT,
DEAD OPTION, ACCELERATING (unless intended), SLOG, or grind flags.

## Phase 5: Levels, progression, story, interface
**Read:** `references/progression-and-levels.md`, `references/story-dialogue-interface.md`

Deliverables: a **mission graph + space graph** per level, with lock-and-key validation
(no soft locks, keys before locks, shortcuts in place of backtracking); a **difficulty and
intensity curve** with a rest and save point before every henchman and boss; a
**tutorial plan** (introduce → test → combine, a few lessons at a time); a **level brief**
per level; **story**: premise, world bible, cast by role (one henchman per chapter),
chapter outline in which every beat changes something playable, quest state machines,
and a dialogue data format; **interface**: screen inventory and flow, wireframes with
data sources, HUD rules, control maps per platform, accessibility, and a feedback
catalogue.

Gate: the checklists in both references.

## Phase 6: Game design document
**Read:** `references/production-and-gdd.md` · **Template:** `assets/templates/gdd.md`

Assemble Moore's structure: **Introduction** (management, 4–6 pages), **Game Mechanics**
(programmers, ordered by play-time budget), **Story & Levels**, **Game Graphics**
(artists), **Interface**, and **Appendices** (all charts and tables as data files, audio,
UI schematics, level maps, dialogue, balance reports, change log). Label it a *concept
version*, then maintain it as the production "Bible": every change logged, kept current
for the whole team. For solo or small teams, use the folder form described in the
reference (`design/*.md` + `data/*.csv`).

Gate: each discipline can find its section; every mechanic has algorithm + data +
balance evidence; open questions are listed with the test that resolves them.

## Phase 7: Build a playable prototype
When the user wants something playable (or Claude is building the game):
1. **Prototype the riskiest system first** (usually the core loop or combat). Use the
   simplest fitting medium: a paper ruleset, a script-driven text simulation, or an
   engine/web build with placeholder art. Match the medium to the question: feel and
   scale need real-time; rules clarity and economy can be tested on paper or in a sim.
2. **Keep the game data-driven.** Load charts and tables from the Phase 3 CSV/JSON files,
   with no tuning values hard-coded, so balance changes need no rebuild. Mirror the GDD
   algorithms one-to-one in code and cite the GDD step numbers in comments.
3. **Build in the designer tools Moore asks for:** debug logs of RNG outputs, combat
   resolution, and AI decisions; a quick way to reload data; cheats and save states for
   testing any point of the game.
4. **Give feedback for every action** (highlights, alerts, damage feedback) and teach
   through play, not text.
5. **Vertical slice next**: one level at representative quality, end to end. Then run the
   playtest protocol with fresh players and update the GDD and balance reports from what
   you learn.
If the project already has a codebase, follow its existing architecture and conventions.
These principles shape what you build, not which framework to use.

## Phase 8: Production, testing, launch
**Read:** `references/production-and-gdd.md`, `references/balancing-and-playtesting.md`

Plan milestones with exit criteria: concept → proposal → preproduction complete (TDD,
art bible, audio doc, test suite, interactive prototype) → vertical slice → **alpha**
(playable start to finish; attributes frozen) → **beta** (content complete; design
frozen; bugs only) → **gold** → post-launch patches and telemetry. Guard against late
changes unbalancing finished content, keep fresh testers coming, and park late ideas for
updates or sequels.

---

## Output conventions

- Lead every design doc with a 3–5 line summary: what this is, the key decisions, and
  what's open.
- Use tables for charts, numbered steps for algorithms, and fenced blocks for formulas,
  scripts, and diagrams.
- Use relative values ("fast / moderate / slow") until a prototype exists; once numbers
  are proposed, show the simulation or odds output that justifies them.
- Name the patterns and mechanic types you use so the reasoning is traceable.
- Prefer concrete examples from the user's own game over generic ones, and keep
  examples from many genres in mind: these principles apply to platformers, puzzle
  games, card games, and learning games as much as to RPGs and wargames.

## Bundled resources

| Path | What it's for |
|---|---|
| `references/concept-and-pitch.md` | Fun factor, play-time budget, genre elements, abstraction and fudge, high concept, pitch, proposal |
| `references/mechanics-framework.md` | Mechanics vs. rules, five mechanic types, discrete/continuous, core mechanic, emergence vs. progression, writing algorithms, Boolean scripting, meaningful mechanics |
| `references/internal-economy.md` | Resources, sources, drains, converters, traders, feedback-loop characteristics, Machinations notation, modelling steps, failures and fixes |
| `references/design-patterns.md` | Engine / friction / escalation / other patterns, symptom-to-pattern guide |
| `references/probability-and-math.md` | Dice, bell curves, matrices, percentile tables, precision, RNG hygiene, readable numbers |
| `references/movement-and-space.md` | Scale, military scales, hexes, ZOC, terrain charts, action points, world map, LOS, fog, movement rates, encounter tables |
| `references/combat.md` | RPS balance, turn vs. real time, AV/DV/HP, RPG algorithm, combat and crit tables, magic, flee, wargame SOP and CRT, RTS, AI |
| `references/characters-and-entities.md` | Character generation, races, classes, skills, starting kit, leveling, XP curves, entity roles, monster charts |
| `references/content-systems.md` | Items, inventory, stores and money, magic, tech trees, puzzles, quests |
| `references/progression-and-levels.md` | Missions and spaces, locks and keys, emergent progression, flow, tutorials, pacing, playfields, level brief |
| `references/story-dialogue-interface.md` | Story structures, linking plot to play, dialogue data, GUI, controls, feedback |
| `references/balancing-and-playtesting.md` | Prototype ladder, simulation, what "balanced" means, methods, playtest protocol, telemetry, balance report |
| `references/production-and-gdd.md` | Design data types, roles, preproduction to gold, GDD structure, milestone gates, scaling down |
| `scripts/dice_odds.py` | Exact odds for dice expressions, keep-highest/lowest, binary sticks, d100 table validation |
| `scripts/combat_sim.py` | Monte Carlo fights: win-rate matrix, fight length, dominant/dominated/slog flags |
| `scripts/economy_sim.py` | Machinations-style economy runs with artificial players and runaway/dead/swingy flags |
| `scripts/xp_curve.py` | XP tables (doubling/power/exponential/linear/authored) with play-time pacing and grind checks |
| `scripts/validate_tables.py` | Lint CSV data: duplicate ids, range coverage per group, % totals, cross-table references |
| `assets/templates/` | Pitch, proposal, and GDD templates; starter CSV data tables |

All scripts use only the Python 3 standard library. Run any of them with `--help` for
the full usage.
