import { useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import loginBg from "../../assets/login/loginBg.svg";
import kakaoButton from "../../assets/login/kakaoLoginButton.svg";
import { API_ENDPOINTS, apiClient } from "../../lib/api";
import { clearPendingSignUp, savePendingSignUp } from "../../lib/pendingSignUp";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const moveKakaoAuth = () => {
    if (!clientId || clientId === "YOUR_KAKAO_CLIENT_ID") {
      console.error("VITE_KAKAO_CLIENT_ID is not configured.");
      window.alert("카카오 앱 키가 설정되지 않았습니다. frontend/.env의 VITE_KAKAO_CLIENT_ID를 확인하세요.");
      return;
    }

    if (!redirectUri) {
      console.error("VITE_KAKAO_REDIRECT_URI is not configured.");
      window.alert(
        "카카오 리다이렉트 URI가 설정되지 않았습니다. frontend/.env의 VITE_KAKAO_REDIRECT_URI를 확인하세요."
      );
      return;
    }

    const searchParams = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
    });

    window.location.href = `https://kauth.kakao.com/oauth/authorize?${searchParams.toString()}`;
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    const key = `kakao_login_code_${code}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    apiClient
      .post(API_ENDPOINTS.login, { code })
      .then((res) => {
        const payload = res.data?.data;

        if (payload?.status === "LOGIN_SUCCESS") {
          clearPendingSignUp();
          localStorage.setItem("accessToken", payload.accessToken || "");
          localStorage.setItem("userName", payload.user?.name || "");
          localStorage.setItem("profileImage", payload.user?.profileImageUrl || "");
          window.history.replaceState({}, document.title, location.pathname);
          navigate("/", { replace: true });
          return;
        }

        if (payload?.status === "SIGNUP_REQUIRED") {
          const pendingSignUp = {
            code,
            kakaoInfo: payload.kakaoInfo,
          };

          savePendingSignUp(pendingSignUp);
          navigate("/signUp", {
            replace: true,
            state: pendingSignUp,
          });
          return;
        }

        console.error("알 수 없는 로그인 응답:", payload);
      })
      .catch((error) => {
        console.error("로그인 통신 에러:", error);
      });
  }, [location.pathname, navigate]);

  return (
    <Page>
      <Background aria-hidden="true" />
      <KakaoButton type="button" onClick={moveKakaoAuth} aria-label="카카오 로그인">
        <img src={kakaoButton} alt="" aria-hidden="true" />
      </KakaoButton>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  min-height: 100dvh;
  position: relative;
  overflow: hidden;
  background: #0a1f3b;
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  background: url(${loginBg}) center/cover no-repeat;
`;

const KakaoButton = styled.button`
  width: 188px;
  height: 46px;
  position: absolute;
  left: 50%;
  bottom: 58px;
  transform: translateX(-50%);
  cursor: pointer;

  img {
    width: 188px;
    height: 46px;
    display: block;
  }
`;
