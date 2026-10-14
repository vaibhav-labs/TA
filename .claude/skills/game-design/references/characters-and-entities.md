# Characters, Classes, Progression, Monsters and NPCs

Source: Moore, *Basics of Game Design*, ch. 6 (read through the Entity Attribute Chart;
the rest of ch. 6, on treasure tables and sports characters, wasn't in the provided copy,
so those sections are marked). Character progression links to Adams & Dormans'
progression and playing-style-reinforcement ideas.

## Contents
1. Why define attributes early
2. Character generation: full vs. restricted
3. Core attributes
4. Races (fantasy and sci-fi) and the balance rule
5. Classes / careers / guilds
6. Skills, advantages and disadvantages, traits, alignment
7. Starting kit: gear, money, items, skills, spells
8. Appearance customization vs. art budget
9. Experience points and leveling
10. XP curve design (with `xp_curve.py`)
11. Entity roles: villain to inactive NPC
12. Enemy attributes and scaling
13. Entity Attribute (Monster) Chart
14. Treasure tables and sports characters (summary, outside the provided pages)
15. Checklist

---

## 1. Define attributes early

Simple board games give tokens no attributes; complex games give units many. **Lock the
attribute list early.** Attributes added late unbalance values with no time left to test,
and they add fields to save files, which breaks testers' saved games, so a whole library
of test saves must be rebuilt.

## 2. Character generation

- **Full generation** (paper-RPG style: dice for stats, race, guild, faction,
  alignment) can take hours. Early CRPGs (Wizardry, Ultima) copied it; MMOs keep rich
  options so characters feel unique.
- **Restricted / pre-generated:** a few points to assign within a narrow range. Reasons:
  most players don't replay, so vast choice is wasted; and fewer combinations are far
  easier to test and balance.
Choose by replay expectation and testing budget.

## 3. Core attributes

Strength (Body, Brawn, Might) · Constitution (Stamina, Endurance, Vitality) · Size
(Health) · Dexterity (Agility, Speed, Reflex) · Luck (Karma, Fate) · Mana (magic fuel) ·
Wisdom (Knowledge, Intelligence, Power; sometimes split into learning vs. casting) ·
Charisma (appearance, NPC reactions).
Values **start low** and rise with each experience level.

## 4. Races

Starting values depend on race × class (a **Character Generation Chart** lists start
values for each combination). **Every race needs a compensating weakness.** Elves are
weak in melee but devastating with bows and magic.
- **Fantasy staples:** Humans (balanced, the median; get along with most) · Elves (tall,
  ranged and magic, aloof, forest-dwelling, clash with dwarves) · Dwarves (short, strong,
  melee, poor magic, miners, short-tempered).
- **Others:** Halflings (avoid "hobbit", which is Tolkien IP) · Gnomes (tinkers, small
  weapons) · Changelings (shape-shifters, strong magic) · Giants (huge, strong, dim, clubs)
  · Faery (frail but potent magic, flight) · Kobolds (child-sized, strong magic,
  mischievous) · Goblins (ugly, magic-leaning, sometimes helpful) · Ogres (cruel, melee) ·
  Trolls (powerful, evil magic) · Orcs (nasty warmongers, cave dwellers). Horror
  creatures (vampires, werewolves, zombies) are usually enemies, unless the genre is
  horror (Lovecraft, Stoker).
- Fantasy archetypes are easy because players know Tolkien and folklore. **Sci-fi races
  must be invented from scratch**, and must avoid borrowing too heavily from well-known
  authors or films. Options: humans, androids and cyborgs, plants, protoplasm, mutants,
  star-faring species. Settings: space travel, post-holocaust, superheroes, spy-tech.
- **Playable monsters** (an ogre) need sympathetic art (Shrek, not a fanged lump) so
  players identify with them.

## 5. Classes

Strongest to weakest physically: **Barbarian/Warrior** (melee "tank", low magic) ·
**Knight/Paladin** (melee, average intelligence, many spells) · **Ranger/Scout** (ranged,
nature magic) · **Cleric/Healer** (clubs and staves, healing and curing) · **Thief/Rogue**
(knives, high intelligence, pickpocketing and locks) · **Wizard/Mage** (weak, staff,
broad combat magic). Niche classes: Tinker, Necromancer, Ninja, Beastmaster.
Sci-fi equivalents: Military ≈ barbarian/knight, Explorer ≈ ranger/rogue, Merchant ≈
rogue, Scientist ≈ wizard, Medic ≈ cleric.

**Party roles to cover:** front-line melee, ranged support, heavy caster, healer, and
specialist (traps, locks, forbidden entry). **Balance races × classes × items together.**
A halfling wizard with only knives is "toast" against a magic-resistant enemy.
**Don't invent a class for one task** unless that task is central to play (e.g. an
architect in a build-and-demolish game). Players won't play a niche role for a whole
game.

## 6. Skills, advantages, traits, alignment

