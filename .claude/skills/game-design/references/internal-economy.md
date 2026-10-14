# Internal Economy, Feedback Loops, and Machinations Diagrams

Source: Adams & Dormans, *Game Mechanics: Advanced Game Design*, ch. 4–6 and 8–9
(summarized from the published framework). The simulator in `scripts/economy_sim.py`
implements a text version of the diagram language.

## Contents
1. Resources and entities
2. The four economic functions
3. Shapes of economies over time
4. Feedback loops and their seven characteristics
5. Machinations diagram vocabulary (text form)
6. How to model an economy, step by step
7. Simulating with `economy_sim.py`
8. Worked example: a small RTS economy
9. Common economy failures and fixes

---

## 1. Resources and entities

A **resource** is anything the player can count that the game creates, stores, moves,
spends, or destroys: gold, ammo, health, lives, XP, units, time, territory, cards in
hand, reputation, score.
- **Tangible** resources occupy space in the game world (a pile of wood, a unit on the
  map). **Intangible** ones are just numbers (gold, XP).
- **Abstract** resources are computed from game state and not stored. Positional
  advantage in chess is an example. They often matter most to strategy.

An **entity** stores a resource quantity. A simple entity holds one number (gold = 230).
A compound entity holds several (a unit with HP, ammo, and XP).

## 2. The four economic functions

| Function | Does | Examples |
|---|---|---|
| **Source** | Creates a resource from nothing, unconditionally, on a condition, or on a timer | Gold per turn, enemy spawns, XP on kill, mana regen |
| **Drain** | Destroys a resource permanently | Upkeep, ammo used, damage taken, item decay, tax |
| **Converter** | Turns one resource into another at a rate | Gold → soldier, wood + stone → house, XP → level |
| **Trader** | Moves resources between entities (often players) without creating or destroying them | Market trades, Monopoly rent, gifting |

Every number on the HUD should map to one of these. If you can't say where a resource
comes from and where it goes, that's a design hole.

## 3. Shapes of economies over time

Watch the curve of key resources across a session:
- **Linear growth**: a fixed source with no feedback. Predictable and dull over time.
- **Exponential growth**: positive feedback (production builds more production). Exciting,
  but a lead becomes unbeatable.
- **Equilibrium / plateau**: negative feedback or a balanced drain. Stable, and can feel
  static.
- **Rise and fall / arms race**: competing loops, where escalation is checked by
  attrition.
- **Oscillation**: delayed negative feedback, as in boom-and-bust or predator-prey.

Decide which shape each phase of the game *should* have: opening, mid-game, endgame.
Then build loops that produce it, and confirm by simulation.

## 4. Feedback loops

A **feedback loop** exists when a resource level influences the rate of its own
production or consumption, directly or through other resources.
- **Positive feedback** amplifies change: winners win harder, losers lose harder. It ends
  games and creates drama, and it produces runaway leaders and early decisive wins.
- **Negative feedback** damps change: it stabilizes, prolongs, and lets players catch up.
  Too much makes early play feel meaningless.

Describe each loop by seven characteristics:
| Characteristic | Question |
|---|---|
| **Type** | Positive or negative? |
| **Effect** | Constructive (helps the affected player) or destructive (hurts an opponent)? A destructive positive loop, where hurting the enemy makes it easier to hurt them more, is especially decisive. |
| **Investment** | What must be spent to start the loop turning? |
| **Return** | How much does one turn of the loop pay back, relative to investment? |
| **Speed** | How long until the return arrives? Fast loops dominate perception. |
| **Range** | Short (local, immediate) or long (felt over the whole game)? |
| **Durability** | How long does the loop keep working before it stops or saturates? |

Rules of thumb:
- Use **positive** constructive loops for the sense of building and growth. Pair them with
  something that stops a leader escaping too early (a stopping mechanism, dynamic
  friction, rising costs).
- Use **negative** loops for catch-up, but make them **slow** and **weak** relative to
  skill. Otherwise good play goes unrewarded.
- **Destructive** positive loops (killing units weakens the enemy, so killing gets
  easier) end games fast. Use them for endgames.
- **Multiple feedback** (one action feeding several loops of different speeds) creates
  depth: short-term vs. long-term trade-offs.

## 5. Machinations vocabulary (text form)

Machinations is Dormans' diagram language for economies. Use it as a thinking tool; you
can draw it as text:

| Element | Meaning | Text notation |
|---|---|---|
| **Pool** | Stores resources (a circle with a count) | `(gold:10)` |
| **Source** | Produces resources | `[+] -> gold` |
| **Drain** | Consumes resources | `upkeep -> [x]` |
| **Converter** | Consumes input, produces output | `gold 5 -> <convert> -> soldier 1` |
| **Trader** | Swaps resources between two pools | `<=>` |
| **Gate** | Distributes resources by probability or condition | `<gate 60%/40%>` |
| **Resource connection** | Solid arrow: resources flow, labelled with a rate | `gold --3/turn--> army` |
| **State connection** | Dotted arrow: one node's state modifies another's rate, or triggers or activates it | `mines ..+3.. mining_rate` |
| **Trigger** | Fires a node when a condition is met | `hp<=0 ..*.. respawn` |
| **Activator** | Enables or disables a node by condition | `gold>=15 ..on.. build_mine` |
| **Register** | Displays a computed value | `[score = kills*10]` |
| **Delay / queue** | Resources arrive after time; production queues | `--delay 3-->` |
| **End condition** | Game over when true | `END: enemy_hp<=0` |

