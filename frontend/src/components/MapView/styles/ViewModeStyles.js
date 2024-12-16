import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { CloseButton as BaseCloseButton } from './CommonStyles';

export const FullPagePopup = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(28, 28, 30, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 2000;
    padding: 40px;
    color: white;
    overflow-y: auto;
`;

export const FullPageContent = styled.div`
    max-width: 800px;
    margin: 0 auto;
`;

export const FullPageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
`;

export const FullPageTitle = styled.h1`
    font-size: 32px;
    font-weight: 600;
    margin: 0;
`;

export const FullPageDescription = styled.p`
    font-size: 16px;
    line-height: 1.6;
    margin: 24px 0;
    color: rgba(255, 255, 255, 0.8);
`;

export const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
    margin-top: 32px;
`;

export const ImageContainer = styled.div`
    position: relative;
    padding-bottom: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export const CloseButton = styled(BaseCloseButton)`
    // Add any specific styles for the close button
`;
