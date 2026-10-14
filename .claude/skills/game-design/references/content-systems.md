# Items, Inventory, Money, Magic and Technology, Puzzles

Coverage note: this file follows the structure of Moore's ch. 7–9 (item categories, item
functions, item chart, weapon and armor types, potions and scrolls, auxiliary equipment,
inventory, store inventories, resources, money; magic in games, technology, tech trees;
puzzle elements, categories, randomization, quests as puzzles, adventure games). Those
chapters were **beyond the pages in the provided copy**, so the guidance here applies
Moore's method from ch. 1–6 (classes + relative values + charts + algorithms; balance
by limiting factors; test on paper, then in a prototype) and Adams & Dormans' economy
framework. Treat it as practice-grade guidance, not a quotation of those chapters.

## Contents
1. Items: categories and game functions
2. The Item Chart (master data)
3. Weapons, armor, consumables, auxiliary gear
4. Inventory models
5. Stores, money, and resources (as an economy)
6. Magic systems
7. Technology and tech trees
8. Puzzles: elements, categories, randomness
9. Quests as puzzles; adventure-game structure
10. Checklist

---

## 1. Items

**Categories:** weapons (hand, ranged, exotic), armor (body, shield, helm, accessories),
consumables (potions, scrolls, food, ammo), auxiliary equipment (tools, keys, light,
containers, mounts), quest items, crafting materials, currency, cosmetics.

**Game functions:** every item must do at least one of these, or cut it:
- **Modify attributes** (+AV, +DV, +STR, resistances): feeds the combat algorithm as
  modifiers.
- **Enable actions** (lockpick opens chests; rope crosses chasms; a key opens a door).
  This is a progression mechanism (lock and key).
- **Restore or convert resources** (heal HP, restore mana, cure status): a
  converter in economy terms.
- **Store value** (trade goods, gems): a trader or money proxy.
- **Communicate** (maps, notes, lore): information.
- **Express identity** (cosmetics): no stats, motivates collection.

## 2. Item Chart

One row per item. The engine reads it from data files, not code. Suggested fields:
`id, name, plural, category, subtype, tier, required_level, required_class, slot,
attack_value, damage_type, range, reload_time, ammo_type, ammo_capacity, defense_value,
attribute_mods, special_effect, effect_value, duration, uses, weight, buy_price,
sell_price, rarity, drop_tables, icon_id, model_id, description_text`.

Principles carried over from Moore's charts:
- Group into **tiers** and describe relatively first (light / medium / heavy), with
  numbers once prototyped.
- Every powerful item needs a **limiting factor**: weight, reload time, class or level
  requirement, price, ammo scarcity, two-handedness.
- Text strings (names, plurals, descriptions) are data too, and localization needs them
  separated.

## 3. Weapon and armor design

- **Hand weapons:** damage vs. speed vs. reach vs. weight. Daggers are fast, low damage,
  and suit rogues. Great-swords are slow, high damage, and need STR. Blunt vs. edged can
  interact with armor types (rock-paper-scissors at the item level).
- **Ranged weapons:** range bands with accuracy falloff (see RTS range modifiers in
  `combat.md`), reload time, ammo type and capacity, line-of-sight needs. Thrown weapons
  get short range.
- **Exotic weapons:** unique mechanics (area, status effects, chaining). Make them
  memorable, but keep them inside the same algorithm.
- **Armor:** DV and resistances vs. weight and movement or casting penalties. Slot-based
  or composite. Heavy armor should cost something (speed, stealth, mana).
- **Potions and scrolls:** single-use converters (heal X, cure poison, cast a spell
  without mana). Price them against the damage curve of the area they're sold in.
- **Auxiliary equipment:** tools that unlock verbs (climb, swim, see in dark). Treat them
  as keys in the progression graph.
- Balance check: compute **damage per second (or per turn) per gold** and **per weight**
  for each tier. Outliers become dominant picks.

## 4. Inventory models

| Model | Feel | Use when |
|---|---|---|
| Unlimited list | Frictionless | Story-focused games; avoid chore time |
| Slot count | Simple scarcity | Action games, survival-lite |
| Weight limit | Realism, trade-offs | Simulation-leaning RPGs |
| Grid (Tetris-style) | Spatial puzzle | Survival, looter games that make packing a mini-game |
| Per-category caps (e.g. 99 potions) | Prevents hoarding exploits | JRPGs, action RPGs |
Inventory management is a **chore** in Moore's fun/chore split. Minimize clicks with
auto-sort, compare tooltips, junk auto-sell, stash access, and equip-best.

## 5. Stores, money, resources

Treat these as an **internal economy** (`internal-economy.md`):
- **Sources** of money: enemy gold, loot sales, quest rewards. **Drains:** purchases,
  repairs, fees, upkeep. **Traders:** shops (buy price > sell price; a typical sell rate is
  25–50% of buy).
- **Store inventories:** per town or chapter, stocked with the next tier slightly above the
  player's means, so saving up is a goal. Refresh rules (static, timed, story-gated). Rare
  stock can be a reward.
