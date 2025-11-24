import React, { useState } from "react";
import styled from "styled-components";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import BasicButton from "../../shared/BasicButton";
import firework from "../../assets/certificate/firework.svg";
import celebImg from "../../assets/certificate/celeb.svg";

export default function Certificate({ certificates = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    slides: { perView: 1 },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  const downloadCertificate = () => {
    const now = certificates[currentSlide];
    if (!now || !now.downloadUrl) {
      alert("다운로드 URL이 없습니다");
      return;
    }
    const link = document.createElement("a");
    link.href = now.downloadUrl;
    link.download = "certificate.png";
    link.click();
  };

  return (
    <Wrapper>
      <TopMessage>
        <FireworkImg src={firework} />
        <CelebImg src={celebImg} />
      </TopMessage>

      <SliderContainer ref={sliderRef} className="keen-slider">
        {certificates.map((item, idx) => (
          <Slide className="keen-slider__slide" key={idx}>
            <CertImage src={item.downloadUrl} alt="certificate" />
          </Slide>
        ))}
      </SliderContainer>

      <BottomArea>
        <BasicButton text="수료증 다운로드" onClick={downloadCertificate} />
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

const TopMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
`;

const FireworkImg = styled.img`
  width: 50px;
  margin-bottom: 10px;
`;

const CelebImg = styled.img`
  width: 300px;
  margin-bottom: 10px;
`;

const SliderContainer = styled.div`
  margin-top: 20px;
`;

const Slide = styled.div`
  display: flex;
  justify-content: center;
`;

const CertImage = styled.img`
  width: 100%;
  max-width: 320px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
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
