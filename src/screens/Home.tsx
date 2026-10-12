import { useEffect, useState } from "react";
import { useSession } from "../state/store";
import { allResults } from "../state/db";
import { worlds, allLevelConcepts } from "../content/registry";
import { conceptsHeldCount, isWorldUnlocked, masteryByConcept } from "../state/mastery";
import type { Difficulty } from "../content/types";

const DIFFICULTIES: { key: Difficulty; label: string; who: string }[] = [
  { key: "L1", label: "Spot", who: "Never heard of TA" },
  { key: "L2", label: "Play", who: "Knows the basics" },
  { key: "L3", label: "Analyse", who: "Coach or TA student" },
];

export function Home() {
  const { navigate, playerLevel, setPlayerLevel } = useSession();
  const [held, setHeld] = useState(0);
  const [unlockedWorlds, setUnlockedWorlds] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    let cancelled = false;
    allResults().then((results) => {
      if (cancelled) return;
      const map = masteryByConcept(results, allLevelConcepts());
      setHeld(conceptsHeldCount(map));

      const unlocked = new Set<number>([1]);
      for (let i = 0; i < worlds.length - 1; i++) {
        const w = worlds[i];
        const boss = w.levels.find((l) => l.boss);
        if (boss && isWorldUnlocked(results, boss.id, playerLevel)) {
          unlocked.add(worlds[i + 1].id);
        }
      }
      setUnlockedWorlds(unlocked);
    });
    return () => {
      cancelled = true;
    };
  }, [playerLevel]);

  return (
    <div className="max-w-[480px] mx-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-[28px] leading-8 font-bold">TA Arena</h1>
        <div className="text-[17px] leading-6 text-ta-grey">Concepts held: {held} / 61</div>
      </header>

      <section className="flex flex-col gap-2">
        <div className="text-[13px] leading-[18px] text-ta-grey uppercase tracking-wide">Your level</div>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.key}
              onClick={() => setPlayerLevel(d.key)}
              className={`ta-tap flex-1 rounded-lg px-2 py-2 text-[13px] leading-[18px] border-2 ${
                playerLevel === d.key
                  ? "bg-ta-yellow text-ta-black border-ta-yellow font-semibold"
                  : "bg-transparent text-ta-grey border-ta-grey"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        {worlds.map((w) => {
          const unlocked = unlockedWorlds.has(w.id);
          return (
            <button
              key={w.id}
              disabled={!unlocked}
              onClick={() => navigate("world", { worldId: w.id })}
              className={`ta-fade text-left rounded-xl p-4 ${
                unlocked ? "bg-ta-white text-ta-black" : "bg-transparent border-2 border-ta-grey text-ta-grey"
              }`}
            >
              <div className="text-[13px] leading-[18px] opacity-70">World {w.id}</div>
              <div className="text-[17px] leading-6 font-semibold">{w.theme}</div>
              <div className="text-[13px] leading-[18px]">{w.subtitle}</div>
              {!unlocked && <div className="text-[13px] leading-[18px] mt-1">Locked</div>}
            </button>
          );
        })}
      </section>
    </div>
  );
}