- **Money pacing:** chart expected gold income per hour (from encounter tables) against
  item prices per chapter. Without drains late in the game, money stops mattering; add
  sinks such as upgrades, cosmetics, and housing.
- **Resources** (wood, ore, food) in strategy and survival games are gathered,
  converted, and spent. Model them with `economy_sim.py` before pricing anything.
- Keep displayed amounts readable. Large totals belong on store and status screens,
  not mid-combat (Moore ch. 3).

## 6. Magic systems

Decide:
- **Fuel:** mana pool + regen; cooldowns; charges and slots; reagents (an economy);
  health cost (risk).
- **Acquisition:** level-up grants, scrolls or books, trainers, discovery or
  experimentation.
- **Structure:** schools or elements with strengths and weaknesses (fire vs. ice;
  immunities in the entity chart). Spell **levels** (upgrade one spell vs. many separate
  spells; upgrading keeps menus short).
- **Function classes** (same as combat actions): offensive, defensive, modifying (heal,
  cure, buff, debuff), utility (light, teleport, unlock). Utility spells are also keys
  in the progression graph.
- **Resolution:** see magic combat and saving rolls in `combat.md`.
- Balance against weapons. Casters trade fragility for range and flexibility; their mana
  supply (potions, regen skills) is the limiting factor.
Write a **Spell Chart**: id, name, school, level, mana cost, target (single, area,
party), AV or effect value, save attribute, duration, casting time, cooldown, upgrade
path, required class and level, visual and audio effect ids.

## 7. Technology and tech trees

Technology is "magic with a rationale" in sci-fi RPGs and the progression spine of
strategy games.
- **Tech tree:** a directed graph of research nodes with prerequisites, costs (research
  points or time), and unlocks (units, buildings, abilities, modifiers).
- Shapes: **linear** (an age system), **branching** (choose a path), **web** (multiple
  prerequisites), **exclusive branches** (choosing one locks another, for replay and
  identity, i.e. playing-style reinforcement).
- Economy view: research is a **dynamic engine** if techs speed up research, and an **arms
  race** when military techs counter each other. Use a **stopping mechanism** (rising
  costs per tier) so leaders don't run away.
- Design rules: every node has a visible payoff; no mandatory "dead" nodes without
  value; key counters available before the threat they answer; total research time fits
  the intended game length. Simulate research pacing with `economy_sim.py` (research
  points as a pool; techs as converters).
- Document it as a node table: `id, name, era/tier, prerequisites, cost, unlocks,
  modifiers, ai_priority`, plus a diagram.

## 8. Puzzles

**Elements:** a goal state, an initial state, the allowed operations (verbs), constraints,
the information shown or hidden, and feedback on progress. A good puzzle has an "aha":
the solution follows from rules the player already understands.

**Categories:** logic/deduction, spatial/assembly (Tetris, jigsaws), sequence/pattern,
physics, word/riddle, inventory combination (adventure games), environmental (levers,
light beams), timing/dexterity, social/dialogue, hidden object.

**Randomization:** randomized puzzle games (Tetris's piece order) gain replay but must
guarantee solvability (generate from the solved state backward, or verify with a solver).
Hand-authored puzzles in narrative games should be deterministic, so hints and guides
stay valid.

**Designing puzzles inside games:**
- Teach each verb in isolation, then combine verbs (introduce → develop → twist →
  combine).
- Avoid moon logic: every step must be inferable from in-world information.
- Provide graded hints (nudge → direction → answer) to protect pacing. Puzzles were
  only ~5% of play time in Moore's RPG budget.
- Keep puzzle state resettable, and avoid unwinnable states (or make them obvious and
  reversible).

## 9. Quests and adventure structure

- A **quest is a puzzle at story scale**: goal, preconditions, steps, locks and keys,
  reward. Represent quests as **state machines** using the scripting constructs from
  `mechanics-framework.md` (NOT_STARTED → ACTIVE → COMPLETE/FAILED), with Boolean
  start and finish conditions.
- Quest types: kill, fetch, escort, deliver, explore or discover, talk or persuade,
  build, defend, puzzle. Vary them, and tie rewards to the economy (XP, gold, items,
  reputation, unlocks).
- **Adventure games** are progression-heavy (Adams & Dormans): their structure is a
  **mission graph** of locks and keys across a **space graph** of rooms
  (`progression-and-levels.md`). Track every key's location, every lock's requirement,
  and dead-end risks (a key consumed or lost before its lock).

## 10. Checklist

- [ ] Item Chart with tiers, limiting factors, prices; DPS per gold and per weight
      outliers checked.
- [ ] Inventory model chosen, with chore mitigations.
- [ ] Money sources and drains per chapter charted; store stock and price ladder set.
- [ ] Spell Chart; magic fuel and supply; schools and immunities consistent with the
      entity chart.
- [ ] Tech tree node table, diagram, and research-pacing simulation.
- [ ] Puzzle list: category, verbs taught, hint ladder, reset rules, solvability.
- [ ] Quest list as state machines with start and complete conditions and rewards.
