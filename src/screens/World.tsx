import { useEffect, useState } from "react";
import { useSession } from "../state/store";
import { allResults } from "../state/db";
import { worldById } from "../content/registry";
import { isBossUnlocked } from "../state/mastery";

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
      <div className="max-w-[480px] mx-auto px-4 pt-8">
        <div className="text-[17px]">World not found.</div>
        <button className="text-ta-yellow mt-4" onClick={() => navigate("home")}>
          &larr; Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-10 flex flex-col gap-5">
      <button className="text-ta-yellow text-[13px] self-start" onClick={() => navigate("home")}>
        &larr; Home
      </button>
      <header>
        <div className="text-[13px] leading-[18px] text-ta-grey">World {world.id}</div>
        <h1 className="text-[28px] leading-8 font-bold">{world.theme}</h1>
        <div className="text-[17px] leading-6 text-ta-grey">{world.unlocks}</div>
      </header>

      <section className="flex flex-col gap-3">
        {world.levels.map((l, i) => {
          const isBoss = Boolean(l.boss);
          const prevAttempted = i === 0 || attempted.has(world.levels[i - 1].id);
          const unlocked = isBoss ? bossReady : prevAttempted;
          return (
            <button
              key={l.id}
              disabled={!unlocked}
              onClick={() => navigate("level", { worldId: world.id, levelId: l.id })}
              className={`ta-fade text-left rounded-xl p-4 ${
                unlocked
                  ? isBoss
                    ? "bg-ta-yellow text-ta-black"
                    : "bg-ta-white text-ta-black"
                  : "bg-transparent border-2 border-ta-grey text-ta-grey"
              }`}
            >
              <div className="text-[13px] leading-[18px] opacity-70">
                {isBoss ? "Boss" : l.id} &middot; {l.mechanic}
              </div>
              <div className="text-[17px] leading-6 font-semibold">{l.title}</div>
              {!unlocked && <div className="text-[13px] leading-[18px] mt-1">Locked</div>}
            </button>
          );
        })}
      </section>
    </div>
  );
}
