import styled, { css } from "styled-components";
import colors from "../styles/common/colors";

export default function BasicButton({ text, onClick, disabled = false }) {
  return (
    <ButtonWrapper disabled={disabled} onClick={disabled ? undefined : onClick}>
      {text}
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button`
  display: flex;
  width: 100%;
  
  max-width: 350px;
  height: 22px;
  margin: 0 auto;

  padding: 14px 16px;
  justify-content: center;
  align-items: center;

  border-radius: 6px;
  border: none;
  cursor: pointer;

  font-size: 1.6rem;
  font-weight: 600;

  background: ${colors.primary_blue};
  color: ${colors.primary_white};

  ${(props) =>
    props.disabled &&
    css`
      background: ${colors.disable_gray};
      color: ${colors.text_disable};
      cursor: default;
    `}
`;
