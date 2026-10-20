# TA Arena — Visual Design & Graphic System Guide

> **Directive for AI / Claude:** Use this guide to apply, maintain, and extend the visual design and graphical styling of TA Arena. **Do not modify or alter any educational content, level JSON files, concept definitions, quotes, feedback text, mechanics, schemas, or mastery mathematical formulas.** All improvements are strictly presentation-layer (CSS, Tailwind, SVG graphics, UI component hierarchy, animations, audio synthesis, and interactive polish).

---

## 1. Design Philosophy: The Psychological Tactical Terminal

TA Arena moves away from flat, stark black-and-white wireframes into a **Cyber-Psychological Tactical Console** aesthetic:
- **Depth & Atmosphere:** Deep obsidian/slate backdrops with ambient radial lighting that breathes with the active world's psychological theme.
- **Tactile Glassmorphism:** Elevated dark surfaces (`backdrop-blur-md`, subtle 1px border highlights, soft layered shadows) instead of harsh stark-white boxes.
- **Electric Accents:** The core brand electric yellow (`#FFFC00`) and amber (`#FFB800`) used purposefully for player action, active ego states, and breakthroughs.
- **Expressive Character Art:** Stylized, personality-rich vector portraits that dynamically reflect emotional state (`tense`, `neutral`, `open`) rather than primitive line smileys.
- **Interactive Visual Models:** Diagrams like the PAC Stack and Transaction Vectors are rendered as live, glowing visual instruments (dynamic SVG laser canvas, tactile orb reactors).

---

## 2. Color Palette & Thematic World System

### 2.1 Core Base Tokens

| Token | Hex / Value | Role / Usage |
| :--- | :--- | :--- |
| **`--ta-black`** | `#080A10` | Primary app background (deep obsidian) |
| **`--ta-dark`** | `#0F131F` | Surface depth layer |
| **`--ta-surface-dark`** | `#151A2A` | Elevated glass cards and containers (`rgba(21, 26, 42, 0.85)`) |
| **`--ta-border`** | `rgba(255, 255, 255, 0.12)` | Subtle glass card borders |
| **`--ta-yellow`** | `#FFFC00` | Primary action accent, player dialogue bubbles, Adult breakthroughs |
| **`--ta-amber`** | `#FFB800` | Secondary warm gold accent, streak flame badges |
| **`--ta-red`** | `#FF3B30` / `#F43F5E` | Psychological game-move traps (The Switch), tense warnings |
| **`--ta-cyan`** | `#06B6D4` / `#00E5FF` | Adult ego state, objective logic, vector circuits |
| **`--ta-emerald`** | `#10B981` | Correct vector confirmation, mastery badges, practical applications |
| **`--ta-purple`** | `#A855F7` | Transaction vectors, crossed communication highlights |

### 2.2 Thematic World Accents

Every world has a signature ambient accent used in its cards, hero banners, and emblem glow:

```css
/* Ambient World Signatures */
--w1-color: #FF9500; /* World 1: Hunger (Strokes & Time) - Warm Solar Ember */
--w2-color: #00E5FF; /* World 2: Three Voices (Ego States) - Electric Cyan */
--w3-color: #A855F7; /* World 3: Vectors (Transactions) - Vivid Laser Violet */
--w4-color: #F43F5E; /* World 4: The Thesaurus (Games) - Crimson Ruby */
--w5-color: #06B6D4; /* World 5: Underneath (Depth & Ulterior) - Oceanic Teal */
--w6-color: #10B981; /* World 6: The Plan (Script Matrix) - Emerald Neon */
--w7-color: #F59E0B; /* World 7: Autonomy (The Dawn) - Golden Sunburst */
```

---

## 3. Typography & Micro-Hierarchies

One clean, modern sans-serif typeface family: **Inter, system-ui, sans-serif**, with monospace accents for tactical telemetry:

| Level | Size / Weight | Style / Tracking | Role |
| :--- | :--- | :--- | :--- |
| **Title / Hero** | `24px`–`30px`, Black (`font-black`) | `-0.02em` tracking, gradient text | Screen headers, world titles, boss names |
| **Section Header** | `18px`–`20px`, Bold (`font-extrabold`) | Normal | Card titles, concept names |
| **Dialogue Body** | `16px`–`17px`, Medium (`font-medium`) | Relaxed line-height (`1.55`) | Speech bubbles, scenario descriptions |
| **Body / Theory** | `14px`–`15px`, Regular | Relaxed line-height (`1.5`) | Lessons, analysis callouts, debriefs |
| **Telemetry / Badges** | `11px`–`12px`, Bold (`font-mono`) | Uppercase, `+0.08em` tracking | Ego tags (`[ADULT]`), difficulty (`L1 SPOT`), word counts |

