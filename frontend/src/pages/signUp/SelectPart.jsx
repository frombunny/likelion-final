import React, { useState } from "react";
import SelectPage from "./SelectPage";
import { useNavigate } from "react-router-dom";

const PART_OPTIONS = ["기획", "디자인", "프론트엔드", "백엔드"];

export default function SelectPart() {
    const navigate = useNavigate();
  const [part, setPart] = useState("");

  return (
    <SelectPage
      title="어떤 트랙에 소속되어 있나요?"
      description="아래에서 본인의 트랙을 선택해 주세요 :)"
      options={PART_OPTIONS}
      selected={part}
      onSelect={setPart}
      onSubmit={() => {
        navigate("/signUp/role", { state: { part } });
      }}
    />
  );
}
