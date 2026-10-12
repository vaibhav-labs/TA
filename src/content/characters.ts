export type HairStyle = "short" | "bun" | "wavy";

export interface CharacterConfig {
  hairStyle: HairStyle;
}

/** Hand-authored looks for named, recurring characters. */
const REGISTRY: Record<string, CharacterConfig> = {
  arjun: { hairStyle: "short" },
  priya: { hairStyle: "bun" },
};

const FALLBACK_STYLES: HairStyle[] = ["short", "bun", "wavy"];

/** Any other name still gets a consistent, distinct look (deterministic hash, no bespoke authoring needed). */
export function characterFor(name: string): CharacterConfig {
  const key = name.toLowerCase().trim().split(/[\s,]/)[0];
  if (REGISTRY[key]) return REGISTRY[key];
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return { hairStyle: FALLBACK_STYLES[hash % FALLBACK_STYLES.length] };
}
