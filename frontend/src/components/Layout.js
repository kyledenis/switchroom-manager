import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTheme } from '../contexts/ThemeContext';
import MapIcon from '@mui/icons-material/Map';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme === 'dark' ? '#1c1c1e' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

const Header = styled.header`
  position: fixed;
  top: 16px;
  left: 16px;
  right: 16px;
  height: 48px;
  background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  padding: 0 16px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
    font-weight: 500;
  }
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }

  svg {
    font-size: 20px;
    opacity: 0.8;
  }
`;

const Nav = styled.nav`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  align-items: center;
  height: 32px;
  background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;
  padding: 2px;
  min-width: 300px;
  justify-content: space-between;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  text-decoration: none;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: ${props => props.active && props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : props.active ? 'rgba(0, 0, 0, 0.1)' : 'transparent'};
  flex: 1;
  justify-content: center;

  &:hover {
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }

  svg {
    font-size: 16px;
    opacity: ${props => props.active ? 1 : 0.7};
  }
`;

const Main = styled.main`
  flex: 1;
  margin-top: 80px;
  position: relative;
`;

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <HeaderLeft>
          <Title theme={theme}>
            INFRABUILD <span>SWITCHROOM MANAGER</span>
          </Title>
        </HeaderLeft>
        <Nav theme={theme}>
          <NavLink to="/" active={location.pathname === '/' ? 1 : 0} theme={theme}>
            <MapIcon /> MAP
          </NavLink>
          <NavLink to="/switchrooms" active={location.pathname === '/switchrooms' ? 1 : 0} theme={theme}>
            <ListAltIcon /> LIST
          </NavLink>
          <NavLink to="/settings" active={location.pathname === '/settings' ? 1 : 0} theme={theme}>
            <SettingsIcon /> SETTINGS
          </NavLink>
        </Nav>
        <HeaderRight>
          <IconButton theme={theme}>
            <AccountCircleIcon />
          </IconButton>
        </HeaderRight>
      </Header>
      <Main>
        {children}
      </Main>
    </Container>
  );
};

export default Layout;
