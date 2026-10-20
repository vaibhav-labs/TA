import { useEffect, useState } from "react";
import { useSession } from "../state/store";
import { allResults } from "../state/db";
import { worlds, allLevelConcepts } from "../content/registry";
import { conceptsHeldCount, gameFreeStreak, isWorldUnlocked, masteryByConcept } from "../state/mastery";
import type { Difficulty } from "../content/types";
import { WorldIcon } from "../ui/WorldIcon";
import { isSoundEnabled, setSoundEnabled, playTap } from "../ui/sound";

const DIFFICULTIES: { key: Difficulty; label: string; badge: string; desc: string }[] = [
  { key: "L1", label: "Spot", badge: "L1", desc: "Diagnose cues & ego states" },
  { key: "L2", label: "Play", badge: "L2", desc: "Live dialogue & choices" },
  { key: "L3", label: "Analyse", badge: "L3", desc: "Vectors, scripts & theory" },
];

const WORLD_ACCENTS: Record<number, { border: string; glow: string; text: string; bg: string }> = {
  1: { border: "border-amber-500/40", glow: "hover:shadow-amber-500/20", text: "text-amber-400", bg: "from-amber-950/40 to-slate-900" },
  2: { border: "border-cyan-500/40", glow: "hover:shadow-cyan-500/20", text: "text-cyan-400", bg: "from-cyan-950/40 to-slate-900" },
  3: { border: "border-purple-500/40", glow: "hover:shadow-purple-500/20", text: "text-purple-400", bg: "from-purple-950/40 to-slate-900" },
  4: { border: "border-rose-500/40", glow: "hover:shadow-rose-500/20", text: "text-rose-400", bg: "from-rose-950/40 to-slate-900" },
  5: { border: "border-teal-500/40", glow: "hover:shadow-teal-500/20", text: "text-teal-400", bg: "from-teal-950/40 to-slate-900" },
  6: { border: "border-emerald-500/40", glow: "hover:shadow-emerald-500/20", text: "text-emerald-400", bg: "from-emerald-950/40 to-slate-900" },
  7: { border: "border-yellow-500/40", glow: "hover:shadow-yellow-500/20", text: "text-yellow-400", bg: "from-yellow-950/40 to-slate-900" },
};

