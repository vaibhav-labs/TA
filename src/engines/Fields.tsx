import { useState } from "react";
import type { Field } from "../content/types";
import { Button } from "../ui/Button";
import { Vector } from "../ui/Vector";

interface FieldsProps {
  level: { fields: Field[] };
  onComplete: (result: { score: number }) => void;
}

/** The L3 "Build" / free-text field form (section 5): vector pairs plus rubric-graded text. */
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
    setFieldScore(i, overLimit ? rubricScore * 0.8 : rubricScore);
    setSubmittedText((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  }

  const allDone = fieldScores.every((s) => s !== null);

  return (
    <div className="flex flex-col gap-4">
      {level.fields.map((field, i) => {
        if (field.type === "vector") {
          return (
            <div key={i} className="flex flex-col gap-3">
              <div className="text-[17px] leading-6">{field.label}</div>
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
        return (
          <div key={i} className="flex flex-col gap-2">
            <div className="text-[17px] leading-6">{field.label}</div>
            <textarea
              className="w-full rounded-lg p-3 text-ta-black text-[17px] bg-ta-white disabled:opacity-70"
              rows={3}
              disabled={submittedText[i]}
              value={text}
              onChange={(e) =>
                setTexts((prev) => {
                  const next = [...prev];
                  next[i] = e.target.value;
                  return next;
                })
              }
            />
            <div className="text-[13px] text-ta-grey">
              {words}/{field.maxWords} words
            </div>
            {!submittedText[i] ? (
              <Button variant="ghost" onClick={() => submitText(i, field)}>
                Submit
              </Button>
            ) : (
              <div className="text-[17px] text-ta-white/90">
                Rubric score: {Math.round(fieldScores[i] ?? 0)}/100
              </div>
            )}
          </div>
        );
      })}
      {allDone && (
        <Button
          variant="ghost"
          onClick={() =>
            onComplete({
              score: (fieldScores as number[]).reduce((a, b) => a + b, 0) / fieldScores.length,
            })
          }
        >
          Finish
        </Button>
      )}
    </div>
  );
}
