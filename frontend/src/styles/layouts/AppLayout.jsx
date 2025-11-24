import styled from "styled-components";

export default function AppLayout({ header, children}) {
  return (
    <AppBackground>
      <AppContainer>
        {header}
        <MainContent>{children}</MainContent>

      </AppContainer>
    </AppBackground>
  );
}


export const AppBackground = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
`;

export const AppContainer = styled.div`
  width: 100%;
  max-width: 420px;
  min-height: calc(var(--vh) * 100);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const MainContent = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;
