import type { ButtonHTMLAttributes } from "react";
import { playTap } from "./sound";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "option" | "selected" | "game-move" | "ghost" | "primary";
}

/**
 * Player choice buttons with tactile feedback, elevation, and distinct response feedback.
 */
export function Button({
  variant = "option",
  className = "",
  children,
  onClick,
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    "ta-tap w-full text-left px-4 py-3.5 rounded-xl text-[16px] sm:text-[17px] leading-snug transition-all duration-150 flex items-center justify-between gap-3 group relative select-none disabled:opacity-40 disabled:cursor-not-allowed";

  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    option:
      "bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 text-slate-950 font-bold border border-yellow-200/60 shadow-[0_4px_16px_rgba(255,252,0,0.18)] hover:shadow-[0_6px_22px_rgba(255,252,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
    primary:
      "bg-gradient-to-r from-ta-yellow to-amber-400 text-slate-950 font-black shadow-lg hover:brightness-105 active:scale-[0.99]",
    selected:
      "bg-slate-100 text-slate-950 font-bold border-2 border-ta-yellow shadow-[0_0_16px_rgba(255,252,0,0.4)]",
    "game-move":
      "bg-rose-950/80 text-rose-100 font-bold border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.45)] ta-shake",
    ghost:
      "bg-slate-900/70 text-slate-200 hover:text-white font-semibold border border-slate-700/80 hover:border-slate-400 hover:bg-slate-800/90 shadow-md active:scale-[0.99]",
  };

  return (
    <button
      className={`${base} ${styles[variant]} ${className}`}
      disabled={disabled}
      onClick={(e) => {
        if (!disabled) {
          playTap();
        }
        onClick?.(e);
      }}
      {...rest}
    >
      <span className="flex-1">{children}</span>
      {variant === "option" && (
        <span className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs font-mono font-bold">
          &rarr;
        </span>
      )}
    </button>
  );
}
