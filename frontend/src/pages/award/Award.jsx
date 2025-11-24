import React from "react";
import styled from "styled-components";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import BasicButton from "../../shared/BasicButton";

export default function Award({ results = [], onNext }) {
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "snap",
      slides: {
        perView: 1,
        spacing: 20,
      },

      created(slider) {
        let timeout;
        let mouseOver = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2000);
        }

        slider.on("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });

        slider.on("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);

        nextTimeout();
      },
    }
  );

  return (
    <Wrapper>
      <SliderContainer ref={sliderRef} className="keen-slider">
        {results.map((item, index) => (
          <Slide className="keen-slider__slide" key={index}>
            <AwardCard>
              <StarIcon>⭐</StarIcon>
              <SectionName>“{item.title}”</SectionName>

              <AwardImage src={item.img} />
              <AwardName>{item.name}</AwardName>
              <AwardRole>{item.role}</AwardRole>

              <Description>{item.description}</Description>
            </AwardCard>
          </Slide>
        ))}
      </SliderContainer>

      <BottomArea>
        <BasicButton text="다음" onClick={onNext} />
      </BottomArea>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 24px 20px;
  padding-bottom: 120px;
  position: relative;
`;

const SliderContainer = styled.div`
  margin-top: 20px;
`;

const Slide = styled.div`
  display: flex;
  justify-content: center;
`;

const AwardCard = styled.div`
  text-align: center;
`;

const StarIcon = styled.div`
  font-size: 3rem;
  margin: 20px 0;
`;

const SectionName = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 24px;
`;

const AwardImage = styled.img`
  width: 230px;
  border-radius: 14px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
`;

const AwardName = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 12px;
`;

const AwardRole = styled.div`
  font-size: 1.4rem;
  color: #999;
  margin-top: 2px;
`;

const Description = styled.p`
  color: #767676;
  font-size: 1.4rem;
  line-height: 1.5;
  margin: 24px 0;
`;

const BottomArea = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
`;
