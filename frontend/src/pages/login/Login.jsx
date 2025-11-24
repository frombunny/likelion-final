import React from "react";
import styled from "styled-components";
import bgImage from "../../assets/login/loginBg.svg";
import loginButton from "../../assets/login/kakaoLoginButton.png";

export default function Login(){
    return <LoginWrapper>
        <LoginButton/>
    </LoginWrapper>;
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
