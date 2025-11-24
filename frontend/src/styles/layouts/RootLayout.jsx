import styled from "styled-components";
import { Outlet, useLocation } from "react-router-dom";
import AppLayout from "./AppLayout";
import logo from "../../assets/common/headerLogo.svg";
import menubar from "../../assets/common/menuBar.svg";
import { useNavigate } from "react-router-dom";

export default function RootLayout() {
  const { pathname } = useLocation();

  const hideHeader = pathname === "/login";
  const showMenubar =
    pathname.startsWith("/vote") ||
    pathname.startsWith("/award") ||
    pathname.startsWith("/Certificate") ||
    pathname.startsWith("/certificate") ;

  return (
    <AppLayout header={hideHeader ? null : <Header showMenubar={showMenubar} />}>
      <Outlet />
    </AppLayout>
  );
}


function Header({ showMenubar }) {
  const navigate = useNavigate();
  return (
    <HeaderWrapper>
      <Logo src={logo} alt="LikeLion" />
      {showMenubar && <MenuButton src={menubar} alt="menu" onClick={() => navigate("")}/>}
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  width: 100%;
  height: 56px;

  padding: 18px 20px; 
  display: flex;
  align-items: center;
  justify-content: space-between;
`;


const Logo = styled.img`
  height: 20px;
`;

const MenuButton = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;