export function Home() {
  const { navigate, playerLevel, setPlayerLevel } = useSession();
  const [held, setHeld] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [unlockedWorlds, setUnlockedWorlds] = useState<Set<number>>(new Set([1]));
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  useEffect(() => {
    let cancelled = false;
    allResults().then((results) => {
      if (cancelled) return;
      const map = masteryByConcept(results, allLevelConcepts());
      setHeld(conceptsHeldCount(map));
      setStreak(gameFreeStreak(results));
      setIsFirstTime(results.length === 0);

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

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playTap();
  }

  const progressPct = Math.round((held / 61) * 100);

  return (
    <div className="max-w-[540px] mx-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))] flex flex-col gap-6">
      {/* Top Header & HUD */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div>
              <h1 className="font-display italic text-[30px] font-medium tracking-tight leading-none text-white">
                you
                <span className="text-ta-yellow drop-shadow-[0_0_10px_rgba(255,252,0,0.85)]">.</span>
              </h1>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                42 games about how we talk
              </span>
            </div>
          </div>

          {/* Sound Mute / Unmute Toggle */}
          <button
            onClick={toggleSound}
            className="ta-tap px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 hover:border-slate-500 text-xs font-mono text-slate-300 flex items-center gap-1.5 backdrop-blur-md transition-colors"
            title={soundOn ? "Mute sound" : "Enable sound"}
          >
            <span>{soundOn ? "🔊" : "🔇"}</span>
            <span>{soundOn ? "SFX ON" : "SFX OFF"}</span>
          </button>
        </div>

        {/* Player Status HUD Bar */}
        <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-3.5 backdrop-blur-md shadow-xl flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span>Concepts Mastered:</span>
              <span className="font-mono text-ta-yellow font-bold">
                {held} <span className="text-slate-500 font-normal">/ 61</span>
              </span>
            </span>

            {streak > 0 ? (
              <span className="flex items-center gap-1 text-amber-400 font-mono font-bold bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full ta-pop">
                <span>🔥</span> {streak} Game-Free Streak
              </span>
            ) : (
              <span className="text-slate-500 font-mono text-[11px]">No active streak</span>
            )}
          </div>

          {/* Glowing segmented progress bar */}
          <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-ta-yellow to-emerald-400 transition-all duration-500 shadow-[0_0_8px_rgba(255,252,0,0.6)]"
              style={{ width: `${Math.max(progressPct, 3)}%` }}
            />
          </div>
        </div>
      </header>

      {/* First time intro banner */}
      {isFirstTime && (
        <section className="ta-fade rounded-2xl border border-ta-yellow/40 bg-gradient-to-br from-ta-yellow/15 via-slate-900 to-slate-950 p-4 flex flex-col gap-2.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-ta-yellow font-bold text-[15px]">
            <span>⚡</span>
            <span>Every scene here is really about you</span>
          </div>
          <div className="text-[14px] leading-relaxed text-slate-200">
            These aren't stories about strangers. Each one is a moment you've already lived: the flatmate who goes
            quiet instead of saying what's wrong, the colleague who jokes past every real question. Play it as
            yourself. Somewhere around World 5, you'll start catching the pattern in your own week, not just on
            screen.
          </div>
        </section>
      )}

      {/* Mode / Difficulty Selector */}
      <section className="flex flex-col gap-2">
        <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 px-1">
          Select Difficulty Track
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((d) => {
            const isSelected = playerLevel === d.key;
            return (
              <button
                key={d.key}
                onClick={() => {
                  playTap();
                  setPlayerLevel(d.key);
                }}
                className={`ta-tap flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "bg-gradient-to-b from-ta-yellow via-amber-300 to-yellow-400 text-slate-950 border-yellow-200 font-bold shadow-[0_0_18px_rgba(255,252,0,0.35)] scale-[1.02]"
                    : "bg-slate-900/70 text-slate-400 border-white/10 hover:border-slate-500 hover:text-slate-200"
                }`}
              >
                <span className="text-[14px] font-extrabold flex items-center gap-1">
                  {d.label}
                </span>
                <span className={`text-[10px] mt-0.5 leading-tight ${isSelected ? "text-slate-800" : "text-slate-500"}`}>
                  {d.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Campaign Worlds List */}
      <section className="flex flex-col gap-3.5">
        <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 px-1">
          Campaign Worlds
        </div>

        {worlds.map((w) => {
          const unlocked = unlockedWorlds.has(w.id);
          const style = WORLD_ACCENTS[w.id] || WORLD_ACCENTS[1];

          return (
            <button
              key={w.id}
              disabled={!unlocked}
              onClick={() => {
                playTap();
                navigate("world", { worldId: w.id });
              }}
              className={`ta-fade text-left rounded-2xl p-4 flex items-center gap-4 border transition-all duration-200 relative overflow-hidden group select-none ${
                unlocked
                  ? `bg-gradient-to-r ${style.bg} ${style.border} ${style.glow} hover:-translate-y-0.5 hover:shadow-xl cursor-pointer`
                  : "bg-slate-950/40 border-slate-800/60 opacity-60 cursor-not-allowed"
              }`}
            >
              {/* World Icon Pedestal */}
              <div
                className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 shadow-inner ${
                  unlocked
                    ? "bg-slate-900/90 border-white/15"
                    : "bg-black/50 border-slate-800"
                }`}
              >
                <WorldIcon world={w.id} size={30} />
              </div>

              {/* World Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono uppercase tracking-wider font-bold ${style.text}`}>
                    World {w.id}
                  </span>
                  <span className="text-slate-500 text-xs">&bull;</span>
                  <span className="text-slate-400 text-xs truncate">{w.subtitle}</span>
                </div>

                <div className="text-[18px] font-extrabold text-white leading-tight mt-0.5 group-hover:text-ta-yellow transition-colors">
                  {w.theme}
                </div>

                <div className="text-[12px] text-slate-400 truncate mt-1">
                  {w.unlocks}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="shrink-0 flex flex-col items-end justify-center">
                {unlocked ? (
                  <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-ta-yellow group-hover:text-black text-slate-300 flex items-center justify-center text-xs font-bold transition-all shadow-sm">
                    &rarr;
                  </span>
                ) : (
                  <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                    🔒 Locked
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}
