/** One authored line icon per world, each a visual pun on that world's concept — gives each world an identity without leaving the brand's stroke/monochrome language. Color inherits from the parent's text color. */
export function WorldIcon({ world, size = 28 }: { world: number; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (world) {
    case 1: // Hunger — strokes, literally: tally marks for recognition
      return (
        <svg {...common}>
          <path d="M9 7v18M15 7v18M21 7v18" />
          <path d="M26 10v12" opacity={0.4} />
        </svg>
      );
    case 2: // Three Voices — the PAC stack itself
      return (
        <svg {...common}>
          <circle cx="16" cy="8" r="5" />
          <circle cx="16" cy="16" r="5" fill="currentColor" stroke="none" />
          <circle cx="16" cy="24" r="5" />
        </svg>
      );
    case 3: // Vectors — a crossed transaction
      return (
        <svg {...common}>
          <path d="M7 7l18 18M25 7L7 25" />
        </svg>
      );
    case 4: // The Thesaurus — an open book of named games
      return (
        <svg {...common}>
          <path d="M16 9c-3-2-7-2-10-1v16c3-1 7-1 10 1 3-2 7-2 10-1V8c-3-1-7-1-10 1Z" />
          <path d="M16 9v16" />
        </svg>
      );
    case 5: // Underneath — what's below the waterline
      return (
        <svg {...common}>
          <path d="M5 13h22" />
          <path d="M16 13l4 13h-8l4-13Z" />
        </svg>
      );
    case 6: // The Plan — the script matrix, a branching tree
      return (
        <svg {...common}>
          <circle cx="16" cy="6" r="2.5" fill="currentColor" stroke="none" />
          <path d="M16 8.5v6M16 14.5L8 24M16 14.5l8 9.5" />
          <circle cx="8" cy="26" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="24" cy="26" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 7: // Autonomy — sunrise after games
      return (
        <svg {...common}>
          <path d="M6 20a10 10 0 0 1 20 0" />
          <path d="M3 20h26M16 4v3M6.5 7.5l2 2M25.5 7.5l-2 2" />
        </svg>
      );
    default:
      return null;
  }
}
