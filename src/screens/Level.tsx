import { useState } from "react";
import { useSession } from "../state/store";
import { recordResult } from "../state/db";
import { levels, levelStub, conceptById } from "../content/registry";
import { Diagnose } from "../engines/Diagnose";
import { ChoiceStory } from "../engines/ChoiceStory";
import { Fields } from "../engines/Fields";
import { Button } from "../ui/Button";
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

  return (
    <div className="max-w-[480px] mx-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-10 flex flex-col gap-4">
      <button
        className="text-ta-yellow text-[13px] self-start"
        onClick={() => navigate("world", { worldId: world.id })}
      >
        &larr; {world.theme}
      </button>

      <header className="flex flex-col gap-1">
        <div className="text-[13px] leading-[18px] text-ta-grey">
          {stub.id} &middot; {playerLevel}
        </div>
        <h1 className="text-[28px] leading-8 font-bold">{stub.title}</h1>
        {content && <div className="text-[17px] leading-6 text-ta-grey">{content.setting}</div>}
      </header>

      <div className="flex gap-2">
        <Button variant="ghost" className="w-auto px-3 py-2 text-[13px]" onClick={goToLesson}>
          Lesson
        </Button>
        <Button variant="ghost" className="w-auto px-3 py-2 text-[13px]" onClick={() => setShowBook((s) => !s)}>
          Book
        </Button>
        <Button
          variant="ghost"
          className="w-auto px-3 py-2 text-[13px]"
          onClick={() => setReplayKey((k) => k + 1)}
        >
          Replay
        </Button>
      </div>

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
          onComplete={({ score, tags, egoStates }) => complete(score, tags, egoStates)}
        />
      )}
      {content && diff && "fields" in diff && (
        <Fields key={replayKey} level={diff} onComplete={({ score }) => complete(score)} />
      )}
    </div>
  );
}
