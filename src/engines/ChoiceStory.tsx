import { useState } from "react";
import type { ChoiceStoryLevel, EgoState, Tag } from "../content/types";
import { Button } from "../ui/Button";
import { Bubble } from "../ui/Card";

interface ChoiceStoryProps {
  level: ChoiceStoryLevel;
  onComplete: (result: { score: number; tags: Tag[]; egoStates: EgoState[] }) => void;
}

const TAG_SCORE: Record<Tag, number> = { best: 100, ok: 50, "game-move": 0 };

/** Choice-story engine (section 5): walk the beats, pick a line, read the consequence. */
export function ChoiceStory({ level, onComplete }: ChoiceStoryProps) {
  const [beatIndex, setBeatIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [egoStates, setEgoStates] = useState<EgoState[]>([]);
  const [ended, setEnded] = useState(false);

  const beat = level.beats[beatIndex];
  const option = chosen !== null ? beat.options[chosen] : null;

  function pick(i: number) {
    const opt = beat.options[i];
    setChosen(i);
    const nextTags = [...tags, opt.tag];
    const nextEgo = [...egoStates, opt.egoState];
    setTags(nextTags);
    setEgoStates(nextEgo);
    if (opt.tag === "game-move" || beatIndex === level.beats.length - 1) {
      setEnded(true);
    }
  }

  function advance() {
    setBeatIndex((i) => i + 1);
    setChosen(null);
  }

  function finish() {
    const score = tags.length ? tags.reduce((a, t) => a + TAG_SCORE[t], 0) / tags.length : 0;
    onComplete({ score, tags, egoStates });
  }

  return (
    <div className="flex flex-col gap-3">
      {level.intro && <div className="text-[13px] leading-[18px] text-ta-grey">{level.intro}</div>}
      <Bubble>
        <span className="font-semibold">{beat.npc}:</span> {beat.line}
      </Bubble>
      {chosen === null && (
        <div className="flex flex-col gap-2">
          {beat.options.map((opt, i) => (
            <Button key={i} onClick={() => pick(i)}>
              {opt.text}
            </Button>
          ))}
        </div>
      )}
      {option && (
        <div className="ta-fade flex flex-col gap-2">
          <Button variant={option.tag === "game-move" ? "game-move" : "selected"} disabled>
            {option.text}
          </Button>
          <Bubble>{option.outcome}</Bubble>
          <div className="text-[17px] leading-6 text-ta-white/90">{option.lesson}</div>
          {!ended ? (
            <Button variant="ghost" onClick={advance}>
              Continue
            </Button>
          ) : (
            <Button variant="ghost" onClick={finish}>
              Finish
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
