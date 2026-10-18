import type { PropsWithChildren } from "react";
import { Avatar, type Expression } from "./Avatar";

interface DialogueRowProps {
  name: string;
  text: string;
  side?: "left" | "right";
  expression?: Expression;
  active?: boolean;
  tone?: "npc" | "player";
}

/** One line of scene dialogue: avatar, name tag, speech bubble with tail and glow. */
export function DialogueRow({
  name,
  text,
  side = "left",
  expression = "neutral",
  active = true,
  tone = "npc",
}: DialogueRowProps) {
  const isRight = side === "right";

  return (
    <div
      className={`ta-fade flex items-end gap-3 ${
        isRight ? "flex-row-reverse" : ""
      } select-text`}
    >
      <Avatar name={name} expression={expression} active={active} size={50} />

      <div
        className={`flex flex-col gap-1.5 max-w-[82%] ${
          isRight ? "items-end" : "items-start"
        }`}
      >
        <div className="flex items-center gap-1.5 px-1">
          <span className="text-[12px] font-bold tracking-wider uppercase text-slate-400">
            {name}
          </span>
          {tone === "player" && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-ta-yellow/20 text-ta-yellow font-mono font-semibold">
              YOU
            </span>
          )}
        </div>

        <div
          className={[
            "relative px-4 py-3 text-[16px] sm:text-[17px] leading-relaxed rounded-2xl shadow-xl transition-all duration-200",
            tone === "player"
              ? "bg-gradient-to-br from-yellow-300 to-amber-400 text-slate-950 font-medium rounded-br-none shadow-[0_4px_20px_rgba(255,252,0,0.22)] border border-yellow-200"
              : "bg-slate-100 text-slate-900 font-normal rounded-bl-none shadow-[0_4px_20px_rgba(0,0,0,0.35)] border border-slate-200",
          ].join(" ")}
        >
          {text}

          {/* Speech bubble pointer tail */}
          <span
            className={`absolute bottom-0 w-3 h-3 ${
              tone === "player"
                ? "-right-1.5 bg-amber-400 [clip-path:polygon(0_0,0_100%,100%_100%)]"
                : "-left-1.5 bg-slate-100 [clip-path:polygon(100%_0,0_100%,100%_100%)]"
            }`}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

/** A note that teaches, set apart from the scene itself as a tactical psychological dossier. */
export function Callout({ children, label = "Read" }: PropsWithChildren<{ label?: string }>) {
  return (
    <div className="ta-fade rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-ta-yellow/40 p-4 flex gap-3 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Accent left highlight bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-ta-yellow via-amber-400 to-ta-yellow shadow-[0_0_12px_rgba(255,252,0,0.8)]" />

      <div className="flex flex-col gap-1 pl-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest font-black text-ta-yellow bg-ta-yellow/15 px-2 py-0.5 rounded border border-ta-yellow/30">
            {label === "Why" ? "Psychological Analysis" : label}
          </span>
        </div>
        <div className="text-[15px] leading-relaxed text-slate-200 mt-1 font-normal">
          {children}
        </div>
      </div>
    </div>
  );
}
