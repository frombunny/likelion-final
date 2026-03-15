import { useState } from "react";
import styled from "styled-components";
import BasicButton from "../../shared/BasicButton";
import colors from "../../styles/common/colors";

export default function SelectPage({
  title,
  description,
  label,
  placeholder,
  options,
  selected,
  onSelect,
  onSubmit,
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <Page>
      <Title>{title}</Title>
      <Description>{description}</Description>

      <Label>{label}</Label>
      <SelectButton type="button" onClick={() => setOpen((prev) => !prev)}>
        <SelectText $active={Boolean(selected)}>{selected || placeholder}</SelectText>
        <Arrow $open={open} />
      </SelectButton>

      {open && (
        <OptionPanel>
          {options.map((option) => (
            <OptionButton key={option} type="button" onClick={() => handleSelect(option)}>
              {option}
            </OptionButton>
          ))}
        </OptionPanel>
      )}

      <BottomArea>
        <BasicButton text="완료" disabled={!selected} onClick={onSubmit} />
      </BottomArea>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  min-height: var(--content-min-height);
  padding: 18px 20px 140px;
  position: relative;
`;

const Title = styled.h1`
  margin: 0;
  white-space: pre-wrap;
  color: ${colors.textPrimary};
  font-size: 2.8rem;
  font-weight: 600;
  line-height: 4.1rem;
  letter-spacing: -0.07rem;
`;

const Description = styled.p`
  margin: 8px 0 0;
  color: ${colors.textGray};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: -0.035rem;
`;

const Label = styled.p`
  margin: 32px 0 8px 4px;
  color: ${colors.textPrimary};
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 2.8rem;
  letter-spacing: -0.045rem;
`;

const SelectButton = styled.button`
  width: var(--content-width);
  height: 52px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 19px;
  cursor: pointer;
`;

const SelectText = styled.span`
  width: 267px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? colors.textPrimary : colors.textGray)};
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 2.4rem;
  letter-spacing: -0.04rem;
  text-align: left;
`;

const Arrow = styled.span`
  width: 13px;
  height: 13px;
  border-right: 1.8px solid ${colors.textPrimary};
  border-bottom: 1.8px solid ${colors.textPrimary};
  transform: ${({ $open }) => ($open ? "rotate(225deg)" : "rotate(45deg)")};
  transition: transform 0.18s ease;
`;

const OptionPanel = styled.div`
  width: var(--content-width);
  margin-top: 12px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.white};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const OptionButton = styled.button`
  width: 100%;
  height: 52px;
  padding: 0 20px;
  text-align: left;
  color: ${colors.textPrimary};
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 2.4rem;
  letter-spacing: -0.04rem;
  cursor: pointer;

  &:hover {
    background: rgba(2, 111, 255, 0.06);
  }
`;

const BottomArea = styled.div`
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--app-width);
  padding: 0 20px;
`;
