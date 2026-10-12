import { useState } from "react";
import { useSession } from "../state/store";
import { conceptById, lessons, levelStub } from "../content/registry";
import { Button } from "../ui/Button";

function LessonCardView({ conceptId }: { conceptId: number }) {
  const [expanded, setExpanded] = useState(false);
  const card = lessons[conceptId];
  const concept = conceptById(conceptId);
  if (!concept) return null;

  const name = card?.name ?? concept.concept.split(/[,:;(]/)[0].trim();
  const oneLine = card?.oneLine ?? concept.concept;
  const confusion = card?.confusion ?? (concept.confusion ? `People often think ${concept.confusion}.` : null);
  const book = card?.fromBook.book ?? concept.source;

  return (
    <div className="ta-fade bg-ta-white text-ta-black rounded-xl p-4 flex flex-col gap-2">
      <div className="text-[17px] leading-6 font-bold">{name}</div>
      <div className="text-[17px] leading-6">{oneLine}</div>
      {card && <div className="text-[17px] leading-6 text-ta-black/80">{card.whatYouDid}</div>}
      {confusion && <div className="text-[13px] leading-[18px] text-ta-grey">{confusion}</div>}
      <div className="text-[13px] leading-[18px]">
        {book}
        {card && <span className="italic"> &mdash; &ldquo;{card.fromBook.quote}&rdquo;</span>}
      </div>

      {card?.expand && (
        <>
          <button
            className="text-[13px] text-left underline mt-1"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
          {expanded && (
            <div className="ta-fade flex flex-col gap-2 text-[17px] leading-6 border-t border-ta-grey/30 pt-2">
              <div>{card.expand.definition}</div>
              {card.expand.otherFraming && <div>{card.expand.otherFraming}</div>}
              <div className="font-semibold">Try this today: {card.expand.tryThisToday}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function Lesson() {
  const { params, navigate } = useSession();
  const found = params.levelId ? levelStub(params.levelId) : undefined;

  if (!found) {
    return (
      <div className="max-w-[480px] mx-auto px-4 pt-8">
        <div className="text-[17px]">Nothing to show.</div>
        <button className="text-ta-yellow mt-4" onClick={() => navigate("home")}>
          &larr; Home
        </button>
      </div>
    );
  }

  const { world, stub } = found;

  return (
    <div className="max-w-[480px] mx-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-10 flex flex-col gap-4">
      <div className="text-[13px] leading-[18px] text-ta-grey">{stub.title}</div>
      <h1 className="text-[28px] leading-8 font-bold">Lesson</h1>

      <div className="flex flex-col gap-3">
        {stub.concepts.map((cid) => (
          <LessonCardView key={cid} conceptId={cid} />
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <Button onClick={() => navigate("level", { worldId: world.id, levelId: stub.id })}>
          Play again
        </Button>
        <Button variant="ghost" onClick={() => navigate("world", { worldId: world.id })}>
          Back to {world.theme}
        </Button>
      </div>
    </div>
  );
}
