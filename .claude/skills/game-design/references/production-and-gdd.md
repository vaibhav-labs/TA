# Development Lifecycle, the Designer's Role, and the Game Design Document

Source: Moore, *Basics of Game Design*, ch. 1 (read in full) and the outline of ch. 13 (a
conversation with Chris Taylor on preproduction and production; the interview text was
beyond the provided pages and isn't quoted here).

## Contents
1. Simple vs. complex games and the four kinds of design data
2. Team and roles
3. Preproduction: pitch → proposal → GDD or prototype → technical review → schedule →
   interactive prototype
4. Production: assets, alpha, beta, gold, crunch
5. Post-production
6. The designer's ongoing duties
7. GDD structure (concept version → production "Bible")
8. Milestone gates and exit criteria
9. Scaling the process to small teams and solo developers

---

## 1. Design data

Simple games hard-code a few values. Complex games keep data **separate from the
engine** so designers can tune without a recompile (recompiles idle both programmers and
designers); data is baked in at ship. The four categories:
1. **Charts and tables:** lists of object values (weapons, monsters, treasure,
   production, character generation) and the tables that resolve actions (combat, magic,
   buying and selling).
2. **Level and map layout:** 2D/3D playfields and object placement.
3. **Scripts:** changes to world state, dialogue structure, encounter triggers.
4. **Dialogue:** character speech plus all other on-screen text strings (item
   descriptions).
Keep the GDD updated so the team builds the **same** game.

## 2. Team and roles

Senior or lead designer (owns the overall design and play; "keeper of the flame") ·
junior designers (data, systems, content) · level designers (3D tools such as 3ds Max
and Maya, plus scripting) · programmers (engine, tools, AI) · artists (2D/3D, concept,
storyboards) · audio · QA · producer and management · marketing (licences, demos,
screenshots). Design is collaborative: invite ideas from everyone and pick those that
improve play. Then **freeze changes** on schedule and park good late ideas for add-ons
or sequels.

## 3. Preproduction

1. **Ideation:** solo or bull sessions at a whiteboard; the designer steers, writes
   notes, and circulates them for comment.
2. **Pitch paper** (1–2 pages, high concept first). About 1–2 in 10 advance.
3. **Game proposal** (6–10 pages incl. marketing analysis; ~1–2 months). About 1 in 5–6
   gets a green light.
4. **GDD** (concept version) **or iterative prototyping.** Well-defined genres (FPS à la
   Doom) may prototype several settings, test them with focus groups, and pitch the
   winner instead of writing long documents.
5. **Technical review:** programmers write a **technical design document** (engine
   architecture, module interaction, tools); art writes an **art bible** (look +
   technical asset requirements); audio writes an **audio design document** (SFX,
   voice-over, musical themes); QA writes a **test suite** from the GDD.
6. **Schedule and budget:** team leads + producer + management set milestones, hiring,
   and hardware/software; marketing marks when demos and screenshots are needed.
7. **Interactive prototype:** proves the game to management and lets designers test
   mechanics (especially combat in RPGs) before full production.

## 4. Production

- Artists build sprites, models, and environments; programmers build the engine;
  designers refine data and work with level builders on layouts and contents.
- Systems are integrated, tested, and changed; the GDD is updated with every change.
- **Alpha:** playable start to finish, even if rough. The design should be solid; few
  basic design changes after this.
- **Beta:** all assets in; polishing and debugging only; **no design changes**. The
  publisher reviews it.
- **Gold:** the final build is released (to manufacturing or stores).
- **Crunch:** extra hours before milestone builds (third-party developers are paid per
  milestone). Plan scope to limit it.
- Production is the longest phase, often years for big games.

## 5. Post-production

Overlaps late production: the designer drafts the manual (a professional writer
finishes it), marketing plans the campaign, demos, and strategy guides; the team does
chats, conventions, and **patches** for escaped bugs. Most of the team rolls onto the next
project, often before gold. Modern additions: store pages, trailers, community, live
updates, and post-launch telemetry review.

## 6. Designer's duties throughout

- Define what the team builds; keep the vision; make sure the game is **fun**.
- Story is only part of the job. Non-story genres need just as much design time on
  gameplay elements.
- Massage chart data until systems balance; co-design the GUI and controls until they
  feel intuitive.
- Test continuously; guard earlier assets against later changes; bring in fresh testers.
- At beta, designers are mostly freed (except for database issues or loose story
  threads). Then rest and recharge for the next project.

## 7. GDD structure

Break it into chunks so each discipline reads its part (Moore's structure):

1. **Introduction** (for management, 4–6 pages max): high concept, a short example of
   play, genre, setting, platform, audience, rough budget and schedule.
2. **Game mechanics** (for programmers): every play element in detail (movement, combat,
   resource management, magic, etc.) with charts, tables, and algorithms; UI suggestions
   per screen; all control functions. Order sections by the **play-time budget**: the
   most important elements come first and in the most detail.
3. **Game graphics** (for artists): every character (physical description, actions, VFX),
   environment, and item; a starting point that's updated as art is finalized.
4. **Appendices:** audio requirements, all charts and tables, UI schematics, and
   everything else. This becomes the biggest section: final level maps, dialogue, flow
   charts, storyboards.

Two stages:
- **Concept version:** revised until management is satisfied. It's conjectural until
  prototypes exist; a "living" document.
- **Production version, the "Bible":** tracks every change, adds production materials
  (level maps, dialogue, scripts, bug-report updates, even asset directory listings),
  can run to hundreds of pages, and is invaluable for add-ons and sequels.

Balance the detail level: too vague leaves the design to programmers; too detailed
early "handcuffs" them and gets thrown away. Specify what's settled; mark open questions
with the prototype that will answer them.

Template: `assets/templates/gdd.md`.

## 8. Milestone gates

| Gate | Exit criteria |
|---|---|
| Concept approved | High concept, pitch, play-time budget, competitive analysis |
| Proposal green-lit | Proposal + marketing analysis + feasibility nod from the tech director |
| Preproduction complete | GDD concept version; TDD, art bible, audio doc, test suite; core loop proven in sims and a paper prototype; interactive prototype of the riskiest system; schedule with milestones |
| Vertical slice | One level at final quality; balance reports for core systems |
| Alpha | Playable start to finish; all systems in; attribute list frozen; fresh-player tests begin |
| Beta | All content in; design frozen; bug fixing only; difficulty curve validated |
| Gold / launch | Release-candidate certification; data baked; patch plan ready |
| Post-launch | Telemetry vs. targets; patch or balance updates; sequel/add-on notes from the Bible |

## 9. Scaling down

Solo and small teams compress the documents, not the thinking:
- Pitch = a README paragraph; proposal = a one-page "why this, why now."
- GDD = a living folder: `design/overview.md`, `design/mechanics/*.md`, `data/*.csv`
  (charts and tables as CSV or JSON loaded by the game), `design/levels/*.md` (level
  briefs).
- Technical review = a short list of risks with the prototype that retires each one.
- Still do: play-time budget, core-loop simulation, a paper prototype, data outside code,
  fresh-player tests, and the alpha/beta freeze discipline.
