import styled from "styled-components";
import colors from "../styles/common/colors";

export default function BasicButton({ text, onClick, disabled = false, type = "button" }) {
  return (
    <Button type={type} disabled={disabled} onClick={disabled ? undefined : onClick}>
      {text}
    </Button>
  );
}

const Button = styled.button`
  width: var(--content-width);
  height: 56px;
  border-radius: 6px;
  background: ${({ disabled }) => (disabled ? "#DDDDDD" : colors.primaryBlue)};
  color: ${({ disabled }) => (disabled ? "#9C9C9C" : colors.white)};
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.4rem;
  letter-spacing: -0.04rem;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
`;
