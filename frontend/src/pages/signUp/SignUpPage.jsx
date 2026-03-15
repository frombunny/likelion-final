import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import BasicButton from "../../shared/BasicButton";
import colors from "../../styles/common/colors";

const partLabel = {
  PM: "기획",
  DE: "디자인",
  FE: "프론트엔드",
  BE: "백엔드",
};

const roleLabel = {
  ROLE_BABY_LION: "아기사자",
  ROLE_EXECUTIVE: "운영진",
  ROLE_PART_LEADER: "팀장",
  ROLE_SUB_LEADER: "부대표",
  ROLE_LEADER: "대표",
};

export default function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const kakaoInfo = location.state?.kakaoInfo;
  const part = location.state?.part;
  const role = location.state?.role;

  const [name, setName] = useState(kakaoInfo?.kakao_account?.profile?.nickname || "");

  useEffect(() => {
    if (!kakaoInfo) {
      navigate("/login", { replace: true });
    }
  }, [kakaoInfo, navigate]);

  const submitSignUp = () => {
    const signupApi = import.meta.env.VITE_BACKEND_SIGNUP_URL;
    if (!signupApi) return;
    const trimmedName = name.trim();
    if (!trimmedName) return;

    axios
      .post(signupApi, {
        name: trimmedName,
        part,
        role,
        kakaoId: kakaoInfo?.id,
        profileImageUrl: kakaoInfo?.kakao_account?.profile?.profile_image_url,
      })
      .then(() => {
        localStorage.setItem("userName", trimmedName);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error("회원가입 실패:", error);
      });
  };

  return (
    <Page>
      <Title>회원가입 정보를 입력해 주세요</Title>
      <Description>필수 정보를 확인하고 멋사의 밤을 시작해요 :)</Description>

      <FormGroup>
        <Label>이름</Label>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="이름을 입력해 주세요"
          maxLength={20}
          autoFocus
        />
      </FormGroup>

      <FormGroup>
        <Label>트랙</Label>
        <Readonly>{partLabel[part] || "선택되지 않음"}</Readonly>
      </FormGroup>

      <FormGroup>
        <Label>직책</Label>
        <Readonly>{roleLabel[role] || "선택되지 않음"}</Readonly>
      </FormGroup>

      <BottomArea>
        <BasicButton text="완료" disabled={!name.trim()} onClick={submitSignUp} />
      </BottomArea>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  min-height: var(--content-min-height);
  padding: 18px 20px 140px;
`;

const Title = styled.h1`
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 2.8rem;
  font-weight: 600;
  line-height: 4.1rem;
  letter-spacing: -0.07rem;
`;

const Description = styled.p`
  margin: 8px 0 0;
  color: ${colors.textGray};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: -0.035rem;
`;

const FormGroup = styled.div`
  margin-top: 24px;
`;

const Label = styled.p`
  margin: 0 0 8px 4px;
  color: ${colors.textPrimary};
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 2.8rem;
  letter-spacing: -0.045rem;
`;

const inputStyle = `
  width: var(--content-width);
  height: 52px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background: transparent;
  padding: 0 19px;
  color: ${colors.textPrimary};
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 2.4rem;
  letter-spacing: -0.04rem;
`;

const Input = styled.input`
  ${inputStyle}
`;

const Readonly = styled.div`
  ${inputStyle}
  display: flex;
  align-items: center;
`;

const BottomArea = styled.div`
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--app-width);
  padding: 0 20px;
`;
