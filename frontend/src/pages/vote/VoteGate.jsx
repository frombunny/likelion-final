import { useEffect, useState } from "react";
import VoteComplete from "./VoteComplete";
import Vote from "./Vote";

export default function VoteGate() {
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_BACKEND_VOTE_STATUS_URL,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const data = await res.json();
        setVoted(data.data.isParticipated);
      } catch (err) {
        console.error("투표 상태 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return <div>불러오는 중...</div>;

  return voted ? <VoteComplete /> : <Vote />;
}