**Activation modes**: automatic (fires every step), interactive (the player clicks it),
starting action (once at start), passive (fires only when triggered).
**Push vs. pull**: a node pushes resources out or pulls them in. Pulling from an empty
pool moves nothing.
**Artificial player**: a scripted policy that clicks the interactive nodes (e.g. "build a
mine when gold ≥ 15") so you can run the diagram thousands of times without a human.

## 6. How to model an economy

1. **List resources.** Every number the player sees, plus the important abstract ones.
2. **Wire the functions.** For each resource: which sources, drains, converters, and
   traders touch it?
3. **Find the loops.** Trace each resource around the diagram until it returns to
   itself. Label each loop with the seven characteristics.
4. **Mark the player's decisions.** These are the interactive nodes: where the player
   chooses what to build or spend. With no interactive nodes, there's no gameplay, only a
   movie.
5. **Choose target shapes** (section 3) per phase.
6. **Simulate** with artificial players representing different strategies (rusher,
   turtler, balanced, random). Look for one strategy beating all others (a dominant
   strategy), options never used (dead options), runaway leaders, stalls, games that run
   too long, and randomness drowning out skill.
7. **Apply a pattern** from `design-patterns.md` to fix the problem you saw, then re-run.
8. **Only then** commit values to the GDD's data tables.

## 7. Simulating with `economy_sim.py`

```
python scripts/economy_sim.py --example > econ.json        # starter spec (params + 3 strategies)
python scripts/economy_sim.py econ.json --runs 500          # strategies compared side by side
python scripts/economy_sim.py econ.json --strategy boom --csv traj.csv   # full report for one
python scripts/economy_sim.py econ.json --set upkeep=0.8    # try a value without editing the file
python scripts/economy_sim.py econ.json --sweep upkeep=0.25,0.5,1.0      # sensitivity sweep
```
- **Pools** are resources. **Flows** are sources/drains (`source`, `drain`, or pool→pool)
  whose rate expressions can reference any pool or param. This is how you express state
  connections and feedback (`"rate": "3*mines"` = mines feed gold).
- **Params** are named tuning knobs. Put every number you expect to tune here rather than
  inline, so balance passes are `--set`/`--sweep` runs, not file edits.
- **Converters** are the artificial player's choices (`when`, `consume`, `produce`,
  `max_per_step`). Costs may be expressions, so a rising-cost **stopping mechanism** is
  one line: `"consume": {"gold": "mine_cost*1.3**(mines-1)"}`.
- **Strategies** are artificial players: each overrides `params`, `converters` or starting
  `pools`. The comparison flags a strategy that wins far more often than all others
  (**DOMINANT?**).
- **End** conditions give outcome percentages and game length.
- Per-strategy flags: **ACCELERATING** (runaway positive feedback), **FLAT** (unconnected),
  **SWINGY** (luck dominates), **DEAD OPTION** (converter never fires), **NO ENDING**.
- If you need more than this format can express (card-level play, spatial rules), write a
  game-specific simulator that reads the same data tables. Keep this one for fast
  structural checks.

Treat the output as evidence for a design decision, not as the final numbers. Re-check in
an interactive prototype at the correct scale (Moore: the real values only settle once the
game runs at runtime speed).

## 8. Worked example: RTS economy

```
(gold:10) <--3*mines-- [+]            # mining: positive feedback via mines
(mines:1) <-- <build: 15 gold> -- (gold)   # interactive: invest in economy
(soldiers) <-- <train: 5 gold> -- (gold)   # interactive: invest in military
(gold) --0.5*soldiers--> [x]          # upkeep: negative feedback on army size
(enemy_hp:300) --soldiers*d3--> [x]   # destructive: army attacks enemy
END: enemy_hp <= 0
```
Loops:
- *Mines → gold → mines*: positive, constructive, investment 15, slow, long range. This
  is the engine.
- *Soldiers → upkeep → less gold → fewer soldiers*: negative, constructive. This is the
  brake.
- *Soldiers → enemy damage*: destructive. This is the win path.

Decision: when to stop building mines and switch to soldiers. That is the classic
**engine-building** timing choice and the core strategic tension. Simulate a "2 mines
then army" policy against "6 mines then army". If one always wins, the tension is fake;
retune costs or upkeep.

## 9. Common failures and fixes

| Symptom | Likely structural cause | Fix (pattern) |
|---|---|---|
| Leader snowballs; game decided early | Strong, fast positive loop with no brake | Stopping mechanism (rising costs), dynamic friction (upkeep scaling with size), slow cycle |
| Games drag; nobody can finish | Negative feedback too strong, or no destructive loop | Add attrition or an escalating challenge; weaken catch-up |
| One strategy always wins | A converter with outsized return, or an unchecked loop | Raise investment, lengthen delay, add a counter (rock-paper-scissors) |
| An option is never chosen | Cost too high, or its loop too slow to matter | Shorten speed, raise return, or cut it |
| Outcomes feel random | Gates and random rates outweigh decisions | Reduce variance; move randomness before decisions (information) rather than after (resolution) |
| Economy feels static | Only linear sources | Add a converter engine or engine-building choice |
| Players hoard and never spend | No drain, or no time pressure | Decay, upkeep, escalating threats, spend-or-lose timers |
