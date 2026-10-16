/**
 * High-definition thematic world emblems for TA Arena.
 * Each world features an iconic psychological motif with rich dual-tone gradients.
 */

interface WorldIconProps {
  world: number;
  size?: number;
  className?: string;
}

export function WorldIcon({ world, size = 32, className = "" }: WorldIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 36 36",
    className: `shrink-0 overflow-visible select-none ${className}`,
  };

  switch (world) {
    case 1: // Hunger — strokes, tally marks & vibrant vitality sparks
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="w1-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA000" />
              <stop offset="100%" stopColor="#FF3D00" />
            </linearGradient>
          </defs>
          {/* Tally marks for recognition strokes */}
          <line x1="8" y1="8" x2="8" y2="28" stroke="url(#w1-grad)" strokeWidth="3" strokeLinecap="round" />
          <line x1="14" y1="8" x2="14" y2="28" stroke="url(#w1-grad)" strokeWidth="3" strokeLinecap="round" />
          <line x1="20" y1="8" x2="20" y2="28" stroke="url(#w1-grad)" strokeWidth="3" strokeLinecap="round" />
          <line x1="26" y1="8" x2="26" y2="28" stroke="url(#w1-grad)" strokeWidth="3" strokeLinecap="round" />
          {/* Slashed stroke connecting the 5-bundle */}
          <line x1="4" y1="24" x2="30" y2="12" stroke="#FFFC00" strokeWidth="2.5" strokeLinecap="round" />
          {/* Energy spark */}
          <circle cx="31" cy="11" r="2.5" fill="#FFFC00" />
        </svg>
      );

    case 2: // Three Voices — The PAC Reactor Tri-Orb
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="w2-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          {/* Connecting axis */}
          <line x1="18" y1="6" x2="18" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="2 2" />
          {/* Parent Orb */}
          <circle cx="18" cy="8" r="4.5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Adult Core Orb */}
          <circle cx="18" cy="18" r="6" fill="#06B6D4" stroke="#FFFC00" strokeWidth="2" />
          {/* Child Orb */}
          <circle cx="18" cy="28" r="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      );

    case 3: // Vectors — Crossed Transactions (laser swords/arrows)
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="w3-v1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>
            <linearGradient id="w3-v2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFC00" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          {/* Crossed vector rays */}
          <line x1="6" y1="6" x2="30" y2="30" stroke="url(#w3-v1)" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="30" y1="6" x2="6" y2="30" stroke="url(#w3-v2)" strokeWidth="3.2" strokeLinecap="round" />
          {/* Arrow tips */}
          <polygon points="30,30 24,29 29,24" fill="#C084FC" />
          <polygon points="6,30 12,29 7,24" fill="#FFFC00" />
          {/* Impact spark at the crossing point */}
          <circle cx="18" cy="18" r="3" fill="#FFFFFF" />
          <circle cx="18" cy="18" r="6" fill="none" stroke="#FFFC00" strokeWidth="1.2" opacity="0.8" />
        </svg>
      );

    case 4: // The Thesaurus — Grimoire / Tome of Games
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="w4-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
          </defs>
          {/* Open game book pages */}
          <path
            d="M18 9 C13 7 7 7 4 8 L4 26 C8 25 13 25 18 28 C23 25 28 25 32 26 L32 8 C29 7 23 7 18 9 Z"
            fill="url(#w4-grad)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          {/* Spine */}
          <line x1="18" y1="9" x2="18" y2="28" stroke="#FFE4E6" strokeWidth="2" />
          {/* Magic game symbol: The Switch Triangle */}
          <polygon points="18,14 14,21 22,21" fill="#FFFC00" stroke="#000000" strokeWidth="1" />
        </svg>
      );

    case 5: // Underneath — The Psychological Iceberg
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="w5-ice" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
          </defs>
          {/* Waterline */}
          <line x1="3" y1="13" x2="33" y2="13" stroke="#22D3EE" strokeWidth="2" strokeDasharray="3 1" />
          {/* Tip above water (Social Level) */}
          <polygon points="18,6 23,13 13,13" fill="#FFFFFF" stroke="#67E8F9" strokeWidth="1.2" />
          {/* Massive submerged body (Psychological Level) */}
          <polygon points="13,13 23,13 27,29 9,29" fill="url(#w5-ice)" stroke="#0891B2" strokeWidth="1.5" />
          {/* Depth sonar ring */}
          <path d="M12 32 Q18 35 24 32" stroke="#06B6D4" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
        </svg>
      );

    case 6: // The Plan — Script Matrix Decision Tree
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="w6-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Roots / Origin node */}
          <circle cx="18" cy="6" r="3.5" fill="#FFFC00" stroke="#FFFFFF" strokeWidth="1" />
          {/* Branching pathways */}
          <path d="M18 9.5 V16 M18 16 L9 26 M18 16 L27 26" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
          {/* Destination Nodes */}
          <circle cx="9" cy="27" r="4" fill="url(#w6-grad)" stroke="#FFFFFF" strokeWidth="1.2" />
          <circle cx="27" cy="27" r="4" fill="url(#w6-grad)" stroke="#FFFFFF" strokeWidth="1.2" />
          {/* Crosslink injunction */}
          <line x1="12.5" y1="24" x2="23.5" y2="24" stroke="#FFFC00" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      );

    case 7: // Autonomy — The Dawn of Autonomy (Awareness, Spontaneity, Intimacy)
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="w7-sun" cx="50%" cy="100%" r="80%">
              <stop offset="0%" stopColor="#FFFC00" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
          </defs>
          {/* Rising Sun of Autonomy */}
          <path d="M7 23 A11 11 0 0 1 29 23 Z" fill="url(#w7-sun)" stroke="#FFFC00" strokeWidth="1.5" />
          {/* Horizon */}
          <line x1="3" y1="23" x2="33" y2="23" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
          {/* Radiant crown rays */}
          <line x1="18" y1="5" x2="18" y2="9" stroke="#FFFC00" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="9" x2="11" y2="12" stroke="#FFFC00" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="9" x2="25" y2="12" stroke="#FFFC00" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="31" y1="17" x2="27" y2="18" stroke="#FFFC00" strokeWidth="2" strokeLinecap="round" />
          <line x1="5" y1="17" x2="9" y2="18" stroke="#FFFC00" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    default:
      return null;
  }
}
