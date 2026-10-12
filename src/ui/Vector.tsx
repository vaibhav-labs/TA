import { useState } from "react";
import { PacStack } from "./PacStack";

type Letter = "P" | "A" | "C";

interface VectorProps {
  label: string;
  /** The correct stimulus (left stack) and response (right stack) states. */
  answer: { from: string; to: string };
  onCheck?: (correct: boolean) => void;
}

function toLetter(s: string): Letter {
  const up = s.toUpperCase();
  if (up.startsWith("P")) return "P";
  if (up.startsWith("C")) return "C";
  return "A";
}

/**
 * Two PAC stacks side by side with a drawn line: the stimulus arrow (left) and
 * the response arrow (right). Click a circle on each side to draw the vector,
 * then Check compares it against the answer (section 9's "only diagram").
 */
export function Vector({ label, answer, onCheck }: VectorProps) {
  const [from, setFrom] = useState<Letter | null>(null);
  const [to, setTo] = useState<Letter | null>(null);
  const [checked, setChecked] = useState(false);

  const correctFrom = toLetter(answer.from);
  const correctTo = toLetter(answer.to);
  const isCorrect = from === correctFrom && to === correctTo;

  return (
    <div className="ta-fade bg-ta-white text-ta-black rounded-xl p-4">
      <div className="text-[13px] leading-[18px] text-ta-grey mb-3">{label}</div>
      <div className="flex items-center justify-around">
        <PacStack active={from ? [from] : []} label="Stimulus" onSelect={(s) => !checked && setFrom(s)} />
        <div className="text-ta-grey text-xl px-2">&rarr;</div>
        <PacStack active={to ? [to] : []} label="Response" onSelect={(s) => !checked && setTo(s)} />
      </div>
      {!checked ? (
        <button
          type="button"
          disabled={!from || !to}
          onClick={() => {
            setChecked(true);
            onCheck?.(isCorrect);
          }}
          className="ta-tap mt-3 w-full rounded-lg bg-ta-black text-ta-white disabled:opacity-30 text-[17px]"
        >
          Check
        </button>
      ) : (
        <div className={`mt-3 text-[17px] ${isCorrect ? "text-green-700" : "text-ta-red"}`}>
          {isCorrect
            ? "Correct vector."
            : `Not quite — it runs ${correctFrom} → ${correctTo}.`}
        </div>
      )}
    </div>
  );
}
