# Extra settings for one game (read all of this before writing)

Every campaign game (slots 1.1 to 7.6) keeps its existing story as the first setting. You write
THREE more stories for ONE game, each in a different setting, so a player can pick the setting
closest to their own life. The lesson is the same in all four. The people, place and situation
are new in each.

## Your output

One file: `content/stories/<world>-<n>.json` (for 3.2 that is `content/stories/3-2.json`). Nothing
else may be created or edited. Shape:

```json
{
  "baseBlurb": "One line (max 18 words) describing the game's EXISTING story, no spoilers",
  "stories": [
    { "setting": "Relationships",
      "blurb": "One line (max 18 words): who is in it and what is at stake, no spoilers",
      "opener": { "setting": "...", "lines": [ { "who": "", "text": "", "cue": "" } ], "ask": "" },
      "rounds": [ { "level": "Spot", "label": "...", "items": [] },
                  { "level": "Play", "label": "...", "items": [] },
                  { "level": "Analyse", "label": "...", "items": [] } ] }
  ]
}
```

`setting` must be exactly one of: Home & Flatmates, Work, Family, Friends & Community,
Relationships, School & College. Use exactly the three settings given for your slot in
`qa/story-plan.json`, in that order. `opener` and `rounds` follow the same JSON contract as the
base game file (item types pick, scene, sort, counter; see BRIEF.md section "Item types and the
JSON contract"). `debrief`, `reflection`, title, concept and book term are shared and are NOT
repeated.

## What each extra story must keep from the base game

- The same lesson, at the same difficulty, with the same mechanic. Open `content/<slot>.json`,
  note the item type of every item in each round, and use the same types in the same order, with
  the same item counts (plus or minus one). Round `label` and `level` stay as in the base.
- For `sort` items, keep the same `bins` labels, and write new statements for them. For an
  ordering item (`"order": true`) keep the same steps in the same order, new wording and setting.
  For `counter` items, keep the target and the idea; build a palette that fits the new setting.
- The plain-words rule of BRIEF.md: worlds 1 to 3 use plain words only in the story text; from
  world 4 the book term may appear where the base game uses it.
- Be fair: every wrong option is tempting for a real reason and its `traps` text says what it
  does to the conversation. Every right answer has a `why`. Pick items need `example` (a short
  everyday exchange somewhere else) and `traps` for every wrong index.
- Vary the position of the right answer: across your stories do not put the answer at the same
  index more than half the time. Do not make the right answer the longest option.

## What makes it a story, not a worksheet (master-storyteller craft)

- Open late, in the middle of something. The opener names a concrete want and a small pressure
  (a deadline, a face to save, a thing someone is about to say). The reader should want the next
  line.
- One thread per story. The Spot items, the Play scenes and the Analyse item all happen to the
  same few people in the same place and week, and each item moves the situation on. Later items
  can refer back to earlier ones. Something is at stake for a specific person.
- People have a want and a flaw. Use the cast bible (docs/CHARACTER-BIBLE.md, also summarised
  below). Keep each person's tell and driver consistent. Add one or two new minor characters per
  story at most, with ordinary, era-appropriate names (no Elara, Lyra, Kael, Marcus, Sarah Chen).
- Dialogue is a contest. People dodge, interrupt, say one thing and mean another. Subtext over
  statement. Nobody announces their feelings or the lesson.
- Specific, odd detail beats general detail: one precise object, number, smell or sound per scene.
  Do not use a code for a flat (no "1A" or "2B"); say "Gran's flat downstairs".
- Do not end an item with a tidy moral. Let the `why` teach, in plain words, about this exact moment.

## Setting guide and cast (use only these places and people, plus minor one-offs)

- Home & Flatmates: Hawthorn Court, the shared flat (apartment 3B), the kitchen, the balcony. Sam
  and Maya share it with the player. Money, chores, milk, the bins, the rota.
- Work: Halden, a software team. Daniel (manager-ish, rationalist), Clara (Be Perfect), Omar
  (steady), Sam sometimes. Standups, releases, the canteen, the team room.
- Family: Mum, Dad, Gran (lives downstairs), Leo (8), Grace and Mrs Kale from the building.
  Sunday lunch, the school gate, the phone call home, Gran's kitchen.
- Friends & Community: The Corner Table (cafe near the station), Nadia's Sunday group, neighbours,
  Joseph and Ruby, the five-a-side game, a birthday.
- Relationships: Omar and Clara, two colleagues who are drifting toward something. Peer warmth, no
  hierarchy. Clara earns affection through usefulness and cannot accept a compliment she has not
  earned. Omar is steady and misses it when someone cannot ask plainly. A second date, a text that
  sat unanswered, a friend who is too honest.
- School & College: Sam's evening class (a course he enrolled in and may not finish). A tutor, a
  classmate or two with one-off names. Group projects, a feedback sheet, a missed deadline, a
  study group, the library.
- Names and places: GLOBAL-NAMES.md applies. No money symbols (say "a bus fare", "a fee"), no
  non-English words, no real places. British spelling.

## Writing rules

All the writing rules in BRIEF.md apply: no em dashes, no triads in lists of three, no "not X but
Y", no participle tails, no drumroll openers, no banned words, varied sentence length, curly
double quotes for dialogue inside JSON strings, straight apostrophes, only <b>, <i>, <br> as
markup. Spot items short; Play scenes three to six beats with two to four lines each; every beat
has a `best` line; at most one `game` line per beat; every line has `outcome` and `why`.

## Work process

1. Read `content/<slot>.json` fully, BRIEF.md (rules, schema), docs/CHARACTER-BIBLE.md for the
   people you use, and the library games for your world (`content/<world>-L*.json`) so you do
   not repeat their scenarios.
2. Write `content/stories/<slot>.json` (use `<world>-<n>` in the file name).
3. Run `python3 engine/check_story.py <slot>` from the ta-arena-artifacts folder. It validates the
   schema, scans for banned words and codes, counts answer positions and prints the humanize
   score. Fix every ERROR and BANNED line. Aim for a humanize score under 30 and RESULT: ok.
4. Read your stories once as a player would. If a scene does not make you curious, rewrite it.

Final reply: under 50 words. The file written, the three settings, the score, anything that
failed. Do not paste content.
