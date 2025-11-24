import React from "react";
import styled from "styled-components";
import bgImage from "../../assets/login/loginBg.svg";
import loginButton from "../../assets/login/kakaoLoginButton.png";
import { useEffect } from "react";
import axios from "axios";

export default function Login() {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API;
  const REDIRECT_URI = "http://localhost:5173/login";

  const handleLogin = () => {
    window.location.href =
      `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      axios
        .post("https://your-backend.com/auth/login", { code })
        .then(res => {
          const token = res.data.jwt;
          localStorage.setItem("accessToken", token);
          window.location.href = "/"; // 홈으로 이동
        })
        .catch(err => console.log("로그인 에러:", err));
    }
  }, []);

  return (
    <LoginWrapper>
      <LoginButton onClick={handleLogin} />
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

const LoginButton = styled.button`
  width: 300px;
  height: 60px;
  position: absolute;
  top: calc(100vh - 160px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;

  background-image: url(${loginButton});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: transparent !important;
  border: none;
`;
