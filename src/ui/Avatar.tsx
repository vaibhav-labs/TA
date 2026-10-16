import { characterFor, type HairStyle, type OutfitStyle } from "../content/characters";

export type Expression = "neutral" | "tense" | "open";

interface AvatarProps {
  name: string;
  expression?: Expression;
  /** Highlights whoever is currently speaking with an active glowing aura */
  active?: boolean;
  size?: number;
  className?: string;
}

function HairLayer({
  style,
  color,
}: {
  style: HairStyle;
  color: string;
}) {
  switch (style) {
    case "bun":
      return (
        <g>
          {/* Top bun */}
          <ellipse cx="50" cy="14" rx="14" ry="12" fill={color} />
          {/* Hairpin accent */}
          <path d="M38 12 L62 16" stroke="#FFFC00" strokeWidth="2.5" strokeLinecap="round" />
          {/* Base hair cap with elegant hairline */}
          <path
            d="M24 45 C22 24 34 18 50 18 C66 18 78 24 76 45 C73 30 64 26 50 26 C36 26 27 30 24 45 Z"
            fill={color}
          />
          {/* Side swept strands */}
          <path d="M25 40 C28 50 30 55 31 58 C28 53 26 47 25 40 Z" fill={color} />
          <path d="M75 40 C72 50 70 55 69 58 C72 53 74 47 75 40 Z" fill={color} />
        </g>
      );
    case "fade":
      return (
        <g>
          {/* Modern structured fade / crop */}
          <path
            d="M26 40 C26 22 36 17 50 17 C64 17 74 22 74 40 C74 34 65 24 50 24 C35 24 26 34 26 40 Z"
            fill={color}
          />
          {/* Top textured volume */}
          <path
            d="M32 24 Q50 13 68 24 Q50 18 32 24 Z"
            fill={color}
            opacity="0.9"
          />
        </g>
      );
    case "curls":
      return (
        <g fill={color}>
          <circle cx="34" cy="24" r="8" />
          <circle cx="48" cy="18" r="9" />
          <circle cx="64" cy="23" r="8" />
          <circle cx="26" cy="33" r="7" />
          <circle cx="74" cy="33" r="7" />
          <path d="M26 38 C26 25 36 22 50 22 C64 22 74 25 74 38 Z" />
        </g>
      );
    case "wavy":
      return (
        <g>
          {/* Top cap */}
          <path
            d="M23 42 C23 23 35 18 50 18 C65 18 77 23 77 42 C74 29 65 26 50 26 C35 26 26 29 23 42 Z"
            fill={color}
          />
          {/* Wavy locks on sides */}
          <path
            d="M23 38 C18 48 18 64 24 74 C26 68 23 54 26 44 Z"
            fill={color}
          />
          <path
            d="M77 38 C82 48 82 64 76 74 C74 68 77 54 74 44 Z"
            fill={color}
          />
        </g>
      );
    case "bob":
      return (
        <g>
          <path
            d="M22 42 C22 22 34 18 50 18 C66 18 78 22 78 42 C78 56 75 68 70 72 C73 60 72 44 72 36 C64 28 36 28 28 36 C28 44 27 60 30 72 C25 68 22 56 22 42 Z"
            fill={color}
          />
        </g>
      );
    case "short":
    default:
      return (
        <path
          d="M24 42 C24 22 36 18 50 18 C64 18 76 22 76 42 C74 30 65 26 50 26 C35 26 26 30 24 42 Z"
          fill={color}
        />
      );
  }
}

function OutfitLayer({
  style,
  color,
}: {
  style: OutfitStyle;
  color: string;
}) {
  switch (style) {
    case "blazer":
      return (
        <g>
          {/* Shoulders */}
          <path d="M12 96 C14 80 30 74 50 74 C70 74 86 80 88 96 Z" fill={color} />
          {/* Inner shirt */}
          <polygon points="43,74 57,74 50,88" fill="#FFFFFF" />
          {/* Lapels */}
          <polygon points="34,74 44,88 32,96 24,96" fill="#18181B" opacity="0.4" />
          <polygon points="66,74 56,88 68,96 76,96" fill="#18181B" opacity="0.4" />
        </g>
      );
    case "turtleneck":
      return (
        <g>
          <path d="M12 96 C14 80 30 74 50 74 C70 74 86 80 88 96 Z" fill={color} />
          {/* Neck band */}
          <rect x="38" y="70" width="24" height="12" rx="4" fill={color} filter="brightness(0.9)" />
        </g>
      );
    case "collar":
      return (
        <g>
          <path d="M12 96 C14 80 30 74 50 74 C70 74 86 80 88 96 Z" fill={color} />
          {/* Shirt collars */}
          <polygon points="50,81 37,73 44,72" fill="#FFFFFF" />
          <polygon points="50,81 63,73 56,72" fill="#FFFFFF" />
        </g>
      );
    case "hoodie":
    default:
      return (
        <g>
          <path d="M12 96 C14 80 30 74 50 74 C70 74 86 80 88 96 Z" fill={color} />
          {/* Hood collar curve */}
          <path d="M34 76 Q50 88 66 76" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round" />
          {/* Drawstrings */}
          <line x1="44" y1="84" x2="44" y2="93" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
          <line x1="56" y1="84" x2="56" y2="93" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
        </g>
      );
  }
}

