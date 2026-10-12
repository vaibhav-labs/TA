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

/** One line of scene dialogue: avatar, name tag, speech bubble. The core "this is a scene, not a form" unit. */
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
    <div className={`ta-fade flex items-end gap-2 ${isRight ? "flex-row-reverse" : ""}`}>
      <Avatar name={name} expression={expression} active={active} size={48} />
      <div className={`flex flex-col gap-1 max-w-[78%] ${isRight ? "items-end" : "items-start"}`}>
        <div className="text-[13px] leading-[18px] text-ta-grey px-1">{name}</div>
        <div
          className={[
            "px-4 py-3 text-[17px] leading-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.4)]",
            tone === "player" ? "bg-ta-yellow text-ta-black rounded-br-md" : "bg-ta-white text-ta-black rounded-bl-md",
          ].join(" ")}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

/** A note that teaches, set apart from the scene itself so the player can tell story from lesson. */
export function Callout({ children, label = "Read" }: PropsWithChildren<{ label?: string }>) {
  return (
    <div className="ta-fade rounded-xl border border-ta-grey/35 p-3 flex gap-2.5">
      <span className="text-[13px] leading-[18px] font-semibold text-ta-yellow shrink-0">{label}</span>
      <span className="text-[15px] leading-[21px] text-ta-white/85">{children}</span>
    </div>
  );
}
