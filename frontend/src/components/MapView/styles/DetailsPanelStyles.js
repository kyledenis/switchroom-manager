import styled from '@emotion/styled';
import { CloseButton as BaseCloseButton, Title, Content } from './CommonStyles';

export const DetailsPanelContainer = styled.div`
    position: fixed;
    top: 80px;
    right: 0;
    bottom: 0;
    width: 400px;
    background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-left: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    padding: 24px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    z-index: 1;
    overflow-y: auto;
    transition: transform 0.3s ease;
    transform: translateX(${(props) => props.isOpen ? "0" : "100%"});

    .MuiTextField-root {
        margin-bottom: 16px;

        .MuiOutlinedInput-root {
            background: ${props => props.theme === 'dark' ? '#2c2c2e' : '#f5f5f5'};
            color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};

            fieldset {
                border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
            }

            &:hover fieldset {
                border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
            }

            &.Mui-focused fieldset {
                border-color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
            }
        }

        .MuiInputLabel-root {
            color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};

            &.Mui-focused {
                color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
            }
        }
    }

    .MuiButton-root {
        color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};

        &.MuiButton-contained {
            background: ${props => props.theme === 'dark' ? '#2c2c2e' : '#f5f5f5'};

            &:hover {
                background: ${props => props.theme === 'dark' ? '#3c3c3e' : '#e0e0e0'};
            }

            &.MuiButton-containedPrimary {
                background: #007AFF;
                color: white;

                &:hover {
                    background: #0066CC;
                }
            }
        }
    }
`;

export const DetailsPanelTitle = styled(Title)`
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

export const DetailsPanelContent = styled(Content)`
    color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'};
`;

export const CloseButton = styled(BaseCloseButton)`
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};

    &:hover {
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    }
`;

export const ImageUploadArea = styled.div`
    border: 2px dashed ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'};

    &:hover {
        border-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    }
`;
