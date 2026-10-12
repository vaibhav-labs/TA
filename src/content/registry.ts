import type { Concept, LessonCard, LevelContent, World } from "./types";
import conceptsData from "./concepts.json";
import worldsData from "./worlds.json";

const levelModules = import.meta.glob("./levels/*.json", { eager: true }) as Record<
  string,
  { default: LevelContent }
>;
const lessonModules = import.meta.glob("./lessons/*.json", { eager: true }) as Record<
  string,
  { default: LessonCard }
>;

export const concepts = conceptsData as Concept[];
export const worlds = worldsData as World[];

export const levels: Record<string, LevelContent> = {};
for (const path in levelModules) {
  const content = levelModules[path].default;
  levels[content.id] = content;
}

export const lessons: Record<number, LessonCard> = {};
for (const path in lessonModules) {
  const content = lessonModules[path].default;
  lessons[content.concept] = content;
}

export function conceptById(id: number): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

export function worldById(id: number): World | undefined {
  return worlds.find((w) => w.id === id);
}

/** Every level id -> the concept ids it touches, for mastery.ts (section 8). */
export function allLevelConcepts(): Record<string, number[]> {
  const map: Record<string, number[]> = {};
  for (const w of worlds) for (const l of w.levels) map[l.id] = l.concepts;
  return map;
}

export function levelStub(levelId: string) {
  for (const w of worlds) {
    const found = w.levels.find((l) => l.id === levelId);
    if (found) return { world: w, stub: found };
  }
  return undefined;
}