---

## 4. Component Visual Specifications

### 4.1 Character Avatars (`src/ui/Avatar.tsx`)
Rendered as an authored vector SVG (`viewBox="0 0 100 100"`), replacing flat line smileys:
- **Head & Features:** Natural warm skin tones with soft shadow shading, ears, nose contour, and responsive facial features.
- **Expressive Eyes:** Pupil iris with dual light catch reflections (`#FFFFFF` catchlights). Eyelid curves adjust dynamically:
  - `tense`: Narrowed intense eyes (`ry: 2.5`), downward-angled furrowed brows (`M32 40 L44 45`), tight flat mouth line.
  - `open`: Warm, widened eyes (`ry: 4.5`), arched soft brows (`M32 42 Q38 38 44 41`), smiling mouth curve (`#DC2626` lip fill).
  - `neutral`: Balanced focused eyes (`ry: 3.8`), level brows, relaxed mouth.
- **Hairstyles & Outfits:**
  - `bun`: High bun with electric yellow hairpin and face-framing strands.
  - `fade`: Modern textured fade with volume.
  - `wavy`: Flowing shoulder-length hair waves.
  - `curls`: Volumetric curls.
  - Outfits: `blazer` with lapels, `hoodie` with drawstrings, `turtleneck`, or `collar`.
- **Active Speaker Halo:** When `active === true`, an outer concentric ring pulses with golden bloom (`filter: drop-shadow(0 0 8px rgba(255,252,0,0.75))`) and an animated speaker pill floats at the top-right.
- **Emotion Micro-Badge:** Floating bottom-right pill:
  - `tense`: `⚡` on a rose-red badge.
  - `open`: `✨` on an emerald badge.

### 4.2 PAC Structural Core (`src/ui/PacStack.tsx`)
Replaces plain grey buttons with glowing psychological reactor orbs:
- **Parent (P):** Gradient `from-amber-400 via-rose-500 to-red-600`, values & rules. Active: Rose-red halo bloom (`shadow-[0_0_20px_rgba(244,63,94,0.65)]`).
- **Adult (A):** Gradient `from-cyan-400 via-teal-400 to-blue-600`, logic & reality. Active: Cyan-teal halo bloom (`shadow-[0_0_22px_rgba(6,182,212,0.7)]`).
- **Child (C):** Gradient `from-yellow-300 via-amber-400 to-orange-500`, feelings & impulses. Active: Golden-amber halo bloom (`shadow-[0_0_20px_rgba(251,191,36,0.65)]`).
- **Interactive Stack Container:** Dark recessed capsule (`bg-black/40 border border-white/10`) with a vertical subtle axis guide line running through all three nodes.
- **Micro-Labels:** Subtitles for state identity (`P: Parent • Values`, `A: Adult • Logic`, `C: Child • Feelings`).

### 4.3 Dynamic Transaction Vector Canvas (`src/ui/Vector.tsx`)
- **Interactive SVG Laser Board:** Positioned between the Stimulus (left) and Response (right) PAC stacks.
- **Dynamic Path Laser:** Calculates coordinates from the selected node centers and renders an animated laser vector arrow (`className="ta-laser-flow"` with `stroke-dasharray: 6 3` and `@keyframes ta-laser`).
- **Crossed vs. Complementary Detection:**
  - If lines cross: displays a dynamic collision marker at the intersection point with an alert: `[⚡ CROSSED TRANSACTION: Communication Broken]`.
  - If parallel: displays `[✓ COMPLEMENTARY: Continues Indefinitely]`.
- **Dual Reveal:** When checked, correct paths glow in emerald (`#10B981`) with dashed reference lines if the initial diagnosis was off-target.

