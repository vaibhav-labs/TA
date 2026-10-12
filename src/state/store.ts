import { create } from "zustand";
import type { Difficulty } from "../content/types";

export type Screen = "home" | "world" | "level" | "lesson";

interface NavParams {
  worldId?: number;
  levelId?: string;
}

interface SessionState {
  screen: Screen;
  playerLevel: Difficulty;
  params: NavParams;
  lastLevelId?: string;
  navigate: (screen: Screen, params?: NavParams) => void;
  setPlayerLevel: (level: Difficulty) => void;
  setLastLevelId: (levelId: string) => void;
}

export const useSession = create<SessionState>((set) => ({
  screen: "home",
  playerLevel: "L1",
  params: {},
  navigate: (screen, params = {}) => set({ screen, params }),
  setPlayerLevel: (level) => set({ playerLevel: level }),
  setLastLevelId: (levelId) => set({ lastLevelId: levelId }),
}));

if (import.meta.env.DEV) {
  (window as unknown as { __taArenaStore: typeof useSession }).__taArenaStore = useSession;
}
