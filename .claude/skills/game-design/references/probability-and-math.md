# Probability, Randomness, and Game Math

Source: Moore, *Basics of Game Design*, ch. 3 (read in full), with checks automated by
`scripts/dice_odds.py`.

## Contents
1. How much math a designer needs
2. Perfect vs. imperfect information
3. Binary randomizers (coins, sticks, shells)
4. Dice: single die vs. sums (bell curves)
5. Sequential use and matrices
6. Percentile tables (d100) and weighting
7. Precision: when you need d1000 (sports stats)
8. Randomness in video games, and RNG hygiene
9. The two dangers: too many outcomes, meaningless odds
10. Keep numbers small and readable
11. Recipes

---

## 1. How much math

Design math is mostly addition, subtraction, and occasional multiplication.
Programmers use calculus, analytic geometry, and quaternions. Learn enough of those to
talk to them, but you must be fluent in **probability and statistics** and **Boolean
logic**.
- **Probability** predicts how often a result will happen. Use it while designing.
- **Statistics** analyzes results after they happen. Use it while balancing. If testers
  report several criticals per fight, the crit chance is too high.

## 2. Perfect vs. imperfect information

- **Perfect information games** (chess, checkers) hide nothing and have no randomness.
  Skill decides everything.
- **Imperfect information games** (Tetris's random next piece, face-down cards) add
  uncertainty and **replayability**: the same start gives a different playthrough.
Most video games use some randomness. Decide **where** it enters: before a decision
(what piece comes next) or after it (did the attack hit). Randomness before a decision
creates planning; randomness after it creates tension and luck.

## 3. Binary randomizers

Coin flip: 2 outcomes, 50/50. N flips gives 2^N results. The chance of all-same falls
quickly: 2 flips 50%, 3 flips 25%, 4 flips 12.5%.
**Senet throwing sticks** (4 two-sided sticks, move = count of red sides):

| Move | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Chance | 1/16 (6.25%) | 4/16 (25%) | 6/16 (37.5%) | 4/16 (25%) | 1/16 (6.25%) |

Note: Moore's text lists 0 and 4 as "16.7%". The correct value is 6.25%, and
`dice_odds.py sticks 4` confirms it.

## 4. Dice

- **1 die (d6):** flat. Each face 16.7%. Few outcomes, no shaping.
- **2d6:** 36 combinations, a bell curve centred on 7.

| Total | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Ways/36 | 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 | 3 | 2 | 1 |
| % | 2.8 | 5.6 | 8.3 | 11.1 | 13.9 | 16.7 | 13.9 | 11.1 | 8.3 | 5.6 | 2.8 |

Doubles are as likely as a 7 (16.7%). On a ~40-space board, 2d6 gives a steady pace with
rare bursts.
- Downsides of summing dice: the minimum can never be 1, results bunch in the middle,
  and you can't give every outcome equal odds.
- More dice give a tighter bell (more predictable). Fewer dice or bigger dice give more
  swing. Compare with `dice_odds.py compare 2d6 1d12 3d4`.

## 5. Sequential use and matrices

- **Sequential:** roll one die, decide, then optionally roll the second (Backgammon
  splits dice between pieces). This adds a decision inside the randomizer.
- **Matrix:** first die picks the row, second die the column, giving 36 equally likely
  cells. Each cell can hold any result. This gives flat odds over 36 outcomes. It's used
  in wargame tables.

## 6. Percentile tables (d100)

Two d10s (tens and units) give 1–100 (or 00–99 in code), every number equally likely.
Assign **ranges**, not single numbers, to weight outcomes:

| d100 | Result | Chance |
|---|---|---|
| 1–5 | Miss | 5% |
| 6–15 | Glancing (75% damage) | 10% |
| 16–65 | Normal (100%) | 50% |
| 66–80 | Heavy (125%) | 15% |
| 81–95 | Very heavy (150%) | 15% |
| 96–100 | Critical (roll on Critical Hit table) | 5% |

Validate any table with `dice_odds.py table file.csv` (checks gaps and overlaps,
coverage, a near-50% coin-flip warning, and too-many-outcomes).

## 7. Precision (sports)

To separate a .346 hitter from a .170 hitter you need resolution. A d6 can't (both
round to "hit on 1–2" or "hit on 1"). A d10 barely can. d100 can (hit on 1–34 vs. 1–17).
d1000 matches a three-decimal average exactly. Pick resolution by **how finely players
must be differentiated**. (Real league stats are licensed.)

## 8. Randomness in video games

- Without a dungeon master you aren't limited to dice-shaped ranges. Use any range per
  action. Design in d100 if that's comfortable; programmers may convert.
- History: early games used lookup tables of random numbers. Players spotted patterns
  and exploited them. Modern games use seeded pseudo-random generators.
- **RNG hygiene:** ask for a debug tool that logs RNG outputs to a text file, and a
  second tool that scans for repeating sequences. If nothing repeats visibly, players
  won't notice.
- Seed control is a design feature: fixed seeds for daily challenges and replays,
  seeded procedural generation for shareable worlds.
- Consider **pseudo-random distribution** (rising odds after each miss) or "bags"
  (Tetris 7-bag) when long streaks would feel unfair.

## 9. The two dangers

1. **Too many outcomes per action.** With 20 possible results the player can't predict
   anything. Some randomness is interesting; too much is frustrating. Keep about 3–7
   outcomes per action.
2. **Meaningless odds.** A 51/49 split reads to players as 50/50. A 70/30 split may come
   up more often than intended because players remember streaks. Test splits in a paper
   prototype, then in code.

## 10. Keep numbers small and readable

- During fast play (combat, puzzles), show **small numbers** or no numbers. Large numbers
  (XP to next level, a fortune in cash) belong on secondary screens where the player has
  time to read.
- Replace number spam with **visual signals**: health bars and thermometers, a character
  glowing redder as damage grows, countdown timers.
- Don't swap number overload for icon overload. A dozen status icons mid-battle is just
  as unreadable.

## 11. Recipes

- **Hit chance vs. a target number:** `dice_odds.py roll 1d20 --at-least 14`.
- **Advantage / disadvantage:** `roll 2d20kh1` / `roll 2d20kl1`.
- **Stat generation shape:** `roll 4d6kh3` vs. `roll 3d6`.
- **Weighted loot or encounter table:** author as CSV ranges, then `table`.
- **Critical frequency per fight:** chance per attack × attacks per fight. With 5% crits
  and 8 attacks per fight, P(at least one crit) = 1 − 0.95⁸ ≈ 34%.
- **Expected damage:** Σ(probability × multiplier) × base. For the table above:
  0.05·0 + 0.10·0.75 + 0.50·1 + 0.15·1.25 + 0.15·1.5 + 0.05·(crit average) ≈ 0.99 + 0.05·crit.
