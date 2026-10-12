import { characterFor, type HairStyle } from "../content/characters";

export type Expression = "neutral" | "tense" | "open";

interface AvatarProps {
  name: string;
  expression?: Expression;
  /** Highlights whoever is currently "speaking" with a thin accent ring. */
  active?: boolean;
  size?: number;
}

const MOUTHS: Record<Expression, string> = {
  neutral: "M28,56 Q40,58 52,56",
  tense: "M28,58 Q40,51 52,58",
  open: "M26,53 Q40,65 54,53",
};

const BROWS: Record<Expression, { left: string; right: string }> = {
  neutral: { left: "M24,32 L34,32", right: "M46,32 L56,32" },
  tense: { left: "M24,29 L34,34", right: "M56,29 L46,34" },
  open: { left: "M24,29 L34,31", right: "M56,29 L46,31" },
};

const EYE_RY: Record<Expression, number> = { neutral: 2.6, tense: 1.6, open: 2.8 };

function Hair({ style, color }: { style: HairStyle; color: string }) {
  const cap = (
    <path
      d="M12,34 C12,14 24,4 40,4 C56,4 68,14 68,34 C68,23 58,15 40,15 C22,15 12,23 12,34 Z"
      fill={color}
    />
  );
  if (style === "bun") {
    return (
      <>
        {cap}
        <circle cx="40" cy="6" r="6.5" fill={color} />
      </>
    );
  }
  if (style === "wavy") {
    return (
      <>
        {cap}
        <path d="M12,28 C7,38 7,54 14,66 C19,60 16,45 18,30 Z" fill={color} />
        <path d="M68,28 C73,38 73,54 66,66 C61,60 64,45 62,30 Z" fill={color} />
      </>
    );
  }
  return cap;
}

/** A consistent, monochrome, authored-SVG character portrait (no photos, no emoji). */
export function Avatar({ name, expression = "neutral", active = false, size = 56 }: AvatarProps) {
  const { hairStyle } = characterFor(name);
  const brows = BROWS[expression];
  const ry = EYE_RY[expression];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      role="img"
      aria-label={`${name}, looking ${expression === "open" ? "relieved" : expression === "tense" ? "upset" : "neutral"}`}
      className="shrink-0"
    >
      {active && <circle cx="40" cy="42" r="30" fill="none" stroke="#FFFC00" strokeWidth="2.5" />}
      <circle cx="40" cy="42" r="26" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
      <ellipse cx="30" cy="40" rx="2.6" ry={ry} fill="#000000" />
      <ellipse cx="50" cy="40" rx="2.6" ry={ry} fill="#000000" />
      <path d={brows.left} stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d={brows.right} stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d={MOUTHS[expression]} stroke="#000000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <Hair style={hairStyle} color="#000000" />
    </svg>
  );
}