- **Skills** separate classes: class-exclusive abilities (rogue lockpicking),
  weapon-affinity modifiers (ranger +2 with bows; rogue −1 with a battleaxe), and
  specialties (mana regen for casters, detecting enemies in forests for rangers). Mark
  each as **automatic** (always on) or **selected** (activated). Skills improve with
  level. Record them in a **Skill Chart** (name, effect, auto/selected, per-level growth).
- **Every skill must affect core play.** Paper-RPG filler (fishing, poetry) is noise in
  a CRPG, except in MMOs, where secondary activities (housing) fill long sessions.
- **Advantages and disadvantages** (blessings, reputation; curses, disease, ignoble
  birth) and **traits** (necromancy specialist, gourmet knight) deepen identity in paper
  RPGs. In CRPGs they multiply testing and pre-written NPC text for little mechanical
  gain. Use them sparingly.
- **Alignment** (good/neutral/evil or lawful/neutral/chaotic) forces ethical choices.
  Different rewards per choice make it gameplay, not flavour.

## 7. Starting kit

- **Gear:** lowest-tier weapons and armor (or plain clothes) that fit race and class. No
  barbarians in wizard robes.
- **Money:** a little, so players buy a few useful items (healing, light armor) without
  facing too many decisions before they understand the game, or wasting it on gear they
  can't use yet.
- **Items as hints:** the starting inventory tells players what's coming. Only heal
  potions implies no poison early; add cure items if poisonous enemies appear soon.
- **Skills:** hold back. At most one, unless it's needed to survive (a caster's mana
  regen).
- **Spells:** melee classes need none; clerics and wizards need at least one attack spell
  plus heal or mana regen, **and mana potions**, or magic dies after two casts. Psychic
  powers likewise need a refill item or natural regen.

## 8. Appearance vs. art budget

Options: a single fixed hero (Final Fantasy X, The Bard's Tale); face and body sliders
(Oblivion); deep MMO customization. Constraints:
- **First-person** play rarely shows the character, so heavy customization is wasted.
- **Third-person** play shows the hero constantly. The in-world model is often generic.
  Gear-driven appearance changes multiply art.
- Art may argue, rightly, that more NPCs and enemies beat a feature seen only at the
  start. Agree scope with the art lead.

## 9. Experience and leveling

XP comes from winning fights, solving puzzles, and finishing quests. Crossing a threshold
raises the level, and attributes go up. It's the core RPG reward.
- **Point allocation:** the player spends points. One point can raise a stat by a race-
  or class-scaled amount (human barbarian STR +10, halfling barbarian +7, human wizard +4,
  elf wizard +5). In MMOs, add race modifiers or randomness so identical-level
  characters aren't clones.
- **Automatic increases:** easier to balance, less player control. Show attribute changes
  so growth is visible (Oblivion's stats screen).
- **Randomized gains:** minimum + random (STR +6 + d0–4 = 6–10). Watch for classes that
  snowball.
- **Spells on level-up:** add new tiers (Fire Ball, then Infernal Fire Ball) or **upgrade
  the existing spell** (stronger, costs more mana). Upgrading keeps menus short.
- **Skills on level-up:** faster mana regen, which may extend to allies; bow modifiers;
  new detection skills; either point-bought or automatic.
- **Don't overwhelm.** Too many points to place at once stalls players. Fully automatic
  growth feels alienating. Find the middle.
- **Level-ups as story beats:** a major quest's level-up can close a chapter, open new
  regions, NPCs, and shops, and trigger a cutscene and new goals. Decide what happens to
  **unfinished sub-quests**. Tweak their NPC lines to acknowledge the changed world so
  they don't parrot stale dialogue.
- **Document it in a spreadsheet** (the Experience Level Chart: level, XP needed, free
  points, auto increases to damage, mana, and HP, new skills and spells, skill/spell
  upgrade points). Keep it **outside the engine** as data, because it gets tuned
  constantly.
- **Levels vs. no levels:** Oblivion gives XP for using skills, and class skills learn
  faster. Fallout 3 mostly pays XP for quests. Constant small gains keep the player in the
  world instead of on a menu screen.
- **Caps:** paper RPGs may be uncapped, but high levels become tedious and only stats
  rise once spells and skills max out. Electronic games cap levels, because every level
  must be **tested**, and getting test characters to max level takes ages. Watch for
  **grinding** (farming weak enemies), which turns play into work.

## 10. XP curve design

Moore's cases: **doubling** (50, 100, 200, ...: easy to code) vs. **custom** (×2 for
three levels, then ×2.5, then authored). Programmers then need the designer's table.
Race or class can change the curve too. **Choose formula vs. table early.** Switching
late is a "massive headache."
```
python scripts/xp_curve.py --model power --base 100 --exp 1.8 --levels 30 \
       --xp-per-minute 15 --xp-growth 1.08 --csv xp.csv
```
Targets to check: first level-up within a few minutes; mid-game levels every ~20–45 min
for a story RPG; no late level taking far longer than mid-game ones (grind); total time
to cap consistent with the game's intended length; in-play numbers kept small (big
numbers only on secondary screens).

## 11. Entity roles

