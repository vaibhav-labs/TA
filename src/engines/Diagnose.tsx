import { useState } from "react";
import type { DiagnoseLevel } from "../content/types";
import { Button } from "../ui/Button";
import { DialogueRow, Callout } from "../ui/Dialogue";
import { playGameMove, playSuccess } from "../ui/sound";

interface DiagnoseProps {
  level: DiagnoseLevel;
  /** Keyword rubric for an optional L3 "why" field. Omit to skip it. */
  whyRubric?: string[];
  onComplete: (result: { score: number; correct: boolean }) => void;
}

/** Diagnose engine: read the moment, tap one option, see per-option feedback, then the lesson. */
export function Diagnose({ level, whyRubric, onComplete }: DiagnoseProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const [why, setWhy] = useState("");
  const [whySubmitted, setWhySubmitted] = useState(false);

  const correct = picked === level.answer;
  const needsWhy = Boolean(whyRubric?.length);

  function handlePick(i: number) {
    setPicked(i);
    if (i === level.answer) {
      playSuccess();
    } else {
      playGameMove();
    }
  }

  function finish() {
    const whyHits = whyRubric
      ? whyRubric.filter((kw) => why.toLowerCase().includes(kw.toLowerCase())).length
      : 0;
    const whyScore = whyRubric?.length ? (whyHits / whyRubric.length) * 100 : 100;
    const score = needsWhy ? (correct ? 100 : 0) * 0.5 + whyScore * 0.5 : correct ? 100 : 0;
    onComplete({ score, correct });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Dialogue / Scene prompt */}
      {level.npc && level.line ? (
        <DialogueRow name={level.npc} text={level.line} expression={level.expression} />
      ) : (
        <DialogueRow name="Scene" text={level.question} />
      )}

      {level.npc && (
        <div className="rounded-xl bg-slate-900/80 border border-white/10 p-3.5 text-[15px] leading-relaxed text-slate-200">
          <span className="text-ta-yellow font-bold mr-1">&bull;</span>
          {level.question}
        </div>
      )}

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        <div className="text-[12px] font-mono uppercase tracking-wider text-ta-grey px-1">
          Diagnose the Ego State
        </div>

        {level.options.map((opt, i) => {
          const isSelected = picked === i;
          const isCorrect = i === level.answer;
          let variant: "option" | "selected" | "game-move" = "option";

          if (picked !== null) {
            if (isSelected) {
              variant = isCorrect ? "selected" : "game-move";
            }
          }

          return (
            <Button
              key={i}
              variant={variant}
              disabled={picked !== null}
              onClick={() => handlePick(i)}
              className="relative"
            >
              <span>{opt.text}</span>
              {picked !== null && isSelected && (
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    isCorrect
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-400/30"
                  }`}
                >
                  {isCorrect ? "Correct ✓" : "Incorrect ×"}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Per-option feedback callout */}
      {picked !== null && (
        <Callout label={correct ? "Insight" : "Tell"}>
          {level.options[picked].feedback}
        </Callout>
      )}

      {/* L3 free-text why */}
      {picked !== null && needsWhy && !whySubmitted && (
        <div className="ta-fade rounded-2xl bg-slate-900/90 border border-white/10 p-4 flex flex-col gap-3 shadow-xl">
          <div className="text-[14px] font-semibold text-slate-200">
            Explain your diagnosis (under 60 words):
          </div>
          <textarea
            className="w-full rounded-xl p-3 text-slate-100 bg-black/50 border border-slate-700 focus:border-ta-yellow focus:outline-none text-[15px] leading-relaxed resize-none"
            rows={3}
            placeholder="Identify the behavioral cues and psychological level..."
            value={why}
            onChange={(e) => setWhy(e.target.value)}
          />
          <Button variant="ghost" onClick={() => setWhySubmitted(true)}>
            Submit Analysis
          </Button>
        </div>
      )}

      {/* Continue */}
      {picked !== null && (!needsWhy || whySubmitted) && (
        <Button variant="primary" onClick={finish} className="mt-2">
          Continue &rarr;
        </Button>
      )}
    </div>
  );
}
