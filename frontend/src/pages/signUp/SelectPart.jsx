import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SelectPage from "./SelectPage";
import { loadPendingSignUp, savePendingSignUp } from "../../lib/pendingSignUp";

const options = ["기획", "디자인", "프론트엔드", "백엔드"];
const partMap = {
  기획: "PM",
  디자인: "DE",
  프론트엔드: "FE",
  백엔드: "BE",
};

export default function SelectPart() {
  const navigate = useNavigate();
  const location = useLocation();
  const pendingSignUp = location.state ?? loadPendingSignUp();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (!pendingSignUp?.kakaoInfo || !pendingSignUp?.code) {
      navigate("/login", { replace: true });
    }
  }, [navigate, pendingSignUp]);

  if (!pendingSignUp?.kakaoInfo || !pendingSignUp?.code) {
    return null;
  }

  return (
    <SelectPage
      title={"어떤 트랙에\n소속되어 있나요?"}
      description="아래에서 본인의 트랙을 선택해 주세요 :)"
      label="트랙"
      placeholder="본인의 트랙을 선택해 주세요"
      options={options}
      selected={selected}
      onSelect={setSelected}
      onSubmit={() => {
        if (!selected) return;

        navigate("/signUp/role", {
          state: {
            part: partMap[selected],
            kakaoInfo: pendingSignUp?.kakaoInfo,
            code: pendingSignUp?.code,
          },
        });
        savePendingSignUp({
          ...(pendingSignUp ?? {}),
          part: partMap[selected],
        });
      }}
    />
  );
}
