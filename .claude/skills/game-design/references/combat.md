# Combat Systems

Source: Moore, *Basics of Game Design*, ch. 5 (read in full). Balancing tools: Adams &
Dormans' attrition and feedback analysis, and `scripts/combat_sim.py`.

## Contents
1. What the combat spec must decide
2. Balance through rock-paper-scissors
3. Turn-based vs. real-time
4. Combat attributes
5. RPG combat: types, actions, attributes
6. RPG combat algorithm (full template)
7. Combat tables, scaling workarounds, critical hits
8. Magic / technology combat and saving throws
9. Fleeing
10. Wargame combat: attributes, sequence of play, CRT, modifiers
11. RTS combat
12. Enemy AI: what designers own
13. Verifying with combat_sim.py
14. Combat design checklist

---

## 1. Decide these up front

- Is combat central (RPG, RTS, wargame) or absent (sports, many sims)?
- Does the player directly control units (RPG, tactics) or direct them (RTS)?
- Which **forms** exist (melee, ranged, magic/tech, air, naval, indirect)? Each may need
  its own resolution.
- Turn-based or real-time? How long should a typical fight last, and a boss fight?
- Which attributes feed resolution, and how does randomness enter?
Combat must be **consistent** for the whole game and engaging for hours. Test the
algorithm on paper, then in an interactive prototype.

## 2. Rock-paper-scissors balance

Three options, each beating one and losing to another, each 33.3% viable: no dominant
choice. Apply the same idea to units, weapons, and classes:
- Medieval (Age of Empires II): **knights** (fast, armored) beat **infantry**;
  **archers** shoot knights from range and retreat; **infantry** can catch and absorb
  archers.
- Modern: armor ≈ knights; infantry holds ground tanks can't; artillery ≈ archers (strong
  at range, fragile up close). Air, naval, supply, command, and electronic warfare blur
  the picture, but a good force needs every branch.
- A super-unit is allowed **if** it has a limiting factor: long production time, high
  cost, scarce resources.
- Finding one or two balance-breaking units near beta is devastating, and many games ship
  with them. **Balance continuously**, not at the end. `combat_sim.py` prints the
  win-rate matrix and flags dominant and dominated units.

## 3. Turn-based vs. real-time

| | Real-time | Turn-based |
|---|---|---|
| Feel | Intense, constant pressure, little long-range planning | Deliberate, plan-ahead, tactical |
| Control | Usually one character/unit (or RTS macro) | Many units |
| Typical | FPS/TPS, arcade, dungeon crawls, modern RPGs | Wargames, strategy, sims, tactical RPGs |
| Risks | Frantic menus when controlling a party | Committing blind; winning just by going first |
Turn variants: one side moves everything then the other, or sides **alternate** units.
Hybrids: **Active Time Battle** (Final Fantasy IV, 1991: each unit acts when its timer
refills); **pause-on-select** for party control.
**Prototyping real-time on paper:** slice time into mini-turns of a few seconds with
status markers. It's clumsy, so move to an interactive prototype early. Final values
need true scale at runtime.

## 4. Combat attributes

Also called statistics. Moore uses "attributes" to avoid confusion with sports stats and
with statistics the discipline.
- **Attack Value (AV):** offensive strength from the unit and its weapon.
- **Defense Value (DV):** ability to withstand damage (armor, deflection).
- **Hit Points (HP):** damage absorbed before incapacitation (tank ≫ infantry).
Minimal algorithm:
```
Step 1. AV − DV = HP modifier. If ≤ 0: no effect, combat ends. If ≥ 1: go to 2.
Step 2. Current HP − modifier = new HP. If new HP ≤ 0: unit incapacitated/removed.
```
In turn-based games a destroyed defender can't strike back. In real-time games defenders
counterattack. Prototype both if unsure.

## 5. RPG combat

**RPG flavours:**
- *Tactical RPGs*: turn-based mini-wargames on a grid (Final Fantasy Tactics, Disgaea).
- *Dungeon crawls*: real-time, short fights, few options; kill lots, loot lots (Diablo,
  Gauntlet).
- *Traditional RPGs*: paper-RPG heritage, many options, longer fights (Baldur's Gate,
  Final Fantasy, EverQuest, WoW). Some modern RPGs feel like shooters (Oblivion,
  Fallout 3).

**Attack forms:** melee (adjacent; both sides risk damage, so strong units go here),
ranged (only the target takes damage unless it can return fire), magic/technology (near
or far; resolved differently, see §8).

**Actions menu:** Attack · Use Magic/Tech (offensive, defensive, or modifying, e.g. heal
or cure) · Use Item (potion or scroll, or swap weapon/armor) · Flee · Defend (no attack,
reduced damage; sometimes restores mana; handy for leveling weak characters). Optional:
Use Skill, Steal.
**Fit all actions on one small menu**, especially in real-time. Nested menus for spells
and items are painful mid-fight.

