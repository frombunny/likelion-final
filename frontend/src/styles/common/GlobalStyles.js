import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import colors from "./colors";

const GlobalStyles = createGlobalStyle`
  ${reset}

  :root {
    --app-width: 390px;
    --content-width: 350px;
    --side-gutter: 20px;
    --header-row-height: 56px;
    --top-chrome-height: var(--header-row-height);
    --content-min-height: calc(100dvh - var(--top-chrome-height));
    --font-family: "Pretendard", "Noto Sans KR", sans-serif;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-Regular.woff2") format("woff2");
    font-style: normal;
    font-weight: 400;
    font-display: swap;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-Medium.woff2") format("woff2");
    font-style: normal;
    font-weight: 500;
    font-display: swap;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-SemiBold.woff2") format("woff2");
    font-style: normal;
    font-weight: 600;
    font-display: swap;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-Bold.woff2") format("woff2");
    font-style: normal;
    font-weight: 700;
    font-display: swap;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    min-height: 100%;
  }

  html {
    font-size: 62.5%;
    font-family: var(--font-family);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  body {
    margin: 0;
    overflow-x: hidden;
    background: ${colors.bgShell};
    color: ${colors.textPrimary};
    font-family: var(--font-family);
    color-scheme: light;
  }

  button,
  input,
  textarea,
  select {
    border: 0;
    outline: 0;
    background: transparent;
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export default GlobalStyles;
