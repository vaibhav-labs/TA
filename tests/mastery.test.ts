import { describe, expect, it } from "vitest";
import {
  bestScore,
  computeConceptMastery,
  conceptsHeldCount,
  gameFreeStreak,
  isBossUnlocked,
  isWorldUnlocked,
  kFor,
  masteryByConcept,
  masteryStatus,
  playerEgogram,
  updateMastery,
  worldAccuracy,
} from "../src/state/mastery";

describe("kFor", () => {
  it("returns the section 8 constants", () => {
    expect(kFor("L1")).toBe(0.35);
    expect(kFor("L2")).toBe(0.5);
    expect(kFor("L3")).toBe(0.6);
  });
});

describe("updateMastery", () => {
  it("moves mastery toward the score by k", () => {
    expect(updateMastery(0, 100, "L1")).toBeCloseTo(35);
    expect(updateMastery(50, 100, "L2")).toBeCloseTo(75);
    expect(updateMastery(50, 0, "L3")).toBeCloseTo(20);
  });

  it("clamps to [0, 100]", () => {
    expect(updateMastery(95, 100, "L3")).toBeLessThanOrEqual(100);
    expect(updateMastery(5, 0, "L3")).toBeGreaterThanOrEqual(0);
  });
});

describe("computeConceptMastery", () => {
  it("folds touches in order, L3 moving fastest", () => {
    const m = computeConceptMastery([
      { score: 100, level: "L1" },
      { score: 100, level: "L2" },
      { score: 100, level: "L3" },
    ]);
    // 0 -> 35 -> 67.5 -> 87
    expect(m).toBeCloseTo(87, 0);
  });

  it("is empty-safe", () => {
    expect(computeConceptMastery([])).toBe(0);
  });
});

describe("masteryStatus", () => {
  it("is held only at >=80 with both a Play and an Analyse touch", () => {
    expect(masteryStatus(90, ["L1"])).toBe("seen"); // high score but no L2/L3 touch
    expect(masteryStatus(90, ["L2", "L3"])).toBe("held");
    expect(masteryStatus(60, ["L2", "L3"])).toBe("seen");
    expect(masteryStatus(10, [])).toBe("open");
  });
});

describe("masteryByConcept + conceptsHeldCount", () => {
  it("attributes a level's score to every concept it touches", () => {
    const levelConcepts = { "3-3": [18, 21] };
    const results = [
      { levelId: "3-3", level: "L1" as const, score: 100, tags: [], egoStates: [], at: 1 },
      { levelId: "3-3", level: "L2" as const, score: 100, tags: [], egoStates: [], at: 2 },
      { levelId: "3-3", level: "L3" as const, score: 100, tags: [], egoStates: [], at: 3 },
    ];
    const map = masteryByConcept(results, levelConcepts);
    expect(map[18].status).toBe("held");
    expect(map[21].status).toBe("held");
    expect(conceptsHeldCount(map)).toBe(2);
  });
});

describe("boss / world unlock thresholds", () => {
  const results = [
    { levelId: "1-1", level: "L1" as const, score: 80, tags: [], egoStates: [], at: 1 },
    { levelId: "1-2", level: "L1" as const, score: 40, tags: [], egoStates: [], at: 2 },
    { levelId: "1-6", level: "L1" as const, score: 75, tags: [], egoStates: [], at: 3 },
  ];

  it("bestScore picks the max for a levelId+difficulty", () => {
    expect(bestScore(results, "1-1", "L1")).toBe(80);
    expect(bestScore(results, "1-1", "L2")).toBe(0);
  });

  it("worldAccuracy averages across the given levels, missing = 0", () => {
    expect(worldAccuracy(results, ["1-1", "1-2", "1-3", "1-4", "1-5"], "L1")).toBeCloseTo(24, 0);
  });

  it("isBossUnlocked requires >=60% average on the first five levels", () => {
    expect(isBossUnlocked(results, ["1-1", "1-2", "1-3", "1-4", "1-5"], "L1")).toBe(false);
    const strong = [
      { levelId: "1-1", level: "L1" as const, score: 70, tags: [], egoStates: [], at: 1 },
      { levelId: "1-2", level: "L1" as const, score: 70, tags: [], egoStates: [], at: 2 },
      { levelId: "1-3", level: "L1" as const, score: 70, tags: [], egoStates: [], at: 3 },
      { levelId: "1-4", level: "L1" as const, score: 70, tags: [], egoStates: [], at: 4 },
      { levelId: "1-5", level: "L1" as const, score: 70, tags: [], egoStates: [], at: 5 },
    ];
    expect(isBossUnlocked(strong, ["1-1", "1-2", "1-3", "1-4", "1-5"], "L1")).toBe(true);
  });

  it("isWorldUnlocked requires >=70% on the boss", () => {
    expect(isWorldUnlocked(results, "1-6", "L1")).toBe(true);
    expect(isWorldUnlocked(results, "1-1", "L1")).toBe(true);
    expect(isWorldUnlocked(results, "1-2", "L1")).toBe(false);
  });
});

describe("gameFreeStreak", () => {
  it("counts back from most recent while no game-move is hit", () => {
    const results = [
      { levelId: "a", level: "L2" as const, score: 100, tags: ["best" as const], egoStates: [], at: 1 },
      { levelId: "b", level: "L2" as const, score: 0, tags: ["game-move" as const], egoStates: [], at: 2 },
      { levelId: "c", level: "L2" as const, score: 100, tags: ["best" as const], egoStates: [], at: 3 },
      { levelId: "d", level: "L2" as const, score: 50, tags: ["ok" as const], egoStates: [], at: 4 },
    ];
    expect(gameFreeStreak(results)).toBe(2);
  });

  it("ignores results with no tags (Diagnose/Fields) and is empty-safe", () => {
    const results = [
      { levelId: "a", level: "L1" as const, score: 100, tags: [], egoStates: [], at: 1 },
      { levelId: "b", level: "L2" as const, score: 100, tags: ["best" as const], egoStates: [], at: 2 },
    ];
    expect(gameFreeStreak(results)).toBe(1);
    expect(gameFreeStreak([])).toBe(0);
  });
});

describe("playerEgogram", () => {
  it("returns five integers summing to 100", () => {
    const eg = playerEgogram(["NP", "NP", "NP", "NP", "NP", "NP", "NP", "A", "A", "A", "A", "AC"]);
    const total = Object.values(eg).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
    expect(eg.NP).toBeGreaterThan(eg.A);
  });

  it("maps structural P/C onto functional CP/FC and handles empty input", () => {
    const eg = playerEgogram([]);
    expect(Object.values(eg).reduce((a, b) => a + b, 0)).toBe(0);
    const eg2 = playerEgogram(["P", "C"]);
    expect(eg2.CP + eg2.FC).toBe(100);
  });
});
