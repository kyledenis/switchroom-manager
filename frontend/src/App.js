import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Global, css } from '@emotion/react';

import Layout from './components/Layout';
import MapView from './components/MapView';
import SwitchroomList from './components/SwitchroomList';
import Settings from './components/Settings';
import { ThemeProvider } from './contexts/ThemeContext';

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #1c1c1e;
    color: #ffffff;
  }

  * {
    box-sizing: border-box;
  }

  .toast-container {
    background: rgba(28, 28, 30, 0.8) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 16px !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  }

  .Toastify__toast {
    background: transparent !important;
    color: #ffffff !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    font-weight: 500 !important;
  }
`;

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ffffff',
        light: '#ffffff',
        dark: '#cccccc',
      },
      secondary: {
        main: '#86868b',
        light: '#b4b4b6',
        dark: '#5b5b5f',
      },
      background: {
        default: '#1c1c1e',
        paper: '#2c2c2e',
      },
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      h1: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            padding: '10px 20px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            backgroundColor: '#2c2c2e',
            '&:hover': {
              backgroundColor: '#3c3c3e',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: '#2c2c2e',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: '#2c2c2e',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Global styles={globalStyles} />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<MapView />} />
              <Route path="/switchrooms" element={<SwitchroomList />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="toast-container"
          />
        </Router>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

export default App;
