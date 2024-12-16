import styled from '@emotion/styled';
import { Panel, StyledButton as BaseStyledButton } from './CommonStyles';

export const DrawingControlPanel = styled(Panel)`
    position: absolute;
    top: 24px;
    left: 24px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 220px;
`;

export const DrawingButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export const StyledButton = styled(BaseStyledButton)`
    // Inherits theme-aware styles from BaseStyledButton
`;

export const DrawingSubmenu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-left: 12px;
    padding-left: 12px;
    border-left: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;
