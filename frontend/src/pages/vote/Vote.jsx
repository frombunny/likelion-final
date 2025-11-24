import VoteGuide from "./VoteGuide";
import { useNavigate } from "react-router-dom";

export default function Vote() {
  const navigate = useNavigate();

  return (
    <VoteGuide onConfirm={() => navigate("/vote/cheer")} />
  );
}
