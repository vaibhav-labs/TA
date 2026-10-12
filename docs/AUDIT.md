# Source-material audit

12 Oct 2026. `docs/STRATEGY.md`'s 61-concept curriculum was originally written from the designer's own knowledge of the four TA books, not from reading them directly. This audit independently reads all four against the curriculum — each book fetched via Google Drive (or the local PDF where Drive truncated a large scan) and cross-checked chapter-by-chapter against every concept-map row and worked example that cites it. Findings below were applied to `concepts.json`, `worlds.json`, and `STRATEGY.md` on this date; this file is the record of what was found and why each fix was made.

## Headline findings

1. **The curriculum's order does not follow TA Today**, despite STRATEGY.md's original claim that "TA Today supplies the order (it is a textbook)." TA Today's real sequence (Parts II→VI) is ego-states → transactions → strokes → **scripts** → passivity → games. The game runs strokes → ego-states → transactions → **games** → passivity → **scripts**. Scripts-after-games is a direct reversal of the book's own Part IV→VI order. **Resolution:** kept the game's order (a deliberate discovery-learning sequence — accessible concept first, scripts as the late reveal of *why* the games happened), corrected the false claim in section 1/4 of STRATEGY.md.
2. **One fabricated worked example.** Section 6.5 ("Cuff Links") was labeled "Berne's own text, unchanged" but no such scene exists in Berne 1961 — confirmed by full-text search and the book's own subject index. **Resolution:** replaced with the book's real ch.9 example (Camellia/Rosita/Holly/Mr. Troy, Figs. 7-8, pp.90-95), quotes verified against the actual scanned pages.
3. **One real conceptual error.** The Discount Matrix was documented as "4 levels × 3 areas." The book's actual matrix (ch.18, Fig. 18.1) is 4 levels × 3 **types** (stimuli/problems/options), with *area* (self/others/situation) as a separate third dimension. **Resolution:** concept #39 rewritten; Discount Matrix (#40) recredited to Mellor & Sigmund (not the Schiffs, who are correctly credited for the general discounting theory in #39).
4. **17 citation/attribution errors**, now fixed in `concepts.json`: TA Today chapter numbers off-by-one (rows 9, 12, 15, 47) or swapped (42↔43); contracts wrongly credited to Berne instead of Steiner; sex-role scripts and the Pig Parent both omitted Hogie Wyckoff, who wrote/coined them; the 3 P's omitted Pat Crossman, their actual originator; two rows (#2 stroke typology, #56 "sweatshirt") cited GPP for material that isn't in GPP at all.
5. **Content silently dropped from gameplay.** Two real GPP games (Perversion, The Stocking Game) were missing from the thesaurus entirely; World 4 level 4.4's level list dropped "Frigid Woman/Man" even though the concept row lists it. **Resolution:** both added back.
6. **One mischaracterized exclusion.** STRATEGY.md claimed Steiner's "radical-therapy politics" chapters were cleanly excluded. They're not separable — the banal scripts (Lovelessness/Mindlessness/Joylessness) are explicitly assigned by race, class, and gender in Steiner's own text, and material the game already uses (Pig Parent, Stroke Economy, Rescue) carries that critique. **Resolution:** corrected the claim in section 1; the game gamifies the mechanics but not yet the explicit political framing — left as an open scope question, not silently resolved either way.

## Per-book detail

### Berne 1961, *Transactional Analysis in Psychotherapy*
Real structure: Part I Structural Analysis (ch.2-7), Part II Transactional Analysis (ch.8-12: Social Intercourse, Analysis of Transactions, Analysis of Games, Analysis of Scripts, Analysis of Relationships), Part III Psychotherapy (ch.13-15), Part IV Frontiers (ch.16-20).
- "Symbiosis" and "Berne's four contract requirements" do not appear anywhere in this book (confirmed via its own subject index) — both were wrongly cited to it.
- The nine-vector relationship diagram is this book's own ch.12, not GPP's as originally cited (GPP does reuse it; credited both now).
- Game vs. operation vs. maneuver is already distinct in ch.10, three years before GPP; GPP ch.5 added as a co-source, not the sole one.
- Not covered by the curriculum, deliberately: ch.18 (marital-therapy technique) and ch.19 (regression-analysis psychodrama) — real content, but clinician technique rather than a lay-player confusion to catch.

### Games People Play (Berne, 1964)
Real structure: Introduction (hunger, time-structuring) → Part I Analysis of Games (ch.1-5) → Part II Thesaurus of Games, 36 games in 7 families (ch.6-12) → Part III Beyond Games (ch.13-18, autonomy).
- The "Why Don't You — Yes, But" formal analysis in section 6.2 (thesis/aim/roles/dynamics/paradigm/moves/advantages/antithesis, including the exact antithesis line) was verified **accurate, near-verbatim** — not invented.
- The crossed-transaction/Karpman's-options distinction in section 6.1 was verified **clean** — no conflation between the two authors.
- Two real games (Perversion, The Stocking Game, both ch.9) were missing from the thesaurus; added to concept #33.
- Not covered by the curriculum, deliberately: ch.13-15 (historical/cultural significance of games; Berne's Sulk/Jerk personality typology) — secondary to the thesaurus itself.

### Scripts People Live (Steiner, 1974)
Real structure: 5 sections, 28 chapters — TA Theory (1-2) → Script Analysis (3-12, incl. Stroke Economy ch.8, Rescue ch.11) → Relationships (13-17, sex-role scripts ch.13-14 **by Hogie Wyckoff**) → Therapy (18-24) → The Good Life (25-28).
- The five Stroke Economy rules are verbatim-accurate; only the chapter number was wrong (ch.8, not ch.9).
- "Winner/non-winner/loser" is TA Today's vocabulary, not Steiner's — his own terms are tragic/hamartic vs. banal (ch.6-7); both now credited in #52.
- The Rescue Triangle is explicitly Karpman's diagram in Steiner's own text, applied to family/therapy context — not an independent second framing, as the original curriculum implied.

### TA Today (Stewart & Joines)
Real structure confirmed from the book's own table of contents, 30 chapters in 7 parts (full list in the commit that applied these fixes). This is the book most heavily cited by the curriculum (~31 rows) and the one whose claimed "order" needed the most correction — see headline finding #1.
- Formula G and the Drama Triangle are both genuinely in ch.23, correctly credited to Berne and Karpman respectively — this one checked out as originally written.
- Discount Matrix error — see headline finding #3.
- Not covered by the curriculum, deliberately: ch.29-30 (TA in organizations/education; history of the TA movement) — outside a personal-relationships game's scope. Ch.24-25 ("Why People Play Games," "How to Deal with Games") are now cross-referenced as co-sources on concepts #27 and #29 rather than left as a hard gap.
