import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import colors from "../common/colors";
import logo from "../../assets/common/headerLogo.svg";
import menuIcon from "../../assets/common/menubar.svg";

function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  const isServicePage =
    pathname.startsWith("/chat") ||
    pathname.startsWith("/vote") ||
    pathname.startsWith("/award") ||
    pathname.startsWith("/certificate");
  const isSignPage = pathname.startsWith("/signUp");

  if (isLogin) return null;

  return (
    <>
      <HeaderWrap>
        <Left $service={isServicePage}>
          {isServicePage && (
            <IconButton type="button" onClick={() => navigate("/")} aria-label="메뉴">
              <img src={menuIcon} alt="menu" />
            </IconButton>
          )}
          <Logo src={logo} alt="멋사의 밤" />
        </Left>

        {isHome ? (
          <IconButton type="button" onClick={() => navigate("/login")} aria-label="닫기">
            <CloseIcon />
          </IconButton>
        ) : isSignPage ? (
          <IconGap />
        ) : (
          <IconGap />
        )}
      </HeaderWrap>
    </>
  );
}

export default function RootLayout() {
  const { pathname } = useLocation();
  const hideHeader = pathname === "/login";

  return (
    <AppLayout header={hideHeader ? null : <Header />} showHomeIndicator={!hideHeader}>
      <Outlet />
    </AppLayout>
  );
}

const HeaderWrap = styled.header`
  height: var(--header-row-height);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${colors.bgPage};
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ $service }) => ($service ? "12px" : "0")};
`;

const Logo = styled.img`
  width: 97px;
  height: 20px;
`;

const IconButton = styled.button`
  width: 28px;
  height: 28px;
  padding: 0;
  display: grid;
  place-items: center;
  cursor: pointer;

  img {
    width: 28px;
    height: 28px;
  }
`;

const IconGap = styled.div`
  width: 28px;
  height: 28px;
`;

const CloseIcon = styled.span`
  width: 20px;
  height: 20px;
  display: inline-block;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 20px;
    height: 2px;
    border-radius: 10px;
    background: ${colors.textPrimary};
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;
