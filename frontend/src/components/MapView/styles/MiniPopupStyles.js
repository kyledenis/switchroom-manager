import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const MiniPopupContainer = styled(motion.div)`
    position: absolute;
    background: rgba(28, 28, 30, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 8px;
    display: flex;
    gap: 8px;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const PopupButton = styled.button`
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    padding: 6px 12px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    svg {
        font-size: 16px;
    }
`;
