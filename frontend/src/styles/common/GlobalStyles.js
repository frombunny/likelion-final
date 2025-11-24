import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import colors from "./colors";


const GlobalStyle = createGlobalStyle`
  ${reset}

  :root {
    --vh: 100%;
    --font-family: 'Pretendard', 'Noto Sans', sans-serif;
  }

  @font-face {
    font-family: 'Ownglyph_meetme-Rg';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2402_1@1.0/Ownglyph_meetme-Rg.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  * {
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%; /* 1rem = 10px */
    font-family: var(--font-family);
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    scroll-behavior: smooth;
  }

  body {
    width: 100%;
    height: calc(var(--vh) * 100);
    font-family: var(--font-family);
    touch-action: manipulation;
    background-color: ${colors.bg_white};
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul, li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  button, input, select {
    border: none;
    background: transparent;
    font-family: var(--font-family);
    padding: 0;
    outline: none;
  }

  button {
    all: unset;
    cursor: pointer;
    display: block;
  }


  input:focus, button:focus, select:focus {
    outline: none;
  }

  .scroll::-webkit-scrollbar {
    display: none;
  }
  .scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .pageContainer {
    width: 100%;
    min-height: calc(var(--vh) * 100);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export default GlobalStyle;

