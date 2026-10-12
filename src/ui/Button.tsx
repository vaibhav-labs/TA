import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "option" | "selected" | "game-move" | "ghost";
}

/**
 * Player option buttons: full-width black-text-on-yellow by default (section 9).
 * "selected" flips to black-on-white with a check; "game-move" marks the Switch in red.
 */
export function Button({ variant = "option", className = "", children, ...rest }: ButtonProps) {
  const base = "ta-tap w-full text-left px-4 py-3 rounded-lg text-[17px] leading-6 transition-colors duration-150";
  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    option: "bg-ta-yellow text-ta-black font-medium",
    selected: "bg-ta-white text-ta-black font-medium border-2 border-ta-black",
    "game-move": "bg-ta-white text-ta-red font-medium border-2 border-ta-red",
    ghost: "bg-transparent text-ta-white border-2 border-ta-grey",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
