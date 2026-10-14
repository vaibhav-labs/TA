# Progression, Level and Playfield Design, Learning and Flow

Sources: Adams & Dormans, *Game Mechanics: Advanced Game Design*, ch. 10–11 (integrating
level design and mechanics; progression mechanisms; summarized from the published
framework). Moore, *Basics of Game Design*, ch. 1 and 4 (read in full: paper layouts,
scale, encounters, planning before building), plus the structure of his ch. 11
(Designing Playfields: 2D maps, 3D levels, scripting and playfields, point of view,
playfield problems, planning before building). Ch. 11 was beyond the provided pages,
so it's summarized from its outline and the method of the earlier chapters.

## Contents
1. Two halves of structure: missions and spaces
2. Lock-and-key mechanisms
3. Emergent progression
4. Character progression vs. player progression
5. Learning, tutorials, and flow
6. Pacing a level: intensity curves
7. 2D maps and 3D levels
8. Point of view
9. Scripting in playfields
10. Common playfield problems
11. Plan before you build: level brief template
12. Checklist

---

## 1. Missions and spaces

Think of every level as **two graphs** laid over each other:
- **Mission graph:** the ordered tasks the player must do (get key A → open gate → defeat
  guard → get key B ...), including optional branches and parallel tasks.
- **Space graph:** the rooms and areas, and how they connect (corridors, doors, one-way
  drops, shortcuts).
Good levels **map the mission onto the space** so that the player crosses space while
doing the mission, sees goals before reaching them, and returns through shortcuts rather
than backtracking. Dormans' work goes further and uses **generative grammars** (rewrite
rules over mission and space graphs) to generate levels procedurally while keeping lock
and key logic valid.

## 2. Lock-and-key mechanisms

A **lock** is anything that blocks progress; a **key** is what removes it. Keys can be
literal (items), abilities (double jump, swim), knowledge (a code), story state (a quest
flag), resources (enough gold or troops), or skill (a hard jump).
Rules:
- Every lock must have a reachable key **before** it on every path. Check that the mission
  graph has no dead ends.
- **Show the lock before the key**, so finding the key gives an "aha, I can open that"
  moment (the Metroidvania pattern).
- **Ability keys** that also add a verb to the core mechanic are the best keys: they
  open space *and* deepen play.
- Avoid single-use keys that can be wasted, or make them replenishable.
- Use one-way valves (drops, collapsing bridges) to control pacing and cut backtracking.

## 3. Emergent progression

Progress can be gated by **system state** instead of authored keys: an area opens when
the economy supports an army big enough, a door yields to enough damage, a boss is
beatable once the engine is built. It combines the replay value of emergence with the
pacing of progression. Model the gating resource in `economy_sim.py` to predict when
most players arrive.

## 4. Character progression vs. player progression

- **Character progression:** the avatar gets stronger (levels, stats, gear). It is an
  internal economy (XP as a resource, levels as converters) and a reward loop. See
  `characters-and-entities.md`.
- **Player progression:** the human gets better (skill, knowledge, strategy).
- Balance them. If character power outpaces challenge, skill stops mattering. If
  challenge outpaces both, players hit walls. Grinding lets slow players buy power with
  time (a safety valve), but it shouldn't be the required path.

## 5. Learning, tutorials, flow

- **Flow** (Csikszentmihalyi): engagement peaks when challenge tracks skill. Too hard
  produces anxiety; too easy, boredom. Push challenge slightly above skill, then give
  relief.
- **Tutorials:** teach a few lessons at a time across hours (Moore); hands-on
  demonstrations of each major system early. Teach *how*, not *why*. Teach one verb in a
  safe space, test it in a low-risk situation, then combine it with known verbs.
- **Feedback as teaching:** live movement highlights, a grayed-out Flee button, item
  tooltips. UI that shows the rules reduces tutorial text.
