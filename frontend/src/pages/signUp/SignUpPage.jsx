import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import BasicButton from "../../shared/BasicButton";
import colors from "../../styles/common/colors";

export default function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const kakaoInfo = location.state?.kakaoInfo;
  const part = location.state?.part;
  const role = location.state?.role;

  const ROLE_LABEL = {
    ROLE_BABY_LION: "아기사자",
    ROLE_EXECUTIVE: "운영진",
    ROLE_PART_LEADER: "파트 팀장",
    ROLE_SUB_LEADER: "부대표",
    ROLE_LEADER: "대표",
  };

  const PART_LABEL = {
    PM: "기획",
    DE: "디자인",
    FE: "프론트엔드",
    BE: "백엔드",
  };
  
  const [name, setName] = useState(
    kakaoInfo?.kakao_account?.profile?.nickname ?? ""
  );
  const [kakaoId] = useState(kakaoInfo?.id ?? null);
  const [profileImageUrl] = useState(
    kakaoInfo?.kakao_account?.profile?.profile_image_url ?? ""
  );

  const SIGNUP_API = import.meta.env.VITE_BACKEND_SIGNUP_URL;

  useEffect(() => {
    if (!kakaoInfo) {
      alert("카카오 정보가 없습니다. 다시 로그인 해주세요.");
      navigate("/login");
    }
  }, [kakaoInfo, navigate]);

  const handleSignUp = () => {
    axios
      .post(SIGNUP_API, {
        name,
        part,
        role,
        kakaoId,
        profileImageUrl,
      })
      .then(() => {
        alert("회원가입 완료!");
        navigate("/");
      })
      .catch((err) => {
        console.error("회원가입 실패:", err);
        alert(
          err.response?.data?.message || "회원가입 중 오류가 발생했습니다."
        );
      });
  };

  return (
    <Wrapper>
      <Title>회원가입</Title>

      <Label>이름</Label>
      <Input value={name} onChange={(e) => setName(e.target.value)} />

      <Label>트랙</Label>
      <FixedBox>{PART_LABEL[part] ?? "알 수 없음"}</FixedBox>

      <Label>직위</Label>
      <FixedBox>{ROLE_LABEL[role] ?? "알 수 없음"}</FixedBox>

      <ButtonArea>
        <BasicButton
          text="회원가입 완료"
          disabled={!name || !kakaoId}
          onClick={handleSignUp}
        />
      </ButtonArea>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 28px 22px;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 28px;
  color: ${colors.text_primary};
`;

const Label = styled.p`
  font-size: 1.4rem;
  margin: 18px 0 6px;
  color: ${colors.text_gray};
`;

const Input = styled.input`
  width: 100%;
  padding: 13px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const FixedBox = styled.div`
  width: 100%;
  padding: 13px;
  border-radius: 6px;
  background: #f5f5f5;
`;

const ButtonArea = styled.div`
  margin-top: 40px;
`;