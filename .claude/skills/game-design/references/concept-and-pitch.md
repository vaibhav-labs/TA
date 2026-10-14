# Concept, Fun, and the Pitch

Source: Moore, *Basics of Game Design*, ch. 1–2 (read in full). Adams & Dormans' framing of
core mechanics is added where it sharpens the concept work.

## Contents
1. Start from what the player *does*
2. The fun-action / chore-action split
3. Play-time budget (percentages)
4. Play elements by genre
5. What is *not* gameplay
6. Abstraction and the fudge factor
7. High concept (≤20 words)
8. Pitch paper (1–2 pages)
9. Game proposal (6–10 pages)
10. Concept quality checklist

---

## 1. Start from what the player does

The single most important question, before story, art, or platform: **what will the player
do, minute to minute, that is fun?** Moore's warning: novice designers write pages of story
and mention "there is a combat system" in passing. That hands the design to programmers,
and the game that ships won't match what the designer imagined.

Gameplay = the actions the player performs. Pong is one action (move a paddle). An RPG is
dozens: exploring, fighting, talking to NPCs, trading, solving puzzles. Simple games run on
randomness or reflex mastery. Complex games run on **data**: values the designer assigns
to every object so the systems can interact. With no damage value on the bullet and no
hit points on the target, nothing happens when they collide.

## 2. Fun actions vs. chore actions

List both. Players tolerate chores because they lead to fun.

| Fun (players want more) | Chores (necessary precursors) |
|---|---|
| Exploring unknown areas | Inventory management |
| Resolving combat | Buying and selling |
| Finding treasure | Bookkeeping |
| Building things | Retracing steps through explored areas |
| Destroying things | Managing trades/salaries in sports sims |
| Interacting with characters | Reloading a save |
| Living through a story | Hunting the manual for an obscure control |
| Solving puzzles | |
| Manipulating resources | |
| Piloting, driving, playing a sport | |

Design goal: **maximize fun-time, minimize drudgery.** Moore's fixes, which recur through
the book:
- Long trips get a fast-travel / strategic map (see `movement.md`).
- Repetitive gathering goes to "gatherer" units (RTS) or auto-pickup.
- Steep learning curves get a tutorial spread over hours, a few lessons at a time.

## 3. Play-time budget

Give every play element a percentage of expected play time. Moore's RPG example:

| Element | % |
|---|---|
| Exploration | 60 |
| Combat | 15 |
| NPC interaction | 10 |
| Puzzle-solving | 5 |
| Storytelling | 5 |
| Inventory management | 3 |
| Buying/selling | 2 |

The budget is a design lever. Raising combat to 25% means cutting exploration, puzzles, or
story. The result is a dungeon crawl: denser enemies, smaller maps. Too much combat
becomes repetitive. A 60% exploration share means the world must be large and seeded
with encounters, treasure, NPCs, and towns, and then fast travel is needed to stop
backtracking.

**Use the budget to order the GDD.** Write the highest-percentage elements first and in
the most detail. That tells the team what to build and test first.

**Validate it.** Time yourself playing three comparable games and compare the real split
with your guess (Moore, ch. 2 exercise 3).

## 4. Play elements by genre (Moore Table 2.1)

| Genre | Core play elements |
|---|---|
| Role-playing | Movement, combat, character generation, experience levels, magic/technology, character interactions, inventory management |
| Wargames | Movement, combat, strategy & tactics, supply, leadership, production (reinforcements) |
| Real-time strategy | Movement, combat, resource management, production (reinforcements), technology |
| Simulation | Movement, combat, resource management, production |
| Sports | Movement, offense vs. defense, strategy & tactics, management |
| Shooters | Movement, combat, puzzles, resource management |

The same element varies in importance by genre. Movement is deep in a wargame and
abstract in a sim.

## 5. What is *not* gameplay

These are vital to a commercial game, but they are not what the player **does**:
- **Graphics.** Photorealism is costly and hits the "uncanny valley." A distinct look
  sells; it doesn't make play.
- **Non-interactive story.** Long cutscenes are passive. Players forget sprawling plots
  and won't re-trigger cinematics to catch up. NPC conversation *with real choices* is
  gameplay.
- **Audio.** It sets ambience and gives great feedback, but it isn't play (unless the
  game is *about* making music).

The GDD covers all three, but most of its words go to actions and mechanics.

## 6. Abstraction and the fudge factor

**Games abstract reality.** Much of design is removing the extraneous to expose what is
most enjoyable. Monopoly abstracts construction (no floor-by-floor building) to keep focus
on acquiring and dominating. Flight sims show a handful of instruments, not a real
cockpit.

**Over-design early, trim during production.** Adding substance late in alpha is
expensive and breaks finished assets.

**Fudge factor.** Let things exceed reality to keep play moving: fast movement, quick
combat, resources that appear when needed, characters who become demigods carrying tons
of gear. Players accept these conventions. **Exception: never visibly fudge in the
AI's favour.** A sentry who spots you through his back, or enemies who always take
the perfect path, feel like cheating. Players won't notice the computer cheating *for*
them.

Write two lists in the GDD: elements that must feel **realistic** and elements that can be
**fudged** for fun.

## 7. High concept

One sentence of **20 words or fewer**, placed first in the pitch. It names the genre,
the player's role or fantasy, and the hook. Marketing will reuse it.

Template: *"[Genre] where you [core fun action] to [goal], but [twist that makes it new]."*

Test it: someone who hears it can say what they would *do* in the first five minutes.

## 8. Pitch paper (1–2 pages)

Purpose: a sales tool to get management, marketing, and sales excited. Anyone in a
company can write one. Contents:
1. High concept (first sentence of first paragraph).
2. Genre and fictional setting (if any).
3. The one or two most exciting gameplay elements: **what the player does that's fun**,
   not the story.
4. Why it's new and why it's fun.

Write it creatively; it must leave an "indelible impression." Odds: for every 10 pitched
ideas, 1–2 get developed further. Ideas are cheap.

Template: `assets/templates/pitch-paper.md`.

## 9. Game proposal (6–10 pages)

Expands an accepted pitch. The designer drafts it over about 1–2 months, helped by a
sketch/concept artist, and asks the technical director early whether it's feasible.
Under 6 pages won't sell the fun; over 10 and management won't read it.
- Plot/history synopsis (or why the topic is exciting).
- Main gameplay features, summarized without much detail on any one.
- Characters, key locations, objects (with concept sketches or storyboards).
- **Marketing analysis**: competing titles, genre revenue and popularity, best
  platforms, and why this game fills a gap or can beat rivals.
- Feedback from art and programming that it can be built.

Odds: about 1 in 5–6 proposals gets a green light for a full GDD.

Template: `assets/templates/game-proposal.md`.

## 10. Concept quality checklist

- [ ] High concept ≤ 20 words and names the core action.
- [ ] Fun-action and chore lists written; every chore has a mitigation.
- [ ] Play-time budget adds to 100%, with a reason for the top two elements.
- [ ] Core mechanic identified (see `mechanics-framework.md`): what the player does most
      often, and the system that action feeds.
- [ ] Emergence vs. progression balance chosen (see `mechanics-framework.md`).
- [ ] "Realistic vs. fudged" lists drafted.
- [ ] Competitive set of 3–5 titles, each with a line on how this differs.
- [ ] Scope sanity check: content volume (maps, enemies, items, dialogue lines) roughly
      estimated against team size.
