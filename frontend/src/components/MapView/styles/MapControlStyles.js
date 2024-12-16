import styled from '@emotion/styled';

export const CustomMapControls = styled.div`
    position: absolute;
    right: 24px;
    bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 1;
`;

export const MapButton = styled.button`
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};

    &:hover {
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
            background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
        }
    }

    svg {
        font-size: 20px;
        opacity: 0.7;
    }
`;
