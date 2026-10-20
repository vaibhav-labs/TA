# Settings guide: browsing by context

`ta-arena-artifacts` now has two layers of content for each world:

1. **The campaign** (`content/*.json`, slots `N.1`–`N.6`): the original, book-audited, structurally locked 42 games. Unchanged by this guide. Each one already has exactly one fixed setting; that setting is now recorded in a new `"setting"` field (see below) purely for filtering, and nothing else about these files changes.
2. **The library** (`content-library/*.json`, ids like `1-relationships-1`): new bonus games, one or more per world, that teach the same concept as that world's campaign games but in a setting the campaign doesn't already cover well. These are optional extra practice, not part of the required 1→7 progression, so they don't have a `next` chain and aren't numbered `N.1`–`N.6`.

Both layers share the same game schema (`opener`, `rounds` with Spot/Play/Analyse, `debrief`, `reflection`) and the same hard constraints from `BRIEF.md`: no em dashes, British spelling, GLOBAL-NAMES-only cast and places, the plain-words-by-week rule, and round item counts (Spot 3–5, Play 2–3, Analyse 1–2). Library games additionally carry `"setting"` and `"world"` (which campaign world's concept they reinforce) but no `"slot"`/`"next"` chain fields.

## The six settings

| Setting | What it covers | Established in the campaign? |
|---|---|---|
| Home & Flatmates | Hawthorn Court, apartment 3B, day-to-day life with Sam and Maya | Yes, heavily (20 of 42 games) |
| Work | Halden, colleagues, the team room, the canteen | Yes (7 of 42) |
| Family | Mum, Dad, Gran, apartment 1A, the extended family | Yes, thinly (4–5 of 42) |
| Friends & Community | The Corner Table, Nadia's group, neighbours | Yes (9 of 42) |
| Relationships | A romantic pairing, not a flatmate or colleague dynamic | Barely (1 of 42, a softened flirtation in 3.5) |
| School & College | A classroom, a course, a tutor or classmates | Not at all |

## How the two new settings use the existing cast

No new characters are added to GLOBAL-NAMES.md. Both new settings are built from people already in `docs/CHARACTER-BIBLE.md`.

**Relationships: Omar and Clara.** They already have an established, peer-level warmth (Clara reaches out to Omar at The Corner Table in 5.6; he's the cast's steadiest Adult, she's the Be Perfect case who can't accept a stroke she hasn't earned). There's no hierarchy problem (they're colleagues, not manager and report), which the Daniel/Clara dynamic would have. Library games in this setting follow them from early, undefined warmth toward something more spoken, using exactly the frictions the Character Bible already gives them: Clara's instinct to earn affection through usefulness, Omar's blind spot about people who can't just ask plainly. Keep both in character; this is not a new couple invented from nothing, it's the one relationship already hinted at in the audited content.

**School & College: Sam's evening class.** Sam (Please Others / Try Hard, chronically over-promising, Hawthorn Court flatmate) has enrolled in an evening course, the believable kind of self-improvement a scattered, eager-to-please person takes on, then struggles to actually finish. Minor one-off names (a tutor, a classmate or two) may be introduced exactly as the campaign already does for incidental characters (e.g. "Joseph and Ruby" in Nadia's group, "Mrs Kale" the neighbour) — same register, era-appropriate, not stock AI names, and not from the banned-words list.

## Gap list: what each world still needs

Settings each world's campaign already has, and what's missing (the library should fill these, at least one game per missing cell; more where a world has several concepts that split naturally across settings):

| World | Already has | Missing (write these) |
|---|---|---|
| 1 Being Noticed | Home, Work, Family, Friends | Relationships, School & College |
| 2 Who's Talking | Home, Work, Family, Friends | Relationships, School & College |
| 3 Back and Forth | Home, Work, Relationships, Friends | Family, School & College |
| 4 Conversation Traps | Home, Friends | Work, Family, Relationships, School & College |
| 5 Under the Surface | Home, Work, Family, Friends | Relationships, School & College |
| 6 The Story You Wrote | Home, Family, Friends | Work, Relationships, School & College |
| 7 Free to Choose | Home, Work, Friends | Family, Relationships, School & College |

That's 18 new library games for this round (minimum one per missing cell). `world` in each library game's JSON must match the campaign world whose concept it reinforces, so the hub can file it under the right world when filtering by setting.

## File and id convention

- Path: `content-library/<world>-<setting-slug>-<n>.json`, e.g. `content-library/1-relationships-1.json`.
- Setting slugs: `home`, `work`, `family`, `relationships`, `school`, `friends`.
- `id` field inside the JSON: same as the filename without `.json`, e.g. `"1-relationships-1"`.
- No `"slot"` or `"next"` field. Instead: `"world": 1`, `"setting": "Relationships"` (the display label from the table above, exact string).
