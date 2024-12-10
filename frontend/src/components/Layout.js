import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTheme } from '../contexts/ThemeContext';
import MapIcon from '@mui/icons-material/Map';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #1c1c1e;
  color: #ffffff;
`;

const Header = styled.header`
  position: fixed;
  top: 16px;
  left: 16px;
  right: 16px;
  height: 48px;
  background: rgba(28, 28, 30, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
  }
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    font-size: 20px;
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2px;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  text-decoration: none;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};

  &:hover {
    background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
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
  const { isDarkMode } = useTheme();

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>
            INFRABUILD <span>SWITCHROOM MANAGER</span>
          </Title>
        </HeaderLeft>
        <Nav>
          <NavLink to="/" active={location.pathname === '/' ? 1 : 0}>
            <MapIcon /> MAP
          </NavLink>
          <NavLink to="/switchrooms" active={location.pathname === '/switchrooms' ? 1 : 0}>
            <ListAltIcon /> LIST
          </NavLink>
        </Nav>
        <HeaderRight>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <FilterListIcon />
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