### 4.4 Thematic World Emblems (`src/ui/WorldIcon.tsx`)
Vector SVG emblems (`viewBox="0 0 36 36"`) rendered inside illuminated pedestals:
1. **World 1 (Hunger):** Bundle of 4 vertical stroke tally lines crossed by a golden diagonal slash with solar vitality sparks.
2. **World 2 (Three Voices):** Tri-orb PAC reactor core aligned along a vertical laser axis.
3. **World 3 (Vectors):** Dual crossed laser swords with an impact collision burst at `(18, 18)`.
4. **World 4 (The Thesaurus):** Open Grimoire of Games featuring the Switch triangle seal.
5. **World 5 (Underneath):** Dual-tier psychological iceberg with social surface and submerged subconscious depths.
6. **World 6 (The Plan):** Script Matrix decision tree with root nodes and branching future pathways.
7. **World 7 (Autonomy):** Radiant dawn of autonomy with solar crown rays breaking game chains.

### 4.5 Dialogue Bubbles & Tactical Callouts (`src/ui/Dialogue.tsx`)
- **Directional Speech Tails:** Built via CSS clip-path polygons on the bottom corner of each bubble (`-left-1.5` for NPC, `-right-1.5` for player).
- **NPC Speech Bubble:** High-contrast crisp light surface (`bg-slate-100 text-slate-900 border border-slate-200 shadow-xl`) with speaker name tag.
- **Player Speech Bubble:** Electric golden-yellow gradient (`from-yellow-300 to-amber-400 text-slate-950 font-medium border border-yellow-200`) with a dedicated `[YOU]` telemetry badge.
- **Psychological Callout Dossier:** Elevated dark card with an illuminated left accent bar (`from-ta-yellow via-amber-400 to-ta-yellow`), a `[Psychological Analysis]` badge, and Berne's rule citation.

### 4.6 Tactical Option Buttons (`src/ui/Button.tsx`)
- **`variant="option"`:** Full-width gold gradient card, subtle border highlight, hover lift (`hover:-translate-y-0.5 shadow-md`), active depression (`active:scale-[0.99]`), and an animated arrow reveal (`&rarr;`) on hover.
- **`variant="game-move"`:** Triggered when walking into a psychological trap: dark rose background (`bg-rose-950/80 border-2 border-rose-500 text-rose-100`), red glow, and the `ta-shake` screen vibration.
- **`variant="selected"`:** Elevated crisp light card with gold border and checkmark confirmation.
- **`variant="ghost"`:** Modern dark glass surface (`bg-slate-900/70 border border-slate-700/80 hover:border-slate-400`).

---

## 5. Animation, Micro-Interactions & Audio Feedback

### 5.1 CSS Keyframes (`src/index.css`)

```css
/* Smooth bouncy entrance for cards and dialogues */
@keyframes ta-pop-in {
  0% { opacity: 0; transform: scale(0.92) translateY(8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* Screen shake on psychological game traps */
@keyframes ta-shake-effect {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
  40%, 60% { transform: translate3d(3px, 0, 0); }
}

/* Animated laser dash flow for transaction arrows */
@keyframes ta-laser {
  from { stroke-dashoffset: 24; }
  to { stroke-dashoffset: 0; }
}

/* Breathing luminescence for active orbs */
@keyframes ta-glow {
  0% { filter: drop-shadow(0 0 6px rgba(255, 252, 0, 0.25)); }
  100% { filter: drop-shadow(0 0 16px rgba(255, 252, 0, 0.65)); }
}
```

### 5.2 Procedural Audio Synthesizer (`src/ui/sound.ts`)
Zero external MP3s or audio assets; uses native browser Web Audio API:
- `playTap()`: 440 Hz &rarr; 220 Hz soft tactile sine pop (50 ms).
- `playSuccess()`: Ascending triangle arpeggio (C5 &rarr; E5 &rarr; G5 &rarr; C6) for Adult breakthroughs and correct vector checks.
- `playGameMove()`: 140 Hz &rarr; 55 Hz descending sawtooth thud (280 ms) for triggering a game switch.
- `playVictory()`: Full major arpeggio fanfare for completing levels and worlds.
- Includes a top-level mute toggle (`🔊 SFX ON` / `🔇 SFX OFF`) persisted in `localStorage`.

---

## 6. Screen Structures

