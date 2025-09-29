// client/src/globalStyles.js
import { createGlobalStyle } from 'styled-components';

// Import the fonts from Google Fonts (add this to your index.html or here)
// We'll add the import to index.html for better performance.

const GlobalStyle = createGlobalStyle`
  /* Reset default browser styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Montserrat', sans-serif; /* Our main body font */
    background-color: #0D1B2A; /* Deep Navy Blue */
    color: #F4F7F6; /* Off-white text */
    line-height: 1.6;
  }

  h1, h2, h3 {
    font-family: 'Playfair Display', serif; /* Our elegant heading font */
    color: #FFFFFF;
    line-height: 1.2;
  }
`;

export default GlobalStyle;