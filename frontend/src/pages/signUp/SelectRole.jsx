import React, { useState } from "react";
import SelectPage from "./SelectPage";
import { useNavigate } from "react-router-dom";

const ROLE_OPTIONS = ["아기사자", "운영진", "파트 팀장", "부대표", "대표"];

export default function SelectRole() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  return (
    <SelectPage
      title="어떤 직책이신가요?"
      description="아래에서 본인의 직책을 선택해 주세요!"
      options={ROLE_OPTIONS}
      selected={role}
      onSelect={setRole}
      onSubmit={() => {
        navigate("/", { state: { role } });
      }}
    />
  );
}
