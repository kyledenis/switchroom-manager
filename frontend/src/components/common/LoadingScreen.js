import React from 'react';
import styled from '@emotion/styled';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '../../contexts/ThemeContext';

const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    z-index: 1000;
`;

const LoadingText = styled.div`
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    line-height: 1.5;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};

    span {
        display: block;
        margin-top: 8px;
        font-size: 14px;
        opacity: 0.7;
    }
`;

const LoadingScreen = ({
    message = 'Loading...',
    subMessage = 'This may take a few moments'
}) => {
    const { theme } = useTheme();

    return (
        <LoadingOverlay theme={theme}>
            <CircularProgress
                size={48}
                sx={{
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                }}
            />
            <LoadingText theme={theme}>
                {message}
                <span>{subMessage}</span>
            </LoadingText>
        </LoadingOverlay>
    );
};

export default LoadingScreen;