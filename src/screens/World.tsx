import { useEffect, useState } from "react";
import { useSession } from "../state/store";
import { allResults } from "../state/db";
import { worldById } from "../content/registry";
import { isBossUnlocked } from "../state/mastery";
import { WorldIcon } from "../ui/WorldIcon";
import { playTap } from "../ui/sound";

const WORLD_THEMES: Record<number, { accent: string; badge: string; bg: string }> = {
  1: { accent: "text-amber-400", badge: "border-amber-500/40 bg-amber-500/10", bg: "from-amber-950/40 via-slate-900 to-slate-950" },
  2: { accent: "text-cyan-400", badge: "border-cyan-500/40 bg-cyan-500/10", bg: "from-cyan-950/40 via-slate-900 to-slate-950" },
  3: { accent: "text-purple-400", badge: "border-purple-500/40 bg-purple-500/10", bg: "from-purple-950/40 via-slate-900 to-slate-950" },
  4: { accent: "text-rose-400", badge: "border-rose-500/40 bg-rose-500/10", bg: "from-rose-950/40 via-slate-900 to-slate-950" },
  5: { accent: "text-teal-400", badge: "border-teal-500/40 bg-teal-500/10", bg: "from-teal-950/40 via-slate-900 to-slate-950" },
  6: { accent: "text-emerald-400", badge: "border-emerald-500/40 bg-emerald-500/10", bg: "from-emerald-950/40 via-slate-900 to-slate-950" },
  7: { accent: "text-yellow-400", badge: "border-yellow-500/40 bg-yellow-500/10", bg: "from-yellow-950/40 via-slate-900 to-slate-950" },
};

export function World() {
  const { params, navigate, playerLevel } = useSession();
  const world = params.worldId ? worldById(params.worldId) : undefined;
  const [attempted, setAttempted] = useState<Set<string>>(new Set());
  const [bossReady, setBossReady] = useState(false);

  useEffect(() => {
    if (!world) return;
    allResults().then((results) => {
      setAttempted(new Set(results.map((r) => r.levelId)));
      const firstFive = world.levels.filter((l) => !l.boss).map((l) => l.id);
      setBossReady(isBossUnlocked(results, firstFive, playerLevel));
    });
  }, [world, playerLevel]);

  if (!world) {
    return (
      <div className="max-w-[540px] mx-auto px-4 pt-8">
        <div className="text-[17px] text-slate-200">World not found.</div>
        <button
          className="text-ta-yellow font-bold mt-4 flex items-center gap-1"
          onClick={() => {
            playTap();
            navigate("home");
          }}
        >
          &larr; Back to Home
        </button>
      </div>
    );
  }

  const themeStyle = WORLD_THEMES[world.id] || WORLD_THEMES[1];

  return (
    <div className="max-w-[540px] mx-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-12 flex flex-col gap-6">
      {/* Back button */}
      <button
        className="ta-tap self-start px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 hover:border-slate-500 text-xs font-mono text-slate-300 flex items-center gap-1.5 backdrop-blur-md transition-colors"
        onClick={() => {
          playTap();
          navigate("home");
        }}
      >
        <span>&larr;</span>
        <span>All Worlds</span>
      </button>

      {/* World Hero Banner */}
      <header
        className={`rounded-3xl border border-white/15 bg-gradient-to-br ${themeStyle.bg} p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden`}
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/15 flex items-center justify-center shrink-0 shadow-inner">
            <WorldIcon world={world.id} size={38} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono uppercase tracking-widest font-black ${themeStyle.accent}`}>
                World {world.id}
              </span>
              <span className="text-slate-500 text-xs">&bull;</span>
              <span className="text-slate-400 text-xs font-mono font-bold uppercase">
                {playerLevel} Track
              </span>
            </div>

            <h1 className="text-[26px] sm:text-[30px] font-black tracking-tight text-white leading-tight mt-1">
              {world.theme}
            </h1>

            <div className="text-[13px] text-slate-300 mt-1 leading-relaxed">
              {world.unlocks}
            </div>
          </div>
        </div>
      </header>

      {/* Levels Mission Path */}
      <section className="flex flex-col gap-3">
        <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 px-1">
          Mission Levels ({world.levels.length})
        </div>

        {world.levels.map((l, i) => {
          const isBoss = Boolean(l.boss);
          const prevAttempted = i === 0 || attempted.has(world.levels[i - 1].id);
          const isCompleted = attempted.has(l.id);
          const unlocked = isBoss ? bossReady : prevAttempted;

          // Boss Level card: dramatic high-stakes visual
          if (isBoss) {
            return (
              <button
                key={l.id}
                disabled={!unlocked}
                onClick={() => {
                  playTap();
                  navigate("level", { worldId: world.id, levelId: l.id });
                }}
                className={`ta-fade text-left rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden select-none ${
                  unlocked
                    ? "bg-gradient-to-r from-yellow-950/60 via-amber-900/40 to-slate-900 border-ta-yellow/60 shadow-[0_0_24px_rgba(255,252,0,0.2)] hover:shadow-[0_0_32px_rgba(255,252,0,0.4)] hover:-translate-y-0.5 cursor-pointer"
                    : "bg-slate-950/40 border-slate-800 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-black uppercase tracking-wider text-ta-yellow">
                    <span>👑</span>
                    <span>WORLD BOSS CLIMAX</span>
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-ta-yellow/20 text-ta-yellow border border-ta-yellow/30 font-bold">
                    {l.mechanic}
                  </span>
                </div>

                <div className="text-[19px] font-black text-white">{l.title}</div>

                <div className="text-xs text-slate-300 mt-1">
                  {unlocked
                    ? "The decisive psychological confrontation of this world."
                    : "Complete previous levels with ≥60% mastery to unlock this boss."}
                </div>
              </button>
            );
          }

          // Regular Level Card
          return (
            <button
              key={l.id}
              disabled={!unlocked}
              onClick={() => {
                playTap();
                navigate("level", { worldId: world.id, levelId: l.id });
              }}
              className={`ta-fade text-left rounded-2xl p-4 border flex items-center justify-between gap-3 transition-all duration-150 select-none ${
                unlocked
                  ? "bg-slate-900/80 border-white/10 hover:border-slate-500 hover:bg-slate-850 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                  : "bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-50"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : unlocked
                      ? "bg-ta-yellow/15 text-ta-yellow border-ta-yellow/30"
                      : "bg-slate-900 text-slate-600 border-slate-800"
                  }`}
                >
                  {isCompleted ? "✓" : l.id}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 uppercase">
                      {l.mechanic}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        COMPLETED
                      </span>
                    )}
                  </div>
                  <div className="text-[16px] font-bold text-white truncate">{l.title}</div>
                </div>
              </div>

              <div className="shrink-0">
                {unlocked ? (
                  <span className="text-xs font-mono text-ta-yellow flex items-center gap-1 font-bold">
                    <span>PLAY</span>
                    <span>&rarr;</span>
                  </span>
                ) : (
                  <span className="text-xs font-mono text-slate-600">🔒</span>
                )}
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}
