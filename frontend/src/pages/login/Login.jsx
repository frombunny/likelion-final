import React, { useEffect } from "react";
import styled from "styled-components";
import bgImage from "../../assets/login/loginBg.svg";
import loginButton from "../../assets/login/kakaoLoginButton.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const BACKEND_LOGIN_URL = import.meta.env.VITE_BACKEND_LOGIN_URL;

  const handleLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) return;

    axios
      .post(BACKEND_LOGIN_URL, { code })
      .then((res) => {
        const loginRes = res.data.data;

        // 로그인 성공
        if (loginRes.status === "LOGIN_SUCCESS") {
          localStorage.setItem("accessToken", loginRes.accessToken);
          navigate("/");
          return;
        }

        // 회원가입 필요
        if (loginRes.status === "SIGNUP_REQUIRED") {
          navigate("/signUp", {
            state: {
              kakaoInfo: loginRes.kakaoInfo,
            },
          });
          return;
        }

        console.error("예상치 못한 로그인 상태:", loginRes);
      })
      .catch((err) => {
        console.error("로그인 통신 에러:", err);
      });
  }, []);

  return (
    <LoginWrapper>
      <LoginButton
        src={loginButton}
        alt="카카오 로그인"
        onClick={handleLogin}
      />
    </LoginWrapper>
  );
}

const LoginWrapper = styled.div`
  width: 100%;
  height: 100vh;
  flex: 1;
  position: relative;

  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const LoginButton = styled.img`
  width: 300px;
  height: 60px;
  position: absolute;
  top: calc(100vh - 160px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  cursor: pointer;
`;
