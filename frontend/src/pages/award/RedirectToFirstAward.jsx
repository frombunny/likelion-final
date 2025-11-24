import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AWARD_CATEGORIES } from "./awardCategories";

export default function RedirectToFirstAward() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/award/${AWARD_CATEGORIES[0]}`);
  }, []);

  return null;
}
