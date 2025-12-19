import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import boogie from "../../assets/vote/voteGatheringIcon.svg";
import { AWARD_CATEGORIES } from "./awardCategories";

export default function AwardGate() {
  const navigate = useNavigate();
  const STATUS_API = import.meta.env.VITE_BACKEND_VOTE_STATUS_URL;

  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(STATUS_API, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const open = res.data?.data?.isOpen ?? false;
        setIsOpen(open);

        if (!open) {
          navigate(`/award/${AWARD_CATEGORIES[0]}`);
        }
      })
      .catch(() => setIsOpen(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CenterBox>확인 중...</CenterBox>;

  if (isOpen)
    return (
          <VoteCompleteWrapper>
            <VoteCompleteImage src={boogie} alt="boogie" />
            <VoteCompleteText>투표가 진행 중 입니다.</VoteCompleteText>
          </VoteCompleteWrapper>
    );

  return null;
}

const CenterBox = ({ children }) => (
  <div
    style={{
      padding: "40px",
      textAlign: "center",
      fontSize: "1.6rem",
      lineHeight: 1.6,
    }}
  >
    {children}
  </div>
);

const VoteCompleteWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const VoteCompleteImage = styled.img`
  width: 160px;
  height: auto;
  margin-bottom: 24px;
`;

const VoteCompleteText = styled.div`
  font-size: 1.6rem;
  color: #555;
  font-weight: 500;
`;