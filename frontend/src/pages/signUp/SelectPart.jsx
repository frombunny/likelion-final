import React, { useState } from "react";
import SelectPage from "./SelectPage";
import { useLocation, useNavigate } from "react-router-dom";

const PART_OPTIONS = ["기획", "디자인", "프론트엔드", "백엔드"];

export default function SelectPart() {
  const location = useLocation();
  const navigate = useNavigate();
  const [part, setPart] = useState("");
  const kakaoInfo = location.state?.kakaoInfo;
  const PART_MAP = {
  "기획": "PM",
  "디자인": "DE",
  "프론트엔드": "FE",
  "백엔드": "BE",
};

  return (
  
    <SelectPage
      title="어떤 트랙에 소속되어 있나요?"
      description="아래에서 본인의 트랙을 선택해 주세요 :)"
      options={PART_OPTIONS}
      selected={part}
      onSelect={setPart}
      onSubmit={() => {
        navigate("/signUp/role", { state: { part:PART_MAP[part], kakaoInfo: kakaoInfo } });
      }}
    />
  );
}