| Role | Function | Design notes |
|---|---|---|
| **Major villain** | Antagonist. Usually fought at the end; early run-ins end with the hero beaten and the villain gloating and revealing the plan. | Tune it to challenge an experienced player without being unbeatable. |
| **Henchmen** | Serve the villain; major obstacles; varied attacks; teach tactics needed for the finale. | Structure the story so **each henchman is a chapter**; beating one opens the next. Drop strong gear and clues. Can be monsters. |
| **Minions** | Cannon fodder, random encounters; special minions end sub-quests. | Scale with the player or flee from the strong. Live in ecological niches (caves, sewers, dark forests). |
| **Active allies** | Join the party and fight. | Player-controlled or AI (reuse enemy AI). Have personal stories and quests. Leveling and inventory for each add micromanagement. |
| **Reactive allies** | Friendly but don't adventure. Often the villain's victims (kidnapped, manipulated). | Give sub-quests; advance the main plot (the king helps once the dragon-henchman dies). |
| **Active NPCs** | Services: shops, inns, healers, porters (world-map access). | Minor sub-quests; new dialogue each chapter. |
| **Inactive NPCs** | Window dressing; repeat lines; give local lore. | Limited AI; update lines when the world state changes. |

## 12. Enemy attributes and scaling

- Combat entities use the same attributes and algorithm as characters. Better enemies
  get magic and items: self-buffs, minion buffs, debuffs on the party, cleansing.
- **Trash is weak by design.** In dungeon crawls and story RPGs, frequent fights must not
  force constant town trips for supplies.
- **Quest enemies are tougher.** Henchmen and the villain have the most actions. **Before
  them, let players rest and save.** Long walks back from a distant save point to a boss
  are frustrating.
- **Relative scaling:** enemy stats = % of the party's (average) stats. Trash at 25%
  (AV 36 → 9), elites at 80% (→ 29). Every fight stays challenging, but players may wonder
  why level 1 wolves suddenly hit hard. Consider scaling by region, with only mild
  level-relative adjustment.

## 13. Entity Attribute (Monster) Chart

Fields: **entity number** (unique id; also the key to the artwork), **name** (singular;
the plural lives in the encounter table, or here), **type** (animal, magic animal,
ghost, elemental, human, henchman, boss), **attributes** (AV, DV, DEX, LUCK, flee, HP,
starting mana), **magic casting %** (chance it casts instead of attacking, or an AI
routine id), **up to four spells**, each with a pick % (**must total 100%**). Optional:
AI type, resistances, loot table id.
Example rows (abridged from Moore's FRP chart):

| # | Name | Type | AV | DV | DEX | Luck | HP | Cast % | Spells (pick %) |
|---|---|---|---|---|---|---|---|---|---|
| 5 | Bear | Animal | 15 | 10 | 6 | 9 | 50 | 0 | n/a |
| 7 | Death wolf | Magic animal | 30 | 21 | 12 | 15 | 190 | 10 | Bolt 90, Curse 10 |
| 10 | Dragon | Magic animal | 90 | 60 | 16 | 60 | 1200 | 30 | Hell flame 40, Bolt 30, Poison 20, Inferno 10 |
| 17 | Rogue wizard | Magician | 12 | 10 | 30 | 30 | 90 | 90 | Inferno 40, Tsunami 35, Lightning 20, Heal L3 5 |
| 18 | Archer prince | Henchman | 100 | 80 | 25 | 20 | 800 | 15 | Bolt 80, Heal L1 20 |
| 19 | Woodland queen | Boss | 150 | 120 | 20 | 25 | 1200 | 30 | Tsunami 50, Bolt 30, Poison ... |

Validate with a script: spell percentages sum to 100, every id is unique, every encounter
table name resolves to a chart row, and HP and AV progress monotonically along the
intended difficulty order. Then run key matchups in `combat_sim.py`.

## 14. Treasure tables and sports characters (outside the provided pages)

The provided copy of Moore's book ended before these sections (pp. 156–161). Working
guidance consistent with the rest of the book:
- **Treasure tables:** per area or enemy tier, a d100 table of loot entries (gold range,
  consumables, equipment by tier, rare drops). Reference them from encounter-table loot %
  and from chests. Validate with `dice_odds.py table`. Keep rare-drop odds visible to the
  designer, and test them statistically against expected kills per hour.
- **Sports characters:** attributes come from real performance statistics, scaled to the
  randomizer's resolution (see §7 of `probability-and-math.md`). Real league stats need a
  licence.

## 15. Checklist

- [ ] Attribute list frozen before production.
- [ ] Character Generation Chart (race × class start values) with each race's offsetting
      weakness.
- [ ] Class list mapped to party roles; no single-task classes.
- [ ] Skill Chart with auto/selected flags and per-level growth.
- [ ] Starting kit per class (gear, money, items as hints, spells + mana supply).
- [ ] Customization scope agreed with art.
- [ ] Experience Level Chart (data file) + curve check (`xp_curve.py`) + level cap.
- [ ] Entity roster by role (villain, henchmen per chapter, minions per region, allies,
      NPCs).
- [ ] Entity Attribute Chart validated; boss and henchman fights simulated; rest and save
      points placed before each.
