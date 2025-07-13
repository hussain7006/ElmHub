import React from "react";
import { Routes, Route } from "react-router-dom";

import ErrorPage from "../../views/Error/ErrorPage";
import PeopleAnalyticsV3 from "../../views/PeopAnalytics/PeopleAnalyticsV3.jsx";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function Routing() {
  let arabicFont = useSelector((data) => data.arabicFont)
  let englishFont = useSelector((data) => data.englishFont)
  let langReducer = useSelector((data) => data.lang)
  const themeMode = useSelector(data => data.themeMode)
  const colors = useSelector(data => data.colors)
  const theme = useSelector(data => data.theme)

  const darkTheme = createTheme({
    palette: {
      mode: (themeMode == "dark") ? 'dark' : 'light',
      primary: {
        main: colors?.primary || '#0070c7',
      },
      secondary: {
        main: colors?.accent || '#f16845',
      },
      background: {
        default: colors?.background || '#F9FAFB',
        paper: colors?.surface || '#FFFFFF',
      },
      text: {
        primary: colors?.textPrimary || '#0c1d46',
        secondary: colors?.textSecondary || '#64748B',
      },
      divider: colors?.borderColor || '#D1D5DB',
    },
    direction: langReducer == "en" ? 'ltr' : 'rtl',
    typography: {
      allVariants: {
        fontFamily: langReducer == "en" ? englishFont : arabicFont,
        textTransform: 'none',
        // fontSize: 16,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: colors?.buttonBackground || '#0070c7',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: colors?.primary || '#0070c7',
              opacity: 0.8,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: colors?.inputBackground || '#FFFFFF',
              '& fieldset': {
                borderColor: colors?.borderColor || '#D1D5DB',
              },
              '&:hover fieldset': {
                borderColor: colors?.primary || '#0070c7',
              },
              '&.Mui-focused fieldset': {
                borderColor: colors?.primary || '#0070c7',
              },
            },
            '& .MuiInputLabel-root': {
              color: colors?.placeholderColor || '#9CA3AF',
            },
          },
        },
      },
    },
  });
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<PeopleAnalyticsV3 />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ThemeProvider>
    </>
  );

}

export default Routing;
