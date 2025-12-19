import { useParams, useNavigate } from "react-router-dom";
import Award from "./Award";
import { AWARD_CATEGORIES, SECTOR_TITLES } from "./awardCategories";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AwardSectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const API = import.meta.env.VITE_BACKEND_WINNERS_URL;
  const STATUS_API = import.meta.env.VITE_BACKEND_VOTE_STATUS_URL;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios.get(STATUS_API, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setIsOpen(res.data?.data?.isOpen ?? false);
    })
    .catch(() => setIsOpen(false));

    axios
      .get(`${API}?sector=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const winners = res.data?.data?.winners ?? [];

        setResults(
          winners.map((w) => ({
            title: SECTOR_TITLES[id],
            img: w.profileImageUrl,
            name: w.name,
            role: w.part,
            description: ""
          }))
        );
      })
      .catch((e) => console.error("수상자 조회 실패:", e));
  }, [id]);

  const currentIndex = AWARD_CATEGORIES.indexOf(id);
  const isLast = currentIndex === AWARD_CATEGORIES.length - 1;
  const nextId = !isLast ? AWARD_CATEGORIES[currentIndex + 1] : null;

  if (results.length === 0) {
    return <div style={{ padding: "40px", textAlign: "center" }}>로딩 중...</div>;
  }

  return (
    <Award
      results={results}
      isOpen={isOpen}
      onNext={() => {
        if (!isLast) navigate(`/award/${nextId}`);
        else navigate("/award/complete");
      }}
    />
  );
}