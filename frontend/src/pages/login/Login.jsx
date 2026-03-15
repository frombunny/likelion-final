import { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/login/loginBg.svg";
import kakaoButton from "../../assets/login/kakaoLoginButton.svg";

export default function Login() {
  const navigate = useNavigate();

  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const loginApi = import.meta.env.VITE_BACKEND_LOGIN_URL;

  const moveKakaoAuth = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code || !loginApi) return;

    const key = `kakao_login_code_${code}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    axios
      .post(loginApi, { code })
      .then((res) => {
        const payload = res.data?.data;

        if (payload?.status === "LOGIN_SUCCESS") {
          localStorage.setItem("accessToken", payload.accessToken || "");
          localStorage.setItem("userName", payload.user?.name || "권기남");
          navigate("/", { replace: true });
          return;
        }

        if (payload?.status === "SIGNUP_REQUIRED") {
          navigate("/signUp", {
            replace: true,
            state: { kakaoInfo: payload.kakaoInfo },
          });
          return;
        }

        console.error("알 수 없는 로그인 응답:", payload);
      })
      .catch((error) => {
        console.error("로그인 통신 에러:", error);
      });
  }, [loginApi, navigate]);

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