**Attributes used in combat:**
- Strength (Body, Brawn, Might): weapon carry limit, blow power → AV.
- Constitution (Stamina, Endurance, Vitality): health, resistance (poison) → DV.
- Size (Health): mass → HP total.
- Dexterity (Agility, Speed, Reflex): act and react speed → attack order, dodge magic.
- Luck (Karma, Fate): avoid attacks, chance events.
Players needn't understand the math, but they must understand their **options** and feel
every attack resolves **fairly, without cheating**.

## 6. RPG combat algorithm (template)

Formula building blocks (weights are design choices, tune them in the sim):
```
Initiative    = 1/4·CON + 3/4·DEX                  (or highest DEX acts first)
Base AV       = 3/4·STR + 1/3·SIZE                 (bare-handed base), or
Base AV       = WeaponAV + 1/3·STR                 (weapon-driven; attributes modify)
Modified AV   = Base AV + positive mods − negative mods   (+1 sword, ring, poison −2...)
Base DV       = 1/4·CON + 1/6·SIZE
Modified DV   = Base DV + positive mods − negative mods    (armor, shields, spells)
Final AV      = Modified AV − Modified DV
```
Why DV matters: without it a short sword does the same 6 damage to an unarmored goblin
and an armored rhino.

Full procedure:
```
 1. Determine attack type: magic → magic resolution (§8); ranged → weapon resolution,
    apply to target; melee → weapon resolution to target, then repeat for damage to attacker.
 2–4. Compute attacker's Base AV and Modified AV.
 5–6. Compute defender's Base DV and Modified DV.
 7. Final AV = Modified AV − Modified DV.
 8. If Final AV ≤ 0: show "Attack misses", end.
 9. If Final AV ≥ 1: continue.
10. Roll on the Combat Table.
11. If result = 0: nothing, end. If result outside the crit range: go to 14.
    If inside the crit range: go to 12.
12. Roll on the Critical Hit Table.
13. Damage = Combat Table damage × crit multiplier.
14. Subtract damage from target HP. If HP ≤ 0: remove target, play death animation and sound.
```
Variants: dungeon crawls skip the table and apply damage directly (most enemies die in
one or two blows). Full RPGs run multi-round fights, with the final villain taking
considerable time and resources. Whatever you choose, **never switch methods mid-game**:
players read it as cheating.

## 7. Combat tables

Identical damage every hit makes players suspicious and exploitable. Use a **weighted
Combat Table** so most hits land mid-range (see the d100 table in
`probability-and-math.md`). Results can be flat damage, multipliers, or die-roll
modifiers (poisoned: −5 to the roll).

**Scaling problem:** a table maxing at 50 takes forever against a late boss and is
absurd against a level 1 wolf. Workarounds:
1. **Weapon-driven damage:** skip the table; damage = weapon AV (+mods). Better weapons,
   more damage.
2. **Level-windowed table:** unlock higher rows as experience level rises and retire the
   low rows.
3. **Percentage table:** results are % of weapon damage. A Long Sword (6) at 25% does
   1.5, rounded up to 2. Scales with gear automatically.

