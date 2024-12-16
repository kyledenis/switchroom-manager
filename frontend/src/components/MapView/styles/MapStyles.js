import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Panel } from './CommonStyles';

export const AppContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 80px;
    background: none;
`;

export const Container = styled.div`
    flex: 1;
    position: relative;
    padding: 24px;
    display: flex;
    overflow: hidden;
`;

export const MapContainer = styled.div`
    flex: 1;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    margin-right: ${props => props.isDetailsPanelOpen ? '400px' : '0'};
`;

export const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    z-index: 1000;

    .MuiCircularProgress-root {
        color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    }
`;

export const LoadingText = styled.div`
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    line-height: 1.5;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};

    span {
        display: block;
        margin-top: 8px;
        font-size: 14px;
        color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
    }
`;

export const SearchContainer = styled(Panel)`
    position: absolute;
    top: 24px;
    left: 24px;
    width: 300px;
    z-index: 1;
`;

export const DrawingControls = styled(Panel)`
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 1;
`;

export const DrawingSubmenu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-left: 12px;
    padding-left: 12px;
    border-left: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

export const MiniPopup = styled(motion.div)`
    position: absolute;
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 12px;
    padding: 8px;
    display: flex;
    gap: 8px;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const PopupButton = styled.button`
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 8px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    padding: 6px 12px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    }

    svg {
        font-size: 16px;
    }
`;

export const DetailsPanel = styled(motion.div)`
    position: fixed;
    top: 24px;
    right: 24px;
    bottom: 24px;
    width: 400px;
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 16px;
    padding: 24px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    z-index: 2;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const InfoPanel = styled(Panel)`
    position: absolute;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 12px;
    padding: 12px 16px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(5, auto);
    gap: 24px;
    min-width: 480px;
    margin-bottom: 22px;

    .info-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        text-align: center;
        min-width: 100px;

        .label {
            color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .value {
            font-family: "SF Mono", monospace;
            font-size: 13px;
            color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
        }
    }
`;

// Add more styled components as needed...
