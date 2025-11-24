import { useParams } from "react-router-dom";
import { VOTE_SECTIONS, VOTE_ORDER } from "./voteSectionList";
import VoteMain from "./VoteMain";

export default function VoteSection() {
  const { id } = useParams();
  const section = VOTE_SECTIONS[id];

  const currentIndex = VOTE_ORDER.indexOf(id);
  const isLast = currentIndex === VOTE_ORDER.length - 1;

  const nextId = isLast ? null : VOTE_ORDER[currentIndex + 1];

  return (
    <VoteMain
      key={id}
      title={section.title}
      description={section.description}
      sector={section.sector}
      nextPath={isLast ? "/vote/complete" : `/vote/${nextId}`}
    />
  );
}
