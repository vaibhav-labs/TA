import { useState } from "react";
import { useSession } from "../state/store";
import { recordResult } from "../state/db";
import { levels, levelStub, conceptById } from "../content/registry";
import { Diagnose } from "../engines/Diagnose";
import { ChoiceStory } from "../engines/ChoiceStory";
import { Fields } from "../engines/Fields";
import type { EgoState, Tag } from "../content/types";

export function Level() {
  const { params, navigate, playerLevel, setLastLevelId } = useSession();
  const levelId = params.levelId;
  const content = levelId ? levels[levelId] : undefined;
  const found = levelId ? levelStub(levelId) : undefined;
  const [showBook, setShowBook] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  if (!levelId || !found) {
    return (
      <div className="max-w-[480px] mx-auto px-4 pt-8">
        <div className="text-[17px]">Level not found.</div>
        <button className="text-ta-yellow mt-4" onClick={() => navigate("home")}>
          &larr; Home
        </button>
      </div>
    );
  }

  const { world, stub } = found;

  function goToLesson() {
    setLastLevelId(levelId!);
    navigate("lesson", { worldId: world.id, levelId });
  }

  function complete(score: number, tags: Tag[] = [], egoStates: EgoState[] = []) {
    recordResult(levelId!, playerLevel, Math.round(score), tags, egoStates).then(goToLesson);
  }

  const diff = content?.levels[playerLevel];
  const playerName = content?.playAs?.split(",")[0]?.trim() || "You";

  return (
    <div className="max-w-[480px] mx-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-10 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <button
          className="text-ta-yellow text-[13px] shrink-0"
          onClick={() => navigate("world", { worldId: world.id })}
        >
          &larr; {world.theme}
        </button>
        <div className="flex gap-1.5 shrink-0">
          <button
            aria-label="Lesson"
            title="Lesson"
            onClick={goToLesson}
            className="ta-tap w-9 h-9 rounded-full border border-ta-grey/50 text-ta-grey text-[13px] flex items-center justify-center"
          >
            L
          </button>
          <button
            aria-label="Book source"
            title="Book"
            onClick={() => setShowBook((s) => !s)}
            className="ta-tap w-9 h-9 rounded-full border border-ta-grey/50 text-ta-grey text-[13px] flex items-center justify-center"
          >
            B
          </button>
          <button
            aria-label="Replay"
            title="Replay"
            onClick={() => setReplayKey((k) => k + 1)}
            className="ta-tap w-9 h-9 rounded-full border border-ta-grey/50 text-ta-grey text-[13px] flex items-center justify-center"
          >
            &#8635;
          </button>
        </div>
      </div>

      <header className="flex flex-col gap-1">
        <div className="text-[13px] leading-[18px] text-ta-grey">
          {stub.boss ? (
            <span className="text-ta-yellow font-semibold">Boss</span>
          ) : (
            <>{stub.id}</>
          )}{" "}
          &middot; {playerLevel}
        </div>
        <h1 className="text-[28px] leading-8 font-bold">{stub.title}</h1>
        {content && <div className="text-[17px] leading-6 text-ta-grey">{content.setting}</div>}
        {content?.playAs && (
          <div className="mt-1 inline-flex items-center gap-1.5 self-start rounded-full bg-ta-yellow/15 border border-ta-yellow/40 px-3 py-1 text-[13px] leading-[18px] text-ta-yellow">
            You&rsquo;re playing as {content.playAs}
          </div>
        )}
      </header>

      {showBook && content && (
        <div className="ta-fade bg-ta-white text-ta-black rounded-xl p-4 text-[17px] leading-6">
          <div className="font-semibold">
            {content.source.book}, ch.{content.source.chapter}
          </div>
          <div className="italic">&ldquo;{content.source.quote}&rdquo;</div>
        </div>
      )}
      {showBook && !content && (
        <div className="ta-fade bg-ta-white text-ta-black rounded-xl p-4 text-[17px] leading-6">
          {stub.concepts.map((cid) => {
            const c = conceptById(cid);
            return c ? (
              <div key={cid}>
                {c.concept} &mdash; {c.source}
              </div>
            ) : null;
          })}
        </div>
      )}

      {!content && (
        <div className="ta-fade bg-ta-white text-ta-black rounded-xl p-4 flex flex-col gap-2">
          <div className="text-[17px] leading-6 font-semibold">Coming soon</div>
          <div className="text-[17px] leading-6">{stub.playsLike}</div>
          <div className="text-[13px] leading-[18px] text-ta-grey">
            Mechanic: {stub.mechanic} &middot; Concepts: {stub.concepts.join(", ")}
          </div>
        </div>
      )}

      {content && !diff && (
        <div className="ta-fade bg-ta-white text-ta-black rounded-xl p-4 text-[17px] leading-6">
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
        <Fields key={replayKey} level={diff} onComplete={({ score }) => complete(score)} />
      )}
    </div>
  );
}
