import { playTap } from "./sound";

interface PacStackProps {
  /** Which of P / A / C are "active" (filled glowing color) in this stack. */
  active?: Array<"P" | "A" | "C">;
  /** Optional caption under the stack. */
  label?: string;
  /** Called with the tapped letter, if the stack is interactive. */
  onSelect?: (state: "P" | "A" | "C") => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

const ORDER: Array<"P" | "A" | "C"> = ["P", "A", "C"];

const META = {
  P: {
    title: "Parent",
    role: "Values & Rules",
    activeColor: "bg-gradient-to-br from-amber-400 via-rose-500 to-red-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.65)] border-amber-300",
    haloColor: "rgba(244,63,94,0.3)",
    ringColor: "border-rose-400/30",
    badge: "P",
  },
  A: {
    title: "Adult",
    role: "Logic & Reality",
    activeColor: "bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-600 text-slate-950 font-black shadow-[0_0_22px_rgba(6,182,212,0.7)] border-cyan-200",
    haloColor: "rgba(6,182,212,0.3)",
    ringColor: "border-cyan-400/30",
    badge: "A",
  },
  C: {
    title: "Child",
    role: "Feelings & Urges",
    activeColor: "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-slate-950 font-black shadow-[0_0_20px_rgba(251,191,36,0.65)] border-yellow-200",
    haloColor: "rgba(251,191,36,0.3)",
    ringColor: "border-amber-400/30",
    badge: "C",
  },
};

/**
 * The Berne structural-model PAC stacked circles, rendered with glowing psychological depth.
 */
export function PacStack({ active = [], label, onSelect, size = "md" }: PacStackProps) {
  const isSm = size === "sm";
  const circleSize = isSm ? "w-9 h-9 text-xs" : "w-12 h-12 text-base";

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="relative flex flex-col gap-2 p-2 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-inner">
        {/* Subtle background connecting line */}
        <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-rose-500/20 via-cyan-500/20 to-amber-500/20 -z-0" />

        {ORDER.map((letter) => {
          const isActive = active.includes(letter);
          const meta = META[letter];
          const Tag = onSelect ? "button" : "div";

          return (
            <Tag
              key={letter}
              type={onSelect ? "button" : undefined}
              onClick={
                onSelect
                  ? () => {
                      playTap();
                      onSelect(letter);
                    }
                  : undefined
              }
              className={[
                circleSize,
                "relative z-10 rounded-full flex items-center justify-center font-black ta-tap transition-all duration-200",
                isActive
                  ? `${meta.activeColor} border-2 scale-105 ta-pop`
                  : "bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:border-slate-500 hover:text-slate-200",
                onSelect ? "cursor-pointer active:scale-95 group" : "",
              ].join(" ")}
              aria-pressed={onSelect ? isActive : undefined}
              title={`${meta.title} (${meta.role})`}
            >
              {/* Internal subtle glow ring for inactive hover */}
              {!isActive && onSelect && (
                <span className="absolute inset-0 rounded-full border border-transparent group-hover:border-white/20 transition-colors" />
              )}
              {letter}
            </Tag>
          );
        })}
      </div>

      {label && (
        <div className="text-center">
          <div className="text-[13px] leading-tight font-semibold tracking-wide text-slate-300">
            {label}
          </div>
          {active.length === 1 && (
            <div className="text-[10px] text-ta-yellow/80 uppercase font-mono mt-0.5 tracking-wider">
              {META[active[0]].title}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

