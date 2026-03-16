import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SelectPage from "./SelectPage";
import { loadPendingSignUp, savePendingSignUp } from "../../lib/pendingSignUp";

const options = ["아기사자", "운영진", "팀장", "대표"];
const roleMap = {
  아기사자: "ROLE_BABY_LION",
  운영진: "ROLE_EXECUTIVE",
  팀장: "ROLE_PART_LEADER",
  대표: "ROLE_LEADER",
};

export default function SelectRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const pendingSignUp = location.state ?? loadPendingSignUp();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (!pendingSignUp?.kakaoInfo || !pendingSignUp?.code || !pendingSignUp?.part) {
      navigate("/signUp", { replace: true });
    }
  }, [navigate, pendingSignUp]);

  if (!pendingSignUp?.kakaoInfo || !pendingSignUp?.code || !pendingSignUp?.part) {
    return null;
  }

  return (
    <SelectPage
      title={"어떤 직책을\n맡고 있나요?"}
      description="아래에서 본인의 직책을 선택해 주세요 :)"
      label="트랙"
      placeholder="본인의 직책 선택해 주세요"
      options={options}
      selected={selected}
      onSelect={setSelected}
      onSubmit={() => {
        if (!selected) return;

        navigate("/signUp/info", {
          state: {
            part: pendingSignUp?.part,
            role: roleMap[selected],
            kakaoInfo: pendingSignUp?.kakaoInfo,
            code: pendingSignUp?.code,
          },
        });
        savePendingSignUp({
          ...(pendingSignUp ?? {}),
          role: roleMap[selected],
        });
      }}
    />
  );
}
