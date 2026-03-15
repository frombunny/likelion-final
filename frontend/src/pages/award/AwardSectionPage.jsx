import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Award from "./Award";
import AwardGate from "./AwardGate";
import {
  AWARD_CATEGORIES,
  SECTOR_DESCRIPTIONS,
  SECTOR_TITLES,
} from "./awardCategories";

export default function AwardSectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (!AWARD_CATEGORIES.includes(id)) {
      navigate(`/award/${AWARD_CATEGORIES[0]}`, { replace: true });
      return;
    }

    const token = localStorage.getItem("accessToken");

    Promise.all([
      axios.get(import.meta.env.VITE_BACKEND_VOTE_STATUS_URL, {
        headers: { Authorization: `Bearer ${token || ""}` },
      }),
      axios.get(`${import.meta.env.VITE_BACKEND_WINNERS_URL}?sector=${id}`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      }),
    ])
      .then(([statusRes, winnerRes]) => {
        setIsVotingOpen(statusRes.data?.data?.isOpen ?? false);
        setWinners(winnerRes.data?.data?.winners || []);
      })
      .catch((error) => {
        console.error("어워즈 조회 실패:", error);
        setWinners([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  const currentIndex = AWARD_CATEGORIES.indexOf(id);
  const isLast = currentIndex === AWARD_CATEGORIES.length - 1;

  const results = useMemo(() => {
    if (!winners.length) {
      return [
        {
          name: "결과 집계 중",
          part: "",
          profileImageUrl: "",
          title: SECTOR_TITLES[id],
          description: SECTOR_DESCRIPTIONS[id],
        },
      ];
    }

    return winners.map((winner) => ({
      ...winner,
      title: SECTOR_TITLES[id],
      description: SECTOR_DESCRIPTIONS[id],
    }));
  }, [id, winners]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "var(--content-min-height)",
          padding: "48px 20px",
          textAlign: "center",
          color: "#8F8F8F",
          fontSize: "1.5rem",
        }}
      >
        불러오는 중...
      </div>
    );
  }

  if (isVotingOpen) {
    return <AwardGate />;
  }

  return (
    <Award
      results={results}
      onNext={() => {
        if (isLast) {
          navigate("/");
          return;
        }

        navigate(`/award/${AWARD_CATEGORIES[currentIndex + 1]}`);
      }}
    />
  );
}
