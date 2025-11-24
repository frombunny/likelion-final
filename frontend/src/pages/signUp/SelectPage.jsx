import styled from "styled-components";
import BasicButton from "../../shared/BasicButton";
import colors from "../../styles/common/colors";

export default function SelectPage({
  title,
  description,
  options,
  selected,
  onSelect,
  onSubmit,
}) {
  return (
    <PageWrapper>
      <TitleSection>
        <Title>{title}</Title>
        <SubTitle>{description}</SubTitle>
      </TitleSection>

      <ScrollArea>
        <OptionList>
          {options.map((item) => (
            <OptionItem
              key={item}
              onClick={() => onSelect(item)}
              selected={item === selected}
            >
              {item}
            </OptionItem>
          ))}
        </OptionList>
      </ScrollArea>

      <ButtonWrapper>
        <BasicButton
          text="완료"
          disabled={!selected}
          onClick={onSubmit}
        />
      </ButtonWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  width: 100%;
  height: calc(var(--vh) * 100);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
`;

const TitleSection = styled.div`
  margin-top: 12px;s
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  color: ${colors.text_primary};
  margin-bottom: 20px;
`;

const SubTitle = styled.p`
  font-size: 1.4rem;
  color: ${colors.text_gray};
  margin-bottom: 20px;
`;

const SelectBox = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 16px;
  background: #fff;
`;

const SelectInput = styled.div`
  font-size: 1.6rem;
  color: ${colors.disable_gray};
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionItem = styled.div`
  padding: 14px 16px;
  border-radius: 6px;
  background: ${(props) => (props.selected ? colors.primary_blue : "#F5F5F5")};
  color: ${(props) => (props.selected ? "#FFF" : colors.text_primary)};
  font-size: 1.6rem;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 20px 0;
  display: flex;
  justify-content: center;
`;
