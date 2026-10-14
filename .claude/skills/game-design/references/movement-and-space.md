# Movement, Scale, Maps, and Encounters

Source: Moore, *Basics of Game Design*, ch. 4 (read in full). Adams & Dormans' "tactical
maneuvering" mechanic type sits here too.

## Contents
1. What the movement section of a GDD must answer
2. Scale (object size, interface, consistency)
3. Military scales: tactical, operational, strategic
4. Regulating movement: hexes, squares, splines, waypoints
5. Zones of control
6. Movement statistics, terrain, and action points
7. Strategic / world map, fast travel, line of sight, fog of war
8. Setting movement rates (realistic vs. paced)
9. Revealing movement paths (UI)
10. Movement algorithm template
11. Random and set-piece encounters, encounter tables
12. Items on the map
13. Exercises to run during design

---

## 1. Questions the movement section must answer

- What moves (units, characters, vehicles, cursor) and who controls it?
- What scale are objects relative to the world and the screen?
- Continuous or regulated (grid, hex, spline, waypoint)? Real-time or turn-based?
- What restricts movement (terrain, walls, zones of control, supply, fuel)? How does the
  player learn the limits? Some are obvious (a car can't cross a lake); some are
  discovered (lava kills).
- How fast does each unit move, and how long should real-time trips between key
  locations take?
- How does long-distance travel work?
- What breaks up travel (encounters, items, set pieces)?
Work out special moves with art and programming **before** writing them into the GDD.

## 2. Scale

- **Abstract** (puzzle grids) vs. **realistic** (FPS) vs. **distorted** (Civilization's
  giant units tower over terrain so they're easy to find and control).
- **Large objects** (first-person): close and detailed, need strong texturing, block the
  view. An over-shoulder camera hides much of the field.
- **Small objects** (SimCity): you see more of the world at once, but objects lose detail
  and clutter becomes a risk. People are usually omitted.
- **Medium** (most third-person and top-down games): readable units that don't hide the
  terrain.
- **Interface cost:** more on-screen controls means smaller units (Baldur's Gate frames
  the field with icons). Transparent HUD panels (Half-Life 2) give back space.
- **Keep scale consistent on the playfield.** Different scales on different screens are
  fine. Changing object scale mid-play breaks immersion.

## 3. Military scales (any game with combat)

| Scale | Focus | Time per turn / mission | Map | Examples |
|---|---|---|---|---|
| **Tactical (skirmish)** | Individuals, squads, platoons | Hours to days per mission | Units proportional to terrain | Military FPS, RTS (Warcraft, C&C), air combat |
| **Operational** | Regiment to battalion; whole battles | Turn = day to week; battle lasts weeks to months | Only big terrain matters; units oversized; weather, logistics, command | Sid Meier's Gettysburg! |
| **Strategic (grand)** | Nations, continents, worlds; production | Turn = days to months; war lasts years | Theaters; only oceans and mountain chains matter | Civilization, Victoria II, Risk |
RTS games are tactical even though they're called "strategy." Operational scale has
limited video-game appeal, because the whole map can't be seen at once.

## 4. Regulating movement

- **Hex grid:** equal cost to every neighbour, so no fast diagonals. Roads run *through*
  hexes. Rivers run *along* hex sides (blocking or adding crossing cost). Terrain is
  shoehorned to one dominant type per hex. The grid can be hidden; smooth the jiggle when
  units follow a "straight" road across hidden hexes.
- **Square grid:** easy, but diagonal moves cover more distance for the same cost. Either
  charge 1.5 for diagonals, forbid them (slower movement), or switch to hexes.
- **Splines:** invisible rails for curved 2D/3D paths (AI cars in racing games). Constant
  speed unless outside forces act. The "rubber band" elasticity lets units dodge
  obstacles.
- **Waypoints + pathfinding:** click a destination; the AI finds the route over a hidden
  grid; obstacles force detours (standard in RTS).
Prototype the method early in technical review; switching later is expensive.

## 5. Zones of control (ZOC)

A unit exerts control into adjacent spaces (not across river hex sides). An enemy
entering a ZOC must **stop** (and combat resolves). It can push on next turn, but must
stop again in any new ZOC. This models the fact that units can't slip through gaps in a
line, and it makes front lines and flanking matter. In RTS games it shows up as slowing
on contact; players needn't be told. In tactical RPGs, leave spaces behind enemy units
out of the highlighted move area.

## 6. Movement statistics, terrain, action points

- **Movement Rate:** speed by terrain type. **Movement Point Allowance:** points per turn.
- Group terrain into classes: **open** (1 MP: roads, fields, plains), **blocking**
  (light 2 MP: light woods, brush, mud; heavy 3+ MP: swamp, dense forest, steep slope),
  and **impassable** (per unit type). Add **hex-side penalties** (+1 to cross a creek).
- Example Movement Chart (Civil War / Napoleonic):

| Terrain | Infantry | Cavalry | Artillery |
|---|---|---|---|
| Road | 1 | ½ | 1 |
| Open | 2 | 1 | 2 |
| Light woods | 3 | 2 | 4 |
| Forest | 4 | NA | NA |
| Ford | +2 | +1 | NA |
| River | NA | NA | NA |
| Town | 1 | 1 | 1 |
| Uphill / Downhill | +1 / 0 | 0 / −1 | +2 / −1 |

- Terrain usually affects combat too, so build one **Terrain Effects Chart** (movement
  cost + combat modifier per terrain per unit).
- **Action Points:** one pool for moving *and* fighting, spent in any order (move, attack,
  then move again if points remain). Show the remaining reach live, and let the player
  cancel a path before committing.

## 7. Strategic map and fast travel

When players cover long distances repeatedly, give them a **world map**: click a known
location to travel there.
- Instant teleporting can break immersion. Justify it in the fiction (trains, airships,
  sea lanes, spaceships, dragons, magic portals) and animate the route.
- Restrict it to **discovered** locations, or allow free travel. Free travel means NPC
  dialogue must exist for every location at every stage of the story, which is costly.
- The map can also show resources, unvisited points of interest, quest pointers,
  multiple zoom levels, and filter buttons (resources, troops, terrain).
- **Line of sight (LOS):** how far a unit sees before terrain blocks the view. In RTS
  games enemies show on both maps only while in friendly LOS. **Fog of war:** areas out of
  sight grey out and enemies vanish. LOS blocking also controls who can fire at whom.

## 8. Setting movement rates

- **Realistic games** (wargames, sims): research it. Infantry on foot vs. motorized,
  tanks vs. infantry, and weather (Eastern Front mud stalls tanks in spring; infantry
  barely slows).
- **Paced games** (RPG, RTS): ignore weather and mud; compress distance. Ask how long the
  trip from A to B should take in real minutes.
  - If a crossing takes over ~10 minutes, it needs plenty of encounters and items.
  - Scenery changes help a little; players want to *do* things, not watch.
- **Grid it out on paper:** at 4 s per space, a 15-minute trip = 60/4 × 15 = **225
  spaces**. Plot encounters along it and play it through. You'll find the rate is too
  slow, the distance too long, or the encounter rate wrong.
- Then confirm in an **interactive prototype** with a sprite or model at true size. Scale
  is only settled when things move at runtime. Measure a comparable shipped game's
  traversal times and encounter frequency as a benchmark.

## 9. Revealing movement paths

On selection, light up reachable spaces. With action points, shrink the lit area after
each action. Example: a tank with 8 AP moves 8 road spaces or 4 open spaces (forest is
off-limits). It moves 3 and attacks (combat costs AP), and the remaining reach redraws
from 2 AP. This feedback greatly speeds play and teaches the rules without text.

## 10. Movement algorithm template

```
Step 1. Determine movement allowance (random roll | stat | action points).
Step 2. For each space entered:
        if impassable for this unit type -> reject, play alert
        cost = terrain cost + hexside penalty (+ weather modifier)
        if remaining < cost -> reject, play alert
        if entering enemy ZOC -> stop after entering
        remaining -= cost
Step 3. On arrival, check the space contents (message, item, trigger, encounter roll) and
        resolve in a defined order.
```
Agree the **order of factors** (terrain, ZOC, supply, weather) with programmers.

## 11. Encounters

- **Random encounters** keep players alert and supply XP, gold, and items. They get
  tiresome, especially for high-level characters among weak enemies, so players flee to
  save time.
- **Set-piece encounters** are scripted, or visible enemies the player can engage or
  avoid (Final Fantasy XIII). Downside: players can sneak into areas too early, so add
  gating.
- Generic markers (red or blue blobs signalling difficulty, as in Mana Khemia) vs. actual
  models.
- **Frequency** is set per area by the designer, **outside compiled code**. Keep it low
  in areas players revisit often. Final values come from playtesting.
- **Encounter tables** are per area, because the environment decides which creatures
  appear. Simple form:

| d100 | Enemy |
|---|---|
| 1–20 | L1 wolf |
| 21–40 | L1 dodo |
| 41–60 | L1 bandit |
| 61–70 | L2 wolf |
| 71–80 | L2 dodo |
| 81–90 | L3 bandit |
| 91–100 | Special (roll on special table) |

- Rich form (fields): map used; die result; singular and plural name (also the key into
  the entity chart); **min count + random extra** (e.g. 1 + 0–2); **preferred row/slot**
  on the battle grid (front for melee, back for ranged/magic; overflow to the other row);
  **flee value** (can differ by area: a wolf flees less in forest than in open ground;
  bosses 0); **XP value**; **gold value** (base + random range); **loot %** (often points
  to a Treasure Table). Reserve rows for scripted specials that never roll randomly.
- Alternative: one roll picks a whole pre-composed group and its positions. This avoids
  odd mixes like bears marching with thieves.

## 12. Items on the map

Decide early:
- **Pickup:** an explicit action or walk-over, then a loot window (keep or discard) vs.
  auto-add to inventory (best for resource gathering) vs. **gatherer units** (RTS).
- **Overflow:** take all and discard excess, or take what fits and leave the rest for
  later? Leaving a reserve of ammo can be a lifesaver in heavy combat.
- Chests, resource nodes, visibility, and respawn rules.
Settle these by testing.

## 13. Design exercises (adapt per project)

- Find 5 games at tactical, operational, and strategic scales; note object sizes; choose
  yours and justify it.
- Overlay an 18×12 hex grid on a real map. What terrain must be bent to fit?
- Build a paper map + Terrain Effects Chart; move cardboard units to feel relative
  speed.
- Write a random encounter table: what fields, what randomizer, equal or weighted rows?
- List every object on the playfield: controlled vs. encountered vs. picked up;
  frequency of each.
- Draft the GDD movement chapter: scale, time, terrain, objects, encounters. Expect it
  to change.
