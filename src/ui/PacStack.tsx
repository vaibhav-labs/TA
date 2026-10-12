import type { EgoState } from "../content/types";

interface PacStackProps {
  /** Which of P / A / C are "active" (filled yellow) in this stack. */
  active?: Array<"P" | "A" | "C">;
  /** Optional caption under the stack. */
  label?: string;
  /** Called with the tapped letter, if the stack is interactive. */
  onSelect?: (state: "P" | "A" | "C") => void;
}

const ORDER: Array<"P" | "A" | "C"> = ["P", "A", "C"];

/** The structural-model P/A/C stacked circles, drawn in CSS (section 9). */
export function PacStack({ active = [], label, onSelect }: PacStackProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex flex-col gap-1.5">
        {ORDER.map((s) => {
          const isActive = active.includes(s);
          const Tag = onSelect ? "button" : "div";
          return (
            <Tag
              key={s}
              type={onSelect ? "button" : undefined}
              onClick={onSelect ? () => onSelect(s) : undefined}
              className={[
                "w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ta-tap",
                isActive
                  ? "bg-ta-yellow text-ta-black"
                  : "bg-transparent text-ta-grey border-2 border-ta-grey",
                onSelect ? "cursor-pointer" : "",
              ].join(" ")}
              aria-pressed={onSelect ? isActive : undefined}
            >
              {s}
            </Tag>
          );
        })}
      </div>
      {label && <div className="text-[13px] leading-[18px] text-ta-grey mt-1">{label}</div>}
    </div>
  );
}

/** Reduces a functional/structural EgoState tag to the structural circle it lights up. */
export function structuralOf(state: EgoState): "P" | "A" | "C" {
  if (state === "CP" || state === "NP" || state === "P") return "P";
  if (state === "FC" || state === "AC" || state === "C") return "C";
  return "A";
}
