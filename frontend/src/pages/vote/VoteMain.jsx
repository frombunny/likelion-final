import styled from "styled-components";
import BasicButton from "../../shared/BasicButton";
import checkIcon from "../../assets/vote/checkIcon.svg";
import sampleImage from "../../assets/vote/testImg.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VoteMain({ title, description, nextPath }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const candidates = [
    { id: 1, name: "권기남", img: sampleImage },
    { id: 2, name: "권기남", img: sampleImage },
    { id: 3, name: "권기남", img: sampleImage },
    { id: 4, name: "권기남", img: sampleImage },
    { id: 5, name: "권기남", img: sampleImage },
    { id: 6, name: "권기남", img: sampleImage },
    { id: 7, name: "권기남", img: sampleImage },
    { id: 8, name: "권기남", img: sampleImage },
    { id: 9, name: "권기남", img: sampleImage },
    { id: 10, name: "권기남", img: sampleImage },
  ];

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
  };

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
            <Image src={c.img} alt={c.name} />

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
          onClick={() => navigate(nextPath, { state: { selected } })}
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

  /* AppContainer 중앙 정렬 대응 */
  left: 50%;
  transform: translateX(-50%);

  width: 100%;
  max-width: 420px;

  padding: 0 20px;
  display: flex;
  justify-content: center;

  z-index: 100;
`;