/**
 * Expressive, modern vector character avatar.
 * Changes eyebrows, eyes, and mouth dynamically based on emotional state.
 */
export function Avatar({
  name,
  expression = "neutral",
  active = false,
  size = 56,
  className = "",
}: AvatarProps) {
  const config = characterFor(name);

  // Eyebrows based on emotion
  const browLeft =
    expression === "tense"
      ? "M32 40 L44 45" // angled in and down
      : expression === "open"
      ? "M32 42 Q38 38 44 41" // raised and gentle
      : "M32 42 L44 42"; // level

  const browRight =
    expression === "tense"
      ? "M68 40 L56 45"
      : expression === "open"
      ? "M68 42 Q62 38 56 41"
      : "M68 42 L56 42";

  // Eyes based on emotion
  const eyeRy = expression === "tense" ? 2.5 : expression === "open" ? 4.5 : 3.8;

  // Mouth based on emotion
  const mouthPath =
    expression === "tense"
      ? "M42 66 Q50 63 58 66" // tight flat grimace
      : expression === "open"
      ? "M40 64 Q50 72 60 64" // warm open smile
      : "M43 65 Q50 66 57 65"; // relaxed neutral line

  // Emotion badge
  const moodBadge =
    expression === "tense" ? "⚡" : expression === "open" ? "✨" : null;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={`${name} (${expression})`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${name}, feeling ${expression}`}
        className="overflow-visible select-none"
      >
        <defs>
          {/* Active speaker glow */}
          <filter id="speaker-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#FFFC00" floodOpacity="0.75" />
          </filter>
          {/* Subtle character drop shadow */}
          <filter id="avatar-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Active speaker animated ripple ring */}
        {active && (
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#FFFC00"
            strokeWidth="3"
            filter="url(#speaker-glow)"
            className="animate-pulse"
          />
        )}

        {/* Character container circle backdrop */}
        <circle
          cx="50"
          cy="50"
          r="43"
          fill="#131722"
          stroke={active ? "#FFFC00" : "rgba(255,255,255,0.18)"}
          strokeWidth={active ? "2.5" : "1.5"}
        />

        <g filter="url(#avatar-shadow)">
          {/* Clothing / Shoulders */}
          <OutfitLayer style={config.outfit} color={config.outfitColor} />

          {/* Neck */}
          <rect
            x="44"
            y="64"
            width="12"
            height="14"
            rx="3"
            fill={config.skinShadow}
          />

          {/* Face base */}
          <ellipse
            cx="50"
            cy="52"
            rx="23"
            ry="24"
            fill={config.skinTone}
          />

          {/* Ears */}
          <circle cx="27" cy="52" r="5" fill={config.skinTone} />
          <circle cx="73" cy="52" r="5" fill={config.skinTone} />

          {/* Eyebrows */}
          <path
            d={browLeft}
            stroke={config.hairColor}
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={browRight}
            stroke={config.hairColor}
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes with highlights */}
          <g>
            {/* Eye whites */}
            <ellipse cx="40" cy="50" rx="4.5" ry={eyeRy} fill="#FFFFFF" />
            <ellipse cx="60" cy="50" rx="4.5" ry={eyeRy} fill="#FFFFFF" />

            {/* Iris/pupils */}
            <circle cx="40" cy="50" r={expression === "tense" ? "2.2" : "2.6"} fill="#18181B" />
            <circle cx="60" cy="50" r={expression === "tense" ? "2.2" : "2.6"} fill="#18181B" />

            {/* Light catch reflections */}
            <circle cx="41.2" cy="48.8" r="1" fill="#FFFFFF" />
            <circle cx="61.2" cy="48.8" r="1" fill="#FFFFFF" />
          </g>

          {/* Glasses if enabled */}
          {config.glasses && (
            <g stroke="#0F172A" strokeWidth="1.8" fill="rgba(255,255,255,0.15)">
              <rect x="33" y="44" width="14" height="12" rx="3" />
              <rect x="53" y="44" width="14" height="12" rx="3" />
              <line x1="47" y1="49" x2="53" y2="49" />
              <line x1="28" y1="48" x2="33" y2="48" />
              <line x1="67" y1="48" x2="72" y2="48" />
            </g>
          )}

          {/* Nose */}
          <path
            d="M50 54 L48.5 59 L51.5 59"
            stroke={config.skinShadow}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Mouth */}
          <path
            d={mouthPath}
            stroke="#1F2937"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill={expression === "open" ? "#DC2626" : "none"}
          />

          {/* Hair layer */}
          <HairLayer style={config.hairStyle} color={config.hairColor} />
        </g>
      </svg>

      {/* Floating Emotion Badge */}
      {moodBadge && (
        <span
          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-md border ${
            expression === "tense"
              ? "bg-rose-600/90 border-rose-300 text-white"
              : "bg-emerald-600/90 border-emerald-300 text-white"
          } ta-pop`}
          aria-hidden="true"
        >
          {moodBadge}
        </span>
      )}

      {/* Floating active mic/speaking pill */}
      {active && (
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ta-yellow border border-black flex items-center justify-center animate-bounce shadow-sm"
          title="Speaking"
          aria-hidden="true"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
        </span>
      )}
    </div>
  );
}
