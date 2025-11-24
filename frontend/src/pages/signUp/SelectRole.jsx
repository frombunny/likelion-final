import React, { useState } from "react";
import SelectPage from "./SelectPage";
import { useNavigate, useLocation } from "react-router-dom";

const ROLE_OPTIONS = ["아기사자", "운영진", "파트 팀장", "부대표", "대표"];
const ROLE_MAP = {
  "대표": "ROLE_LEADER",
  "부대표": "ROLE_SUB_LEADER",
  "파트 팀장": "ROLE_PART_LEADER",
  "운영진": "ROLE_EXECUTIVE",
  "아기사자": "ROLE_BABY_LION",
};

export default function SelectRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");
  const kakaoInfo = location.state?.kakaoInfo;
  const part = location.state?.part;

  return (
    <SelectPage
      title="어떤 직책이신가요?"
      description="아래에서 본인의 직책을 선택해 주세요!"
      options={ROLE_OPTIONS}
      selected={role}
      onSelect={setRole}
      onSubmit={() => {
        navigate("/signUp/info", {
          state: { part, role: ROLE_MAP[role], kakaoInfo },
        });
      }}
    />
  );
}
