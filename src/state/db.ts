import Dexie, { type EntityTable } from "dexie";
import type { Difficulty, EgoState, LevelResult, Tag } from "../content/types";

export interface ResultRow extends LevelResult {
  autoId?: number;
}

export interface JournalRow {
  autoId?: number;
  worldId: number;
  prompt: string;
  text: string;
  at: number;
}

export interface SettingRow {
  key: string;
  value: unknown;
}

class TaArenaDB extends Dexie {
  results!: EntityTable<ResultRow, "autoId">;
  journal!: EntityTable<JournalRow, "autoId">;
  settings!: EntityTable<SettingRow, "key">;

  constructor() {
    super("ta-arena");
    this.version(1).stores({
      results: "++autoId, levelId, level, at",
      journal: "++autoId, worldId, at",
      settings: "key",
    });
  }
}

export const db = new TaArenaDB();

export async function recordResult(
  levelId: string,
  level: Difficulty,
  score: number,
  tags: Tag[],
  egoStates: EgoState[],
): Promise<void> {
  await db.results.add({ levelId, level, score, tags, egoStates, at: Date.now() });
}

export async function resultsForLevel(levelId: string): Promise<ResultRow[]> {
  return db.results.where("levelId").equals(levelId).toArray();
}

export async function allResults(): Promise<ResultRow[]> {
  return db.results.toArray();
}

export async function exportProgress(): Promise<string> {
  const [results, journal, settings] = await Promise.all([
    db.results.toArray(),
    db.journal.toArray(),
    db.settings.toArray(),
  ]);
  return JSON.stringify({ results, journal, settings }, null, 2);
}

export async function importProgress(json: string): Promise<void> {
  const data = JSON.parse(json) as {
    results: ResultRow[];
    journal: JournalRow[];
    settings: SettingRow[];
  };
  await db.transaction("rw", db.results, db.journal, db.settings, async () => {
    await db.results.clear();
    await db.journal.clear();
    await db.settings.clear();
    if (data.results?.length) await db.results.bulkAdd(data.results.map(({ autoId: _autoId, ...r }) => r));
    if (data.journal?.length) await db.journal.bulkAdd(data.journal.map(({ autoId: _autoId, ...r }) => r));
    if (data.settings?.length) await db.settings.bulkAdd(data.settings);
  });
}