### 6.1 Home Screen (`src/screens/Home.tsx`)
1. **Header HUD:** Glowing "TA ARENA" crown insignia, SFX toggle button, and a Player Status HUD containing:
   - Concepts Mastered counter (`X / 61 Concepts`).
   - Luminous segmented progress bar (`bg-gradient-to-r from-amber-400 via-ta-yellow to-emerald-400`).
   - Streak badge with animated flame (`🔥 X Game-Free Streak`).
2. **Arcade Track Selector:** 3-column pill cards (`L1 Spot` • Diagnose cues; `L2 Play` • Live dialogue; `L3 Analyse` • Deep theory).
3. **Campaign World Cards:** Rounded cards with thematic color gradients, illuminated icon pedestal, title, subtitle, unlocks overview, and interactive status arrow.

### 6.2 World Screen (`src/screens/World.tsx`)
1. **Thematic Hero Banner:** Deep gradient matching the world's accent, large emblem pedestal, theme title, and unlocks.
2. **Mission Roadmap:** Numbered level cards with mechanic badges (`CHOICE-STORY`, `DIAGNOSE`, `VECTOR`), completed checkmarks, and instant "PLAY &rarr;" triggers.
3. **Climactic Boss Showdown Card:** High-stakes card with hazard glow (`shadow-[0_0_24px_rgba(255,252,0,0.2)]`), crown badge (`👑 WORLD BOSS CLIMAX`), and unlock requirements.

### 6.3 Level Screen (`src/screens/Level.tsx`)
1. **Scenario Briefing Card:**
   - Level ID and difficulty badge.
   - Setting bar with time & place pins (`📍 Setting: Monday, 9:40...`).
   - Character role dossier card with player avatar: `"You are playing as Priya, the team lead"`.
2. **Action Bar:** Sleek rounded icon pills for `📖 Source Reference`, `🎓 Theory Lesson`, and `↻ Replay`.
3. **Engine Rendering:** Seamless rendering of `Diagnose`, `ChoiceStory`, or `Fields` engines.

### 6.4 Lesson / Debrief Screen (`src/screens/Lesson.tsx`)
1. **Victory Header:** Level Complete confirmation with celebratory arpeggio chime on arrival.
2. **Collectible Theory Mastery Cards:** Dark glassmorphic cards with gold accent lines, concept tags, definitions, and "Common Confusion" warning boxes.
3. **Expandable Deep Theory:** Expandable drawer containing formal definitions, alternate framings, and a practical `"🎯 Try this today"` challenge.

---

## 7. Turnkey Prompt to Give Claude

Copy and paste the prompt below to instruct Claude to implement or adhere to this visual design guide:

```markdown
You are styling the TA Arena web app. Follow the visual design specification in `docs/VISUAL_GUIDE.md` exactly:

CRITICAL CONSTRAINTS:
1. DO NOT change or rewrite any educational content, level dialogue, options, answers, feedback text, quotes, concept IDs, book references, or difficulty tiers.
2. DO NOT modify any state logic or scoring formulas in `src/state/mastery.ts` or `src/state/db.ts`.
3. Focus 100% on visual presentation, graphic styling, animations, tactile component design, and game feel.

KEY DESIGN REQUIREMENTS:
- Use the Cyber-Psychological Tactical Console aesthetic: deep obsidian/slate backgrounds (`#080A10`), elevated dark glassmorphic cards (`bg-slate-900/80 backdrop-blur-md border border-white/10`), and electric yellow/amber accents (`#FFFC00`, `#FFB800`).
- Ensure character avatars in `src/ui/Avatar.tsx` use expressive vector portraits with dynamic eye, brow, and mouth adjustments for `tense`, `open`, and `neutral` emotions, complete with active speaker halos and mood badges.
- Ensure the PAC stack in `src/ui/PacStack.tsx` renders as glowing psychological reactor orbs (Parent: warm amber-rose, Adult: crystalline cyan-teal, Child: radiant gold-orange) with tactile spring interactions.
- Ensure transaction vectors in `src/ui/Vector.tsx` use the dynamic SVG laser canvas with animated dashed laser lines (`ta-laser-flow`) and crossed transaction collision markers.
- Ensure dialogue rows have speech tails, role badges, and tactical analysis callouts.
- Ensure all option buttons have hover elevation, tactile depressions, and trigger the `ta-shake` warning on psychological game traps.
- Keep all unit tests passing (`npm run test`) and typechecks passing (`npm run build`).
```
