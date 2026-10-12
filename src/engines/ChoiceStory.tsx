import { useState } from "react";
import type { ChoiceStoryLevel, EgoState, Tag } from "../content/types";
import { Button } from "../ui/Button";
import { DialogueRow, Callout } from "../ui/Dialogue";

interface ChoiceStoryProps {
  level: ChoiceStoryLevel;
  playerName?: string;
  onComplete: (result: { score: number; tags: Tag[]; egoStates: EgoState[] }) => void;
}

const TAG_SCORE: Record<Tag, number> = { best: 100, ok: 50, "game-move": 0 };

/** Choice-story engine (section 5): a real back-and-forth — the player's own line becomes a bubble too. */
export function ChoiceStory({ level, playerName = "You", onComplete }: ChoiceStoryProps) {
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
    <div className="flex flex-col gap-4">
      {level.intro && (
        <div className="text-[15px] leading-[21px] text-ta-grey border-l-2 border-ta-grey/40 pl-3">
          {level.intro}
        </div>
      )}

      <DialogueRow name={beat.npc} text={beat.line} expression={beat.expression} active={chosen === null} />

      {chosen === null && (
        <div className="flex flex-col gap-2">
          <div className="text-[13px] leading-[18px] text-ta-grey uppercase tracking-wide px-1">
            {playerName}&rsquo;s move
          </div>
          {beat.options.map((opt, i) => (
            <Button key={i} onClick={() => pick(i)}>
              {opt.text}
            </Button>
          ))}
        </div>
      )}

      {option && (
        <div className="ta-fade flex flex-col gap-3">
          <DialogueRow name={playerName} text={option.text} side="right" tone="player" active={false} />
          <DialogueRow
            name={beat.npc}
            text={option.outcome}
            expression={option.outcomeExpression ?? "neutral"}
          />
          <Callout label="Why">{option.lesson}</Callout>
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