**Critical hits:** a small range (e.g. 96–100) triggers a roll on the Critical Hit Table,
whose result multiplies damage (e.g. a roll of 26 doubles it). Text per row ("A
crushing blow!") can show on screen. Check crit frequency per fight with statistics
from playtests.

## 8. Magic / technology combat

Sci-fi psychic or tech abilities that mimic magic are handled the same way. Magic is
usually simpler, and the defender has **limited defense**:
```
1. Check spell: scroll/enchanted item → no mana cost, go to 2.
   Else if mana ≥ cost → deduct, go to 2. Else → "You do not have enough mana", end.
2. Target immune? → resolve but show "This spell has no effect on ___".
3. Saving roll: random vs. target's (modified) DEX. Roll > DEX → "The spell missed", end.
4. Subtract spell AV from target HP; on 0 remove target and play death.
```
Saving throw options: single attribute, a blend (`3/4·DEX + 1/4·LUCK − 1/10·SIZE`), or
**per-creature save values** set by the designer for direct control. Test early.

## 9. Fleeing

- Decide whether it moves the whole party or just the character. Repeated per-character
  attempts are annoying; only do it with good reason.
- Resolve with randomness against an attribute blend (`3/4·DEX + 1/2·LUCK ± mods`), or
  put the **flee value on the enemy** (tough enemies low, bosses 0). Grey out the Flee
  option when it's impossible.
- Optional **penalty** (lose gold, drop an item) to discourage dodging fights. But
  fleeing trivial enemies in explored areas saves real time, so test how harsh to be.
- Keep flee rules consistent all game.

## 10. Wargame combat

Roots: Avalon Hill and SPI paper wargames (1970s–80s); today Avalanche Press, Critical
Hit. German-style games (Settlers of Catan) are a gentler entry point. Subgenres:
tactical RPGs, RTS, traditional wargames (Civilization, Total War), combat vehicle sims
(M1 Tank Platoon, Wing Commander), military FPS (Medal of Honor, Call of Duty). Screen
limits make it hard to show detail and scope together; provide zoom.

**Extra unit attributes:** weight level, ammo capacity, reload time, blast radius, line of
sight, indirect LOS, weapon range, supply lines, command radius, leadership, morale
("seeing the elephant"), reinforcement rate, zone of control, line of communication,
production time, carpet bombing, HQ, early warning, ECM, fallout zone.
Each combat form (air-to-air, air-to-surface, surface-to-air, indirect fire, direct fire)
can have its own AV/DV per unit. Infantry may defend well against direct fire but barely
against air or artillery. **Research** the conflict for weapons, damage, and what worked
against what.

**Sequence of Play (SOP):** turns split into phases and steps. Simple SOP: game-turn
advance → supply check → side A move → A combat → side B move → B combat. Complex SOPs add
uprising checks, enlistment, reinforcement, appeasement, victory-point tallies, and marker
removal. Fairness problems: "I-go-you-go" lets multiple players gang up; simultaneous
**pulses** fix that but hinder coordinated attacks, which **fog of war** then
counterbalances. Alternate first player or use initiative. A **fluid SOP** (phases drawn
at random) forces players to keep reserves.

**Combat Results Table (CRT):** invented by Charles S. Roberts (*Tactics*, 1952; Avalon
Hill, 1958). His research found that 3:1 attackers usually win. Use: total attacker AV ÷
total defender DV picks the **odds column** (three AV-2 units vs. DV 3 = 6:3 = 2:1);
roll a d6 for the row. Results: AE/DE (eliminated), attacker/defender hits, r (retreat).
Clamp out-of-range rows and columns to the edges.
**Terrain modifiers:** minor obstacles give a **die-roll modifier** (+1 means worse
rows); major ones give a **column shift** (3:1 resolved at 2:1). Cavalry charging uphill
across a stream loses punch. In video games all of this is hidden, so explain key
modifiers in UI or tooltips, or players won't understand outcomes.

## 11. RTS combat

The player juggles gathering, building, recruiting, and fighting, so keep combat
**simple**; terrain can affect movement only.
```
1. Find the closest enemy within Attack Range (none → no combat; ties → pick randomly).
2. AV − target DV; ≤0 → no damage; ≥1 → step 3.
3. Target HP −= result; ≤0 → remove, play death explosion.
```
Optional to-hit step with range penalty: at max range (e.g. 300 m) −5, easing by 1 per
50 m closer, none at 0–15 m. Use low values and HP (armor > infantry). Make sure every
unit has a weakness (rock-paper-scissors) so players build balanced armies. Use an
interactive prototype, not paper, to settle values.

## 12. Enemy AI: what designers own

The AI module handles **pathfinding**, **goal selection** (tactics toward objectives),
and **combat choices** (which target, which attack). Programmers build it, often from
existing libraries, so don't dictate code structure. Designers:
- describe intended behaviours in the GDD (who targets whom, when to flee, when to cast);
- tune exposed parameters (e.g. sentry detection conditions in engine tools);
- request a **text log of AI moves and attack resolutions** to verify attributes and
  modifiers apply correctly;
- guard **fairness**: programmers are tempted to fudge AI reaction speed or knowledge.
  Players must never feel the computer cheats.

## 13. Verify with `combat_sim.py`

```
python scripts/combat_sim.py --example > units.json   # edit units, tables, counters
python scripts/combat_sim.py units.json               # matrix + pacing + findings
python scripts/combat_sim.py units.json --duel knight archer --trials 20000
```
Scope: `combat_sim.py` models stand-up duels using stats, tables and RPS counters only. It
has no grid, range, movement, spells or team play. Use it for quick stat sanity checks
(dominant stats, fight length, crit swing). For positional or squad games (tactics RPGs,
RTS), write a game-specific simulator that **reads the same CSV data tables** and runs the
GDD algorithm step for step, with simple scripted AI. Then report a squad round-robin,
per-class contribution (win rate with vs. without the class), and duel triangles. Expect
`combat_sim.py` to call ranged and caster classes "dominated" in such games; that is the
missing positioning, not necessarily a real imbalance.

Read: win % (row vs. column), rounds per fight (pacing: is the boss fight long enough?
are trash fights quick?), HP left when winning (how close fights are), DOMINANT,
DOMINATED, and SLOG flags. Add RPS bonuses through `counters`. Re-run after every value
change and paste the summary into the GDD's balance appendix.

## 14. Combat checklist

- [ ] Forms of combat listed, each with a numbered algorithm and a worked example.
- [ ] Attribute list fixed early (late additions unbalance values and break test saves).
- [ ] Combat Table(s) validated (`dice_odds.py table`), with a scaling strategy chosen.
- [ ] Crit range, crit table, and expected crits per fight checked.
- [ ] Magic resolution, saves, immunities, and messages specified.
- [ ] Flee rules, boss no-flee, and penalties decided.
- [ ] Win-rate matrix shows no dominant unit or class; every unit has a counter.
- [ ] Target fight lengths: trash, elite, henchman, boss.
- [ ] AI intents described; AI log tool requested; fairness rules stated.
- [ ] In-game tutorial demonstrates each major combat system hands-on early. Players
      need *how*, not *why*.
