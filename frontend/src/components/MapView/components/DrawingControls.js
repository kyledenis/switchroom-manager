import React, { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PolylineIcon from '@mui/icons-material/Polyline';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import { useTheme } from '../../../contexts/ThemeContext';
import {
    DrawingControlPanel,
    DrawingButtonGroup,
    StyledButton,
    DrawingSubmenu
} from '../styles/DrawingStyles';

const DrawingControls = ({ drawingManager, isAnimating }) => {
    const [activeDrawingMode, setActiveDrawingMode] = useState(null);
    const [selectedDrawingType, setSelectedDrawingType] = useState(null);
    const { theme } = useTheme();

    const handleDrawingMode = (mode, type = null) => {
        if (!drawingManager) return;

        if (activeDrawingMode === mode && selectedDrawingType === type) {
            // Turn off drawing mode
            drawingManager.setDrawingMode(null);
            setActiveDrawingMode(null);
            setSelectedDrawingType(null);
        } else {
            // Set new drawing mode
            drawingManager.setDrawingMode(mode);
            setActiveDrawingMode(mode);
            setSelectedDrawingType(type);
        }
    };

    return (
        <DrawingControlPanel theme={theme}>
            <DrawingButtonGroup>
                <StyledButton
                    active={activeDrawingMode === window.google.maps.drawing.OverlayType.MARKER}
                    onClick={() => handleDrawingMode(window.google.maps.drawing.OverlayType.MARKER)}
                    disabled={isAnimating}
                    theme={theme}
                >
                    <LocationOnIcon /> Add Marker
                </StyledButton>

                <StyledButton
                    active={activeDrawingMode === window.google.maps.drawing.OverlayType.POLYGON}
                    onClick={() => handleDrawingMode(window.google.maps.drawing.OverlayType.POLYGON)}
                    disabled={isAnimating}
                    theme={theme}
                >
                    <PolylineIcon /> Draw Area
                </StyledButton>

                {activeDrawingMode === window.google.maps.drawing.OverlayType.POLYGON && (
                    <DrawingSubmenu theme={theme}>
                        <StyledButton
                            active={selectedDrawingType === "polygon"}
                            onClick={() => handleDrawingMode(window.google.maps.drawing.OverlayType.POLYGON, "polygon")}
                            theme={theme}
                        >
                            <PolylineIcon /> Polygon
                        </StyledButton>
                        <StyledButton
                            active={selectedDrawingType === "rectangle"}
                            onClick={() => handleDrawingMode(window.google.maps.drawing.OverlayType.RECTANGLE, "rectangle")}
                            theme={theme}
                        >
                            <CropSquareIcon /> Rectangle
                        </StyledButton>
                    </DrawingSubmenu>
                )}
            </DrawingButtonGroup>
        </DrawingControlPanel>
    );
};

export default DrawingControls;
