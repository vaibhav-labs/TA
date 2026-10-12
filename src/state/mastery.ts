import type { Difficulty, EgoState, LevelResult } from "../content/types";

/** Learning-rate constant k from section 8: higher levels move the score faster. */
export function kFor(level: Difficulty): number {
  switch (level) {
    case "L1":
      return 0.35;
    case "L2":
      return 0.5;
    case "L3":
      return 0.6;
  }
}

/** M_{t+1} = M_t + k * (s - M_t) */
export function updateMastery(prevM: number, score: number, level: Difficulty): number {
  const k = kFor(level);
  const next = prevM + k * (score - prevM);
  return Math.max(0, Math.min(100, next));
}

/** Folds a chronological sequence of {score, level} touches into a final mastery 0-100. */
export function computeConceptMastery(touches: { score: number; level: Difficulty }[]): number {
  return touches.reduce((m, t) => updateMastery(m, t.score, t.level), 0);
}

export type MasteryStatus = "held" | "seen" | "open";

export function masteryStatus(mastery: number, levelsTouched: Difficulty[]): MasteryStatus {
  const touchedPlay = levelsTouched.includes("L2");
  const touchedAnalyse = levelsTouched.includes("L3");
  if (mastery >= 80 && touchedPlay && touchedAnalyse) return "held";
  if (mastery >= 50) return "seen";
  return "open";
}

/** Groups raw result rows by the concepts each level touches, then folds mastery per concept. */
export function masteryByConcept(
  results: LevelResult[],
  levelConcepts: Record<string, number[]>,
): Record<number, { mastery: number; levelsTouched: Difficulty[]; status: MasteryStatus }> {
  const touches: Record<number, { score: number; level: Difficulty; at: number }[]> = {};
  for (const r of results) {
    const concepts = levelConcepts[r.levelId] ?? [];
    for (const c of concepts) {
      (touches[c] ??= []).push({ score: r.score, level: r.level, at: r.at });
    }
  }
  const out: Record<number, { mastery: number; levelsTouched: Difficulty[]; status: MasteryStatus }> = {};
  for (const [conceptId, list] of Object.entries(touches)) {
    const sorted = [...list].sort((a, b) => a.at - b.at);
    const mastery = computeConceptMastery(sorted);
    const levelsTouched = sorted.map((t) => t.level);
    out[Number(conceptId)] = { mastery, levelsTouched, status: masteryStatus(mastery, levelsTouched) };
  }
  return out;
}

export function conceptsHeldCount(
  masteryMap: Record<number, { status: MasteryStatus }>,
): number {
  return Object.values(masteryMap).filter((m) => m.status === "held").length;
}

/** Boss pass threshold at the player's difficulty (section 8: >= 70%). */
export const BOSS_PASS_THRESHOLD = 70;

/** Threshold for a boss to unlock, as an average over the world's first five levels (section 8: >= 60%). */
export const BOSS_UNLOCK_THRESHOLD = 60;

/** Level-recommendation thresholds (section 8). */
export const LEVEL_UP_THRESHOLD = 85;
export const LEVEL_DOWN_THRESHOLD = 50;

export function bestScore(results: LevelResult[], levelId: string, level: Difficulty): number {
  const matches = results.filter((r) => r.levelId === levelId && r.level === level);
  return matches.length ? Math.max(...matches.map((r) => r.score)) : 0;
}

export function worldAccuracy(results: LevelResult[], levelIds: string[], level: Difficulty): number {
  if (!levelIds.length) return 0;
  const scores = levelIds.map((id) => bestScore(results, id, level));
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function isBossUnlocked(results: LevelResult[], firstFiveLevelIds: string[], level: Difficulty): boolean {
  return worldAccuracy(results, firstFiveLevelIds, level) >= BOSS_UNLOCK_THRESHOLD;
}

export function isWorldUnlocked(results: LevelResult[], bossLevelId: string, level: Difficulty): boolean {
  return bestScore(results, bossLevelId, level) >= BOSS_PASS_THRESHOLD;
}

/** The five functional ego states an egogram is built from (section 2, 8). */
const FUNCTIONAL_STATES: EgoState[] = ["CP", "NP", "A", "FC", "AC"];

/** Player egogram: five integers that sum to 100, built from every choice-story tag (section 8). */
export function playerEgogram(egoStates: EgoState[]): Record<EgoState, number> {
  const counts: Record<string, number> = { CP: 0, NP: 0, A: 0, FC: 0, AC: 0 };
  for (const e of egoStates) {
    const key = e === "P" ? "CP" : e === "C" ? "FC" : e;
    if (key in counts) counts[key] += 1;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const result: Record<string, number> = { CP: 0, NP: 0, A: 0, FC: 0, AC: 0 };
  if (total === 0) return result as Record<EgoState, number>;

  const raw = FUNCTIONAL_STATES.map((s) => (counts[s] / total) * 100);
  const floors = raw.map(Math.floor);
  let remainder = 100 - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - floors[i] }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < order.length && remainder > 0; k++, remainder--) {
    floors[order[k].i] += 1;
  }
  FUNCTIONAL_STATES.forEach((s, i) => (result[s] = floors[i]));
  return result as Record<EgoState, number>;
}
