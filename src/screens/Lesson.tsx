import { useEffect, useState } from "react";
import { useSession } from "../state/store";
import { conceptById, lessons, levelStub } from "../content/registry";
import { Button } from "../ui/Button";
import { playTap, playVictory } from "../ui/sound";

function LessonCardView({ conceptId }: { conceptId: number }) {
  const [expanded, setExpanded] = useState(false);
  const card = lessons[conceptId];
  const concept = conceptById(conceptId);
  if (!concept) return null;

  const name = card?.name ?? concept.concept.split(/[,:;(]/)[0].trim();
  const oneLine = card?.oneLine ?? concept.concept;
  const confusion = card?.confusion ?? (concept.confusion ? `Common confusion: ${concept.confusion}.` : null);
  const book = card?.fromBook.book ?? concept.source;

  return (
    <div className="ta-fade rounded-3xl bg-slate-900/90 border border-white/10 p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-3 relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-ta-yellow/50 to-transparent" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider font-bold text-ta-yellow bg-ta-yellow/15 border border-ta-yellow/30 px-2 py-0.5 rounded-full">
          Concept #{conceptId}
        </span>
        <span className="text-xs font-mono text-slate-400">Mastery Card</span>
      </div>

      <div className="text-[20px] font-black text-white leading-tight">{name}</div>

      <div className="text-[15px] leading-relaxed text-slate-200 bg-black/40 border border-white/5 rounded-2xl p-3.5">
        {oneLine}
      </div>

      {card && (
        <div className="text-[14px] leading-relaxed text-slate-300">
          <span className="text-ta-yellow font-bold mr-1">&bull;</span>
          {card.whatYouDid}
        </div>
      )}

      {confusion && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs leading-relaxed text-amber-200 flex items-start gap-2">
          <span className="font-bold text-amber-400 shrink-0">⚠ Note:</span>
          <span>{confusion}</span>
        </div>
      )}

      <div className="text-xs font-mono text-slate-400 pt-1">
        {book}
        {card && <span className="italic"> &mdash; &ldquo;{card.fromBook.quote}&rdquo;</span>}
      </div>

      {card?.expand && (
        <div className="pt-2 border-t border-white/10">
          <button
            className="text-xs font-mono font-bold text-ta-yellow flex items-center gap-1 hover:underline"
            onClick={() => {
              playTap();
              setExpanded((e) => !e);
            }}
          >
            <span>{expanded ? "▲ Hide Deep Theory" : "▼ Expand Deep Theory & Practical Application"}</span>
          </button>

          {expanded && (
            <div className="ta-fade flex flex-col gap-3 text-[14px] leading-relaxed text-slate-200 mt-3 pt-3 border-t border-white/5 bg-black/30 p-4 rounded-2xl">
              <div>{card.expand.definition}</div>
              {card.expand.otherFraming && (
                <div className="text-slate-300 italic">{card.expand.otherFraming}</div>
              )}
              <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3 text-emerald-200 font-medium">
                <span className="font-bold block text-emerald-400 mb-0.5 text-xs font-mono uppercase tracking-wider">
                  🎯 Try this today:
                </span>
                {card.expand.tryThisToday}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Lesson() {
  const { params, navigate } = useSession();
  const found = params.levelId ? levelStub(params.levelId) : undefined;

  useEffect(() => {
    // Play celebratory sound when arriving at the lesson
    playVictory();
  }, []);

  if (!found) {
    return (
      <div className="max-w-[540px] mx-auto px-4 pt-8">
        <div className="text-[17px] text-slate-200">Nothing to show.</div>
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

  return (
    <div className="max-w-[540px] mx-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-12 flex flex-col gap-5">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Level {stub.id} &bull; {stub.title}
        </span>
        <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
          Level Complete ✓
        </span>
      </div>

      <header>
        <h1 className="text-[28px] font-black text-white tracking-tight leading-tight">
          Psychological Debrief
        </h1>
        <div className="text-sm text-slate-400 mt-1">
          Review the core theory of the transactions you just encountered.
        </div>
      </header>

      {/* Mastery Cards */}
      <div className="flex flex-col gap-4">
        {stub.concepts.map((cid) => (
          <LessonCardView key={cid} conceptId={cid} />
        ))}
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col gap-2.5 mt-2">
        <Button
          variant="primary"
          onClick={() => {
            playTap();
            navigate("level", { worldId: world.id, levelId: stub.id });
          }}
        >
          Play this scenario again
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            playTap();
            navigate("world", { worldId: world.id });
          }}
        >
          Back to {world.theme}
        </Button>
      </div>
    </div>
  );
}