- Starting inventories and early enemies **signal** what the player needs to learn.
- **Fresh testers:** veteran testers ask for harder levels because they know them too well.
  Keep bringing in new players from alpha onward to judge the difficulty curve across the
  whole game (Moore).

## 6. Pacing a level

Plot intended **intensity** over a level and over the game: build-up → spike (set piece
or boss) → relief (safe room, story, shop, save point) → a higher build-up. Rules:
- Place a **rest and save point before every henchman and boss** (Moore).
- Break long traversals with encounters, items, or vistas (more than ~10 minutes of
  travel needs plenty to do).
- Alternate play modes from the play-time budget (combat → exploration → puzzle → story)
  to avoid repetition.
- Escalate along two axes: enemy strength (escalating challenge) and the number of
  mechanics in play (escalating complexity).

## 7. 2D maps and 3D levels

- **2D maps:** top-down or side-on; grids or tiles; easy to paper-prototype exactly;
  readability and sightlines are explicit.
- **3D levels:** verticality, occlusion, camera problems; built by artists or level
  designers in 3D tools from the designer's layout. Paper layouts speed up artists (Moore
  ch. 1). Greybox before art.
- Both need: critical path, optional areas, landmarks for orientation, encounter and item
  placement, triggers, checkpoints, and navigation aids (map, compass, lighting, colour).

## 8. Point of view

First-person (immersion, limited awareness; weapons and hands visible; detailed
textures close up) · third-person over-shoulder (character visible; the body blocks part
of the view) · top-down or isometric (tactical awareness, small objects) · side-scroller
(clear spatial reading; vertical play) · free camera (strategy). POV dictates object
scale, art detail, the cost of character customization, and the information shown on
screen. Choose it before laying out levels.

## 9. Scripting in playfields

Level designers place triggers and volumes that run scripts: spawn encounters, start
cutscenes, switch dialogue, open doors, update quest flags (see the Boolean logic in
`mechanics-framework.md`). Keep the scripts readable, name the variables consistently
(`QUEST_<NAME>`, `NPC_<NAME>_<TOPIC>_CHAT`), and log state changes for QA.

## 10. Common playfield problems

- Getting lost: no landmarks, samey corridors, a hidden critical path.
- Backtracking without shortcuts or fast travel.
- Sequence breaks: players skip gates through set-piece encounters they could avoid, or
  geometry exploits (Moore: add preventatives).
- Soft locks: a key consumed or missed, a one-way drop before an unfinished task.
- Scale mismatch: the level built at the wrong scale for movement speed or camera.
- Encounter density wrong for revisit frequency (random encounters too common in hub
  areas).
- Save points too far from bosses.

## 11. Plan before you build: level brief

```
Level: <id/name>        Chapter: <n>     Target play time: <min>
Purpose: <what this level teaches/tests/advances>
New verb/mechanic introduced: <...>     Verbs combined: <...>
Mission graph: <ordered tasks, branches, locks->keys>
Space graph: <areas, connections, one-way valves, shortcuts>
Intensity curve: <beats with timings>
Encounters: <set pieces + random table id + frequency>
Items/treasure: <placements, tiers, drop tables>
Save/rest points: <locations>
Story beats/dialogue triggers: <...>
Scripts/flags: <variables set/checked>
Art/audio needs: <tilesets, unique props, music cue>
Risks: <soft locks, sequence breaks, scale>
Paper prototype done: [ ]   Greybox done: [ ]   Playtested by fresh players: [ ]
```

## 12. Checklist

- [ ] Mission and space graph for each level; lock-and-key validation (no unreachable
      keys, no soft locks).
- [ ] Difficulty and intensity curve for the whole game; boss save points.
- [ ] Tutorial plan: verbs per level, introduce → test → combine.
- [ ] Character power curve vs. enemy curve checked (`xp_curve.py`, `combat_sim.py`).
- [ ] POV and scale fixed before production layouts.
- [ ] Level briefs written and paper prototypes or greyboxes tested with fresh players.
