import styled from "styled-components";
import colors from "../common/colors";

export default function AppLayout({ header, children, showHomeIndicator = false }) {
  return (
    <Shell>
      <PhoneFrame>
        {header}
        <Content>{children}</Content>
        {showHomeIndicator && <HomeIndicator aria-hidden="true" />}
      </PhoneFrame>
    </Shell>
  );
}

const Shell = styled.div`
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  background: ${colors.bgShell};
`;

const PhoneFrame = styled.div`
  width: 100%;
  max-width: var(--app-width);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${colors.bgPage};
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04);
`;

const Content = styled.main`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const HomeIndicator = styled.span`
  width: 134px;
  height: 5px;
  border-radius: 100px;
  background: #111111;
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 50;
`;
