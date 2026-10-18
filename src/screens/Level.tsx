import { useState } from "react";
import { useSession } from "../state/store";
import { recordResult } from "../state/db";
import { levels, levelStub, conceptById } from "../content/registry";
import { Diagnose } from "../engines/Diagnose";
import { ChoiceStory } from "../engines/ChoiceStory";
import { Fields } from "../engines/Fields";
import { Avatar } from "../ui/Avatar";
import { playTap } from "../ui/sound";
import type { EgoState, Tag } from "../content/types";

export function Level() {
  const { params, navigate, playerLevel, setLastLevelId } = useSession();
  const levelId = params.levelId;
  const content = levelId ? levels[levelId] : undefined;
  const found = levelId ? levelStub(levelId) : undefined;
  const [replayKey, setReplayKey] = useState(0);

  if (!levelId || !found) {
    return (
      <div className="max-w-[540px] mx-auto px-4 pt-8">
        <div className="text-[17px] text-slate-200">Level not found.</div>
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

  const { world, stub } = found;

  function goToLesson() {
    playTap();
    setLastLevelId(levelId!);
    navigate("lesson", { worldId: world.id, levelId });
  }

  function complete(score: number, tags: Tag[] = [], egoStates: EgoState[] = []) {
    recordResult(levelId!, playerLevel, Math.round(score), tags, egoStates).then(goToLesson);
  }

  const diff = content?.levels[playerLevel];
  const playerName = content?.playAs?.split(",")[0]?.trim() || "You";

  return (
    <div className="max-w-[540px] mx-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-12 flex flex-col gap-5">
      {/* Top Header Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          className="ta-tap px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 hover:border-slate-500 text-xs font-mono text-slate-300 flex items-center gap-1.5 backdrop-blur-md transition-colors"
          onClick={() => {
            playTap();
            navigate("world", { worldId: world.id });
          }}
        >
          <span>&larr;</span>
          <span>World {world.id}</span>
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            aria-label="View Lesson"
            title="Lesson Theory"
            onClick={goToLesson}
            className="ta-tap px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 hover:border-slate-500 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <span>🎓</span>
            <span className="hidden sm:inline">Theory</span>
          </button>

          <button
            aria-label="Replay Scenario"
            title="Replay"
            onClick={() => {
              playTap();
              setReplayKey((k) => k + 1);
            }}
            className="ta-tap w-8 h-8 rounded-full bg-slate-900/80 border border-white/10 hover:border-slate-500 text-slate-300 text-xs flex items-center justify-center transition-colors"
          >
            &#8635;
          </button>
        </div>
      </div>

      {/* Scenario Briefing Header */}
      <header className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-ta-yellow bg-ta-yellow/15 border border-ta-yellow/30 px-2 py-0.5 rounded-full">
              {stub.boss ? "👑 World Boss" : `Level ${stub.id}`}
            </span>
            <span className="text-slate-500 text-xs">&bull;</span>
            <span className="text-xs font-mono text-slate-400 font-semibold uppercase">
              {playerLevel} Mode
            </span>
          </div>

          <span className="text-xs font-mono text-slate-400 uppercase">
            {stub.mechanic}
          </span>
        </div>

        <div>
          <h1 className="text-[24px] sm:text-[28px] font-black text-white tracking-tight leading-tight">
            {stub.title}
          </h1>

          {content?.setting && (
            <div className="text-[14px] leading-relaxed text-slate-300 mt-1 flex items-start gap-1.5">
              <span className="text-ta-yellow shrink-0 mt-0.5">📍</span>
              <span>{content.setting}</span>
            </div>
          )}
        </div>

        {/* You play as role card */}
        {content?.playAs && (
          <div className="rounded-2xl bg-black/50 border border-white/10 p-3 flex items-center gap-3">
            <Avatar name={playerName} expression="neutral" size={42} />
            <div className="min-w-0">
              <div className="text-[11px] font-mono uppercase tracking-wider text-ta-yellow font-bold">
                You are playing as
              </div>
              <div className="text-[15px] font-bold text-white truncate">
                {content.playAs}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Honest placeholder for unfinished levels — never show stub.playsLike here,
          it's an internal design note ("the player runs a week...") written for
          building the level, not for a player reading it. */}
      {!content && (
        <div className="ta-fade rounded-3xl bg-slate-900/80 border border-white/10 p-6 flex flex-col gap-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-ta-yellow font-bold text-base">
            <span>🚧</span>
            <span>This level isn't built yet</span>
          </div>

          <div className="text-[15px] leading-relaxed text-slate-200">
            TA Arena is still early: only one level, <span className="font-bold text-white">3-3 &ldquo;Cross It&rdquo;</span>,
            is fully playable right now. The rest of the map is the plan for what's coming, not something you can play yet.
          </div>

          {stub.concepts.length > 0 && (
            <div className="text-[13px] leading-relaxed text-slate-300">
              <span className="text-slate-400">This level will teach: </span>
              {stub.concepts
                .map((cid) => conceptById(cid)?.concept)
                .filter(Boolean)
                .join(" · ")}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-1">
            <button
              className="ta-tap rounded-xl bg-ta-yellow text-slate-950 font-bold text-sm py-2.5 px-4"
              onClick={() => {
                playTap();
                navigate("level", { worldId: 3, levelId: "3-3" });
              }}
            >
              Play the finished level instead &rarr;
            </button>
            <button
              className="ta-tap rounded-xl bg-slate-800 text-slate-200 font-semibold text-sm py-2.5 px-4"
              onClick={() => {
                playTap();
                navigate("world", { worldId: world.id });
              }}
            >
              Back to {world.theme}
            </button>
          </div>
        </div>
      )}

      {/* Content Engine Switcher */}
      {content && !diff && (
        <div className="ta-fade rounded-2xl bg-slate-900 border border-white/10 p-5 text-slate-200">
          This level has no {playerLevel} content yet. Try another difficulty from Home.
        </div>
      )}

      {content && diff && "options" in diff && (
        <Diagnose
          key={replayKey}
          level={diff}
          onComplete={({ score }) => complete(score)}
        />
      )}

      {content && diff && "beats" in diff && (
        <ChoiceStory
          key={replayKey}
          level={diff}
          playerName={playerName}
          onComplete={({ score, tags, egoStates }) => complete(score, tags, egoStates)}
        />
      )}

      {content && diff && "fields" in diff && (
        <Fields
          key={replayKey}
          level={diff}
          onComplete={({ score }) => complete(score)}
        />
      )}
    </div>
  );
}
