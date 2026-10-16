export type HairStyle = "short" | "bun" | "wavy" | "curls" | "bob" | "fade";
export type OutfitStyle = "hoodie" | "blazer" | "turtleneck" | "collar" | "vest";

export interface CharacterConfig {
  hairStyle: HairStyle;
  hairColor: string;
  skinTone: string;
  skinShadow: string;
  outfit: OutfitStyle;
  outfitColor: string;
  accentColor: string;
  glasses?: boolean;
}

const SKIN_PALETTES = [
  { tone: "#F8D9C0", shadow: "#E5B99B" }, // warm beige
  { tone: "#E0B088", shadow: "#C69068" }, // golden tan
  { tone: "#BC8359", shadow: "#A0643C" }, // rich bronze
  { tone: "#8D5524", shadow: "#6B3B12" }, // deep umber
  { tone: "#F5C8A8", shadow: "#DC9E7A" }, // soft peach
];

const HAIR_COLORS = [
  "#1C1917", // raven black
  "#3B2515", // dark chestnut
  "#573823", // espresso
  "#6B4F35", // caramel brown
  "#262626", // charcoal
  "#D97706", // auburn
];

const OUTFIT_COLORS = [
  "#2563EB", // royal blue
  "#7C3AED", // violet
  "#059669", // emerald
  "#DC2626", // crimson
  "#4B5563", // slate
  "#D97706", // amber
  "#0D9488", // teal
];

const ACCENT_COLORS = [
  "#FFFC00", // yellow
  "#00E5FF", // cyan
  "#A855F7", // purple
  "#FF3B30", // red
  "#10B981", // emerald
  "#F59E0B", // amber
];

/** Hand-authored looks for key scenario characters */
const REGISTRY: Record<string, CharacterConfig> = {
  arjun: {
    hairStyle: "fade",
    hairColor: "#1C1917",
    skinTone: "#BC8359",
    skinShadow: "#A0643C",
    outfit: "hoodie",
    outfitColor: "#1E293B",
    accentColor: "#00E5FF",
    glasses: true,
  },
  priya: {
    hairStyle: "bun",
    hairColor: "#18181B",
    skinTone: "#E0B088",
    skinShadow: "#C69068",
    outfit: "blazer",
    outfitColor: "#312E81",
    accentColor: "#FFFC00",
  },
  mike: {
    hairStyle: "curls",
    hairColor: "#6B4F35",
    skinTone: "#F8D9C0",
    skinShadow: "#E5B99B",
    outfit: "collar",
    outfitColor: "#F59E0B",
    accentColor: "#F59E0B",
  },
  camellia: {
    hairStyle: "wavy",
    hairColor: "#3B2515",
    skinTone: "#F5C8A8",
    skinShadow: "#DC9E7A",
    outfit: "turtleneck",
    outfitColor: "#701A75",
    accentColor: "#A855F7",
  },
  rosita: {
    hairStyle: "bob",
    hairColor: "#1C1917",
    skinTone: "#BC8359",
    skinShadow: "#A0643C",
    outfit: "collar",
    outfitColor: "#065F46",
    accentColor: "#10B981",
  },
  troy: {
    hairStyle: "short",
    hairColor: "#71717A",
    skinTone: "#F8D9C0",
    skinShadow: "#E5B99B",
    outfit: "blazer",
    outfitColor: "#1F2937",
    accentColor: "#94A3B8",
  },
  salesman: {
    hairStyle: "short",
    hairColor: "#1C1917",
    skinTone: "#E0B088",
    skinShadow: "#C69068",
    outfit: "blazer",
    outfitColor: "#991B1B",
    accentColor: "#EF4444",
  },
};

const STYLES: HairStyle[] = ["short", "bun", "wavy", "curls", "bob", "fade"];
const OUTFITS: OutfitStyle[] = ["blazer", "hoodie", "turtleneck", "collar", "vest"];

/** Deterministic look generator for any character name */
export function characterFor(name: string): CharacterConfig {
  const key = name.toLowerCase().trim().split(/[\s,]/)[0];
  if (REGISTRY[key]) return REGISTRY[key];

  let hash = 0;
  for (const ch of key) hash = (hash * 37 + ch.charCodeAt(0)) >>> 0;

  const skin = SKIN_PALETTES[hash % SKIN_PALETTES.length];
  const hairStyle = STYLES[(hash >> 2) % STYLES.length];
  const hairColor = HAIR_COLORS[(hash >> 4) % HAIR_COLORS.length];
  const outfit = OUTFITS[(hash >> 6) % OUTFITS.length];
  const outfitColor = OUTFIT_COLORS[(hash >> 8) % OUTFIT_COLORS.length];
  const accentColor = ACCENT_COLORS[(hash >> 10) % ACCENT_COLORS.length];
  const glasses = (hash >> 12) % 4 === 0;

  return {
    hairStyle,
    hairColor,
    skinTone: skin.tone,
    skinShadow: skin.shadow,
    outfit,
    outfitColor,
    accentColor,
    glasses,
  };
}
