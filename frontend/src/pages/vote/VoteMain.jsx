import styled from "styled-components";
import BasicButton from "../../shared/BasicButton";
import checkIcon from "../../assets/vote/checkIcon.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function VoteMain({ title, description, nextPath, sector }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [selected, setSelected] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const USER_LIST_API = import.meta.env.VITE_BACKEND_USER_LIST_URL;
  const VOTE_API = import.meta.env.VITE_BACKEND_VOTE_URL;

  const prevVotes = location.state?.prevVotes || [];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(USER_LIST_API, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCandidates(res.data.data.users))
      .catch(() => alert("후보를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
  };

  const handleNext = () => {
    const currentVote = {
      sector: sector,
      users: selected,
    };

    const updatedVotes = [...prevVotes, currentVote];

    if (nextPath === "/vote/complete") {
      const token = localStorage.getItem("accessToken");

      axios
        .post(
          VOTE_API,
          { voteItems: updatedVotes },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => navigate("/vote/complete"))
        .catch((err) => {
          console.error(err);
          alert("투표 제출 중 오류가 발생했습니다.");
        });

      return;
    }

    navigate(nextPath, { state: { prevVotes: updatedVotes } });
  };

  if (loading) return <Wrapper>불러오는 중...</Wrapper>;

  return (
    <Wrapper>
      <Title>{title}</Title>
      <SubTitle>{description}</SubTitle>

      <Grid>
        {candidates.map((c) => (
          <Card
            key={c.id}
            onClick={() => toggleSelect(c.id)}
            disabled={!selected.includes(c.id) && selected.length >= 2}
          >
            <Image src={c.profileImageUrl} alt={c.name} />

            {selected.includes(c.id) && (
              <SelectedOverlay>
                <CheckIcon src={checkIcon} />
                <span>선택</span>
              </SelectedOverlay>
            )}

            <Name>{c.name}</Name>
          </Card>
        ))}
      </Grid>

      <FixedButton>
        <BasicButton
          text="다음"
          disabled={selected.length !== 2}
          onClick={handleNext}
        />
      </FixedButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 24px 20px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const SubTitle = styled.div`
  font-size: 1.4rem;
  color: #767676;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const Card = styled.div`
  position: relative;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.4 : 1)};
`;

const Image = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const Name = styled.div`
  margin-top: 4px;
  font-size: 1.4rem;
  text-align: center;
`;

const SelectedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;

  background: rgba(0, 0, 0, 0.55);
  color: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CheckIcon = styled.img`
  width: 32px;
  margin-bottom: 4px;
`;

const FixedButton = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  z-index: 100;
`;
