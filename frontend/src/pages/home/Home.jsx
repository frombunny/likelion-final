import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import colors from "../../styles/common/colors";
import madeBy from "../../assets/common/madeBy.svg";

const MENUS = [
  { label: "멋사 피날레 톡", path: "/chat" },
  { label: "올해의 멋사 어워즈", path: "/award" },
  { label: "내 수료증 발급", path: "/certificate" },
];

export default function Home() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "권기남";

  return (
    <Page>
      <Headline>
        멋진 사자 <Blue>{userName}</Blue>님,
        <br />
        그동안 고생 많았습니다!
      </Headline>

      <Section>
        <SectionLabel>우리의 성장을 기념해요</SectionLabel>
        {MENUS.map((menu) => (
          <MenuButton key={menu.path} type="button" onClick={() => navigate(menu.path)}>
            <span>{menu.label}</span>
            <Arrow>›</Arrow>
          </MenuButton>
        ))}
      </Section>

      <Divider />

      <ServiceSection>
        <SectionLabel>서비스 이용</SectionLabel>
        <LogoutButton type="button" onClick={() => navigate("/login")}>
          <Danger>로그아웃</Danger>
        </LogoutButton>
      </ServiceSection>

      <MadeBy src={madeBy} alt="made by" />
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  min-height: var(--content-min-height);
  padding: 24px 24px 54px;
  display: flex;
  flex-direction: column;
`;

const Headline = styled.h1`
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 3.8rem;
  letter-spacing: -0.07rem;
`;

const Blue = styled.span`
  color: ${colors.primaryBlue};
`;

const Section = styled.section`
  margin-top: 34px;
`;

const ServiceSection = styled.section`
  margin-top: 24px;
`;

const SectionLabel = styled.p`
  margin: 0 0 8px;
  color: ${colors.textGray};
  font-size: 1.3rem;
  font-weight: 400;
  line-height: 1.8rem;
  letter-spacing: -0.0325rem;
`;

const MenuButton = styled.button`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${colors.textPrimary};
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 2.8rem;
  letter-spacing: -0.045rem;
  text-align: left;
  cursor: pointer;
`;

const Arrow = styled.span`
  color: #c3c3c3;
  font-size: 2rem;
  line-height: 1;
  transform: translateY(-1px);
`;

const Divider = styled.div`
  width: calc(100% + 48px);
  height: 1px;
  margin: 24px -24px 0;
  background: #dbdbdb;
`;

const Danger = styled.span`
  color: ${colors.textDanger};
`;

const LogoutButton = styled.button`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  color: ${colors.textPrimary};
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 2.8rem;
  letter-spacing: -0.045rem;
  text-align: left;
  cursor: pointer;
`;

const MadeBy = styled.img`
  width: 113px;
  height: 12px;
  margin-top: auto;
  opacity: 0.8;
`;
