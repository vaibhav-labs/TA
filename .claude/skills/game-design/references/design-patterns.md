# Mechanics Design Patterns Library

Source: Adams & Dormans, *Game Mechanics: Advanced Game Design*, ch. 7 and the pattern
appendix (summarized from the published pattern language). Each entry gives structure,
use, examples, and trade-offs. Patterns combine: most good economies are an **engine**
checked by **friction**, with **escalation** supplying pressure.

## Contents
- Engines: Static Engine, Dynamic Engine, Converter Engine, Engine Building
- Friction: Static Friction, Dynamic Friction, Stopping Mechanism, Attrition
- Escalation: Escalating Challenge, Escalating Complexity, Arms Race
- Other: Playing Style Reinforcement, Multiple Feedback, Trade, Worker Placement, Slow Cycle
- Choosing patterns from a symptom

---

## Engines: where resources come from

### Static Engine
**Structure:** a source produces resources at a fixed or player-uninfluenced rate.
**Use:** a predictable baseline income that forces budgeting decisions.
**Examples:** fixed gold per turn, ammo crates on a timer, energy regen.
**Trade-offs:** stable and easy to balance; no long-term planning, because there's
nothing to invest in. Pair it with interesting spending choices.

### Dynamic Engine
**Structure:** a source whose rate the player can raise by investing resources it
produces. This is a positive loop.
**Use:** long-term investment decisions: spend now, or invest for more later.
**Examples:** buying more mines, upgrading production, interest on savings.
**Trade-offs:** creates the satisfying sense of growth, but also snowballing. Needs
friction or a stopping mechanism.

### Converter Engine
**Structure:** two (or more) converters feed each other in a loop (A → B, B → more A),
often with a surplus.
**Use:** an economy players learn to optimize; puzzle-like efficiency play.
**Examples:** oil → electricity → refinery throughput; turning crops into food into
workers.
**Trade-offs:** more complex and more fragile. Small rate changes cause runaway or
collapse. Simulate it.

### Engine Building
**Structure:** a significant part of play is constructing and tuning the engine itself,
usually a dynamic engine with many upgrade options.
**Use:** the core of build-up games (city builders, deck-builders, 4X, idle games).
**Examples:** SimCity, Dominion, Factorio, Civilization.
**Trade-offs:** deep and replayable. The key tension is *when to stop investing and start
cashing in*. Make that timing a real choice.

---

## Friction: where resources go, and what slows the leader

### Static Friction
**Structure:** a drain removes resources at a fixed or periodic rate, independent of
player state.
**Use:** constant pressure; prevents infinite hoarding.
**Examples:** food consumption per turn, fuel burn, fixed rent.
**Trade-offs:** simple, but it hurts weak players more than strong ones in relative
terms.

