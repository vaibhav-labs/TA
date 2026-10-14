# Story, Dialogue, and Interface

Coverage note: this file follows the structure of Moore's ch. 10 (Storytelling in Games:
stories in games, problems with game stories, structuring stories, linking plot to
gameplay, creating a game story, dialogue) and ch. 12 (Interface Design: GUI, designing
the GUI, game controls, feedback). Those chapters were **beyond the provided pages**.
The content applies principles Moore states in ch. 1–6: story is not gameplay;
henchmen as chapters; level-ups as chapter breaks; NPC dialogue state; keep numbers
off the combat HUD; transparent HUDs; one-menu combat actions; show movement range.

## Contents
1. Where story fits
2. Problems with game stories
3. Structures for interactive stories
4. Linking plot to gameplay
5. Creating the story (world, cast, chapters)
6. Dialogue systems and writing
7. GUI: screens, HUD, menus
8. Controls
9. Feedback
10. Checklists

---

## 1. Where story fits

Story matters a great deal in adventure, action, shooter, and RPG genres, and little in
sports, sims, puzzle, and arcade games. Even story-heavy games are judged on what the
player **does**. Non-interactive cinematics aren't gameplay. Conversations with real
choices are.

## 2. Problems with game stories

- **Passivity:** long cutscenes pull players out of play; attempts at fully cinematic
  games have failed.
- **Forgetting:** sprawling plots ("War and Peace on the Wii") get lost between sessions,
  and players won't re-trigger cinematics. Provide a journal, recaps, and quest logs.
- **Player agency vs. authored plot:** freedom breaks pacing; rails break agency.
- **Content cost:** every branch and every NPC × chapter needs lines (free fast travel
  multiplies this; Moore ch. 4).
- **Ludonarrative mismatch:** a story about mercy in a game where only killing pays
  (see meaningful mechanics, `mechanics-framework.md`).

## 3. Story structures

| Structure | Shape | Cost / control |
|---|---|---|
| Linear (string of pearls) | Fixed chapters; freedom within each "pearl" | Cheapest, most control |
| Branching | Choices fork the plot | Exponential cost; usually re-merges |
| Branch-and-bottleneck | Branches re-converge at key beats | Common compromise |
| Hub-and-spoke | Hub with chapter spokes in any order | Flexible pacing; needs state-aware NPCs |
| Open world + main thread | Main quest + optional sub-quests | Huge content; dialogue states per chapter |
| Emergent / systemic | Story arises from systems (sims, roguelikes) | Cheap content, low authorial control |
Moore's chapter heuristic: **each henchman ends a chapter**, and a major quest's level-up
opens the next region, with new NPC dialogue and shop stock.

## 4. Linking plot to gameplay

- Every story beat should **change something the player can do**: new region, verb,
  ally, shop tier, enemy set, or rule.
- Give the villain's plan **mechanical presence**: harm a reactive ally (kidnap the
  king), occupy territory, raise enemy tiers.
- Quests are the bridge: the story motivates them, and their completion moves the plot
  (see the quest state machines in `content-systems.md`).
- Alignment and choices pay **different rewards**, so moral choice is gameplay
  (`characters-and-entities.md`).

## 5. Creating the game story

1. **Premise** (one paragraph) consistent with the high concept.
2. **World bible:** history, factions, races and their relations (elves vs. dwarves),
   geography matching the region and encounter tables, technology or magic rules.
3. **Cast by role:** villain, henchmen (one per chapter), minions by region, active and
   reactive allies, active and inactive NPCs (`characters-and-entities.md` §11).
4. **Chapter outline:** goal, location(s), henchman, new mechanics, rewards, closing beat.
5. **Quest list** per chapter (main + sub-quests), with state variables.
6. **Cinematic budget:** minutes per chapter; prefer short, skippable, replayable via
   journal.

## 6. Dialogue

- **Text strings everywhere:** NPC lines, item descriptions, UI text, barks. All are
  data; keep them in tables for localization.
- **Structure:** linear lines, hub-and-spoke topics, branching trees with conditions
  (flags, alignment, charisma, items), and barks (contextual one-liners).
- **State changes:** NPC lines must update when the world changes (chapter end, quest
  finished). Unresolved sub-quest NPCs should acknowledge the change rather than repeat
  stale text (Moore ch. 6).
- **Writing for games:** short lines; front-load the actionable info; give every choice a
  visible intent; avoid lore dumps; let players skip and re-read (log).
- **Data format** (one row per node):
  `node_id, speaker, text, conditions (Boolean), effects (set flags/give item), next_nodes, voice_file`.

## 7. GUI

- **Screens inventory:** title, options, save/load, character creation, main HUD,
  inventory, character sheet, skills and spells, map (world and local), shop, dialogue,
  journal, combat UI, game over, credits. Draw a **screen-flow diagram**.
- **HUD principles:** the playfield comes first. Frame UI at the edges (Baldur's Gate) or
  make it **transparent** (Half-Life 2) to keep units large. Show only what the current
  decision needs; push large numbers (XP totals, cash) to secondary screens. Replace
  number spam with **bars, thermometers, colour shifts, timers**, without drowning players
  in icons (Moore ch. 3).
- **Menus:** combat actions on **one small menu** where possible (Moore ch. 5); limit
  nesting; remember the last selection.
- **Schematics in the GDD:** for each screen, a wireframe, the data shown, its source
  (which attribute or table), actions available, and the controls for each.

## 8. Controls

- Map every verb to an input per platform (gamepad, mouse and keyboard, touch). Group
  related verbs and keep frequent verbs on the most accessible inputs.
- **Intuitive is the goal:** the designer iterates the control scheme with art and
  programming until it feels obvious (Moore ch. 1). Avoid "breaking out the manual for an
  obscure control" (a chore).
- Support remapping, sensitivity, toggles vs. holds, and accessibility options
  (colour-blind palettes, subtitles, hold-to-press alternatives, difficulty aids).

## 9. Feedback

Every action needs an immediate response (visual, audio, haptic) that confirms the
input, shows the result, and teaches the rule. Examples from Moore: an alert when
movement is blocked, live reachable-space highlights, a greyed-out Flee option, "This
spell has no effect on ___", critical-hit text. Audio isn't gameplay, but it's major
feedback. Rewards (level-up fanfare, loot sparkle) should be proportionate and quick
to skip.

## 10. Checklists

Story
- [ ] Premise, world bible, cast by role, chapter outline, quest list with flags.
- [ ] Every story beat changes something playable.
- [ ] Journal or recap system; cinematic budget; skippable scenes.
- [ ] Dialogue table with conditions and effects; world-state updates planned per
      chapter.

Interface
- [ ] Screen inventory and flow diagram; wireframe per screen with its data source.
- [ ] HUD shows the minimum for moment-to-moment play; big numbers moved to secondary
      screens.
- [ ] Control maps per platform; remapping and accessibility.
- [ ] Feedback list: every action has a response; every failure explains itself.
