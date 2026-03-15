import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BasicButton from "../../shared/BasicButton";
import colors from "../../styles/common/colors";
import icon from "../../assets/vote/voteInProgressIcon.svg";
import { AWARD_CATEGORIES } from "./awardCategories";

export default function AwardGate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isVotingOpen, setIsVotingOpen] = useState(true);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_VOTE_STATUS_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` },
      })
      .then((res) => {
        const open = res.data?.data?.isOpen ?? false;
        setIsVotingOpen(open);

        if (!open) {
          navigate(`/award/${AWARD_CATEGORIES[0]}`, { replace: true });
        }
      })
      .catch(() => {
        setIsVotingOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <Loading>확인 중...</Loading>;
  }

  if (!isVotingOpen) {
    return null;
  }

  return (
    <Page>
      <Center>
        <Icon src={icon} alt="vote open" />
        <Title>잠시만요! 아직 투표 중이에요</Title>
        <Text>
          모두의 투표가 마무리되면,
          <br />
          바로 결과를 알려드릴게요!
        </Text>
      </Center>

      <BottomArea>
        <BasicButton text="확인" onClick={() => navigate("/")} />
      </BottomArea>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  min-height: var(--content-min-height);
  padding: 136px 20px 140px;
`;

const Center = styled.div`
  width: 201px;
  margin: 0 auto;
  text-align: center;
`;

const Icon = styled.img`
  width: 200px;
  height: 200px;
`;

const Title = styled.p`
  margin: 24px 0 8px;
  color: ${colors.textGray};
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 2.6rem;
  letter-spacing: -0.045rem;
`;

const Text = styled.p`
  margin: 0;
  color: ${colors.textGray};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: -0.035rem;
`;

const BottomArea = styled.div`
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--app-width);
  padding: 0 20px;
`;

const Loading = styled.div`
  min-height: var(--content-min-height);
  padding: 48px 20px;
  text-align: center;
  color: ${colors.textGray};
  font-size: 1.5rem;
`;