### Dynamic Friction
**Structure:** a drain whose rate grows with the player's own resources or progress. This
is a negative loop.
**Use:** automatically slows leaders; keeps games close.
**Examples:** upkeep proportional to army size (Warcraft's upkeep tiers), corruption
growing with empire size (Civilization), enemy spawn rate rising with player strength.
**Trade-offs:** an effective catch-up mechanic. If too strong, success feels pointless.

### Stopping Mechanism
**Structure:** the effectiveness of a positive loop falls each time it is used (each
additional investment costs more or returns less).
**Use:** keeps a dynamic engine from running away while preserving the choice to invest.
**Examples:** rising building costs, diminishing returns on stat points, escalating
upgrade prices.
**Trade-offs:** subtle and fair-feeling. Tune the curve so the "last useful purchase"
arrives at the right point in the game.

### Attrition
**Structure:** players actively destroy each other's resources (destructive feedback).
**Use:** direct conflict; the main route to ending competitive games.
**Examples:** combat destroying units, card-game removal, raiding.
**Trade-offs:** dramatic. Combined with positive feedback it ends games fast. A player
hit early can be locked out, so pair it with defense or comeback options.

---

## Escalation: pressure that grows

### Escalating Challenge
**Structure:** progress toward the goal increases the difficulty of further progress.
This is a negative loop on progress.
**Use:** a natural difficulty curve in single-player games; the final stretch is
hardest.
**Examples:** Space Invaders speeding up as fewer remain, Tetris speed by level, tougher
waves.
**Trade-offs:** paces itself, but must outpace player skill growth at the right rate (see
flow in `progression-and-levels.md`).

### Escalating Complexity
**Structure:** the player must manage more over time, and complexity grows faster than
they can keep up. Positive feedback on difficulty.
**Use:** survival or "how long can you last" games where losing is inevitable.
**Examples:** Tetris garbage stacking, Diner Dash, tower-defense waves with mixed types.
**Trade-offs:** tense and replayable. The player always loses eventually, so score or
time becomes the goal.

### Arms Race
**Structure:** players invest in offensive and defensive upgrades that counter each
other, escalating in step.
**Use:** long-term strategic competition with tech or upgrade trees.
**Examples:** RTS tech tiers, armor vs. weapon upgrades, spam vs. filters.
**Trade-offs:** rich decision space. It can stalemate if defense and offense are always
equal, so give them different timings or costs.

---

## Other patterns

### Playing Style Reinforcement
**Structure:** slow positive feedback that strengthens whichever style the player already
uses. Actions accumulate into a persistent specialization.
**Use:** lets players express identity; differentiates long-term characters or
civilizations.
**Examples:** skill-by-use leveling (Elder Scrolls), Spore's stage traits, class
specialization.
**Trade-offs:** strong attachment. Players can lock themselves into a weak build, so
allow respecs or make every style viable.

### Multiple Feedback
**Structure:** one mechanism feeds several loops with different speeds, ranges, or types.
**Use:** depth from one action: short-term vs. long-term trade-offs.
**Examples:** killing an enemy gives gold now (fast), XP (slow), and raises the alarm
(negative, destructive to the player).
**Trade-offs:** hard to read. Make each loop's effect visible in feedback and UI.

### Trade
**Structure:** a trader lets players exchange resources, often at negotiated or
fluctuating rates.
**Use:** social interaction, specialization, kingmaking dynamics.
**Examples:** Settlers of Catan, MMO markets, Monopoly deals.
**Trade-offs:** creates cooperation and competition, but it can be abused (collusion,
feeding). Limit rates or partners if needed.

### Worker Placement
**Structure:** limited workers (action tokens) must be assigned to exclusive or scarce
action spaces. Assignment is the main decision.
**Use:** clear, readable decisions with direct competition for opportunities.
**Examples:** Agricola, Lords of Waterdeep, colony-sim job assignment.
**Trade-offs:** elegant and strategic. Turn order matters a lot, so rotate first player.

### Slow Cycle
**Structure:** a mechanism that switches state periodically (seasons, day/night, tides),
changing which strategies work.
**Use:** variety and rhythm; forces adaptation and planning ahead.
**Examples:** seasons in farming games, day/night monster spawns, market cycles.
**Trade-offs:** adds texture cheaply. The cycle must be visible and predictable enough to
plan around.

---

## Choosing patterns from a symptom

| You want / you see | Reach for |
|---|---|
| Growth and long-term planning | Dynamic Engine, Engine Building |
| Runaway leader | Stopping Mechanism, Dynamic Friction |
| Game never ends | Attrition, Escalating Challenge |
| Single-player difficulty curve | Escalating Challenge (+ progression gating) |
| Survival / high-score loop | Escalating Complexity |
| Strategic tech race | Arms Race + Stopping Mechanism |
| Player identity / builds | Playing Style Reinforcement |
| Depth from few actions | Multiple Feedback |
| Multiplayer cooperation and negotiation | Trade, Worker Placement |
| Variety without new content | Slow Cycle |
| Hoarding | Static Friction, decay drains |

Document each chosen pattern in the GDD with: the pattern name, the resources it uses,
its intended shape over time, and the simulation evidence that it works.
