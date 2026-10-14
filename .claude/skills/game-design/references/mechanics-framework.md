# Game Mechanics Framework

Sources: Adams & Dormans, *Game Mechanics: Advanced Game Design* (ch. 1–3, 10–12;
summarized from the published framework, since the text wasn't in the source files provided),
plus Moore, *Basics of Game Design*, ch. 2–3 (read in full) on describing mechanics so they
can be built.

## Contents
1. Mechanics vs. rules vs. gameplay
2. The five types of mechanics
3. Discrete vs. continuous mechanics
4. Core mechanics
5. Emergence vs. progression
6. Why games become complex: structural sources of emergence
7. Writing a mechanic so programmers can build it (Moore)
8. Algorithms and scripting logic (Moore)
9. Meaningful mechanics: what the system says

---

## 1. Mechanics, rules, gameplay

- **Rules** are what the player is told; they can be read in a manual.
- **Mechanics** are the rules, processes, and data at the heart of the game, specified
  precisely enough to implement. They define how play progresses, what happens when, and
  what conditions mean victory or defeat.
- **Gameplay** is what emerges when players act inside those mechanics: the challenges
  they face and the actions they can take to meet them.

You design mechanics; gameplay is the result. So a mechanic is judged by the gameplay it
produces, and the only way to see that is to build it (on paper, in a sim, or in code)
and play it.

## 2. The five types of mechanics

| Type | What it governs | Typical genres |
|---|---|---|
| **Physics** | Movement, force, collision, timing, aim, jumping. Often continuous and real-time. | Action, platformer, racing, sports, physics puzzles |
| **Internal economy** | Creating, consuming, and trading **resources**: money, ammo, health, XP, mana, units, points, even intangibles like reputation. | Nearly all genres; dominant in strategy, management, RPG |
| **Progression mechanisms** | How the player moves through designed content: levels, locks and keys, quests, story gates, unlocks. | Adventure, action-adventure, RPG, campaign modes |
| **Tactical maneuvering** | Placing and moving units on a map for offensive or defensive advantage; position matters. | Strategy, tactics, board games, wargames |
| **Social interaction** | Rules for cooperation, competition, alliances, trading, communication between players. | Multiplayer, MMO, party, social games |

Most games mix several. **Name the dominant type for your core loop.** It decides which
prototype to build first: a physics prototype in an engine, or an economy prototype on
paper or in a sim.

Rough genre mapping:
- **Action:** physics core; internal economy for health, ammo, power-ups, collectibles;
  progression via levels.
- **Strategy (RTS/4X):** internal economy plus tactical maneuvering; social interaction in
  multiplayer.
- **RPG:** internal economy (XP, gold, stats, items) plus progression (quests, story).
- **Sports:** physics in the match; internal economy in team management.
- **Vehicle sims:** physics; sometimes economy (repairs, money).
- **Management/tycoon/city-builder:** internal economy above all.
- **Adventure:** progression (locks and keys, puzzles, story).
- **Puzzle:** physics or discrete logic rules, plus progression through levels.

## 3. Discrete vs. continuous mechanics

- **Continuous** mechanics (precise physics, smooth velocities) feel real and responsive,
  but are hard to reason about and hard to balance on paper. Prototype them in software.
- **Discrete** mechanics (whole-number resources, grid moves, turns) are easier to grasp,
  simulate, balance, and reproduce on paper. The economy and progression layers are
  usually best kept discrete even when movement is continuous.

A game can be continuous at one level (moment-to-moment physics) and discrete at another
(coins collected, lives left). Most physics games use discrete economies for scoring and
power-ups.

## 4. Core mechanics

The **core mechanic** is the mechanic that is most influential and that the player
interacts with most often (jump-and-stomp in Mario; build-gather-fight in an RTS). It
links many other mechanics. A strong core mechanic:
- is performed many times per minute or per turn and stays interesting through
  repetition;
- connects to the internal economy (it earns, spends, or risks something);
- creates choices with consequences, not just execution.

Write the core loop as a cycle: **action → resource change → new options → action**.
Example (RTS): gather → spend on units/buildings → fight to gain territory or more
gathering capacity → gather.

## 5. Emergence vs. progression

Two structural ways to produce gameplay (after Jesper Juul):

| | Games of emergence | Games of progression |
|---|---|---|
| Source of variety | A few rules combine into a huge space of situations | The designer authors a sequence of challenges |
| Examples | Chess, Go, poker, Civilization, SimCity, Tetris | Classic adventure games, linear shooters, story campaigns |
| Strengths | Replayability, player creativity, strategy depth, cheap content | Control over pacing, story, tutorials, set pieces |
| Weaknesses | Hard to predict, hard to balance, harder to tell a story | Expensive content, little replay, players can feel railroaded |
| Primary tools | Feedback loops, internal economy, tactical maneuvering | Locks and keys, level design, scripting, story |

Most modern games mix the two: emergent systems (combat, economy) run inside a
progression wrapper (levels, quests). Decide the ratio on purpose, because it sets your
production cost. Progression content scales with hours of play; emergent systems scale
with design and balance effort.

**Emergent progression**: let systems gate progress, not only keys. For example, a
region opens when the economy can support an army big enough to take it.

## 6. Structural sources of emergence

A system behaves in complex, surprising ways when it has:
1. **Active, interconnected parts.** Elements that change state and affect one another,
   not just static content.
2. **Feedback loops.** A state change flows back to affect the thing that caused it.
   Positive feedback amplifies differences (the rich get richer). Negative feedback damps
   them (rubber-banding).
3. **Interaction across scales.** Small local rules produce large global patterns. In
   Conway's Game of Life, cell rules produce gliders.

Too few connections and the game is predictable and solved quickly. Too many, or too
chaotic, and choices stop mattering because outcomes feel random. Aim for the zone in
between, where players can form plans and the system still surprises them.

Practical consequence: **feedback structure, not the number of rules, is what drives
complexity.** A game with ten rules and two well-tuned feedback loops can out-depth a
game with a hundred rules and none. Details in `internal-economy.md` and
`design-patterns.md`.

## 7. Writing a mechanic so it can be built (Moore)

Vague: *"the player uses different vehicles to elude the police."* That could produce a
full racing sim instead of the simple driving scheme the designer pictured.

Precise: group objects into **classes**, describe them with **relative values**, and
attach a **chart**:

| Vehicle | Light (motorcycle) | Medium (car) | Heavy (truck/tank) |
|---|---|---|---|
| Passengers | 1 | 3 | 6 |
| Acceleration | fast | moderate | slow |
| Top speed | 120 mph | 90 mph | 50 mph |
| Accident damage | heavy | moderate | minimal |
| Narrow spaces / Alleys / Roads / Open | Y / Y / Y / N | N / Y / Y / N | N / N / Y / Y |

Rules of thumb:
- Use relative values ("fast / moderate / slow") until an interactive prototype exists,
  then set the numbers.
- A chart says more with fewer words. But an endless sea of charts is as meaningless as
  endless text, so add the prose that points out what matters.
- For each mechanic include: the player's goal, controls, on-screen schematic, the
  algorithm, edge cases, and the data it needs.
- Don't over-specify early. A first GDD that dictates implementation handcuffs
  programmers, who may have better ideas. Tighten it as prototypes settle the questions.

## 8. Algorithms and scripting logic (Moore)

Define every action as an **algorithm**: a precise step-by-step procedure from input to
output in a finite number of steps. It doesn't need to be a formula, but a programmer
must be able to code it without guessing. Example (turn-based movement):

> When a unit enters an allowable space, subtract that space's movement-point cost from
> the unit's remaining points. If the unit lacks the points, it can't enter and an alert
> plays. Otherwise it moves in.

Then define every term ("allowable space" = not impassable for that unit type). Complex
procedures (RPG combat) get numbered steps plus a worked example.

**Scripting logic.** Designers change world state through scripts: triggering encounters,
switching NPC dialogue, starting quests. Learn the constructs:
```
IF (QUEST_STONE_SWORD = ACTIVE)   THEN SHOW_TEXT "You are seeking the Stone Sword."
ELSE IF (QUEST_STONE_SWORD = COMPLETE) THEN SHOW_TEXT "You found the Stone Sword."

IF ((NPC1_TALKED = 1) AND (NPC2_TALKED = 1)) THEN QUEST_STONE_SWORD = ACTIVE   # both needed
IF ((NPC1_TALKED = 1) OR  (NPC2_TALKED = 1)) THEN QUEST_STONE_SWORD = ACTIVE   # either one
```
Swapping one word (AND/OR) changes the design completely. Visual scripting (Unreal
Kismet/Blueprints) hides this logic in boxes and wires: unlinked conditions into one
action read as OR, linked conditions read as AND. Keep data and scripts **outside
compiled code** so designers can tune values without a rebuild. Data can be baked in at
ship to stop tampering. A designer-friendly script layer also enables modding, which
extends a game's shelf life.

## 9. Meaningful mechanics (Adams & Dormans)

Mechanics carry meaning on their own, apart from art and text. What a system rewards,
punishes, and makes easy is an argument about the thing it models. This is procedural
rhetoric. A city builder where pollution has no cost says that pollution doesn't
matter. Use this on purpose, especially in serious, educational, or persuasive games:
1. State the message or learning goal as a claim about cause and effect.
2. Model that cause and effect in the economy, not in cutscenes.
3. Check that the dominant strategy matches the lesson. Players learn whatever wins.
4. Use metaphor deliberately. Abstract mechanics (resources, flows) can stand in for
   social or emotional dynamics, but keep the mapping consistent.
