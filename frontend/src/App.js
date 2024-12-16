import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Global, css } from '@emotion/react';

import Layout from './components/Layout';
import MapView from './components/MapView/index';
import SwitchroomList from './components/SwitchroomList';
import Settings from './components/Settings';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import DotGridBackground from './components/common/DotGridBackground';

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  .toast-container {
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'} !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 16px !important;
    border: ${props => props.theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'} !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  }

  .Toastify__toast {
    background: transparent !important;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'} !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    font-weight: 500 !important;
  }
`;

function AppContent() {
  const { theme } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: theme === 'dark' ? '#ffffff' : '#000000',
        light: theme === 'dark' ? '#ffffff' : '#333333',
        dark: theme === 'dark' ? '#cccccc' : '#000000',
      },
      secondary: {
        main: theme === 'dark' ? '#86868b' : '#666666',
        light: theme === 'dark' ? '#b4b4b6' : '#999999',
        dark: theme === 'dark' ? '#5b5b5f' : '#333333',
      },
      background: {
        default: theme === 'dark' ? '#1c1c1e' : '#ffffff',
        paper: theme === 'dark' ? '#2c2c2e' : '#f5f5f5',
      },
      text: {
        primary: theme === 'dark' ? '#ffffff' : '#000000',
        secondary: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
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
            backgroundColor: theme === 'dark' ? '#2c2c2e' : '#f5f5f5',
            '&:hover': {
              backgroundColor: theme === 'dark' ? '#3c3c3e' : '#e0e0e0',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: theme === 'dark' ? '#2c2c2e' : '#f5f5f5',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: theme === 'dark' ? '#2c2c2e' : '#f5f5f5',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Global styles={globalStyles} />
      <DotGridBackground />
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
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
