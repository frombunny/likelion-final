import boogie from "../../assets/common/boogie.svg";
import styled from "styled-components";

export default function VoteComplete() {
  return (
    <VoteCompleteWrapper>
      <VoteCompleteImage src={boogie} alt="boogie" />
      <VoteCompleteText>투표가 완료되었습니다.</VoteCompleteText>
    </VoteCompleteWrapper>
  );
}

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
