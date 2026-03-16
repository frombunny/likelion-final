import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import BasicButton from "../../shared/BasicButton";
import awardBadge from "../../assets/vote/awardBadge.svg";
import colors from "../../styles/common/colors";

export default function Award({ results, onNext }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = useMemo(() => results || [], [results]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [slides.length]);

  const current = slides[currentIndex] || slides[0];

  return (
    <Page>
      <TitleBlock>
        <img src={awardBadge} alt="award" />
        <h1>“{current?.title || "결과 집계 중"}”</h1>
      </TitleBlock>

      <Viewer>
        <NavButton
          type="button"
          onClick={() =>
            setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
          }
          disabled={slides.length <= 1}
        >
          ‹
        </NavButton>

        <CardShell>
          <Card>
            {current?.profileImageUrl ? (
              <img src={current.profileImageUrl} alt={current.name} />
            ) : (
              <Placeholder>결과 집계 중</Placeholder>
            )}
            <Overlay />
            <CardName>{current?.name}</CardName>
            {current?.part ? <CardPart>{current.part}</CardPart> : null}
          </Card>
        </CardShell>

        <NavButton
          type="button"
          onClick={() =>
            setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
          }
          disabled={slides.length <= 1}
        >
          ›
        </NavButton>
      </Viewer>

      {slides.length > 1 && (
        <IndicatorRow>
          {slides.map((item, index) => (
            <Indicator
              key={`${item.name}-${index}`}
              type="button"
              $active={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
              aria-label={`${index + 1}번째 수상자 보기`}
            />
          ))}
        </IndicatorRow>
      )}

      <Description>{current?.description}</Description>

      <BottomArea>
        <BasicButton text="확인" onClick={onNext} />
      </BottomArea>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  min-height: var(--content-min-height);
  padding: 28px 0 140px;
`;

const TitleBlock = styled.div`
  width: min(280px, calc(100% - 40px));
  margin: 0 auto;
  text-align: center;

  img {
    width: 32px;
    height: 32px;
    margin-bottom: 10px;
  }

  h1 {
    margin: 0;
    color: ${colors.textPrimary};
    font-size: 2.8rem;
    font-weight: 600;
    line-height: 4.1rem;
    letter-spacing: -0.07rem;
    white-space: normal;
    word-break: keep-all;
  }
`;

const Viewer = styled.div`
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const NavButton = styled.button`
  width: 28px;
  height: 28px;
  color: ${({ disabled }) => (disabled ? "#d0d0d0" : colors.textGray)};
  font-size: 2.4rem;
  line-height: 1;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
`;

const CardShell = styled.div`
  width: 275px;
  height: 275px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  width: 275px;
  height: 275px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 146px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
`;

const CardName = styled.p`
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 38px;
  color: ${colors.white};
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 3.4rem;
  letter-spacing: -0.05rem;
  white-space: nowrap;
`;

const CardPart = styled.p`
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  color: ${colors.white};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.8rem;
  letter-spacing: -0.03rem;
  white-space: nowrap;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: #d8d8d8;
  color: ${colors.textGray};
  font-size: 1.5rem;
`;

const IndicatorRow = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const Indicator = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? colors.primaryBlue : "#d9d9d9")};
`;

const Description = styled.p`
  width: min(312px, calc(100% - 40px));
  margin: 36px auto 0;
  color: ${colors.textPrimary};
  text-align: center;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 2.5rem;
  letter-spacing: -0.035rem;
  word-break: keep-all;
  white-space: pre-line;
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
