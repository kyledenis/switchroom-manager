import styled from '@emotion/styled';

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
    margin: 8px;

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

export const StyledButton = styled.button`
    background: ${props => props.active
        ? (props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)')
        : (props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 8px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    justify-content: flex-start;

    &:hover {
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    svg {
        font-size: 16px;
        opacity: ${props => props.active ? 1 : 0.7};
    }
`;

export const Panel = styled.div`
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 12px;
    padding: 16px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    }

    svg {
        font-size: 20px;
        opacity: 0.8;
    }
`;

export const Title = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;
