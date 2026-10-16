import { useState } from "react";
import type { ChoiceStoryLevel, EgoState, Tag } from "../content/types";
import { Button } from "../ui/Button";
import { DialogueRow, Callout } from "../ui/Dialogue";
import { playGameMove, playSuccess, playTap } from "../ui/sound";

interface ChoiceStoryProps {
  level: ChoiceStoryLevel;
  playerName?: string;
  onComplete: (result: { score: number; tags: Tag[]; egoStates: EgoState[] }) => void;
}

const TAG_SCORE: Record<Tag, number> = { best: 100, ok: 50, "game-move": 0 };

const EGO_LABELS: Record<EgoState, { name: string; color: string }> = {
  P: { name: "Parent", color: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
  CP: { name: "Critical Parent", color: "bg-rose-600/20 text-rose-300 border-rose-600/40" },
  NP: { name: "Nurturing Parent", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  A: { name: "Adult", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  C: { name: "Child", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" },
  FC: { name: "Free Child", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  AC: { name: "Adapted Child", color: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
};

/** Choice-story engine: a real back-and-forth scenario with psychological feedback. */
export function ChoiceStory({ level, playerName = "You", onComplete }: ChoiceStoryProps) {
  const [beatIndex, setBeatIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [egoStates, setEgoStates] = useState<EgoState[]>([]);
  const [ended, setEnded] = useState(false);

  const beat = level.beats[beatIndex];
  const option = chosen !== null ? beat.options[chosen] : null;

  function pick(i: number) {
    const opt = beat.options[i];
    setChosen(i);
    const nextTags = [...tags, opt.tag];
    const nextEgo = [...egoStates, opt.egoState];
    setTags(nextTags);
    setEgoStates(nextEgo);

    if (opt.tag === "best") {
      playSuccess();
    } else if (opt.tag === "game-move") {
      playGameMove();
    } else {
      playTap();
    }

    if (opt.tag === "game-move" || beatIndex === level.beats.length - 1) {
      setEnded(true);
    }
  }

  function advance() {
    setBeatIndex((i) => i + 1);
    setChosen(null);
  }

  function finish() {
    const score = tags.length ? tags.reduce((a, t) => a + TAG_SCORE[t], 0) / tags.length : 0;
    onComplete({ score, tags, egoStates });
  }

  return (
    <div className="flex flex-col gap-5">
      {level.intro && (
        <div className="rounded-xl bg-slate-900/70 border border-white/10 p-3.5 text-[15px] leading-relaxed text-slate-300 backdrop-blur-sm">
          <span className="text-ta-yellow font-bold mr-1">&rsaquo;</span>
          {level.intro}
        </div>
      )}

      {/* NPC Dialogue with behavioral cues if present */}
      <div className="flex flex-col gap-2">
        <DialogueRow
          name={beat.npc}
          text={beat.line}
          expression={beat.expression}
          active={chosen === null}
        />

        {beat.cues && beat.cues.length > 0 && chosen === null && (
          <div className="flex items-center gap-1.5 pl-14 flex-wrap">
            <span className="text-[11px] text-slate-400 font-mono">Observable cues:</span>
            {beat.cues.map((cue, ci) => (
              <span
                key={ci}
                className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 font-medium"
              >
                &ldquo;{cue}&rdquo;
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Player options */}
      {chosen === null && (
        <div className="flex flex-col gap-2.5 mt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] font-mono uppercase tracking-wider text-ta-yellow font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-ta-yellow animate-ping" />
              {playerName}&rsquo;s move
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Choose your response
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {beat.options.map((opt, i) => (
              <Button key={i} onClick={() => pick(i)}>
                {opt.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Outcome & Psychological Debrief */}
      {option && (
        <div className="ta-fade flex flex-col gap-4 mt-1">
          {/* Reaction status banner */}
          {option.tag === "best" ? (
            <div className="rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 p-3 flex items-center justify-between text-emerald-200 ta-pop shadow-lg">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-black">
                  ✓
                </span>
                <span>Breakthrough &bull; Adult-to-Adult Established</span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                +100 PTS
              </span>
            </div>
          ) : option.tag === "game-move" ? (
            <div className="rounded-xl bg-gradient-to-r from-rose-950/90 to-slate-900 border border-rose-500/50 p-3 flex items-center justify-between text-rose-200 ta-shake shadow-lg">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-black">
                  !
                </span>
                <span>Game Move Triggered &bull; The Switch Sprung</span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/30">
                LOOP CONTINUES
              </span>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-900 border border-slate-700/80 p-3 flex items-center justify-between text-slate-200 ta-pop">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs">
                  &bull;
                </span>
                <span>Complementary &bull; Keeps pattern alive</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                +50 PTS
              </span>
            </div>
          )}

          {/* Dialogue exchange */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-end gap-1">
              <DialogueRow
                name={playerName}
                text={option.text}
                side="right"
                tone="player"
                active={false}
              />
              {/* Ego state tag for player's move */}
              <div className="mr-14">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold ${
                    EGO_LABELS[option.egoState]?.color || "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  From: {EGO_LABELS[option.egoState]?.name || option.egoState}
                </span>
              </div>
            </div>

            <DialogueRow
              name={beat.npc}
              text={option.outcome}
              expression={option.outcomeExpression ?? "neutral"}
            />
          </div>

          {/* Psychological analysis callout */}
          <Callout label="Why">{option.lesson}</Callout>

          {/* Advance button */}
          {!ended ? (
            <Button variant="ghost" onClick={advance} className="mt-2">
              Continue to next beat &rarr;
            </Button>
          ) : (
            <Button variant="primary" onClick={finish} className="mt-2">
              Complete Scenario &rarr;
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
