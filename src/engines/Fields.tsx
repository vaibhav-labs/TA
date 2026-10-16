import { useState } from "react";
import type { Field } from "../content/types";
import { Button } from "../ui/Button";
import { Vector } from "../ui/Vector";
import { playSuccess, playTap } from "../ui/sound";

interface FieldsProps {
  level: { fields: Field[] };
  onComplete: (result: { score: number }) => void;
}

/** The L3 "Build" / free-text field form: vector pairs plus rubric-graded text. */
export function Fields({ level, onComplete }: FieldsProps) {
  const [fieldScores, setFieldScores] = useState<(number | null)[]>(() => level.fields.map(() => null));
  const [, setPairScores] = useState<Record<number, (number | null)[]>>({});
  const [texts, setTexts] = useState<string[]>(() => level.fields.map(() => ""));
  const [submittedText, setSubmittedText] = useState<boolean[]>(() => level.fields.map(() => false));

  function setFieldScore(i: number, score: number) {
    setFieldScores((prev) => {
      const next = [...prev];
      next[i] = score;
      return next;
    });
  }

  function onPairChecked(fieldIndex: number, pairIndex: number, totalPairs: number, correct: boolean) {
    setPairScores((prev) => {
      const current = prev[fieldIndex] ? [...prev[fieldIndex]] : new Array(totalPairs).fill(null);
      current[pairIndex] = correct ? 100 : 0;
      const next = { ...prev, [fieldIndex]: current };
      if (current.every((v) => v !== null)) {
        const avg = (current as number[]).reduce((a, b) => a + b, 0) / current.length;
        setFieldScore(fieldIndex, avg);
      }
      return next;
    });
  }

  function submitText(i: number, field: Extract<Field, { type: "text" }>) {
    const text = texts[i];
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const hits = field.rubric.filter((kw) => text.toLowerCase().includes(kw.toLowerCase())).length;
    const rubricScore = (hits / field.rubric.length) * 100;
    const overLimit = words > field.maxWords;
    const finalScore = overLimit ? rubricScore * 0.8 : rubricScore;
    setFieldScore(i, finalScore);
    setSubmittedText((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
    if (finalScore >= 70) {
      playSuccess();
    } else {
      playTap();
    }
  }

  const allDone = fieldScores.every((s) => s !== null);

  return (
    <div className="flex flex-col gap-6">
      {level.fields.map((field, i) => {
        if (field.type === "vector") {
          return (
            <div key={i} className="flex flex-col gap-3">
              <div className="rounded-xl bg-slate-900/80 border border-white/10 p-3.5 text-[15px] font-semibold text-slate-200">
                <span className="text-ta-yellow font-bold mr-1.5">&bull;</span>
                {field.label}
              </div>
              {field.pairs.map((pair, pi) => (
                <Vector
                  key={pi}
                  label={pair.label}
                  answer={{ from: pair.from, to: pair.to }}
                  onCheck={(correct) => onPairChecked(i, pi, field.pairs.length, correct)}
                />
              ))}
            </div>
          );
        }

        const text = texts[i];
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const isDone = submittedText[i];
        const score = Math.round(fieldScores[i] ?? 0);

        return (
          <div key={i} className="rounded-2xl bg-slate-900/80 border border-white/10 p-5 shadow-xl flex flex-col gap-3">
            <div className="text-[15px] font-semibold text-slate-200">{field.label}</div>
            <textarea
              className="w-full rounded-xl p-3.5 text-slate-100 bg-black/60 border border-slate-700 focus:border-ta-yellow focus:outline-none text-[15px] leading-relaxed disabled:opacity-60 resize-none"
              rows={3}
              disabled={isDone}
              placeholder="Write your analysis citing the specific ego states..."
              value={text}
              onChange={(e) =>
                setTexts((prev) => {
                  const next = [...prev];
                  next[i] = e.target.value;
                  return next;
                })
              }
            />
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>
                {words}/{field.maxWords} words {words > field.maxWords && "(over limit penalty)"}
              </span>
              {isDone && (
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    score >= 70
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                  }`}
                >
                  Rubric Score: {score}/100
                </span>
              )}
            </div>
            {!isDone ? (
              <Button variant="ghost" onClick={() => submitText(i, field)}>
                Submit Written Analysis
              </Button>
            ) : null}
          </div>
        );
      })}

      {allDone && (
        <Button
          variant="primary"
          onClick={() => {
            playSuccess();
            onComplete({
              score: (fieldScores as number[]).reduce((a, b) => a + b, 0) / fieldScores.length,
            });
          }}
          className="mt-2"
        >
          Complete Analysis Passed &rarr;
        </Button>
      )}
    </div>
  );
}
