import styled from "styled-components";
import colors from "../../styles/common/colors";
import madeBy from "../../assets/common/madeBy.svg";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <HomeWrapper>
      <GreetingSection>
        <GreetingTitle>
          오늘은 <Highlight>한성 멋사</Highlight>,
          <br />
          헤어지는 날!
        </GreetingTitle>
      </GreetingSection>

      <MenuSection>
        <SectionTitle>우리의 성장을 기념해요</SectionTitle>

        <MenuList>
          <MenuItem onClick={() => navigate("/chat")}>
            <span>사자들의 피날레 톡</span>
            <Arrow>›</Arrow>
          </MenuItem>

          <MenuItem onClick={() => navigate("/vote")}>
            <span>올해의 멋사 투표</span>
            <Arrow>›</Arrow>
          </MenuItem>

          <MenuItem onClick={() => navigate("/award")}>
            <span>올해의 멋사 어워즈</span>
            <Arrow>›</Arrow>
          </MenuItem>

          <MenuItem onClick={() => navigate("/certificate")}>
            <span>내 수료증 발급</span>
            <Arrow>›</Arrow>
          </MenuItem>
        </MenuList>
      </MenuSection>

      <FooterSection>
        <FooterTitle>서비스 이용</FooterTitle>
        <Logout onClick={() => navigate("/login")}>로그아웃</Logout>
        <MadeBy src={madeBy} alt="made by likelion" />
      </FooterSection>

      <MadeBy src={madeBy} alt="made by likelion" />
      
    </HomeWrapper>
  );
}

const HomeWrapper = styled.div`
  width: 100%;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const GreetingSection = styled.div`
  margin-top: 10px;
`;

const GreetingTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.4;
`;

const Highlight = styled.span`
  color: ${colors.primary_blue};}
`;

const MenuSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.div`
  color: ${colors.text_primary};
  font-size: 1.2rem;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #eee;
`;

const MenuItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 18px 0;
  font-size: 1.6rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
`;

const Arrow = styled.span`
  font-size: 1.8rem;
  color: #bbb;
`;

const FooterSection = styled.div`
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 24px;
`;

const FooterTitle = styled.div`
  font-size: 1.2rem;
  color: ${colors.text_gray};
  margin-bottom: 12px;
`;

const Logout = styled.div`
  font-size: 1.6rem;
  color: #e24c4c;
  cursor: pointer;
`;

const MadeBy = styled.img`
  width: 140px;
  margin-top: 300px;
  opacity: 0.8;
  display: block;
`;