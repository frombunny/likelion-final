import { useParams, useNavigate } from "react-router-dom";
import Award from "./Award";
import { AWARD_CATEGORIES } from "./awardCategories";
import testImg from "../../assets/vote/testImg.png";

const FAKE_RESULTS = {
  kindness: [
    {
      title: "다정함이 상상 그 이상",
      img: testImg,
      name: "권기남",
      role: "Designer",
      description: "따뜻함의 마법을 퍼뜨린 사람!",
    },
    {
      title: "다정함이 상상 그 이상",
      img: testImg,
      name: "홍길동",
      role: "Backend",
      description: "언제나 배려심 깊은 멋사인!",
    },
  ],

  cheer: [
  ],

  skill: [
  ],
};
  
export default function AwardSectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentIndex = AWARD_CATEGORIES.indexOf(id);
  const isLast = currentIndex === AWARD_CATEGORIES.length - 1;

  const nextId = !isLast ? AWARD_CATEGORIES[currentIndex + 1] : null;
  const results = FAKE_RESULTS[id] || [];

  return (
    <Award
      results={results}
      onNext={() => {
        if (!isLast) navigate(`/award/${nextId}`);
        else navigate("/award/complete");
      }}
    />
  );
}
