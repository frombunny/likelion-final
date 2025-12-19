import React, { useState } from "react";
import styled from "styled-components";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import BasicButton from "../../shared/BasicButton";

export default function Award({ results = [], onNext, isOpen }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef] = useKeenSlider({
  loop: true,
  mode: "snap",
  rubberband: false,
  renderMode: "precision",
  dragSpeed: 1.5,
  slides: {
    perView: 1,
    spacing: 20,
  },

  detailsChanged(s) {
    setCurrentSlide(s.track.details.rel);
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
      timeout = setTimeout(() => slider.next(), 1800); // 👈 속도 ↑
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
});

  return (
    <Wrapper>
      {isOpen && <VoteAlert>현재 투표가 진행 중입니다</VoteAlert>}

      <SliderContainer ref={sliderRef} className="keen-slider">
        {results.map((item, index) => (
          <Slide
            className="keen-slider__slide"
            key={index}
            isActive={currentSlide === index}
          >
            <AwardCard isActive={currentSlide === index}>
              <StarIcon>🏆</StarIcon>

              <SectionName>“{item.title}”</SectionName>

              <AwardImageWrapper>
                <AwardGlow />
                <AwardImage src={item.img} loading="lazy" />
              </AwardImageWrapper>

              <AwardName>{item.name}</AwardName>
              <AwardRole>{item.role}</AwardRole>

              <Description>{item.description}</Description>
            </AwardCard>
          </Slide>
        ))}
      </SliderContainer>

      <Dots>
        {results.map((_, i) => (
          <Dot key={i} active={currentSlide === i} />
        ))}
      </Dots>

      <BottomArea>
        <BasicButton text="다음" onClick={onNext} />
      </BottomArea>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 28px 20px 120px;
  position: relative;
`;

const VoteAlert = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #ff3e6c, #ff7a85);
  color: white;
  text-align: center;
  padding: 14px 0;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
`;

const SliderContainer = styled.div`
  margin-top: 10px;
`;

const Slide = styled.div`
  display: flex;
  justify-content: center;
  transition: transform 0.25s ease-out;
  transform: ${({ isActive }) =>
    isActive ? "scale(1)" : "scale(0.9)"};
  opacity: ${({ isActive }) => (isActive ? 1 : 0.5)};
`;

const AwardCard = styled.div`
  text-align: center;
  padding: 14px 6px;
  transition: all 0.4s ease-out;
  transform: ${({ isActive }) =>
    isActive ? "translateY(0px)" : "translateY(6px)"};
`;

const StarIcon = styled.div`
  font-size: 3.6rem;
  margin: 18px 0 10px;
  animation: pulse 1.8s infinite ease-in-out;

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.12); }
    100% { transform: scale(1); }
  }
`;

const SectionName = styled.h2`
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 18px;
`;

const AwardImageWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const AwardGlow = styled.div`
  position: absolute;
  width: 240px;
  height: 240px;
  background: radial-gradient(rgba(255,215,0,0.35), transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const AwardImage = styled.img`
  width: 240px;
  border-radius: 16px;
  box-shadow: 0px 10px 22px rgba(0, 0, 0, 0.18);
`;

const AwardName = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  margin-top: 14px;
`;

const AwardRole = styled.div`
  font-size: 1.5rem;
  color: #777;
  margin-top: 4px;
`;

const Description = styled.p`
  color: #666;
  font-size: 1.4rem;
  margin: 20px 0;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 18px;
`;

const Dot = styled.div`
  width: ${({ active }) => (active ? "18px" : "8px")};
  height: 8px;
  border-radius: 10px;
  background: ${({ active }) =>
    active ? "#ff2f6e" : "#d3d3d3"};
  transition: all 0.3s ease;
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