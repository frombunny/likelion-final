import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import BasicButton from "../../shared/BasicButton";
import colors from "../../styles/common/colors";
import firework from "../../assets/certificate/firework.svg";
import celeb from "../../assets/certificate/celeb.svg";
import { API_ENDPOINTS, apiClient } from "../../lib/api";

const MOBILE_USER_AGENT_PATTERN =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

const getDownloadFileName = (headers, fallbackName) => {
  const contentDisposition = headers?.["content-disposition"] || headers?.["Content-Disposition"];

  if (!contentDisposition) {
    return fallbackName;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  return asciiMatch?.[1] || fallbackName;
};

const isMobileBrowser = () =>
  typeof navigator !== "undefined" && MOBILE_USER_AGENT_PATTERN.test(navigator.userAgent);

export default function Certificate({ loading, certificates }) {
  const [index, setIndex] = useState(0);

  const docs = useMemo(() => certificates || [], [certificates]);

  useEffect(() => {
    setIndex(0);
  }, [docs]);

  const download = async () => {
    if (!docs.length) return;

    try {
      const response = await apiClient.get(API_ENDPOINTS.downloadDocuments, {
        responseType: "blob",
      });
      const userName = localStorage.getItem("userName") || "documents";
      const fallbackFileName = `13기_${userName}.zip`;
      const downloadFileName = getDownloadFileName(response.headers, fallbackFileName);
      const file = new File([response.data], downloadFileName, {
        type: response.data.type || "application/zip",
      });

      if (
        isMobileBrowser() &&
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: downloadFileName,
          });
          return;
        } catch (shareError) {
          if (shareError?.name === "AbortError") {
            return;
          }
        }
      }

      const objectUrl = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Safari/WebView can cancel the download if the blob URL is revoked immediately.
      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60_000);
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
        <>
          <Viewer>
            {docs.length > 1 && (
              <NavButton
                type="button"
                onClick={() => setIndex((prev) => (prev === 0 ? docs.length - 1 : prev - 1))}
              >
                ‹
              </NavButton>
            )}

            <DocFrame>
              {docs[index]?.url.toLowerCase().includes(".pdf") ? (
                <PdfFrame title="certificate pdf" src={docs[index].url} />
              ) : (
                <img src={docs[index]?.url} alt="certificate" />
              )}
            </DocFrame>

            {docs.length > 1 && (
              <NavButton
                type="button"
                onClick={() => setIndex((prev) => (prev + 1) % docs.length)}
              >
                ›
              </NavButton>
            )}
          </Viewer>

          {docs.length > 1 && (
            <IndicatorRow>
              {docs.map((item, dotIndex) => (
                <Indicator
                  key={item.url}
                  type="button"
                  $active={dotIndex === index}
                  onClick={() => setIndex(dotIndex)}
                  aria-label={`문서 ${dotIndex + 1} 보기`}
                />
              ))}
            </IndicatorRow>
          )}
        </>
      ) : (
        <Placeholder>발급 가능한 수료증이 없습니다.</Placeholder>
      )}

      <BottomArea>
        <BasicButton text="수료증 및 상장 다운로드" disabled={!docs.length} onClick={download} />
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

const Viewer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

const PdfFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
  background: ${colors.white};
`;

const NavButton = styled.button`
  width: 28px;
  height: 28px;
  color: ${colors.textGray};
  font-size: 2.4rem;
  line-height: 1;
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
