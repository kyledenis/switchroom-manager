import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '../../contexts/ThemeContext';

const NavContainer = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    z-index: 1000;
`;

const ViewSlider = styled.div`
    display: flex;
    align-items: center;
    background: ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 12px;
    padding: 4px;
    gap: 4px;
    min-width: 360px;
    justify-content: space-between;
`;

const ViewButton = styled.button`
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    opacity: ${props => props.active ? 1 : 0.7};
    padding: 12px 16px;
    border-radius: 8px;
    background: ${props => props.active ? (props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent'};
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    flex: 1;
    justify-content: center;

    &:hover {
        opacity: 1;
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    }

    svg {
        font-size: 20px;
    }
`;

const Navbar = () => {
    const location = useLocation();
    const { theme } = useTheme();
    const isActive = (path) => location.pathname === path;

    return (
        <NavContainer theme={theme}>
            <ViewSlider theme={theme}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <ViewButton active={isActive('/')} theme={theme}>
                        <MapIcon /> Map
                    </ViewButton>
                </Link>
                <Link to="/switchrooms" style={{ textDecoration: 'none' }}>
                    <ViewButton active={isActive('/switchrooms')} theme={theme}>
                        <ListIcon /> List
                    </ViewButton>
                </Link>
                <Link to="/settings" style={{ textDecoration: 'none' }}>
                    <ViewButton active={isActive('/settings')} theme={theme}>
                        <SettingsIcon /> Settings
                    </ViewButton>
                </Link>
            </ViewSlider>
        </NavContainer>
    );
};

export default Navbar;