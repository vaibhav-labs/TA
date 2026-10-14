# Prototyping, Simulation, Balancing, and Playtesting

Sources: Moore, *Basics of Game Design*, ch. 1–6 (read in full: paper and interactive
prototypes, testing, fresh testers, data outside code, statistics for balancing).
Adams & Dormans, ch. 8–9 (simulating and balancing; building economies; summarized from
the published framework). Tools: `scripts/` in this skill.

## Contents
1. The prototype ladder
2. Paper prototypes: what they're good for, how to build one
3. Interactive (electronic) prototypes
4. Simulation before code
5. What "balanced" means
6. Balancing methods
7. Playtesting protocol
8. Telemetry and statistics
9. Late-production balance hazards
10. Balance report template

---

## 1. The prototype ladder

| Rung | Question answered | Tools |
|---|---|---|
| 1. Thought experiment / diagram | Is there a loop with decisions in it? | Machinations-style text diagram (`internal-economy.md`) |
| 2. Spreadsheet + scripts | Do the numbers produce the intended shape? | `economy_sim.py`, `combat_sim.py`, `xp_curve.py`, `dice_odds.py` |
| 3. Paper prototype | Is it fun? Are the rules clear? Where's the drudgery? | Hex or grid paper, counters, index cards, dice, play money |
| 4. Interactive prototype | Do scale, feel, pacing, and real-time behaviour work? | Existing engine + placeholder art (Moore's *Zombie Swarm* example) |
| 5. Vertical slice | Does one finished level represent the final game? | Production pipeline |
Climb only as far as each question needs. Moore: it's far better to change things in
preproduction than after assets exist. Artists hate redoing art and programmers hate
rewriting code because the design keeps changing.

## 2. Paper prototypes

Good for: combat resolution, resource management, tech-tree evolution, puzzle solutions,
level structure, and object placement (Moore). Weak for: real-time feel (slice time into
mini-turns and use status markers; it stays clumsy), physics, camera.
Steps:
1. List materials (hex maps, counters, cards, play money, dice of the right types).
2. Write the rules as numbered algorithms; use relative values first.
3. Play solo, then with others. Log every ruling you had to invent, because each one is
   a missing rule.
4. Record time spent per activity and compare it with your play-time budget.
5. Revise and replay. Note what needs research (real movement rates, historical
   battles).

## 3. Interactive prototypes

Ask for one during technical review: one programmer and one or two artists, an existing
engine, placeholder art. It reveals true **scale** (objects may need resizing, which
forces rebalancing), **movement rate**, **real-time combat values**, and **multiplayer**
behaviour (a "godsend" for early multiplayer tests). Prototype the riskiest system first.
In an RPG that's usually combat.

## 4. Simulate before code

Adams & Dormans' central method: build the economy as a diagram, add **artificial
players** with distinct strategies, and run it many times.
- One spec per strategy (rush, boom/economy-first, turtle, random). Compare outcomes and
  game lengths.
- Check the shapes against intent (growth, plateau, arms race).
- Look for **dominant strategies**: one policy wins regardless of opponent. That's a
  balance failure, because the decision space collapses.
- Look for **dead options**: converters or units never worth using.
- Check that **skill beats luck**: the variance of outcomes for the same policy should
  be smaller than the gap between good and bad policies.
- Classic case studies in the book: Monopoly's rent loop (positive feedback produces a
  long, decided-early endgame) and Will Wright's SimWar balancing exercise. Use the same
  lens on your design.

## 5. What "balanced" means

- **Fair:** no side, start, race, or class has an unearned advantage (symmetry, or
  asymmetry with compensation).
- **No dominant choice:** every unit, weapon, class, and strategy has a counter and a
  niche (rock-paper-scissors).
- **Appropriate difficulty:** challenge tracks the intended skill and power curve; both
  novices and veterans enjoy it (Moore).
- **Meaningful choices:** options differ in kind, not just numbers, and the best choice
  depends on the situation.
- **Pacing:** fights, trips, levels, and the whole game take the intended time.
- **Readable:** players can predict outcomes well enough to plan.

## 6. Balancing methods

- **Cost curves:** price every option by its value (cost ≈ a·AV + b·DV + c·HP + d·range
  + ...). Fit the weights from options that feel right, then check outliers.
- **Win-rate matrices:** `combat_sim.py` for unit vs. unit; aim for every row to lose
  somewhere.
- **Time-to-kill and fight-length targets** per enemy tier.
- **Economy curves:** gold income vs. price ladders per chapter; resource curves per
  strategy (`economy_sim.py`).
- **Progression curves:** player power (`xp_curve.py` + item tiers) vs. enemy power by
  chapter.
- **Probability audits:** every random table checked (`dice_odds.py`); crit and drop
  rates in expected events per hour.
- **One change at a time:** re-run the sims after every change; keep a balance changelog.
- **Data outside code:** all of these values live in designer-editable files, so there's
  no rebuild per tweak (Moore ch. 1). Bake them in at ship.

## 7. Playtesting protocol

- **Internal design testing:** the designer plays continuously and tweaks values.
- **QA:** the lead tester reads the GDD and writes the test suite during preproduction.
  QA tests both play value and defects as levels finish.
- **Fresh players** from alpha onward. Veterans ask for harder levels because they know
  them; new eyes judge the whole game's orchestration (Moore).
- **Focus groups** for competing prototypes (genre or setting choices) before green-light.
- Session script: goal of the test → no coaching → think-aloud or observation →
  timestamps of confusion, deaths, quits, and backtracking → post-session questions (what
  was fun, what was a chore, what was confusing) → compare against the play-time budget.
- Save-game library: testers need saves at key points. Adding attribute fields late
  breaks the library (Moore ch. 6), which is another reason to freeze attributes early.

## 8. Telemetry and statistics

Moore: statistics analyze results after they happen. Instrument the game and the
debug builds for:
- deaths per encounter, fight length, flee rate, crits per fight;
- time per activity (vs. budget), time per level, quit points;
- gold and XP curves vs. design targets; item pick rates;
- RNG output logs (scan for repeating sequences);
- AI decision logs (verify attributes and modifiers apply correctly).
Flag numbers far from targets, form a hypothesis, change one value, re-test.

## 9. Late-production hazards

- New attributes or features after alpha unbalance finished content.
- Changes late in production can break balance in earlier levels. Re-run sims and
  regression-test old levels.
- "Shipping with a glaring imbalance": one or two units that break the game found near
  beta. Balance from the start (Moore ch. 5).
- Beta means bug fixes only; stash new ideas for patches or sequels (Moore ch. 1).

## 10. Balance report template

```
System: <combat / economy / progression / loot>
Intent: <target shape, fight lengths, win rates, pacing>
Method: <sim command + spec file + trials | playtest n=?>
Results: <tables/excerpts>
Problems found: <dominant/dead/runaway/slog/swingy/grind>
Changes made: <value: old -> new, reason>
Re-test result: <...>
Open risks: <...>
```
