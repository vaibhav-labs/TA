import { useState } from "react";
import type { DiagnoseLevel } from "../content/types";
import { Button } from "../ui/Button";
import { Bubble } from "../ui/Card";

interface DiagnoseProps {
  level: DiagnoseLevel;
  /** Keyword rubric for an optional L3 "why" field. Omit to skip it. */
  whyRubric?: string[];
  onComplete: (result: { score: number; correct: boolean }) => void;
}

/** Diagnose engine (section 5): tap one option, see per-option feedback, then the lesson. */
export function Diagnose({ level, whyRubric, onComplete }: DiagnoseProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const [why, setWhy] = useState("");
  const [whySubmitted, setWhySubmitted] = useState(false);

  const correct = picked === level.answer;
  const needsWhy = Boolean(whyRubric?.length);

  function finish() {
    const whyHits = whyRubric
      ? whyRubric.filter((kw) => why.toLowerCase().includes(kw.toLowerCase())).length
      : 0;
    const whyScore = whyRubric?.length ? (whyHits / whyRubric.length) * 100 : 100;
    const score = needsWhy ? (correct ? 100 : 0) * 0.5 + whyScore * 0.5 : correct ? 100 : 0;
    onComplete({ score, correct });
  }

  return (
    <div className="flex flex-col gap-3">
      <Bubble>{level.question}</Bubble>
      <div className="flex flex-col gap-2">
        {level.options.map((opt, i) => (
          <Button
            key={i}
            variant={picked === null ? "option" : i === picked ? "selected" : "option"}
            disabled={picked !== null}
            onClick={() => setPicked(i)}
          >
            {opt.text}
          </Button>
        ))}
      </div>
      {picked !== null && (
        <div className="ta-fade text-[17px] leading-6 text-ta-white/90">
          {level.options[picked].feedback}
        </div>
      )}
      {picked !== null && needsWhy && !whySubmitted && (
        <div className="ta-fade flex flex-col gap-2">
          <textarea
            className="w-full rounded-lg p-3 text-ta-black text-[17px]"
            rows={3}
            placeholder="Why? (under 60 words)"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
          />
          <Button variant="ghost" onClick={() => setWhySubmitted(true)}>
            Submit
          </Button>
        </div>
      )}
      {picked !== null && (!needsWhy || whySubmitted) && (
        <Button variant="ghost" onClick={finish}>
          Continue
        </Button>
      )}
    </div>
  );
}
