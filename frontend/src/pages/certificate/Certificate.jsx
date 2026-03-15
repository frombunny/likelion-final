import { useMemo, useState } from "react";
import styled from "styled-components";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import BasicButton from "../../shared/BasicButton";
import colors from "../../styles/common/colors";
import firework from "../../assets/certificate/firework.svg";
import celeb from "../../assets/certificate/celeb.svg";

export default function Certificate({ loading, certificates }) {
  const [index, setIndex] = useState(0);

  const docs = useMemo(() => certificates || [], [certificates]);

  const [sliderRef] = useKeenSlider({
    loop: docs.length > 1,
    mode: "snap",
    slides: {
      perView: 1,
      origin: "center",
    },
    slideChanged(slider) {
      setIndex(slider.track.details.rel);
    },
  });

  const download = async () => {
    const current = docs[index];
    if (!current?.url) return;

    try {
      const response = await fetch(current.url, { mode: "cors" });
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `certificate_${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("다운로드 실패:", error);
    }
  };

  return (
    <Page>
      <TopMessage>
        <Firework src={firework} alt="firework" />
        <Celeb src={celeb} alt="축하 문구" />
      </TopMessage>

      {loading ? (
        <Placeholder>불러오는 중...</Placeholder>
      ) : docs.length ? (
        <Slider className="keen-slider" ref={sliderRef}>
          {docs.map((item) => (
            <Slide className="keen-slider__slide" key={item.url}>
              <DocFrame>
                <img src={item.url} alt="certificate" />
              </DocFrame>
            </Slide>
          ))}
        </Slider>
      ) : (
        <Placeholder>발급 가능한 수료증이 없습니다.</Placeholder>
      )}

      <BottomArea>
        <BasicButton text="수료증 다운로드" disabled={!docs.length} onClick={download} />
      </BottomArea>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  min-height: var(--content-min-height);
  padding: 28px 20px 140px;
`;

const TopMessage = styled.div`
  width: 240px;
  margin: 0 auto 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Firework = styled.img`
  width: 48px;
  height: 48px;
`;

const Celeb = styled.img`
  width: 240px;
`;

const Slider = styled.div`
  width: 100%;
`;

const Slide = styled.div`
  display: flex;
  justify-content: center;
`;

const DocFrame = styled.div`
  width: 320px;
  height: 454px;
  border-radius: 14px;
  border: 1px solid #e3e3e3;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  background: ${colors.white};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Placeholder = styled.div`
  width: 320px;
  height: 454px;
  margin: 0 auto;
  border-radius: 14px;
  border: 1px solid #e3e3e3;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
  display: grid;
  place-items: center;
  color: ${colors.textGray};
  font-size: 1.5rem;
  background: ${colors.white};
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
