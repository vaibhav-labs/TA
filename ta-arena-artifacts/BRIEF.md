# TA Arena: artifact brief (read all of it before writing anything)

## What we are making

Forty-two games from the TA Arena design, one playable page each. Each page is a
standalone game in the same family as the "First Transaction" series: a story opener,
three levels (Spot, Play, Analyse) played as rounds, an explanation with a real example
for every right and wrong answer, a debrief in plain words, a private reflection, and
navigation. The TA Arena design is the source. These pages are the main product, not a
conversion of an older app.

Sources, all in this folder:
- `source/bible.txt`: story, cast, arc, plain-words glossary, what makes it a game. Read it.
- `source/world-map-and-mechanics.txt`: the 42-game table (mechanic, concepts, what each
  game plays like) and the mechanics catalogue. Read the rows for your games.
- `source/scenes-weeks-1-3.txt`: the fully scripted scenes for games 1.1 to 1.6, 2.1 to 2.6
  and 3.1 to 3.2 (3.2 is only partly scripted). Use these scripts closely. Keep their
  options, meter effects and outcomes when they are given.
- `BRIEF.md` (this file) and `SCHEMA` below: the JSON contract the engine reads.

Games 3.3 to 3.6 and every game in worlds 4 to 7 are not scripted in the source. Design
them from the world table row (what the player does, what they learn, the boss rule)
plus the bible (cast, plain words, the debrief voice). Use the global cast in
GLOBAL-NAMES.md and a neutral city setting.

## Your output

One JSON file per game you are assigned, at `content/<world>-<n>.json` (for example
`content/1-1.json`). Write nothing else into `content/`. Validate every file with
`python3 -m json.tool <file> > /dev/null` before you finish.

Your final reply to the lead is under 80 words: the files you wrote, the number of items
per game, which games you designed without a source script, and any file that failed
validation. Do not paste game content into the reply.

## Writing rules (from the humanize-writing skill; they apply to every string)

- No em dashes (the long dash character). Use commas, full stops, colons, brackets or
  a new sentence. For number ranges write "weeks 1 to 3", not a dash.
- No rule-of-three lists in prose. Vary list lengths (two, four, five).
- Avoid these constructions: "not X, but Y"; "it's not about X, it's about Y"; "the
  question isn't X, it's Y"; "not just X, it's Y"; sentences that end with a participle
  tail ("..., highlighting ...", "..., underscoring ...", "..., reflecting ...").
- Avoid drumroll openers ("Here's the thing", "The best part?", "Here's the kicker").
- Avoid these words: delve, tapestry, landscape, navigate, journey, crucial, vital,
  pivotal, seamless, genuinely, honestly, "the reality is", "in today's", "lean into",
  "unlock", "transformative", "meaningful" (when it means nothing), "quietly" (allowed
  only once in a whole game, if a scene really needs it). Avoid "truly" and "deeply".
- Vary sentence length on purpose. Include some sentences of four words or fewer and a
  few of thirty words or more. Do not open two sentences in a row with the same word.
- Plain words first. The in-game word is the one a person would use: "a nod", "the
  bounce", "the Boss voice". The book term is used only where the bible allows it (see
  Plain words below).
- Specific detail beats general detail: a time, a place in a neutral city (the flat, the
  office, the corner café), a price with no currency symbol, tea, the 35-minute ride, a WhatsApp message, a
  school gate, a train platform. Do not invent facts about real people, companies or
  places beyond the fictional ones in the bible.
- British spelling: recognise, behaviour, realise, colour, programme (where it appears).
- Dialogue uses curly double quotes “like this” inside JSON strings. Apostrophes are
  plain '. Never put a straight double quote (") inside a string value.
- You may use <b>, <i> and <br> in string values. Nothing else. No <p>, no <div>, no
  <span>, no style attributes, no entities other than &amp;, &lt; and &gt; if needed.
- Paraphrase the books. Do not quote book passages. Do not give chapter numbers unless the
  source script gives them.
- Be fair to the player. No option should be silly. Each wrong option is tempting for a
  real reason, and its explanation says what that option would do to the conversation.
- Each explanation names the voice, transaction, game or script concept in plain words
  first, then the book term if the bible allows it at that point.

## Plain words and the book term (the rule that makes this a learning game)

- In the opener, the rounds' questions and the options, use plain words only in weeks 1
  to 3 (games 1.x, 2.x, 3.x). In week 4 onward, the debrief may name the book term once.
