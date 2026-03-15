import { useMemo, useState } from "react";
import styled from "styled-components";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import BasicButton from "../../shared/BasicButton";
import awardBadge from "../../assets/vote/awardBadge.svg";
import colors from "../../styles/common/colors";

export default function Award({ results, onNext }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = useMemo(() => results || [], [results]);

  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: "snap",
    slides: {
      origin: "center",
      perView: 1.2,
      spacing: 16,
    },
    slideChanged(slider) {
      setCurrentIndex(slider.track.details.rel);
    },
  });

  const current = slides[currentIndex] || slides[0];

  return (
    <Page>
      <TitleBlock>
        <img src={awardBadge} alt="award" />
        <h1>“{current?.title || "결과 집계 중"}”</h1>
      </TitleBlock>

      <Slider className="keen-slider" ref={sliderRef}>
        {slides.map((item, index) => {
          const active = index === currentIndex;

          return (
            <Slide className="keen-slider__slide" key={`${item.name}-${index}`}>
              <Card $active={active}>
                {item.profileImageUrl ? (
                  <img src={item.profileImageUrl} alt={item.name} />
                ) : (
                  <Placeholder>결과 집계 중</Placeholder>
                )}
                <Overlay $active={active} />
                <CardName $active={active}>{item.name}</CardName>
                <CardPart $active={active}>{item.part || "Designer"}</CardPart>
              </Card>
            </Slide>
          );
        })}
      </Slider>

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
  width: 219px;
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
  }
`;

const Slider = styled.div`
  margin-top: 32px;
  padding: 0 20px;
`;

const Slide = styled.div`
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: ${({ $active }) => ($active ? "275px" : "240px")};
  height: ${({ $active }) => ($active ? "275px" : "240px")};
  border-radius: ${({ $active }) => ($active ? "12px" : "9.6px")};
  box-shadow: ${({ $active }) =>
    $active ? "0 8px 24px rgba(0, 0, 0, 0.12)" : "0 3.491px 3.491px rgba(0, 0, 0, 0.12)"};
  opacity: ${({ $active }) => ($active ? 1 : 0.14)};
  position: relative;
  overflow: hidden;
  transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease;

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
  height: ${({ $active }) => ($active ? "146px" : "120px")};
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)"
      : "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)"};
`;

const CardName = styled.p`
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 38px;
  color: ${colors.white};
  font-size: ${({ $active }) => ($active ? "2.4rem" : "2rem")};
  font-weight: 700;
  line-height: ${({ $active }) => ($active ? "3.4rem" : "2.8rem")};
  letter-spacing: -0.05rem;
  white-space: nowrap;
`;

const CardPart = styled.p`
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  color: ${({ $active }) => ($active ? colors.white : "#eaeaea")};
  font-size: ${({ $active }) => ($active ? "1.2rem" : "1rem")};
  font-weight: 600;
  line-height: ${({ $active }) => ($active ? "1.8rem" : "1.4rem")};
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

const Description = styled.p`
  width: 308px;
  margin: 44px auto 0;
  color: ${colors.textGray};
  text-align: center;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2.9rem;
  letter-spacing: -0.035rem;
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
