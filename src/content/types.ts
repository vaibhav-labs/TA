export type Difficulty = "L1" | "L2" | "L3";

export type EgoState = "P" | "A" | "C" | "CP" | "NP" | "FC" | "AC";

export type Tag = "best" | "ok" | "game-move";

export type Expression = "neutral" | "tense" | "open";

export interface Concept {
  id: number;
  concept: string;
  tier: number;
  source: string;
  confusion: string | null;
}

export interface WorldLevelStub {
  id: string;
  title: string;
  mechanic: string;
  concepts: number[];
  playsLike: string;
  boss?: boolean;
}

export interface World {
  id: number;
  theme: string;
  subtitle: string;
  unlocks: string;
  boss: string;
  levels: WorldLevelStub[];
}

export interface DiagnoseOption {
  text: string;
  feedback: string;
}

export interface DiagnoseLevel {
  /** The character delivering the line being diagnosed, if any (renders as a scene, not a bare question). */
  npc?: string;
  line?: string;
  expression?: Expression;
  question: string;
  cues?: string[];
  options: DiagnoseOption[];
  answer: number;
  lesson: string;
}

export interface ChoiceStoryOption {
  text: string;
  tag: Tag;
  egoState: EgoState;
  outcome: string;
  /** The NPC's expression while delivering the outcome line. */
  outcomeExpression?: Expression;
  lesson: string;
}

export interface ChoiceStoryBeat {
  npc: string;
  line: string;
  expression?: Expression;
  cues?: string[];
  egoState?: EgoState;
  options: ChoiceStoryOption[];
}

export interface ChoiceStoryLevel {
  intro?: string;
  beats: ChoiceStoryBeat[];
}

export interface VectorPair {
  label: string;
  from: string;
  to: string;
}

export interface FieldVector {
  type: "vector";
  label: string;
  pairs: VectorPair[];
}

export interface FieldText {
  type: "text";
  label: string;
  maxWords: number;
  rubric: string[];
}

export type Field = FieldVector | FieldText;

export interface FieldsLevel {
  fields: Field[];
}

export interface LevelContent {
  id: string;
  title: string;
  world: number;
  engine: string;
  concepts: number[];
  source: { book: string; chapter: number; quote: string };
  setting: string;
  /** Who the player is in this scene, e.g. "Priya, team lead" — answers "whose shoes am I in?" */
  playAs?: string;
  levels: {
    L1?: DiagnoseLevel;
    L2?: ChoiceStoryLevel;
    L3?: FieldsLevel;
  };
  echoAfterHours: number;
  echo?: { setting: string; line: string; shape: string };
}

export interface LessonCard {
  concept: number;
  name: string;
  oneLine: string;
  whatYouDid: string;
  confusion: string;
  fromBook: { book: string; chapter: number; quote: string };
  expand: { definition: string; otherFraming?: string; tryThisToday: string };
}

export interface LevelResult {
  levelId: string;
  level: Difficulty;
  score: number; // 0-100 normalised
  tags: Tag[];
  egoStates: EgoState[];
  at: number; // epoch ms
}
