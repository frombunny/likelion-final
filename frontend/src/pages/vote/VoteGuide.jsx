import styled from "styled-components";
import BasicButton from "../../shared/BasicButton";
import colors from "../../styles/common/colors";

export default function VoteGuide({ onConfirm }) {
  return (
    <Wrapper>
      <Title>올해의 멋사인 투표는<br />이렇게 진행돼요.</Title>

      <GuideCard>
        <Circle>1</Circle>
        <GuideContent>
          <GuideTitle>올해의 멋사 인(人) 투표</GuideTitle>
          <GuideDesc>
            여러분이 생각하기에 해당 부문에 <br/>
            '가장 적합한' 사람을 뽑아주세요!
            <br/>
            <br/>
            (자기 투표는 불가능해요🥲)
          </GuideDesc>
        </GuideContent>
      </GuideCard>

      <GuideCard>
        <Circle>2</Circle>
        <GuideContent>
          <GuideTitle>각 부문마다 2명씩 투표</GuideTitle>
          <GuideDesc>
            각 부문마다 2명씩 투표해 주시면 되요!<br />
            중복 투표는 불가능해요🥲
            <br />
            <br />
            모두가 투표를 완료하면 결과를 확인할 수 있어요😘
          </GuideDesc>
        </GuideContent>
      </GuideCard>

      <ButtonBox>
        <BasicButton text="확인했어요" onClick={onConfirm} />
      </ButtonBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  color: #303030;
  line-height: 1.4;
`;

const GuideCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px 20px;
  background: #f9f9f9;
  border-radius: 16px;
`;

const Circle = styled.div`
  width: 36px;
  height: 36px;
  background: ${colors.primary_blue};
  color: white;
  font-weight: 700;
  font-size: 1.6rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GuideContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const GuideTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: #303030;
`;

const GuideDesc = styled.div`
  font-size: 1.4rem;
  color: #555;
  line-height: 1.5;
`;

const ButtonBox = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
`;
