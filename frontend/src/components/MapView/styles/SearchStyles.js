import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { MapButton } from './CommonStyles';

export const SearchContainer = styled.div`
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const SearchButton = styled(MapButton)`
    margin: 0;
    width: 48px;
    height: 48px;

    svg {
        font-size: 24px;
    }
`;

export const SearchBoxContainer = styled(motion.div)`
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 12px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 300px;

    svg {
        color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
        opacity: 0.7;
    }
`;

export const SearchInput = styled.input`
    background: none;
    border: none;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    font-size: 14px;
    width: 100%;
    outline: none;

    &::placeholder {
        color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
    }
`;

export const IconButton = styled.button`
    background: none;
    border: none;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s ease;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};

    &:hover {
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    }

    svg {
        font-size: 18px;
        opacity: 0.7;
    }
`;
