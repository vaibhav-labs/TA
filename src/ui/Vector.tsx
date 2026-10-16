import { useState } from "react";
import { PacStack } from "./PacStack";
import { playSuccess, playTap } from "./sound";

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

// Y-coordinates for P, A, C circles in a 3-high stack (viewBox 0 0 100 180)
const Y_COORDS: Record<Letter, number> = {
  P: 34,
  A: 90,
  C: 146,
};

/**
 * Interactive Transaction Vector Visualizer:
 * Renders two PAC stacks with an animated dynamic SVG laser vector connecting them.
 */
export function Vector({ label, answer, onCheck }: VectorProps) {
  const [from, setFrom] = useState<Letter | null>(null);
  const [to, setTo] = useState<Letter | null>(null);
  const [checked, setChecked] = useState(false);

  const correctFrom = toLetter(answer.from);
  const correctTo = toLetter(answer.to);
  const isCorrect = from === correctFrom && to === correctTo;

  // Determine transaction classification for TA education
  const isCrossed =
    (correctFrom === "C" && correctTo === "P") ||
    (correctFrom === "P" && correctTo === "C") ||
    (correctFrom === "A" && correctTo === "A" && from !== to);

  function handleCheck() {
    setChecked(true);
    if (isCorrect) {
      playSuccess();
    } else {
      playTap();
    }
    onCheck?.(isCorrect);
  }

  return (
    <div className="ta-fade rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Ambient background mesh */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-[13px] font-semibold text-slate-300 tracking-wide">{label}</span>
        {from && to && (
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-ta-yellow/15 text-ta-yellow border border-ta-yellow/30 ta-pop">
            Vector: {from} &rarr; {to}
          </span>
        )}
      </div>

      <div className="relative flex items-center justify-between px-2 py-3">
        {/* Left PAC Stack: Stimulus */}
        <div className="relative z-10">
          <PacStack
            active={from ? [from] : []}
            label="Stimulus (Sender)"
            onSelect={(s) => !checked && setFrom(s)}
          />
        </div>

        {/* Dynamic SVG Laser Canvas connecting the stacks */}
        <div className="flex-1 h-44 relative mx-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 180" preserveAspectRatio="none">
            <defs>
              {/* Arrow marker for player selection */}
              <marker
                id="laser-arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#FFFC00" />
              </marker>

              {/* Arrow marker for correct answer reveal */}
              <marker
                id="correct-arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
              </marker>

              {/* Glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Inactive guide center line */}
            <line
              x1="10"
              y1="90"
              x2="90"
              y2="90"
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 4"
            />

            {/* Active player drawn vector line */}
            {from && to && (
              <g filter="url(#glow)">
                <line
                  x1="6"
                  y1={Y_COORDS[from]}
                  x2="88"
                  y2={Y_COORDS[to]}
                  stroke="#FFFC00"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  markerEnd="url(#laser-arrow)"
                  className="ta-laser-flow"
                />
              </g>
            )}

            {/* Reveal correct vector if answered and wrong */}
            {checked && !isCorrect && (
              <line
                x1="6"
                y1={Y_COORDS[correctFrom]}
                x2="88"
                y2={Y_COORDS[correctTo]}
                stroke="#10B981"
                strokeWidth="2.5"
                strokeDasharray="5 3"
                markerEnd="url(#correct-arrow)"
                opacity="0.85"
              />
            )}
          </svg>

          {/* Central status pill */}
          {!from && !to && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[11px] font-mono text-slate-500 bg-black/60 px-2 py-1 rounded-full border border-white/10">
                Tap nodes to draw vector
              </span>
            </div>
          )}
        </div>

        {/* Right PAC Stack: Response */}
        <div className="relative z-10">
          <PacStack
            active={to ? [to] : []}
            label="Response (Target)"
            onSelect={(s) => !checked && setTo(s)}
          />
        </div>
      </div>

      {/* Action / Feedback Footer */}
      {!checked ? (
        <button
          type="button"
          disabled={!from || !to}
          onClick={handleCheck}
          className="ta-tap mt-4 w-full rounded-xl bg-ta-yellow text-slate-950 font-bold text-base disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-300 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(255,252,0,0.25)] flex items-center justify-center gap-2"
        >
          <span>Check Transaction Vector</span>
          <span>&rarr;</span>
        </button>
      ) : (
        <div
          className={`mt-4 rounded-xl p-3.5 border flex flex-col gap-1.5 ta-pop ${
            isCorrect
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/40 border-rose-500/40 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-[15px]">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                isCorrect ? "bg-emerald-500 text-black" : "bg-rose-500 text-white"
              }`}
            >
              {isCorrect ? "✓" : "×"}
            </span>
            <span>
              {isCorrect
                ? "Accurate vector diagnosis!"
                : `Vector runs ${correctFrom} → ${correctTo}.`}
            </span>
          </div>
          <div className="text-xs text-slate-300 pl-7">
            {isCorrect
              ? isCrossed
                ? "This is a crossed transaction — the response did not address the ego state that sent the stimulus."
                : "Complementary vectors keep psychological lines parallel and communication open."
              : `You mapped ${from} → ${to}. Notice which ego state triggered the stimulus and where it landed.`}
          </div>
        </div>
      )}
    </div>
  );
}
