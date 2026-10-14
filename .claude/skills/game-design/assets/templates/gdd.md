# <Working Title> — Game Design Document
Version: <x.y> · Stage: Concept | Production ("Bible") · Last updated: <date> · Owner: <lead designer>

> Living document. Every change gets a line in the Change Log (Appendix Z). Sections are
> ordered by the play-time budget: the most-played systems first and in the most detail.
> Mark unresolved items `OPEN:` with the prototype or test that will settle them.

---

## Part 1 — Introduction (for management; 4–6 pages max)
1.1 High concept (≤20 words)
1.2 Example of play (a short narrated minute of gameplay)
1.3 Genre · fictional setting · platform(s) · target audience · rating
1.4 Unique selling points (3 max)
1.5 Play-time budget

| Play element | % of play time | GDD section |
|---|---|---|

1.6 Core loop diagram (action → resource change → new options)
1.7 Mechanic-type profile: physics / internal economy / progression / tactical maneuvering / social (dominant + secondary)
1.8 Emergence vs progression strategy
1.9 Rough scope, budget and schedule; milestone list

## Part 2 — Game Mechanics (for programmers)
For EACH play element (ordered by %), use this sub-template:

### 2.N <Element name>
- **Player goal & fantasy:**
- **Description (relative values first):**
- **Chart(s):** <link to Appendix table / data file>
- **Algorithm:** numbered steps, every term defined, worked example
- **Randomness:** where it enters, table + odds (`dice_odds.py` output)
- **Feedback loops & patterns:** <loop, type, effect, speed; pattern names>
- **UI:** screen schematic reference, info shown, actions
- **Controls:** per platform
- **Edge cases & failure messages:**
- **Tuning knobs exposed to designers (data, not code):**
- **Balance evidence:** <sim command + summary, playtest notes>
- **OPEN questions:**

Typical element sections (keep the ones that apply):
2.1 Movement & scale · 2.2 Combat (melee/ranged/magic; flee) · 2.3 Characters: generation, races, classes, skills
2.4 Experience & leveling · 2.5 Entities & AI behavior · 2.6 Items, inventory, stores, money
2.7 Magic / technology / tech tree · 2.8 Resources & production (economy) · 2.9 Puzzles & quests
2.10 Encounters & spawning · 2.11 Progression structure (missions/spaces, locks & keys) · 2.12 Save system
2.13 Multiplayer/social rules · 2.14 Tutorial plan · 2.15 Difficulty settings & accessibility

## Part 3 — Story & Levels (for designers, writers, level builders)
3.1 Premise & world bible summary · 3.2 Cast by role (villain, henchmen per chapter, minions, allies, NPCs)
3.3 Chapter outline (goal, locations, henchman, new mechanic, rewards)
3.4 Level briefs (one per level — see progression-and-levels.md template)
3.5 Quest list (state variables, conditions, rewards) · 3.6 Dialogue system & data format

## Part 4 — Game Graphics (for artists)
4.1 Art direction summary & references · 4.2 Characters (physical description, actions → animations, VFX)
4.3 Entities/monsters (+ playable-monster appeal notes) · 4.4 Environments/tilesets · 4.5 Items & icons
4.6 UI art · 4.7 Asset list with priorities (link to art bible)

## Part 5 — Interface
5.1 Screen inventory & flow diagram · 5.2 Wireframes per screen (data shown + source) · 5.3 HUD rules
5.4 Control maps per platform · 5.5 Feedback catalogue

## Appendices
A. Charts & tables (or links to data files): movement/terrain effects, combat table, crit table, character generation, skills, XP/levels, entity attributes, encounter tables per map, treasure tables, item chart, spell chart, tech tree, store inventories, economy parameters
B. Audio requirements (SFX list, VO, music themes)
C. UI schematics · D. Level maps · E. Dialogue scripts · F. Flowcharts & storyboards
G. Balance reports (see balancing-and-playtesting.md template)
H. Test plan hooks (what QA must verify per system)
Z. Change log: | date | section | change | reason | author |