- Every game carries `bookTerm` (the term) and `bookIdea` (one paraphrased sentence). These
  appear only in the debrief card, introduced as "the books call this ...".
- Weeks 5 to 7 may use the book term inside the Analyse round, because the player has
  learned the words by then.

## Game structure (every game)

1. Intro card: title, one-line concept, the opener (setting and 2 to 4 lines of dialogue
   or a short scene), and the question the player must answer. Then a "How this one
   works" box.
2. Three levels as rounds, in this order: `Spot` (recognise, 3 to 5 items), `Play` (act,
   2 to 3 items or scenes), `Analyse` (explain, 1 to 2 items). Boss games (x.6) have the
   same three levels but the scenes run harder: more beats, sharper options.
3. Every item gives feedback after the player answers. Right answers get `why`. Wrong
   answers get the `traps` text for the option picked, then the `why` for the correct one.
   Pick items also get an `example`.
4. Debrief card: `nadia` (two to four sentences, plain words, in Nadia's voice), then the
   book term and `bookIdea`.
5. Reflection: one private prompt about the player's own week, addressed to "you".
6. End card: "Case closed" line, source line, and the navigation (added by the engine).

## Item types and the JSON contract

The engine reads `game` objects. Every round item has a `type`: `pick`, `scene`, `sort` or
`counter`. A round can mix types. Use the mechanic in the world table to pick a type:

| Source mechanic | Use type |
|---|---|
| Diagnose, Spot-the-leak, Ladder (as a single choice of rung) | pick |
| Vector (matched or crossed), Two-track (split into one pick per track) | pick |
| Choice-story, Rule-breaker, Replay, Collect, Many-handed, Open (candid) | scene |
| Sort-it, Floor-plan, Build, Quadrant, Match, Egogram | sort |
| Sequence (Formula G order) | sort with `"order": true` |
| Counter (strokes owed) | counter |

Use `scene` for the Play round of most games. A game's Spot round is usually `pick`. The
Analyse round is `pick` (explain which concept) or `sort`.

### Game object

```json
{
  "slot": "1.1",
  "title": "Spinal Cord",
  "world": 1,
  "worldName": "Hunger",
  "week": 1,
  "weekName": "Invisible",
  "mechanic": "Choice-story",
  "concept": "One sentence: what the player can do after this game.",
  "plainWord": "a nod",
  "bookTerm": "Stroke",
  "bookIdea": "One paraphrased sentence, no quotation marks.",
  "bookSource": "Games People Play",
  "opener": {
    "setting": "Monday, 7:50am. Kesari Heights, flat 3B, the kitchen.",
    "lines": [
      { "who": "Tanvi", "text": "“...”", "cue": "optional stage direction" }
    ],
    "ask": "What the player must work out, in one sentence."
  },
  "rounds": [
    {
      "level": "Spot",
      "label": "Spot, round 1",
      "intro": "optional <b>/<i>/<br> html shown above the first item",
      "items": []
    },
    { "level": "Play", "label": "Play, the week in motion", "items": [] },
    { "level": "Analyse", "label": "Analyse, explain it", "items": [] }
  ],
  "debrief": {
    "nadia": "Two to four sentences in Nadia's plain voice.",
    "bookTerm": "Stroke",
    "bookNote": "The books call this ... (one paraphrased sentence)."
  },
  "reflection": { "prompt": "A private question to the player about their own week." },
  "next": "1.2"
}
```

`next` is the slot of the next game, or `null` for 7.6 only. Use slot strings like `"2.1"`.

### Pick item (`"type": "pick"`)

```json
{
  "type": "pick",
  "who": "Vikram",
  "text": "“Let's be rational about this. The numbers are the numbers.”",
  "cue": "leaning back, pen tapping",
  "options": ["Parent", "Adult", "Child"],
  "answer": 1,
  "why": "Why the answer is right, in plain words, then the book idea if allowed.",
  "traps": {
    "0": "What option 0 would sound like here, and what it does to the conversation.",
    "2": "What option 2 would sound like here, and what it does to the conversation."
  },
  "example": "A short everyday exchange in another setting (a train, a school gate, a family WhatsApp group). Use <br> between lines."
}
```

Rules: 2 to 4 options. `traps` has exactly one key for each wrong option index, as a
string. `answer` is the index of the right option. `example` is required on every pick
item. Options may be any labels the concept needs: "Parent", "Adult", "Child", or
"Complementary", "Crossed", or "Ritual", "Pastime", "Activity", "Game", "Intimacy",
"Withdrawal", or rungs such as "Existence", "Significance", "Changeability", "Personal
ability".

### Scene item (`"type": "scene"`)

```json
{
  "type": "scene",
  "title": "Monday, 22:30, the flat",
  "setting": "One or two sentences of setting.",
  "meters": { "you": 70, "them": 50 },
  "beats": [
    {
      "who": "Rohan",
      "text": "“Sorry, sorry, I owe you for the milk. Again.”",
      "cue": "already reaching for the fridge",
      "lines": [
        {
          "text": "“It's fine. Forget it.”",
          "tag": "ok",
          "you": -2,
          "them": 3,
          "outcome": "What happens next, one or two sentences.",
          "why": "Which move this is and what it teaches (plain words first)."
        },
        {
          "text": "“You owe me for the milk and the last two weeks. Pay me Friday.”",
          "tag": "best",
          "you": 4,
          "them": -2,
          "outcome": "What happens next.",
          "why": "Why this line keeps the conversation honest."
        }
      ]
    }
  ],
  "payoff": "Shown when a game move ends the scene early. Required if any line has tag game.",
  "fallout": {
    "them": "Shown if the Them meter reaches zero (optional).",
    "you": "Shown if the You meter reaches zero (optional)."
  },
  "example": "optional short everyday example"
}
```

Rules: 3 to 8 beats. 2 to 4 lines per beat. Each line's `you` and `them` change is between -10
and +10. `tag` is one of `best` (the healthy move), `ok` (not harmful, not the best),
or `game` (a game move: the scene ends early and `payoff` plays). Every beat has at least
one `best` line. A player who picks only `best` lines reaches the end of the scene.
Every line has `why` and `outcome`.

### Sort item (`"type": "sort"`)

```json
{
  "type": "sort",
  "prompt": "Put each statement in the right corner of the OK Corral.",
  "bins": ["I'm OK, you're OK", "I'm not OK, you're OK", "I'm OK, you're not OK", "I'm not OK, you're not OK"],
  "items": [
    { "text": "“I can handle this, and I know you can too.”", "answer": 0, "why": "..." }
  ],
  "example": "optional"
}
```

Rules: `bins` has 2 to 6 labels. Each item has an `answer` index into `bins` and a `why`.
For ordering games set `"order": true`, omit `bins`, list the items in the correct order,
and give each item a `why` that explains why it comes at that position. The engine
shuffles the cards and the player taps them in order.

### Counter item (`"type": "counter"`)

```json
{
  "type": "counter",
  "prompt": "Greet Mr C. He is owed about 30 strokes. Build a greeting that pays them.",
  "target": 30,
  "tolerance": 2,
  "maxPicks": 12,
  "palette": [
    { "text": "“Mr C! Back from holiday, I hope?”", "value": 3, "tag": "warm" }
  ],
  "underMsg": "Shown when the total is below the band.",
  "overMsg": "Shown when the total is above the band.",
  "hitMsg": "Shown when the total is in the band.",
  "why": "What the counting teaches, in plain words."
}
```

## Feedback standard

- Right answers: the `why`, and for pick items the `example`.
- Wrong answers: the `traps` text for the option picked, then the `why` for the right one,
  then the `example`.
- Scene lines: `outcome` after picking, then `why`. Early ends show `payoff` or `fallout`.
- Every explanation is specific to the moment in the scene or example. Avoid generic
  lines like "This shows the importance of ...".

## Difficulty and escalation

- Spot is a clean recognition round. Options are clearly different. Two or three options.
- Play is harder. Options look alike, the cues are mixed, and scenes have three to six
  beats.
- Analyse asks for an explanation: which concept, why, what the other option would have
  done. Use `pick` with explanation-style options, or `sort`.
- Boss games (x.6) use Play and Analyse with stronger pressure: more beats, more game
  moves, and an option that looks kind but keeps the trap running.

## Work process for you

1. Read the bible, the world-map rows for your games, and (for games 1.x to 3.x) the scripts
   in `source/scenes-weeks-1-3.txt`.
2. For each game, decide the three rounds and the type of every item. Keep the round
   count at three.
3. Write the JSON file. Keep strings short where you can. The engine shows them on a
   phone.
4. Validate the JSON with `python3 -m json.tool`.
5. Check the prose for the tells. Extract the strings to a scratch file and score it:

```bash
S=/root/.claude/skills/synced/89a629a6-4c64-4fa1-a319-a5639eab874f_eb2f363c-fa32-43b6-b969-e43ca702010b/humanize-writing/scripts/score.js
python3 -c 'import json,re,sys; s=json.dumps(json.load(open(sys.argv[1])),ensure_ascii=False); print(re.sub(r"<[^>]+>"," ",s).replace("\\n"," "))' content/1-1.json > out/prose-1-1.txt
node "$S" out/prose-1-1.txt
```

   Aim for a score under 30. If a game is higher, look at the per-signal breakdown and
   fix the structure (sentence length, repeated openers, triads, em dashes, participle
   tails), not just the words. The score is a drafting aid, not a verdict.

## Assignment table (42 games)

| Slot | Title | Source mechanic | Week | Renderer hint |
|---|---|---|---|---|
| 1.1 | Spinal Cord | Choice-story | 1 Invisible | scene in Play |
| 1.2 | Stroke Sorter | Sort-it | 1 | sort |
| 1.3 | Hi–Hi | Counter | 1 | counter (use an en dash only in this title, which is a name) |
| 1.4 | The Party | Floor-plan | 1 | sort |
| 1.5 | PTA Three Ways | Choice-story | 1 | scene |
| 1.6 | Boss: The Stroke Economy | Rule-breaker | 1 | scene (Sunday boss) |
| 2.1 | Who Said That | Diagnose | 2 Three Voices | pick |
| 2.2 | Five Faces | Diagnose | 2 | pick |
| 2.3 | Egogram | Build | 2 | sort |
| 2.4 | Four Ways to Know | Diagnose | 2 | pick |
| 2.5 | Little Professor | Choice-story | 2 | scene |
| 2.6 | Boss: The Contaminated Adult | Spot-the-leak | 2 | pick (Sunday boss) |
| 3.1 | Draw the Arrow | Vector | 3 Volleys | pick |
| 3.2 | Keep It Going | Choice-story | 3 | scene |
| 3.3 | Cross It | Choice-story | 3 | scene |
| 3.4 | Cuff Links | Replay | 3 | scene |
| 3.5 | The Barn | Two-track | 3 | pick |
| 3.6 | Boss: The Salesman | Two-track | 3 | pick and scene (Sunday boss) |
| 4.1 | Is It a Game? | Diagnose | 4 Traps | pick |
| 4.2 | Formula G | Sequence | 4 | sort (order) |
| 4.3 | Life Games | Choice-story | 4 | scene |
| 4.4 | Home Games | Choice-story | 4 | scene |
| 4.5 | Room Games | Choice-story | 4 | scene |
| 4.6 | Boss: Why Don't You–Yes But | Many-handed | 4 | scene (Sunday boss) |
| 5.1 | Real or Racket | Diagnose | 5 Underneath | pick |
| 5.2 | Stamp Book | Collect | 5 | scene |
| 5.3 | Four Levels | Ladder | 5 | pick |
| 5.4 | Doing Nothing | Diagnose | 5 | pick |
| 5.5 | Two Halves | Choice-story | 5 | scene |
| 5.6 | Boss: The Discount Matrix | Ladder | 5 | pick and scene (Sunday boss) |
| 6.1 | OK Corral | Quadrant | 6 The Plan | sort |
| 6.2 | Hear the Driver | Diagnose | 6 | pick |
| 6.3 | Don't | Diagnose | 6 | pick |
| 6.4 | Three Banal Scripts | Choice-story | 6 | scene |
| 6.5 | Script Process | Match | 6 | sort |
| 6.6 | Boss: The Script Matrix | Build | 6 | sort (Sunday boss) |
| 7.1 | Help or Rescue | Diagnose | 7 Your Own Person | pick |
| 7.2 | The Contract | Build | 7 | sort |
| 7.3 | Three P's | Choice-story | 7 | scene |
| 7.4 | Despair to Laughter | Replay | 7 | scene |
| 7.5 | Awareness, Spontaneity, Intimacy | Choice-story | 7 | scene |
| 7.6 | Boss: After Games, What? | Open | 7 | scene (Sunday boss, candid, no game moves) |

Slot numbers: use the world digit and the game digit exactly as above.
Week numbers: the bible's arc table. World n is week n, except the titles in the table.
