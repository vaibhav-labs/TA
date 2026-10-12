# TA Arena — Game-Based Learning Strategy (PWA)

Oct 11, 2026 · @AI

The four PDFs uploaded to Drive today are all Transactional Analysis (TA) texts, so the PWA is a TA mastery game: one curriculum, four source books, 42 games across 7 worlds, built so a first-timer and a practising coach both progress. Everything below is specified to the depth Claude Code needs to build without further design decisions.

## 1. Source library

The curriculum is scoped to the four TA books uploaded on 11 Oct 2026. (Drive also holds older non-TA PDFs — de Botton, graphic novels, coaching books — which are excluded; say the word if any should come in as a bonus world.)

| Book | Author, year | What it contributes to the game | Depth it goes to |
| --- | --- | --- | --- |
| [Transactional Analysis in Psychotherapy](https://drive.google.com/file/d/1-ECnmrjKHVgD9v-3PSNO4bOIFpeCT0NE/view?usp=drivesdk) | Eric Berne, 1961 | The foundations: ego states as real phenomena (Parent/Adult/Child), structural vs functional analysis, contamination and exclusion, the first account of transactions, games and scripts, group treatment, the nine-vector relationship diagram. | Deepest on *why* ego states exist (archaeopsyche, neopsyche, exteropsyche) and on diagnosing them. Not covered: ch.18 (marital-therapy technique) and ch.19 (regression-analysis psychodrama) — real content, but technique for trained clinicians, out of scope for a lay-facing game |
| [Games People Play](https://drive.google.com/file/d/19wCm15K29Vp9D-sjaNe9uxx-lCOEBWYd/view?usp=drivesdk) | Eric Berne, 1964 | Strokes and stimulus-hunger, the six ways of structuring time, complementary / crossed / ulterior transactions, the formal game analysis template (thesis, aim, roles, dynamics, paradigm, moves, 6 advantages, antithesis), the thesaurus of 36 named games in 7 families, degrees of games, and the three parts of autonomy (awareness, spontaneity, intimacy). | The game catalogue itself — every named game becomes a playable scenario. Not covered: ch.13-15 (the historical/cultural significance of games, Berne's Sulk/Jerk personality typology) — real content, but secondary to the thesaurus itself |
| [Scripts People Live](https://drive.google.com/file/d/1EVNKG3TD56GyHBfSMKLn-IIjVvJNZk6q/view?usp=drivesdk) | Claude Steiner, 1974 | Scripts as decisions made under injunction, the script matrix, banal scripts (Depression/Lovelessness, Madness/Mindlessness, Addiction/Joylessness), sex-role scripts (ch.13-14 written by Hogie Wyckoff), the Stroke Economy and its five rules, the Pig Parent (coined by Wyckoff), Rescue triangle (Steiner's application of Karpman's own triangle), cooperative contracts, permission/protection/potency. | Deepest on *how* scripts form. **Correction:** the book's class/gender/race critique is not a separable layer we exclude — it runs through roughly half the book (the banal scripts are explicitly assigned by race, class and gender in Steiner's own text) and the material the game *does* use (Pig Parent, Stroke Economy, Rescue) already carries it. We gamify the mechanics; we don't yet gamify the explicit political framing — that's a real scope choice, not a clean omission |
| [TA Today](https://drive.google.com/file/d/1-7VIJIpP-ahu5X3-9482qnn1uFcYCNW1/view?usp=drivesdk) | Ian Stewart & Vann Joines, 1987 (2nd ed. 2012) | The modern synthesis: functional model (CP/NP/A/FC/AC), egograms, the four behavioural / social / historical / phenomenological diagnoses, options (Karpman), the Drama Triangle, Formula G, rackets and the Racket System, stamps, discounting and the Discount Matrix, passivity, symbiosis, miniscript and drivers, life positions and the OK Corral, redecision, contracts, autonomy. | Broadest coverage; the thematic backbone for most of the curriculum. Not covered: ch.29-30 (TA in organizations/education, history of the TA movement) — out of scope for a personal-relationships game |

**How the four books map onto one curriculum.** Berne 1961 supplies the deep theory for Worlds 1–2. Games People Play supplies the scenarios for Worlds 3–4 and the autonomy endgame. Steiner supplies Worlds 5–6 (strokes as economy, scripts as decisions, the Rescue triangle) and the social-critique layer that keeps advanced players interested. TA Today supplies most of the concept citations and a rough thematic backbone — but **not** the world order: verified against the book's actual table of contents, TA Today's own sequence is ego-states → transactions → strokes → *scripts* → passivity → games (Parts II–VI), which teaches scripts before games, as a therapist-training text building full theory before technique. This game deliberately does the opposite — strokes first (World 1), games before scripts (Worlds 4 then 6) — because it's a discovery-learning sequence for lay players, not a clinical curriculum: start with the most emotionally accessible, least-jargon concept (everyone understands wanting attention), and land scripts late as the capstone reveal of *why* the games the player just learned keep happening. That's an intentional divergence from the source text's own order, not an oversight.

## 2. Design philosophy

The game teaches by making the player *do* TA, not read it: every level drops the player into a live transaction, asks for a diagnosis or a move, shows the consequence, then names the concept. Theory arrives after the experience, never before. This mirrors how Berne taught — observe the behaviour, then label the ego state.

**Three player levels, one path.** Every world is playable at three difficulties that change the *question*, not the scenario:

| Level | Who it is for | What a level asks | Scoring |
| --- | --- | --- | --- |
| Spot (L1) | Never heard of TA | Recognise: "Which ego state spoke?" "Was that a stroke?" 2–3 options, immediate feedback. | Right / wrong, 1 point |
| Play (L2) | Knows the basics, wants fluency | Intervene: "Pick the next line that keeps communication open" / "cross this transaction on purpose". 3–4 options, branching consequence. | Best / okay / game-move, 0–3 points |
| Analyse (L3) | Coach, counsellor, TA student | Explain: fill the formal analysis (aim, roles, paradigm, payoff, antithesis), name the injunction behind the script, design the contract. Free-text or multi-field, graded by rubric. | Rubric 0–5 per field |

A player picks a level at the start; the app recommends moving up when accuracy on a world passes 85 %, and down (quietly) when it falls under 50 %.

**The learning loop every level follows** (the engine, not the content):

1. Situation — a 3–8 line dialogue or inner monologue, named characters, stated setting.
2. Move — the player diagnoses, chooses a line, or fills an analysis.
3. Consequence — the scene plays one more beat showing what that move produced.
4. Lesson card — the concept, the book it comes from, one quotable definition, the common confusion.
5. Echo — 24–72 h later the same concept returns in a new situation (spaced retrieval, section 8).

**Why games, and why these games.** Berne's own word for the pathological patterns is "games", so the app leans into the pun: the player's job is to *stop* playing Berne's games by getting good at this one. Each of Berne's named games becomes a scenario the player must first recognise, then refuse (the antithesis), then explain. That gives the thesaurus of \~36 games a natural three-pass structure that maps exactly onto Spot / Play / Analyse.

**Design constraints agreed with you:**

- Visuals stay minimal: text, one colour accent, simple PAC stacked-circle diagrams drawn in CSS, no illustrations, no animation beyond a 150 ms fade.
- Depth over breadth per level: a single level teaches one concept and one confusion.
- Roundedness: every concept is met at least three times — once as recognition, once as a decision, once as explanation — and across at least two books' framings where they differ (e.g. Berne's Rescuer vs Steiner's Rescue triangle vs Karpman's Drama Triangle).

## 3. Concept map

Sixty-one concepts, in seven tiers, each tier a prerequisite for the next. Tier = World (section 4). Column "Confusion" is the misreading the level is built to catch — the thing a half-learned player gets wrong.

| # | Concept | Tier | Source | Confusion to catch |
| --- | --- | --- | --- | --- |
| 1 | Stimulus-hunger, recognition-hunger, structure-hunger | 1 | GPP intro | Thinking strokes are only praise |
| 2 | Stroke: unit of recognition; positive / negative, conditional / unconditional | 1 | GPP, TA Today ch.8 | A negative stroke is still a stroke; people prefer negative to none |
| 3 | Stroke filter and stroke quotient | 1 | TA Today | Discounting positives you don't believe |
| 4 | Stroke Economy and its five rules (don't give/ask/accept/reject/self-stroke) | 1 | Steiner ch.9 | Treating stroke scarcity as natural rather than learned |
| 5 | Six ways to structure time: withdrawal, ritual, pastime, activity, game, intimacy | 1 | GPP ch.2–4 | Confusing pastime with game (no payoff in a pastime) |
| 6 | Ritual stroke-count (the 8-stroke greeting) | 1 | GPP ch.3 | Ritual as empty — it is a precise stroke exchange |
| 7 | Ego state: coherent system of feelings + behaviours | 2 | Berne 1961, GPP ch.1 | Ego state ≠ role, ≠ Freud's superego/ego/id |
| 8 | Structural model: Parent (exteropsyche), Adult (neopsyche), Child (archaeopsyche) | 2 | Berne 1961 | Thinking Child = childish, Adult = mature |
| 9 | Functional model: Controlling Parent, Nurturing Parent, Adult, Free Child, Adapted Child | 2 | TA Today ch.2 | Mixing structural (content) and functional (process) |
| 10 | Positive and negative sides of each functional state | 2 | TA Today | Assuming Nurturing Parent is always good |
| 11 | Egogram | 2 | TA Today (Dusay) | Reading it as fixed personality |
| 12 | Four diagnoses: behavioural, social, historical, phenomenological | 2 | Berne 1961, TA Today ch.4 | Diagnosing from words alone |
| 13 | Contamination (Parent→Adult prejudice, Child→Adult delusion, double) | 2 | Berne 1961, TA Today ch.6 | Hearing contaminated Adult as real Adult |
| 14 | Exclusion (constant Parent / Adult / Child) | 2 | Berne 1961 | Confusing exclusion with preference |
| 15 | Second-order structure (P2 A2 C2 → P1 A1 C1, the "Little Professor") | 2 | TA Today ch.3, GPP | Treating the Child as only feeling, not also thinking |
| 16 | Transaction: stimulus + response | 3 | GPP ch.2 | Counting a single line as a transaction |
| 17 | Complementary transaction, rule 1 (communication continues indefinitely) | 3 | GPP ch.2 | Thinking complementary = healthy (P–C can be complementary and sick) |
| 18 | Crossed transaction, rule 2 (communication breaks; someone must shift) | 3 | GPP ch.2 | Thinking crossing is always bad — it is the main therapeutic tool |
| 19 | Ulterior transaction, rule 3 (outcome decided at psychological level); angular vs duplex | 3 | GPP ch.2 | Hearing only the social level |
| 20 | The nine vectors / relationship diagram | 3 | GPP ch.2 | — |
| 21 | Options: choosing a different ego state to break a lock (Karpman) | 3 | TA Today ch.7 | Believing you must answer in the state you were addressed |
| 22 | Nonverbal cues in diagnosis (voice, posture, vocabulary) | 3 | Berne 1961 | Diagnosing from content |
| 23 | Game: definition (ulterior + payoff), vs operation, manoeuvre | 4 | GPP ch.5 | Calling any conflict a game |
| 24 | Formula G: Con + Gimmick = Response → Switch → Crossup → Payoff | 4 | TA Today ch.23 (Berne 1972) | Missing that the Switch is the diagnostic moment |
| 25 | Drama Triangle: Persecutor, Rescuer, Victim; the switch between roles | 4 | TA Today ch.23 (Karpman) | Rescuer looks helpful — it is a role, not help |
| 26 | Formal game analysis template (thesis, aim, roles, dynamics, paradigm, moves, advantages, antithesis) | 4 | GPP ch.5 | — |
| 27 | Six advantages: internal/external psychological, internal/external social, biological, existential | 4 | GPP ch.5 | Seeing only the obvious gain |
| 28 | Degrees of games: 1st (social), 2nd (concealed), 3rd (tissue damage) | 4 | GPP ch.5 | — |
| 29 | Antithesis: refusing to play, undercutting the payoff; despair → laughter | 4 | GPP ch.5 | Antithesis as reprisal (that is winning the game, not ending it) |
| 30 | Life Games: Alcoholic, Debtor, Kick Me, NIGYSOB, See What You Made Me Do | 4 | GPP ch.6 | — |
| 31 | Marital Games: Corner, Courtroom, Frigid Woman/Man, Harried, If It Weren't For You, Look How Hard I've Tried, Sweetheart | 4 | GPP ch.7 | — |
| 32 | Party Games: Ain't It Awful, Blemish, Schlemiel, Why Don't You–Yes But | 4 | GPP ch.8 | YDYB as a request for help |
| 33 | Sexual / Underworld Games: Let's You and Him Fight, Rapo, Uproar, Cops and Robbers, Want Out, FOOJY | 4 | GPP ch.9–10 | — |
| 34 | Consulting Room Games: ITHY, Greenhouse, Indigence, Peasant, Psychiatry, Stupid, Wooden Leg | 4 | GPP ch.11 | — |
| 35 | Good Games: Busman's Holiday, Cavalier, Happy to Help, Homely Sage, They'll Be Glad They Knew Me | 4 | GPP ch.12 | Thinking all games are bad |
| 36 | Rackets and racket feelings vs authentic feelings (mad, sad, scared, glad) | 5 | TA Today ch.21 | A racket feeling feels real — the tell is that it never resolves anything |
| 37 | Trading stamps and the cash-in | 5 | TA Today ch.21 | — |
| 38 | Racket System (Erskine & Zalcman): beliefs → displays → reinforcing memories | 5 | TA Today ch.22 | — |
| 39 | Discounting: four levels (existence, significance, change possibility, personal ability) × three areas | 5 | TA Today ch.17–18 (Schiffs) | Grandiosity as the flip side of discounting |
| 40 | Discount Matrix | 5 | TA Today ch.18 | — |
| 41 | Four passive behaviours: doing nothing, over-adaptation, agitation, incapacitation/violence | 5 | TA Today ch.17 | Over-adaptation looks like cooperation |
| 42 | Symbiosis (healthy vs unhealthy), second-order symbiosis | 5 | TA Today ch.19, Berne 1961 | — |
| 43 | Frame of reference and redefining; tangential and blocking transactions | 5 | TA Today ch.20 | — |
| 44 | Life positions: I'm OK–You're OK and the other three; OK Corral (Ernst) | 6 | TA Today ch.12 | Position as a mood rather than a decision |
| 45 | Script: unconscious life plan decided in childhood, reinforced by parents, justified by events, culminating in a chosen alternative | 6 | Berne 1961/1972, Steiner ch.1–3 | Script as fate rather than decision |
| 46 | Script matrix: injunctions (from parents' Child), counter-injunctions (from parents' Parent), programme (from parents' Adult) | 6 | Steiner ch.4, TA Today ch.13 | — |
| 47 | The twelve Goulding injunctions (Don't Be, Don't Be You, Don't Be a Child, Don't Grow Up, Don't Make It, Don't, Don't Be Important, Don't Belong, Don't Be Close, Don't Be Well, Don't Think, Don't Feel) | 6 | TA Today ch.13 | Hearing injunctions as spoken sentences — they are mostly nonverbal |
| 48 | Attributions and counter-injunctions; permissions | 6 | Steiner ch.4, TA Today | — |
| 49 | Early decisions and redecision | 6 | TA Today ch.14, 27 | — |
| 50 | Script process: Until, After, Never, Always, Almost, Open-ended (Kahler) | 6 | TA Today ch.15 | — |
| 51 | Miniscript and the five Drivers: Be Perfect, Please Others, Try Hard, Be Strong, Hurry Up | 6 | TA Today ch.16 | Drivers as virtues |
| 52 | Winner, non-winner (banal), loser scripts; hamartic scripts | 6 | Steiner ch.2, TA Today ch.11 | — |
| 53 | Steiner's three banal scripts: Lovelessness, Mindlessness, Joylessness | 6 | Steiner Part 2 | — |
| 54 | Sex-role scripts (Steiner's male/female banal scripts) | 6 | Steiner ch.12–13 | — |
| 55 | The Pig Parent / Critical Parent as internalised oppression | 6 | Steiner ch.7 | — |
| 56 | Script signals, script payoff, the "sweatshirt" | 6 | GPP ch.14–15, TA Today | — |
| 57 | The Rescue triangle and the three rules of Rescue (do more than 50 %, do what you don't want to, don't ask) | 7 | Steiner ch.10 | Help vs Rescue |
| 58 | Contracts: Berne's four requirements, Steiner's cooperative contract, Adult-to-Adult goal setting | 7 | Berne 1961, Steiner, TA Today ch.26 | — |
| 59 | Permission, Protection, Potency (the 3 P's) | 7 | Steiner, TA Today ch.28 | — |
| 60 | Autonomy: awareness, spontaneity, intimacy | 7 | GPP ch.16–17 | Spontaneity as impulsiveness |
| 61 | Intimacy as game-free candid exchange; "After games, what?" | 7 | GPP ch.18 | — |

**Coverage check (independently verified against the actual books, not just this summary — see `docs/AUDIT.md`).** Every chapter with content appropriate for a lay-facing game is represented. What's genuinely dropped, and why: Berne 1961's clinical case appendices (case material, not teachable concepts) and ch.18-19 (marital-therapy and regression-analysis technique — real content, but clinician technique, not a confusion a lay player needs to catch); GPP ch.13-15 (the historical/cultural significance of games and Berne's Sulk/Jerk typology — secondary to the thesaurus itself, which is fully covered); TA Today ch.29-30 (TA in organizations/education, history of the movement — outside a personal-relationships game's scope). Steiner's social critique is **not** cleanly dropped — see the correction in section 1; it's woven through material the game already uses, just not gamified as explicit politics.

## 4. The world map

Seven worlds, six games each, 42 games, played in order. Each world unlocks when the previous world's boss is beaten at the player's level. The order is the dependency order of the theory: you cannot diagnose a game (World 4) until you can read a transaction (World 3), which needs ego states (World 2), which only matter once you feel why people transact at all (World 1). Scripts (World 6) come late because they are the *reason* for the games, and the reason only lands after the player has caught themselves playing a few.

| World | Theme | What the player can do after it | Boss |
| --- | --- | --- | --- |
| 1 Hunger | Strokes and time | Explain why a person keeps a bad relationship, count strokes in a greeting, spot a pastime | The Stroke Economy |
| 2 Three Voices | Ego states | Diagnose P/A/C from voice, words, posture; tell contamination from Adult | The Contaminated Adult |
| 3 Vectors | Transactions | Keep a conversation open, cross one on purpose, hear the ulterior level | The Salesman (angular transaction) |
| 4 The Thesaurus | Games | Name the game from the switch, refuse to play, write the full analysis | Why Don't You–Yes But (many-handed) |
| 5 Underneath | Rackets, discounts, passivity | Tell racket from real feeling, find the discount level, spot over-adaptation | The Discount Matrix |
| 6 The Plan | Scripts | Draw a script matrix from a life story, hear a driver, name the injunction | The Script Matrix |
| 7 Autonomy | Contracts, permission, intimacy | Write a contract, give permission, decline a Rescue, sustain a game-free exchange | After Games, What? |

### World 1 — Hunger (strokes and time structuring)

| # | Game | Mechanic (sec. 5) | Concepts | Plays like |
| --- | --- | --- | --- | --- |
| 1.1 | Spinal Cord | Choice-story | 1 | Spitz's infants, Levine's rats: the player runs a week with zero recognition and watches a mood meter fall; lesson: stroke hunger is biological |
| 1.2 | Stroke Sorter | Sort-it | 2, 3 | Lines fly in; drag each to positive/negative × conditional/unconditional; the twist round: "which of these would you *accept*?" (filter) |
| 1.3 | Hi–Hi | Counter | 6 | Mr C returns from vacation; the player builds the greeting to pay the \~30 strokes owed; too few = offence, too many = "is he selling insurance?" |
| 1.4 | The Party | Floor-plan | 5 | Six corners of a cocktail party; identify each as ritual / pastime / activity / game / intimacy / withdrawal from 3 lines of overheard talk |
| 1.5 | PTA Three Ways | Choice-story | 5, 7 (preview) | Same pastime at P–P ("Juvenile Delinquency"), A–A ("PTA"), C–C levels; player matches the level |
| 1.6 | **Boss: The Stroke Economy** | Rule-breaker | 4 | Steiner's five rules are the "laws" of a town; the player must break each one in a scene and feel the pushback; L3 argues why the rules exist (who benefits) |

### World 2 — Three Voices (ego states)

| # | Game | Mechanic | Concepts | Plays like |
| --- | --- | --- | --- | --- |
| 2.1 | Who Said That | Diagnose | 7, 8 | A line, a tone, a posture: Parent, Adult or Child? Starts with easy archetypes, ends with mixed cues |
| 2.2 | Five Faces | Diagnose | 9, 10 | Functional model: CP / NP / A / FC / AC, each with a + and − side; the hard round shows negative NP (smothering) and positive CP (firm boundary) |
| 2.3 | Egogram | Build | 11 | Player draws their own egogram, then one for a character from a 10-line monologue; compares |
| 2.4 | Four Ways to Know | Diagnose | 12, 22 | Same ego-state call made from behaviour, from how others respond, from history, from the character's own sense; player must get 2 of 4 to agree |
| 2.5 | Little Professor | Choice-story | 15 | Second-order structure: Mike (age 3) at the dinner table from GPP; player plays the father and decides whether to break the game *in statu nascendi* |
| 2.6 | **Boss: The Contaminated Adult** | Spot-the-leak | 13, 14 | Ten "Adult" statements; some are Parent prejudice, some Child delusion, some double; L3 also flags exclusion |

### World 3 — Vectors (transactions)

| # | Game | Mechanic | Concepts | Plays like |
| --- | --- | --- | --- | --- |
| 3.1 | Draw the Arrow | Vector | 16, 17, 20 | Two PAC stacks; player drags stimulus and response arrows; checks complementarity |
| 3.2 | Keep It Going | Choice-story | 17 | Pick the response that keeps a complementary chain alive for 6 turns — including an unhealthy P–C chain, to make the point |
| 3.3 | Cross It | Choice-story | 18, 21 | A Child-to-Parent whine arrives; player must cross it to reach Adult–Adult without starting Uproar; Karpman's options as the menu |
| 3.4 | Why Did You Do That? | Replay | 18 | Berne's own group-therapy scene (ch.9, Figs. 7-8): Camellia and Rosita give the real Type I crossing, Mr. Troy gives the real Type II; player reproduces both |
| 3.5 | The Barn | Two-track | 19 | Duplex transaction: the player writes both the social line and the psychological line for each turn of the cowboy scene |
| 3.6 | **Boss: The Salesman** | Two-track | 19 | Angular transaction: "This one is better, but you can't afford it." Player must respond from Adult at both levels three times in a row |

### World 4 — The Thesaurus (games)

| # | Game | Mechanic | Concepts | Plays like |
| --- | --- | --- | --- | --- |
| 4.1 | Is It a Game? | Diagnose | 23 | Pastime, operation, manoeuvre or game? The tell: a payoff after a switch |
| 4.2 | Formula G | Sequence | 24, 25 | Scenes cut into 6 cards (Con, Gimmick, Response, Switch, Crossup, Payoff); order them; then tag which Drama Triangle role each player holds before and after the Switch |
| 4.3 | Life Games | Choice-story | 30, 27, 28 | Alcoholic (5-handed: player cycles through Persecutor, Rescuer, Patsy, Connection), Debtor, Kick Me, NIGYSOB, SWYMD; each with the 6 advantages to fill at L3 |
| 4.4 | Home Games | Choice-story | 31, 29 | Corner, Courtroom, Harried, IWFY, LHHIT, Sweetheart; player must find the antithesis (e.g. "Yes, honey!" for Sweetheart; third-person ban for Courtroom) |
| 4.5 | Room Games | Choice-story | 32–35 | Party, consulting-room, underworld and Good games; the Good-games round asks "what makes this one good?" |
| 4.6 | **Boss: Why Don't You–Yes But** | Many-handed | 32, 29 | The player is Black in a group of five; every suggestion gets a "Yes, but"; the only win is anti-ITHY: "That's a difficult problem. What are you going to do about it?" L3 writes the full GPP analysis |

### World 5 — Underneath (rackets, discounts, passivity)

| # | Game | Mechanic | Concepts | Plays like |
| --- | --- | --- | --- | --- |
| 5.1 | Real or Racket | Diagnose | 36 | Feeling shown; is it authentic (resolves the situation) or racket (substitutes, never resolves)? |
| 5.2 | Stamp Book | Collect | 37 | Player watches a character collect grievances for a week and chooses the cash-in; lesson: stamps are the licence for the script payoff |
| 5.3 | Four Levels | Ladder | 39, 40 | A problem statement; player climbs the Discount Matrix: is the existence, significance, changeability or personal ability being discounted? |
| 5.4 | Doing Nothing | Diagnose | 41 | Four passive behaviours shown in an office; over-adaptation is the trap level |
| 5.5 | Two Halves | Choice-story | 42 | A symbiosis: one person carries Parent+Adult, the other Child; player must find the move that lets both use all three |
| 5.6 | **Boss: The Discount Matrix** | Ladder | 39–43 | A six-scene conversation with redefinitions; player must name the discount level and the tangential/blocking move at each turn |

### World 6 — The Plan (scripts)

| # | Game | Mechanic | Concepts | Plays like |
| --- | --- | --- | --- | --- |
| 6.1 | OK Corral | Quadrant | 44 | Place 12 inner statements on the OK Corral; then track one character's position across a day |
| 6.2 | Hear the Driver | Diagnose | 51 | 5-second behaviour clips in text; name the driver from the words/gestures Kahler listed |
| 6.3 | Don't | Diagnose | 47, 48 | Childhood scenes, mostly nonverbal; name the injunction a child would decode; then the permission that counters it |
| 6.4 | Three Banal Scripts | Choice-story | 53, 54, 55 | Steiner's Lovelessness, Mindlessness, Joylessness — play a day in each; the Pig Parent narrates |
| 6.5 | Script Process | Match | 50, 52 | Until / After / Never / Always / Almost / Open-ended: match six life stories, then spot the player's own |
| 6.6 | **Boss: The Script Matrix** | Build | 45, 46, 49, 56 | From a 25-line life story, drag injunctions, counter-injunctions and programme onto the matrix; L3 names the early decision and proposes a redecision |

### World 7 — Autonomy (contracts, permission, intimacy)

| # | Game | Mechanic | Concepts | Plays like |
| --- | --- | --- | --- | --- |
| 7.1 | Help or Rescue | Diagnose | 57 | Steiner's three Rescue rules; the player sorts 12 helping acts |
| 7.2 | The Contract | Build | 58 | Write a contract with a character; validator checks Berne's four requirements and Steiner's cooperative-contract clauses |
| 7.3 | Three P's | Choice-story | 59 | Give permission only with protection and potency behind it; giving permission without protection fails the level |
| 7.4 | Despair to Laughter | Replay | 29 | A game is refused; the player must hold the antithesis through the other player's escalation until "There I go again!" |
| 7.5 | Awareness / Spontaneity / Intimacy | Choice-story | 60 | Three scenes (eating an orange, a crossed conversation, a candid one); player chooses the autonomous move, not the scripted one |
| 7.6 | **Boss: After Games, What?** | Open | 61 | Six-turn candid exchange with a character who keeps offering game openings; sustain intimacy without rescuing, persecuting or withdrawing; L3 writes a reflection graded by rubric |

**Side quests (optional, unlock at World 4+):** a "Game of the Day" drawn from the thesaurus; "Colloquialisms" — match Berne's phrases ("waiting for Santa Claus", "rigor mortis", "sweatshirt") to meanings; "Book Trail" — a reading map that shows which chapter each completed level came from.

## 5. Game mechanics catalogue

Twelve reusable engines cover all 42 games, so Claude Code builds twelve components and the rest is JSON content. Each engine is a React component that takes a `level` object (schema in section 10) and emits a `result` (score, choices, time).

| Engine | Input shape | Player action | Scoring | Used by |
| --- | --- | --- | --- | --- |
| Diagnose | One stimulus (text + optional tone/posture tags), 2–5 options, one correct, per-option feedback | Tap an option | Correct = 1; at L3 a second field "why" graded by keyword rubric | 2.1, 2.2, 2.4, 4.1, 5.1, 5.4, 6.2, 6.3, 7.1 |
| Choice-story | Scene of 3–8 beats; at each beat 2–4 lines the player can say; each line has an `outcome` beat and a `tag` (best / ok / game-move) | Tap a line, read the consequence, continue | Sum of tags; a game-move ends the scene early with its payoff shown | 1.1, 1.5, 2.5, 3.2, 3.3, 4.3, 4.4, 4.5, 5.5, 6.4, 7.3, 7.5 |
| Sort-it | 8–16 items, 2–4 bins (or a 2×2) | Drag or tap-to-assign | Per-item correct; a timer only at L1 for pace | 1.2, 6.1 (quadrant variant) |
| Counter | A target number (strokes owed), a palette of lines each worth N | Build a sequence until the meter hits the band | Within ±2 of target = full; under = "offended", over = "selling insurance" | 1.3 |
| Floor-plan | 6 labelled zones, each with 3 lines of talk | Tap a zone, assign a time-structure type | Per-zone | 1.4 |
| Rule-breaker | A list of rules; scenes where each rule can be broken | Choose the rule-breaking line, read the social pushback | Each rule broken once = pass; L3 writes who benefits from the rule | 1.6 |
| Build (egogram / matrix / contract) | A template with slots; a source text; a bank of draggable items | Fill the slots | Validator function per template (egogram: five bars sum check; matrix: each item in its correct row; contract: four Berne requirements present) | 2.3, 6.6, 7.2 |
| Spot-the-leak | 8–12 statements; some contaminated | Flag each as Adult / Parent-leak / Child-leak / double / exclusion | Per-statement; penalty for over-flagging to teach that real Adult exists | 2.6 |
| Vector | Two PAC stacks side by side; draggable arrow endpoints | Draw stimulus then response | Geometric check: parallel = complementary, crossed = crossed | 3.1 |
| Replay | A canonical scene from a book that the player must reproduce or steer to a named end state | Choose lines | End state reached = pass | 3.4, 7.4 |
| Two-track | Each turn has a social line and a psychological line; the player writes or selects both | Select for L1/L2, free-text for L3 | Both tracks correct; L3 free text graded by rubric of required ego-state words | 3.5, 3.6 |
| Sequence / Ladder / Match / Collect / Many-handed / Open | Variants of Diagnose and Choice-story with a different board: cards to order (4.2), a 4-rung ladder (5.3, 5.6), six-to-six matching (6.5), a stamp album that fills (5.2), a 5-NPC ring where each NPC responds to the player's line (4.6), a free dialogue with an LLM-graded rubric (7.6, L3 only) | Per board | Per board | as listed |

**NPC behaviour** is scripted, not generated, except in 7.6 (L3) where the Anthropic API in the artifact may run the counterpart; everything else is deterministic so levels are testable.

**Universal controls:** a Lesson button (opens the lesson card early, costs nothing), a Book button (shows the chapter the level comes from, with a one-line quote under 15 words), Replay, and a Why button after any wrong answer that shows the correct ego-state reading of the moment.

## 6. Live situations — worked examples

Four fully specified levels, one per engine family, at all three difficulties. These are the templates the remaining 38 follow; Claude Code should build these four first and run the rest off the same shape. Characters are original (no real people); settings are Indian urban workplace and home, which the player base will recognise, with one Berne-original replay for fidelity.

### 6.1 Level 3.3 — "Cross It" (Choice-story, World 3)

**Setting.** Monday, 9:40. Priya (team lead) and Arjun (developer) at a standing desk. The release slipped on Friday.

**Beat 1 (stimulus).** Arjun, not looking up: "You're always on my case. Nothing I do is ever enough for you."

*Diagnosis shown at L1 only:* Child → Parent, said with a flat voice and hunched shoulders (Adapted Child).

**L1 question.** Which ego state is Arjun speaking from? \[Parent / Adult / Child\] → Child. Lesson card: the words "always" and "never", the flat tone, the hunch are Child cues; the *content* (a complaint about standards) could sound Parental — diagnose from cues, not content.

**L2 question.** Priya wants Adult–Adult. Which line crosses Arjun's transaction without starting Uproar?

- A. "Don't take that tone with me." → tag: game-move. Outcome beat: Arjun: "See? Exactly." Door-slam energy. The scene ends; lesson: Parent → Child is *complementary* to his opening, so it continues the fight — complementary is not the same as healthy.
- B. "I'm not on your case, I just want the release to ship." → tag: ok. Outcome: Arjun shrugs; 40 % chance (fixed by seed) he stays in Child: "Sure. Whatever." Lesson: Adult words, but the "I just" is defensive; the cross is weak because the psychological level still answers his accusation.
- C. "Something's off this morning. What happened on Friday from where you sat?" → tag: best. Outcome: pause; Arjun looks up: "The API spec changed Thursday night and nobody told us." Adult–Adult established. Lesson: a *crossed* transaction (Adult → Adult in reply to Child → Parent) breaks the loop; Berne's rule 2 — communication stops until someone shifts; Karpman's options — you may answer from any state, not the one addressed.
- D. "Hey, it's okay, I know you're trying." → tag: ok. Outcome: Arjun softens but stays small: "Thanks… I'll try harder." Lesson: Nurturing Parent → Child is comforting and keeps him in Child; useful once, costly as a pattern (sets up Look How Hard I've Tried).

**L3 question.** Free-text, two fields: (1) draw the vectors for Arjun's opening and for option C (vector engine embedded), (2) in under 60 words, why is option D a *complementary* transaction and why is that the problem? Rubric keywords: Nurturing Parent, Child, complementary, continues, dependency / symbiosis.

**Echo (section 8).** 48 h later: a WhatsApp message from a sibling, "You never call," with the same four-option shape.

### 6.2 Level 4.6 — Boss "Why Don't You–Yes But" (Many-handed, World 4)

**Setting.** Five-person book-club chat. Meera: "My husband insists on fixing everything himself and nothing ever works." The other four NPCs each offer a Why-don't-you; Meera answers each with Yes-but. The player is the fifth voice.

**NPC script (fixed).** Round 1: Dev: "Why doesn't he take a course?" Meera: "Yes, but he has no time." Round 2: Sana: "Why don't you buy him proper tools?" Meera: "Yes, but he wouldn't know how to use them." Round 3: Rohan: "Why not just hire someone?" Meera: "Yes, but that costs too much." Round 4: Kavya: "Why don't you accept it the way it is?" Meera: "Yes, but the shelf might fall." Then silence (the payoff). Round 5: the player.

**L1.** After round 4 the chat goes quiet. What just happened? \[Meera got no useful advice / Meera won / Everyone gave up\] → "Meera won" and "Everyone gave up" both accepted; lesson: the silence *is* the payoff — it proves the others inadequate. Then: at which level were the others speaking — social or psychological? Social Adult ("Why don't you…"), psychological Parent ("I can make you grateful for my help").

**L2.** You are the fifth voice. Choose your line:

- A. "Why don't you do it yourself, then?" → game-move: Meera: "Yes, but then he'd sulk." You have joined the game as a fifth Parent.
- B. "Have you actually tried any of these?" → ok: Meera: "All of them, actually." The game is exposed but not ended; she restarts with a new problem.
- C. "That is a difficult problem. What are you going to do about it?" → best: a crossed transaction, Adult → Adult, declining the Parent role (anti-ITHY). Meera, after a beat: "I don't know. Maybe I'm not asking for solutions." Lesson: Berne's antithesis — do not play I'm Only Trying to Help You; the Adult question hands the problem back.
- D. "Men, honestly." → game-move: switches the group into the pastime "PTA — Delinquent Husband type" (Green's move in Berne's own paradigm). Lesson: a pastime is a softer landing than a game but still avoids Meera.

**L3.** Fill the GPP formal analysis for YDYB with the template fields; graded against Berne's own: Thesis ("See if you can present a solution I can't find fault with"), Aim (reassurance), Roles (helpless person, advisers), Dynamics (surrender conflict), Social paradigm (A–A), Psychological paradigm (P–C), Moves (problem–solution; objection–solution; objection–disconcertion), six advantages, Existential position ("Everybody wants to dominate me"), Antithesis (anti-ITHY). Each field 0–5 by keyword rubric; the Advantages field needs 4 of 6.

### 6.3 Level 5.3 — "Four Levels" (Ladder, World 5)

**Setting.** Statement from a colleague, Farhan, on a late project: "It's fine. Clients always push back. There's nothing anyone could do differently. And honestly it's not my area."

**Board.** A four-rung ladder: Existence → Significance → Change possibility → Personal ability. The player places each sentence on its rung.

- "It's fine" → discounts the existence of the problem (T1).
- "Clients always push back" → discounts its significance (T2).
- "Nothing anyone could do" → discounts the possibility of change (T3).
- "Not my area" → discounts personal ability (T4).

**L1** places four sentences. **L2** adds the Discount Matrix's diagonal: which *earlier* rung must also be discounted if T3 is? (T2 of options and T1 of abilities — the matrix's diagonal rule.) **L3** writes the Adult response that confronts the lowest-rung discount first and states why starting lower fails (confronting ability while existence is discounted has no purchase).

**Consequence beat.** If the player confronts "not my area" first, Farhan: "I told you, it's fine." If the player starts at existence ("The client has escalated twice; that's a real problem for us"), Farhan: "…okay, yes, it is." The ladder lights up rung by rung as he stops discounting.

### 6.4 Level 6.6 — Boss "The Script Matrix" (Build, World 6)

**Source text (25 lines, abridged here).** Nisha, 38, head of operations. Father: engineer, admired for working late, said "Jains don't quit." Mother: anxious, praised Nisha for being "no trouble", went quiet for days when Nisha cried. Nisha was top of class, never asked for help, married at 30 a man who "needs managing", has had two burnouts, says "I'll rest once this quarter closes", and is proud she has "never let anyone down".

**Board.** Steiner/TA Today script matrix: three arrows from each parent (Parent → counter-injunction, Adult → programme, Child → injunction) into Nisha's P, A, C. A bank of 14 draggable cards, 9 correct, 5 distractors.

**Correct placements.** Counter-injunctions (from parents' Parent): "Be Strong", "Be Perfect", "Don't quit". Programme (from parents' Adult): "Here's how to work late and be admired." Injunctions (from parents' Child, mostly nonverbal): "Don't feel" (mother goes quiet when she cries), "Don't ask / Don't be a child", "Don't be close" (manageable husband). Drivers: Be Strong, Try Hard. Script process: Until ("I'll rest once…").

**L1** places only the three driver cards and the process type. **L2** places all nine and names the life position (I'm OK–You're not OK, masked as I'm OK–You're OK). **L3** adds two free-text fields: the early decision ("I'll be no trouble and I'll never need anyone") and a redecision that a Nisha in treatment could make, plus the permission a therapist/coach would need to give and the protection required to make it safe. Rubric: names a Goulding injunction, states decision in the child's first person, redecision is present-tense and concrete, protection is specific.

**Consequence beat.** The matrix animates (150 ms fade) into Nisha's "sweatshirt": front "I've got it handled", back "Don't ask me how I am". Lesson card: Berne's sweatshirt, Steiner on scripts as decisions not fate, the Gouldings on redecision.

### 6.5 Replay for fidelity — Level 3.4 "Why Did You Do That?"

**Correction (verified against the actual book, ch.9 "Analysis of Transactions," pp.90-95, Figures 7-8):** the original draft of this level invented a "cuff links" scene and wrongly labeled it "Berne's own text, unchanged" — no such scene exists in Berne 1961. Replaced below with the book's real example, read directly from the source pages.

**Setting (real, Berne's own, Fig. 7).** Dr. Q runs a weekly therapy group of housewives: Daphne, Lily, and Rosita (there from the start, most sophisticated); Hyacinth, Holly, and Camellia (joined later, less so); Cicely.

**Type I crossed transaction (real, Fig. 8a-b).** Camellia announces to the group that she told her husband she wasn't going to sleep with him anymore and he could find someone else. Rosita asks, Adult to Adult: *"Why did you do that?"* Camellia bursts into tears: *"I try so hard and then you criticize me."* Berne's own reading: Rosita's question was a straight Adult-to-Adult stimulus, but Camellia misheard it as a Parent criticizing her Child, and answered from Child to an imagined Parent — the crossed transaction that broke the exchange. The player must reproduce Camellia's actual crossed reply, then correctly diagram it on Figure 8b (stimulus Adult→Adult, response Child→Parent).

**Type II crossed transaction (real, Fig. 8c).** The reciprocal case: a stimulus aimed at someone's Adult gets answered from their Parent instead. Berne's own example: anyone who "asked Mr. Troy a rational question, expecting a judicious answer, might be disconcerted to find himself being treated to a set of dogmatic, ill-considered prejudices, as though he were a backward child in need of correction." The player reproduces Mr. Troy's Parent-voiced reply to a plain Adult question.

Lesson card quotes Berne's own line that this kind of crossing "may be said to be the chief problem of psychoanalytic technique" (p.94) and names transference / counter-transference as the clinical versions of the same pattern.

## 7. Lessons and debrief design

Every level ends on a lesson card with the same five fields, in the same order, so the player learns to read the card in ten seconds. Depth is added by *expanding* the card, never by lengthening the default view.

| Field | Length | Rule |
| --- | --- | --- |
| Name | ≤ 5 words | The concept exactly as the books name it ("Crossed transaction", not "conflict") |
| One line | ≤ 25 words | A definition in the app's own words; no jargon the player hasn't met |
| What you did | ≤ 40 words | Replays the player's own choice in ego-state terms ("You answered his Child from your Nurturing Parent, which kept him small") |
| The confusion | ≤ 30 words | The misreading from the concept map, stated as "People often think X; the tell is Y" |
| From the book | 1 citation | Book, chapter, and a quote under 15 words; tapping opens the Book Trail entry |

**Expand** reveals: the formal definition (quoted sparingly), a second example from a *different* book's framing where one exists (e.g. Berne's Rescuer in Alcoholic vs Steiner's Rescue rules vs Karpman's Drama Triangle), and "Try this today" — one real-life observation task ("Count the strokes in your next greeting").

**World debriefs** (after each boss) are different: a three-screen reflection, not a card.

1. The map of the world's concepts with the player's accuracy per concept, weakest first.
2. "Your pattern": the ego state the player defaulted to across the world's choice-stories (most-chosen tag), shown as a one-line observation without judgement ("In 7 of 12 scenes you answered from Nurturing Parent"). This is the app's egogram of the player, built from play, and it is the single most valuable output of the whole game.
3. One free-text prompt saved to the journal: "Where did you see this game this week?"

**Wrong-answer handling.** A wrong answer never says "wrong". It plays the consequence, then the Why button shows the ego-state reading. This is deliberate: the app must not play Critical Parent, or it teaches the opposite of what it says.

**Lesson voice.** Second person, present tense, plain. No "great job", no exclamation marks: unconditional positive strokes are given by progress, not by copy. Berne's colloquialisms are kept where they are sharper than the formal term — the card shows both ("Pig Parent / Critical Parent").

## 8. Progression, scoring, mastery and spaced retrieval

Mastery is tracked per concept (61 of them), not per level, so a player can finish the game with a map of exactly which ideas hold and which don't.

**Per-concept mastery score** (0–100), updated after every level that touches the concept:

```latex
M_{t+1} = M_t + k \cdot (s - M_t), \quad k = 0.35 \text{ (L1)}, 0.5 \text{ (L2)}, 0.6 \text{ (L3)}
```

where *s* is the level score normalised to 0–100. Higher levels move the score faster because they are harder evidence. A concept is "held" at M ≥ 80 after at least one Play-level and one Analyse-level touch; "seen" at M ≥ 50; otherwise "open".

**Unlocks.** A world unlocks when the previous boss is passed (≥ 70 % at the player's level). Within a world, levels are open in order but the player may replay any. Bosses require ≥ 60 % average on the world's first five levels.

**Level recommendation.** After each world: average accuracy ≥ 85 % → prompt "Play this world again at the next level?" (one tap, optional). < 50 % → the next world opens one level down, with no message; the player can set it back in settings.

**Echoes (spaced retrieval).** Each concept has a bank of 3–6 short "echo" items (Diagnose engine, 20 seconds). Scheduling is a plain Leitner box with intervals of 1, 3, 7, 14, 30 days; a miss resets to 1 day. Echoes appear as a "Today" stack on the home screen, capped at 8 per day, oldest-due first. Echoes use *new* situations, not the ones the concept was learned in, so recognition transfers.

**Scoring display.** One number only on the home screen: Concepts held / 61. Points, streaks and badges exist in the data model but are shown only on the profile page, because the content is about recognising stroke-hunger and the app should not run a stroke economy on its own players. The one exception: a quiet "Game-free streak" counter — consecutive choice-story scenes with no game-move chosen.

**Completion.** The game is "complete" when all 61 concepts are held and all seven bosses are passed at Analyse level. A player at Spot level can finish every world; the app then says plainly that the Analyse pass exists and what it adds, and leaves the choice.

**Player egogram.** Built from every choice-story tag: which functional ego state the chosen line came from. Recomputed after each world; shown on the profile and at world debriefs. Stored as five integers that sum to 100.

## 9. Visual and brand spec

Three colours, one typeface, no photographic illustration. The look is Snapchat's: electric yellow on black, white for text surfaces, nothing else. The restraint is the point — the yellow marks the one thing to act on.

**Revision (build, phase 1):** "no illustrations" turned out to cost the game its game-ness — early playtesting read it as a quiz form, not a scene. The fix keeps the restraint but adds one thing: a parametric, authored-SVG character avatar per named NPC, drawn in the same black/white/grey/yellow language (no skin-tone colour, no photos, no emoji) with 2-3 expression states (neutral / tense / open) driven by the beat's cues. Every scene also now states who the player is playing as ("You're playing as Priya, the team lead") — the game never named the player's role before this. See `src/ui/Avatar.tsx`, `src/content/characters.ts`, `src/ui/Dialogue.tsx`.

| Token | Value | Use |
| --- | --- | --- |
| `--yellow` | #FFFC00 | Primary action, selected option, progress, the active ego-state circle |
| `--black` | #000000 | Default background, body text on yellow/white |
| `--white` | #FFFFFF | Cards (lesson card, dialogue bubbles), text on black |
| `--grey` | #8E8E93 | Secondary text, disabled, untouched ego-state circles |
| `--red` | #FF3B30 | Only for a game-move consequence (the Switch); never for "wrong" |

**Type.** One family: Inter (fallback: system-ui). Three sizes only: 28/32 bold for scene titles and boss names, 17/24 regular for dialogue, 13/18 for labels and citations. Dialogue is set as a chat column: NPC lines left-aligned in white bubbles on black, player options as full-width black-text-on-yellow buttons.

**The only diagram.** The PAC stack: three circles, 44 px, vertically stacked, labelled P / A / C, drawn in CSS. Active state fills yellow; inactive is a 2 px grey ring. Two stacks side by side plus one or two 2 px lines between them is the entire transaction vector drawing. The Drama Triangle is three labelled points and three lines. The OK Corral is a 2×2 grid. The script matrix is three stacks (mother, father, child) and arrows.

**Icons (added, phase 1 revision).** One authored stroke-line icon per world (a visual pun on its concept: World 2's icon *is* the PAC stack; World 3 is a crossed transaction; etc. — see `src/ui/WorldIcon.tsx`), plus ✓ / × for correct/incorrect and ← for back. No other icons, no emoji standing in for icons, no photographic imagery.

**Motion.** 150 ms opacity fade on card change; option buttons go from yellow to black-on-white on selection; nothing else moves.

**Layout.** Mobile-first, single column, max-width 480 px centred on desktop. Safe-area padding top and bottom. Dark by default (black surfaces); a light option swaps to white surfaces with black text and keeps yellow as the accent — the yellow must never be used as a large background in light mode because black-on-yellow at paragraph length is tiring.

**Accessibility.** Yellow is never the only signal: selected options also get a ✓ and a 2 px black border; colour-blind safe since yellow/black/white has strong luminance contrast. Minimum 44 px tap targets. Contrast: white on black 21:1, black on yellow 19.5:1, grey on black 5.2:1 (labels only).

**App identity.** Name: TA Arena (working title). Icon: black rounded square, yellow "TA" in the 28 px weight, no ghost or other Snapchat mark — only the palette is borrowed, never the logo.

## 10. Technical spec for Claude Code

A static PWA, no backend, all content as JSON, all progress in IndexedDB. This keeps the build to one repo and one deploy, and the content editable without touching code.

**Stack.** Vite + React 18 + TypeScript; Tailwind with the five tokens above and nothing from the default palette; `vite-plugin-pwa` for the manifest and Workbox service worker (precache the shell and all content JSON, so the whole game works offline after first load); Dexie for IndexedDB; Zustand for session state; Vitest for engine unit tests. No router library — a `screen` field in state and a switch. Deploy to Netlify or GitHub Pages.

**Repo layout.**

```
src/
  engines/        # 12 components, one per engine in section 5
  screens/        # Home, World, Level, Lesson, Debrief, Profile, Journal, BookTrail
  state/          # store.ts (session), db.ts (Dexie), mastery.ts (section 8 maths)
  content/
    concepts.json # 61 rows of section 3
    worlds.json   # 7 worlds → 42 level ids
    levels/       # one file per level, e.g. 3-3-cross-it.json
    echoes/       # per concept, 3–6 items
    lessons/      # per concept, the 5-field card + expand
  ui/             # Button, Card, PacStack, Vector, Ladder, Matrix (CSS only)
tests/            # one spec per engine, content validator
```

**Level schema** (all engines share the envelope; `board` varies):

```json
{
  "id": "3-3",
  "title": "Cross It",
  "world": 3,
  "engine": "choice-story",
  "concepts": [18, 21],
  "source": { "book": "GPP", "chapter": 2, "quote": "communication is broken off when a crossed transaction occurs" },
  "setting": "Monday, 9:40. Priya and Arjun at a standing desk.",
  "levels": {
    "L1": { "question": "Which ego state is Arjun speaking from?", "options": [...], "answer": 2 },
    "L2": { "beats": [ { "npc": "...", "cues": ["flat", "hunched"], "options": [ { "text": "...", "tag": "best", "egoState": "A", "outcome": "...", "lesson": "..." } ] } ] },
    "L3": { "fields": [ { "type": "vector" }, { "type": "text", "maxWords": 60, "rubric": ["Nurturing Parent", "complementary", "continues"] } ] }
  },
  "echoAfterHours": 48
}
```

**Mastery and egogram** live in `mastery.ts` as pure functions over the result log, so they are unit-testable against section 8's formula. Progress table: `results(levelId, level, score, tags[], at)`; derived tables recomputed on load.

**Content validator** (runs in CI): every level references existing concept ids; every concept is touched by ≥ 1 level per difficulty and has ≥ 3 echoes; every choice-story beat has exactly one `best`; every quote ≤ 15 words; every option has an `egoState`.

**L3 free-text grading.** Default: keyword rubric (case-insensitive, synonyms listed per keyword), scored 0–5 by hits; no network. Optional: an "AI grader" toggle that sends the answer and rubric to the Anthropic API with the model's own rubric prompt and returns 0–5 plus one sentence; off by default, and the app must work with it off.

**PWA requirements.** Manifest with black background, yellow theme colour, 192/512 icons; installable on iOS Safari and Android Chrome; offline after first load; `viewport-fit=cover`; no analytics; export/import of the progress database as a JSON file from the profile page so the player can move devices.

**Performance budget.** First load ≤ 250 KB gzipped excluding content JSON; content lazy-loaded per world; Lighthouse PWA pass.

## 11. Build roadmap and content production

Five phases; a playable World 1–3 ships at the end of phase 2, so you can test the learning loop with real people before writing the other 24 levels. Content is the long pole — 42 levels × 3 difficulties × \~15 options is roughly 2,000 lines of dialogue — so it is written in parallel with the code from phase 2 on.

| Phase | Build (Claude Code) | Content (you + Claude) | Done when |
| --- | --- | --- | --- |
| 1 Shell | Vite/PWA scaffold, tokens, Button/Card/PacStack, store, Dexie, mastery.ts with tests, Home/World/Level/Lesson screens with placeholder JSON | concepts.json (61 rows) and worlds.json from sections 3–4; lessons for World 1–3 concepts | App installs, runs offline, navigates 7 worlds with stub levels |
| 2 Core engines | Diagnose, Choice-story, Sort-it, Counter, Floor-plan, Vector, Two-track, Rule-breaker, Spot-the-leak, Replay | All 18 levels of Worlds 1–3 at L1 and L2; L3 for the four worked examples in section 6 | Worlds 1–3 playable end to end; content validator green |
| 3 Depth | Build, Ladder, Sequence, Many-handed, Open; Debrief and Profile screens; player egogram; echoes scheduler | Worlds 4–5 at L1–L2; L3 for all bosses; echo banks for concepts 1–43 | Worlds 1–5 complete; echoes appear on Home |
| 4 Scripts & autonomy | Matrix and Contract builders; Journal; Book Trail; export/import; optional AI grader | Worlds 6–7 all levels; remaining L3s; remaining echoes; side quests | All 42 levels at three difficulties; validator green |
| 5 Polish | Lighthouse PWA pass, performance budget, accessibility audit, copy edit of every lesson card against the books | Playtest with 5 people at each level; rewrite any option more than 40 % of testers pick for the wrong reason | Release |

**Content production method** (how to write the other 38 levels fast and faithfully):

1. For each level, open the source chapter and pull: the definition, the book's own example, the antithesis if any, and the confusion from section 3.
2. Write the scene in an Indian urban setting with original characters, keeping the *structure* of the book's example (same moves, same switch) — fidelity is in the moves, not the names.
3. Write the `best` option first, then one `game-move` that reproduces the book's game, then two `ok` options that are plausible half-right answers.
4. Write the L1 question as recognition of the same moment, the L3 field as explanation of it.
5. Run the validator; play it at all three levels; cut any line a tester needs to read twice.

**Handoff to Claude Code.** Paste this document into the repo as `docs/STRATEGY.md`, then start with: "Build phase 1 from docs/STRATEGY.md section 10; use sections 3 and 4 for the JSON; use section 9 for tokens." Then "Build level 3-3 exactly as section 6.1" is the first content task, because it exercises Diagnose, Choice-story, Vector and the L3 rubric in one level.

**Open decisions for you**

- [x] Keep the working title TA Arena or rename
- [x] Include the non-TA PDFs (de Botton, Stoltzfus) as a bonus world later, or keep the scope to the four books
- [x] Ship with AI grading off (recommended) or on
- [x] Settings in Hindi/English, or English only for v1
