# Audit, cluster A (slots 1-1 to 1-6 and 2-1 to 2-6)

Books used: GPP = Games People Play (page numbers are the printed ones in `books/gpp.txt`). TAP = Transactional Analysis in Psychotherapy (OCR text, chapters only). SPL = Scripts People Live (printed pages come from its own index; the extract has no page numbers, so chapter and section name are given as well). TA Today (x-readtool) is readable to chapter 7 only; chapter 8 onward is checked against the contents page, and anything that lives only there is marked UNVERIFIABLE.

Verdicts: VERIFIED, CORRECTED, UNVERIFIABLE. Nothing is quoted from a book inside a game. All edits were made in place to the twelve `content/*.json` files; no other game was touched.

Decisions the lead should know about are collected under "Notes for the lead" at the end (2-4 design choice, the rebellion conflict between two books, wrong chapter numbers in the scripted source, one unresolved timeline problem).

## 1-1 Spinal Cord

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| bookTerm "Stroke": any act that shows someone has registered you, from a hello to a glare | VERIFIED | GPP Introduction, p. 5 (stroking means any act implying recognition of another's presence; the stroke is the unit of social action). SPL ch. 1, "Stimulus Hunger" (index pp. 36 to 37): a stroke is a unit of recognition, and "Go to hell" counts as much as "Hi". | None |
| bookSource "Games People Play, Introduction" | VERIFIED, extended | GPP Introduction, pp. 4 to 5; SPL ch. 1 | Added "Scripts People Live, ch. 1" |
| People need a steady supply to stay well, and a day without them drains you "the way a day without food does" (Analyse why, debrief) | VERIFIED | GPP Introduction, p. 4: stimulus-hunger parallels food hunger, deprivation leads to apathy and decline, "spinal cord will shrivel up". SPL ch. 8, "The Stroke Economy" (index pp. 110 to 114) repeats Berne's food comparison. | None |
| Cold nods still count ("Name?", Sam's nod to the cereal) | VERIFIED | GPP Introduction, p. 5: any social contact beats none, and Levine's rats did equally well on gentle handling and painful shocks. SPL ch. 1 (p. 37) and ch. 8 (pp. 106 to 107): negative strokes are life-supporting, people settle for them when they cannot get positive ones. | None |
| "Nothing at all" is a different case from a cold nod | VERIFIED | GPP ch. 3, p. 16: a "Hi" that gets no reply means no stroke came back. | None |
| Clara's nod is "for being", and "that is the kind people go without most" | UNVERIFIABLE (the doing/being split) and CORRECTED (the "go without most" claim) | The conditional/unconditional split is only on the TA Today ch. 8 contents page ("Kinds of strokes"); no readable book says which kind people go without most. | Removed the "go without most" sentence; the nod is now "for being there" |
| A worried question ("Did you eat?") and a complaint ("you're too thin") are nods | VERIFIED as a use of the definition (any act of recognition) | GPP Introduction, p. 5 | None |
| Reciprocity: a nod handed over tends to come back (new scene) | VERIFIED | GPP ch. 3, pp. 15 to 16 (Hi-Hi is an exchange; a "Hi" left unanswered draws "I gave him a stroke and he didn't give me one") | None needed |
| Play round had one item | CORRECTED (structure) | BRIEF.md: Play needs 2 to 3 items | Added a second scene, "Monday, 18:05, the way home": four beats (reception, Omar, Sam, Gran), three lines each, best/ok tags, meters start at 50, best-only path ends at 66. Scripted scene untouched. Play intro reworded to cover both scenes. |

## 1-2 Stroke Sorter

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| bookTerm "Stroke filter", and "the books call this the stroke filter" | UNVERIFIABLE (the term) | The term is not in GPP, SPL, TAP or TA Today chapters 1 to 7. The TA Today ch. 8 contents page lists "Kinds of strokes" and "Giving and taking strokes", not the term. The bible uses it. | Term kept. bookNote now says "TA writers call this a stroke filter" and points to Steiner's description of the same habit. |
| The habit itself: strokes have to soak in, and people reject them by a shrug, a denial, a quick thank you or an immediate return stroke | VERIFIED | SPL ch. 22, "Acceptance and Rejection of Strokes" (a stroke takes about five to fifteen seconds to be fully accepted; rejection shows in gestures, pauses, sighs, a speedy thank you; clear acceptance is a smile and silence). SPL ch. 8, rule 3 ("Don't accept strokes if you want them"). | bookNote rewritten around this |
| bookSource "TA Today, ch. 8" | CORRECTED (incomplete) | As above | "Scripts People Live, ch. 8 and 22; TA Today, ch. 8" |
| Warm and cold map to positive and negative | VERIFIED (plain-word mapping) | SPL ch. 8 (index pp. 106 to 107): strokes are positive or negative by whether they feel good or bad | None |
| "For doing" and "for being" as a second axis | UNVERIFIABLE | Only the TA Today ch. 8 contents ("Kinds of strokes"). SPL uses "unconditional" only about a mother's response (ch. 5). Standard TA theory, and the bible's own split. | Kept; ch. 8 stays in the source line |
| Naming the bounce is the fix | VERIFIED (substance) | SPL ch. 22: demystify stroke discounts and pinpoint the message behind them | None |
| Sort card "Nobody replied to your hi all" is a cold nod for being, and "silence can be a cold one" (debrief) | CORRECTED | GPP ch. 3, p. 16 and Introduction, p. 5: a stroke is an act of recognition, so an unanswered message is the absence of a stroke, not a cold one. It also clashed with 1-1, where "Nothing at all" is a separate option. | Card replaced by Daniel's flat "Oh. You're the new one." (cold, for being). Debrief now says a flat "Name?" is a cold nod. |
| "Most people live on the two for doing and go short on the two for being" | UNVERIFIABLE (the bible's gloss) | Not in the readable books | Reworded as "It is easy to live on the two for doing..." |
| Analyse why: "The bounce is the filter" | CORRECTED (book term in body text, week 1) | check_plain regime | Rewritten in plain words |
| Sort answers for the other eleven cards | VERIFIED against the definitions above | | None |

## 1-3 Hi-Hi

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| A ritual is a set, predictable exchange such as a greeting | VERIFIED | GPP ch. 3, pp. 14 to 16 (stereotyped series of simple complementary transactions; Parentally patterned, p. 16) | None |
| Each side works out, without saying so, how many nods it owes, and the sum rises with time apart | VERIFIED | GPP ch. 3, p. 15: "careful intuitive computations", four strokes owed at each meeting and not oftener than once a day, about thirty after a month's holiday | bookIdea and bookNote now state this, since the game depends on it |
| Target about 30, sample payment of 28 units (1, 2, 5, 7, 4, 4, 4, 1), band 26 to 34 | VERIFIED | GPP ch. 3, p. 15 (the Mr C and Mr D example) | None |
| A lone "Cool" means he is short-changed | VERIFIED | GPP ch. 3, p. 15 (Mr C is offended by a bare "Hi!") | None |
| Too many warm lines read as a pitch ("Okay, what do you want?") | VERIFIED | GPP ch. 3, pp. 15 to 16 (Mr E and Mr F: "Is he selling insurance?", "All he owes me is one stroke") | None |
| A second pass within minutes earns at most a nod | VERIFIED | GPP ch. 3, p. 15 (within half an hour they pass with the slightest nod or a perfunctory Hi-Hi) | None |
| bookSource "Games People Play, ch. 3" | VERIFIED | | None |
| The 1A landlady is called "Mum" in the stairwell scene, while the player's own Mum is the phone call in 1-1 | CORRECTED (cast) | GLOBAL-NAMES.md: Aai becomes Mum, or Gran where a scene already has a Mum. 1-1, 1-5 and 2-1 call her Gran. | All 12 occurrences changed to Gran |
| "after a week away", "all week" | CORRECTED (wording) and UNRESOLVED (story) | The book's 30 is for a month's absence. In the games Sam is home Monday (1-1) and Monday night (1-2) and is back Wednesday 8:00. | Removed "a week" and "all week". The timeline conflict is listed under Notes for the lead. |

## 1-4 The Party

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| Six ways to fill time: alone, routine, small talk, work, trap, real | VERIFIED (mapping to withdrawal, ritual, pastime, activity, game, intimacy) | SPL ch. 1 (p. 37): work, rituals, pastimes, games, withdrawal, intimacy. GPP Introduction, p. 6 lists rituals, pastimes, games, intimacy and activity, with withdrawal as the solitary option. TA Today ch. 9 contents: withdrawal, rituals, pastimes, activities, games, intimacy. | None to the six |
| bookSource "Games People Play, ch. 2 and 4" | CORRECTED | GPP ch. 2 is Transactional Analysis. Time structuring is in the Introduction (pp. 5 to 7), rituals in ch. 3, pastimes in ch. 4, games in ch. 5. | "Games People Play, Introduction and ch. 3 to 5; Scripts People Live, ch. 1; TA Today, ch. 9" |
| "Most of an ordinary life goes to small talk or work rather than real contact" (bookIdea) and "most hours in the middle four" (debrief) | CORRECTED | GPP Introduction, pp. 6 to 7: prolonged intimacy is rare, and most social contact takes the form of games | bookIdea, bookNote and nadia now say real talk is the rarest and most contact is game-playing |
| Alone, even in a crowd | VERIFIED | GPP Introduction, p. 6 (a person can stay solitary in the presence of others) | None |
| Omar's corner "Hey." "Hey." counted as alone | CORRECTED (ambiguous) | GPP ch. 3, p. 15: Hi-Hi is a two-stroke ritual | Quoted exchange removed from the sort card; the Play option where you say "Hey" keeps it, since there it is the ritual before he withdraws again |
| Spot item "How was your weekend?" "Good, yeah. Yours?" is small talk | CORRECTED (reads as the ritual) | GPP ch. 3, p. 15 (How are you, Fine and you); ch. 4, p. 16 (a pastime is built round one topic) | Replaced with a topic exchange (last night's match); example changed to match |
| Small talk is safe because "nothing" is at stake or can happen | CORRECTED (overstated) | GPP ch. 4, pp. 16 to 17: pastimes pass time and give stroking, and the Child in each player is assessing the others | "nothing" became "little" in the Spot why and example, the Play why and the debrief |
| "Anyone can join small talk" (Analyse option and trap) | CORRECTED (contradicted) | GPP ch. 4, p. 18: pastimes are exclusive; people resent an intruder with a different one, and a newcomer must join the one running or switch the whole table | Option now "You walked in without a topic"; trap explains small talk runs on one topic at a time; trap 2 softened |
| Real talk is private and you cannot step into it | VERIFIED (substance) | GPP Introduction, p. 7 (prolonged intimacy is rare and primarily private) | None |
| "One. For me." is a hook (a trap) | VERIFIED (loose gloss) | GPP ch. 5, p. 19 (a game has a concealed motive, a snare or gimmick, and a predictable payoff) | None |
| Silence with Omar "is how real talk starts" | CORRECTED (generalisation not in the books) | | Now "what he said was true" |

## 1-5 PTA Three Ways

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| A pastime is a simple chat on one shared topic that fills time and trades some nods | VERIFIED | GPP ch. 4, pp. 16 to 17 | bookIdea and bookNote rewritten (the old "safe because little is risked" was a gloss) |
| Berne's example, PTA, is played at three levels | VERIFIED | GPP ch. 4, p. 17 (Child-Child, Adult-Adult, Parent-Parent) | bookNote says "three levels"; ego-state names withheld in week 1 |
| The game's labels grumbling, sharing, problem-solving | PARTLY VERIFIED | Grumbling matches the Parent-Parent form ("Juvenile Delinquency"), problem-solving the Adult-Adult form. Sharing for the Child-Child form is the game's loose gloss. | None; flagged here |
| A newcomer who plays another level or pastime gets a cool reception | VERIFIED | GPP ch. 4, p. 18 (Sunny Side Up; intruders resented) | None |
| Grumbling is "the easiest level to join" | CORRECTED (not in the book) | GPP ch. 4, p. 18 says the opposite emphasis: every pastime is exclusive | Replaced with "Anyone listening can agree without risking a thing" |
| Small talk is how people "check you're safe" | CORRECTED | GPP ch. 4, p. 17: pastimes are social-selection; each player assesses the others and picks who to know better | "size you up" in the scene why, the debrief and bookNote |
| bookSource "Games People Play, ch. 4" | VERIFIED | | None |
| Play round had one item | CORRECTED (structure) | BRIEF.md | Added "Saturday, 12:10, the table changes gear": three beats at the same table (a fix-trading level, an invited expert question, a drop to a personal level), best/ok tags, meters start at 60, best-only path ends at 69. Scripted scene untouched. |

## 1-6 Boss: The Stroke Economy

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| bookSource "Scripts People Live, ch. 9" | CORRECTED | Ch. 9 is "Basic Training: Training in Mindlessness". The stroke economy is in ch. 8, "Basic Training: Training in Lovelessness", sections "The Stroke Economy" and "The Stroke Economy Rules" (index pp. 110 to 114). | "Scripts People Live, ch. 8" |
| Five rules | VERIFIED | SPL ch. 8: (1) don't give strokes if you have them to give, (2) don't ask for strokes when you need them, (3) don't accept strokes if you want them, (4) don't reject strokes when you don't want them, (5) don't give yourself strokes | None to the count |
| Rule wording in the Spot options, debrief and bookIdea (no conditions) | CORRECTED | Same | Options now read "Don't give nods you have", "Don't ask for nods you need", "Don't refuse nods you don't want", "Don't accept nods you want"; nadia and bookIdea list the conditions |
| The rules are taught in childhood as injunctions | VERIFIED | SPL ch. 8 | bookIdea and bookNote say so, and name Steiner |
| Who benefits: "whoever hands the nods out" | CORRECTED (imprecise) | SPL ch. 8: strokes are used as a tool of social control; whoever holds a stroke monopoly profits; the scarcity serves an established order | Analyse option, why, nadia and bookNote reworded |
| "Oh, it was nothing" is the don't-accept rule; swallowing Peter's unwanted nod is the don't-refuse rule; "I did that well" is the self-stroking rule | VERIFIED | SPL ch. 8 rules 3, 4 and 5; SPL ch. 22 on discounting strokes | None; the Spot trap for rule 4 now says the nod was an unwanted one |
| Answer keys and scene tags | VERIFIED against the rules above | | None |

## 2-1 Who Said That

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| Ego states are real, observable states, not roles; three of them | VERIFIED | GPP ch. 1, p. 8; TAP ch. 2; TA Today ch. 2 | bookSource now cites chapters |
| Parent copies the people who raised you; Child is left over from your own early years; Adult appraises the present | VERIFIED | GPP ch. 1, p. 8 (exteropsychic, archaeopsychic, neopsychic); TAP ch. 7, "The Complete Diagnosis" | bookNote now says this |
| A voice can be told from words, tone and posture | VERIFIED | TA Today ch. 5 (words, tones, gestures, postures, expressions); TAP ch. 7 (demeanour, gestures, voice, vocabulary) | None |
| bookSource "Transactional Analysis in Psychotherapy; Games People Play, ch. 1" | CORRECTED (no TAP chapter, books out of order) | | "Games People Play, ch. 1; Transactional Analysis in Psychotherapy, ch. 2; TA Today, ch. 2" |
| Debrief: "three recordings, none of them the grown-up one" | CORRECTED | GPP ch. 1, p. 8 and TAP ch. 7: the Adult is autonomous here-and-now appraisal, not a recording | Now: the Boss and the Kid are old recordings, the Pilot reads the room as it is |
| Play trap: "a simple question that Mum can answer" at the door of 1A | CORRECTED (cast) | The 1A landlady is Gran | Gran |
| Spot and Play answer keys (Boss verdict, Pilot plan, Kid apology) | VERIFIED | Behavioural clues per TA Today ch. 5 | None |

## 2-2 Five Faces

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| Five functional parts: controlling Parent, nurturing Parent, Adult, free Child, adapted Child; the Adult is not subdivided | VERIFIED | TA Today ch. 3 (Figure 3.1) | None to the five |
| bookIdea: "the Parent and the Child each show a helpful and a hurtful face, and the Adult stays one whole face, which makes five" | CORRECTED | In ch. 3 the five come from splitting the Parent (controlling, nurturing) and the Child (free, adapted). Positive and negative is a separate sub-division, applied by some writers to the four split parts. | bookIdea, bookNote and the Play intro rewritten |
| bookSource "TA Today" (no chapter) | CORRECTED | | "TA Today, ch. 3" |
| Controlling Parent is also called Critical Parent | VERIFIED | TA Today ch. 3 | Added to bookNote |
| Negative nurturing Parent is smothering; positive controlling Parent is a firm, protective directive | VERIFIED | TA Today ch. 3 (the "smother-mother", the doctor's order to stop smoking) | None; Play items 1 and 2 keys stand |
| Wild Kid is the free Child; Good Kid is the adapted Child | VERIFIED as a mapping, but see the next row | TA Today ch. 3 | None |
| Play 2 trap 3 gave the Wild Kid a rebellious line ("Ugh, that's so unfair, you always say no") | CORRECTED | TA Today ch. 3: rebellion is part of the Adapted Child; the free Child acts independently of parental rules. Bible: the Good Kid "obeys, or rebels". | Trap now an uncensored want ("Friday noon? I was going to be at the beach by then!") |
| Spot intro: "the same three voices as last week" | CORRECTED (2-1 is the same week) | | "as before" |
| Nadia: each face has a helpful and a hurtful side | VERIFIED for the four split parts | TA Today ch. 3 | "Each of those four faces", since the Adult is not split |

## 2-3 Egogram

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| An egogram is a bar chart of the five functional parts, drawn by Jack Dusay's method | VERIFIED | TA Today ch. 3 ("Jack Dusay has devised an intuitive way"; bars in the order controlling Parent, nurturing Parent, Adult, free Child, adapted Child). SPL ch. 2 (index p. 48) also introduces the egogram. | bookIdea and bookNote name Dusay |
| Bar height shows roughly how much of the time you use that part; exact height is unimportant | VERIFIED | TA Today ch. 3 | Old text said "how much each face shows right now, a snapshot rather than a verdict"; replaced |
| You draw it by intuition; others who know you can draw yours; you may need more than one (work, home) | VERIFIED | TA Today ch. 3 | Stated in bookIdea/bookNote; Analyse why says it can be redrawn |
| bookSource "TA Today" | CORRECTED | | "TA Today, ch. 3" |
| Analyse trap: "your voice-print was drawn to show change" | CORRECTED | TA Today ch. 3: Dusay's constancy hypothesis says raising one part lowers others; nothing says the chart is drawn to show change | Rewritten: a rough picture you can redraw that shifts when you practise another voice |
| Three Wild Kid traps (Play 1, 2, 3) used sulking, sighing and complaining | CORRECTED | TA Today ch. 3 (rebellion and sulking are adapted Child); TAP ch. 7 files "rebelliousness" under the natural Child, so the books disagree (see Notes) | Replaced by uncensored, playful wants; Play 3 cue "no sigh first" removed |
| A ten-line tally gives Gran's bars | NOTE | Dusay's chart is an intuitive estimate of time spent | Analyse intro says the tally is a rough guide, not a measurement |
| A tall Good Kid bar is data, not a verdict | VERIFIED | TA Today ch. 3 (positive Adapted Child: manners and rule-following are useful) | Why now says the Good Kid is where good manners live |

## 2-4 Four Ways to Know

Decision. The scripted scene (scenes-weeks-1-3.txt, "The Leak") is a Spot-the-leak game on contamination. The 42-game table, the BRIEF.md assignment table and the existing file call the game "Four Ways to Know" (Diagnose, TA Today ch. 5 on recognising ego states). The books support both topics, but they are different topics, and the leak material already has its home in 2-6 (Boss: The Contaminated Adult, Spot-the-leak, TA Today ch. 6 and TAP ch. 4), which also takes the scripted "Fake Pilot" material. I kept the table's design and fixed it to the books. "The Leak" is not repeated here; only a light preview survives in two Play whys.

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| Four ways to recognise an ego state: behavioural, social, historical, phenomenological | VERIFIED | TA Today ch. 5; TAP ch. 7, "The Complete Diagnosis" | Names now used in bookIdea and bookNote |
| Behavioural diagnosis is first and most important; the other three act as checks | VERIFIED | TA Today ch. 5 ("The other three act as checks upon it"); TAP ch. 7 (the diagnosis proceeds in that order) | Concept, Spot whys, Play intro, Analyse and nadia rebuilt on this |
| "Get 2 of 4 to agree" / "trust a call when two of them agree" | CORRECTED (not in the books) | TA Today ch. 5: all four ideally, in order, and in practice behavioural first with social as back-up; TAP ch. 7: validity is not established until all four are correlated | Rule removed everywhere |
| Phenomenological = "how it feels inside" / "his own sense" | CORRECTED | TA Today ch. 5 and TAP ch. 7: Berne means re-experiencing the old moment in full intensity, and notes he uses the word in a different sense from the dictionary | Fourth Spot clue is now "Reliving it" (new item with Daniel back in the dinner-table scene). A person's own account is kept only as a distractor in the Analyse sort and pick, marked as not one of the four. |
| Historical = "his first manager used the same words" | CORRECTED | TA Today ch. 5: historical diagnosis asks about the person's childhood and their parents or parent-figures | Now Daniel's father at the dinner table |
| Social = the room goes quiet | VERIFIED | TA Today ch. 5 (others respond from the complementary state; a Parent draws a Child) | Why reworded; sort item kept |
| Play 2 used a ticket "with a date and a result" as the historical clue | CORRECTED | A dated record is a fact check, not a historical diagnosis of a voice | Cue now uses behaviour plus the room's reply; the date and result remain only as a note that the claim can be checked |
| Play had two items | CORRECTED (strengthened) | | Added Clara's "Everyone here is cleverer than me": behaviour plus her childhood label |
| Analyse had one sort | EXTENDED | | Sort rebuilt (six clues, including a reliving clue and the self-account distractor) plus a new pick: which clue counts most |
| bookSource "TA Today" | CORRECTED | | "TA Today, ch. 5; Transactional Analysis in Psychotherapy, ch. 7" |

## 2-5 Little Professor

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| "Little Professor" and where it lives | CORRECTED (source) | GPP never uses the exact phrase: ch. 5, p. 25 says "the Professor" and "the little 'Professor'" for the Adult aspect of the Child that sets games up between ages two and eight. The exact term is in SPL ch. 2 (index pp. 42, 44, 48): the Adult in the Child, A1, intuitive, with limited information. TA Today ch. 4 (Figure 4.1): "Adult in the Child (Little Professor)". | bookSource "Games People Play, ch. 5; Scripts People Live, ch. 2; TA Today, ch. 4" |
| bookIdea: the child "works out which face gets the biscuit... that is where games are first learned" | CORRECTED | GPP ch. 5, pp. 24 to 25: games are imitative, deliberately started by young children, and set up by the Adult aspect of the child's personality; SPL ch. 2: the Little Professor is the intuitive part that reads covert meanings | bookIdea and bookNote rewritten: the Adult in the Child, intuitive and quick, and children set up games by copying what works. "Face" was also dropped because it now means a function in 2-2. |
| The scene follows the genesis of games | VERIFIED | GPP ch. 5, "The Genesis of Games", p. 24 (the stomach-ache at the dinner table, the brother's copy, and the father's question that broke it "in statu nascendi") | None; best lines still match the father's move |
| Analyse options "The Kid's own pilot / A leak / Doing nothing" | CORRECTED | "A leak" belongs to 2-6 and "Doing nothing" to the four passive behaviours of week 5 (TA Today ch. 17), so neither tests the idea. The natural contrasts are the other two parts of the Child (SPL ch. 2). | Options now "The Kid's own pilot / The Kid's raw feelings / The Kid's copy of a grown-up rule"; why and both traps rewritten |
| Debrief: "which face gets the biscuit" | CORRECTED | | "which move gets a nod" |
| Feeding the bid keeps the game running | VERIFIED | GPP ch. 5, p. 24 (if the parents cooperate, the game becomes part of the child's character) | None |

## 2-6 Boss: The Contaminated Adult

| Claim | Verdict | Evidence | Change made |
|---|---|---|---|
| Contamination: part of Parent or Child content is mistaken for Adult | VERIFIED | TA Today ch. 6; TAP ch. 4, "Contamination" | None |
| Borrowed belief taken as fact = prejudice; old fear or fantasy taken as fact = delusion; both together = double contamination | VERIFIED | TA Today ch. 6; TAP ch. 4 (Figure 3 A to F) | bookNote now names prejudice, delusion, double contamination and exclusion |
| bookSource "Transactional Analysis in Psychotherapy; TA Today" | CORRECTED (no chapters) | | "Transactional Analysis in Psychotherapy, ch. 4; TA Today, ch. 6" |
| Bin "Double-talk" for Joseph's line (a reasonable split on top, a judgement underneath) | CORRECTED | In TA a double leak is double contamination (a Parent slogan and a Child belief, both taken as fact). Two messages in one line is an ulterior transaction (week 3), and 3-3 and 3-5 already use "double-talk" for that. | Bin renamed "A double leak"; Joseph's line rewritten as slogan plus fear ("Groups always fall apart when they grow, and I'd only be in the way"); intro explains the label |
| Exclusion shown as "a stuck voice" | VERIFIED | TA Today ch. 6 (constant or excluding Adult is a planner and data processor who cannot join in the fun); TAP ch. 4 ("The excluding adult") | Peter's line rewritten ("Give me the figures..., it's all I've ever done") so only the data voice is plainly on |
| A checkable memory ("We tried a bigger room in 2019") is clean Pilot | VERIFIED (design point) | TA Today ch. 6: contamination is cleared by reality-testing | None |
| Child leak: "Nobody listens to a student anyway" | VERIFIED | TA Today ch. 6 (Child contamination: a fantasy taken as fact) | None |
| Daniel's "Let's be rational... simple maths" as a Boss leak | VERIFIED (loose) | TA Today ch. 6 (prejudice is a Parental slogan taken as reality) | None |

## Notes for the lead

1. 2-4 design. See the decision under 2-4. If the scripted "The Leak" is wanted, it should go to 2-6, which already holds the same content. 2-4's new Play and Analyse items lean lightly on "leak" only in one why.
2. Rebellion. TAP ch. 7 puts rebelliousness under the natural Child; TA Today ch. 3 (and the bible) put it under the Adapted Child, and say earlier writers used a separate "Rebellious Child". The games now follow TA Today and avoid rebellious lines for the Wild Kid. Other clusters that give the Wild Kid a sulky or defiant line should be checked.
3. Wrong chapter numbers in `scenes-weeks-1-3.txt`, which may have been copied into other games: "Scripts People Live ch. 9" for the stroke economy (it is ch. 8); "TA Today ch. 2 & 4" for the functional model and the diagnoses (they are ch. 3 and ch. 5); "Games People Play ch. 2 & 4" for time structuring (Introduction and ch. 3 to 5); "Games People Play ch. 5, the Little Professor" (the phrase is in SPL ch. 2 and TA Today ch. 4). 6-4 also mentions the stroke economy and should be checked for the same ch. 9 error.
4. "Little Professor" is not a GPP phrase. GPP says "the Professor" and "the little Professor" in ch. 5, p. 25.
5. Unresolved, outside the books: Sam's absence. 1-1 has him at home Monday, 1-2 has him at home Monday night, and 1-3 has him returning Wednesday 8:00, yet the counter asks for the book's 30 nods (a month's absence in GPP ch. 3, p. 15). I removed the "week away" wording but could not repair the calendar without restructuring 1-1 or 1-2. Options: lengthen his trip by moving 1-3 to the following Wednesday, or lower the target and rebalance the palette.
6. UNVERIFIABLE items kept on purpose, all resting on TA Today ch. 8 or standard TA: the term "stroke filter"; the warm/cold by doing/being grid in 1-1 and 1-2.
7. 1-5's sharing level is the game's own gloss for Berne's Child-Child form; the other two levels match his Parent-Parent and Adult-Adult forms.
