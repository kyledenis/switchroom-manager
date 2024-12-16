import React, { useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { useTheme } from '../../../contexts/ThemeContext';
import { CustomMapControls, MapButton } from '../styles/MapControlStyles';

const MapControls = ({ map, isAnimating }) => {
    const { theme } = useTheme();

    // Counterclockwise rotation
    const handleRotateLeft = useCallback(() => {
        if (!map) return;
        const currentHeading = map.getHeading() || 0;
        // Add 360 before subtracting to ensure we stay in positive range
        const newHeading = ((currentHeading + 360 - 90) % 360);
        map.setHeading(newHeading);
    }, [map]);

    // Clockwise rotation
    const handleRotateRight = useCallback(() => {
        if (!map) return;
        const currentHeading = map.getHeading() || 0;
        const newHeading = (currentHeading + 90) % 360;
        map.setHeading(newHeading);
    }, [map]);

    return (
        <CustomMapControls>
            <MapButton
                onClick={() => map?.setZoom((map.getZoom() || 0) + 1)}
                title="Zoom in"
                theme={theme}
                disabled={isAnimating}
            >
                <AddIcon />
            </MapButton>
            <MapButton
                onClick={() => map?.setZoom((map.getZoom() || 0) - 1)}
                title="Zoom out"
                theme={theme}
                disabled={isAnimating}
            >
                <RemoveIcon />
            </MapButton>
            <MapButton
                onClick={() => {
                    const currentTilt = map?.getTilt() || 0;
                    map?.setTilt(currentTilt >= 45 ? 0 : 45);
                }}
                title="Toggle tilt"
                theme={theme}
                disabled={isAnimating}
            >
                <ThreeDRotationIcon />
            </MapButton>
            <MapButton
                onClick={handleRotateLeft}
                title="Rotate left"
                theme={theme}
                disabled={isAnimating}
            >
                <RotateLeftIcon />
            </MapButton>
            <MapButton
                onClick={handleRotateRight}
                title="Rotate right"
                theme={theme}
                disabled={isAnimating}
            >
                <RotateRightIcon />
            </MapButton>
        </CustomMapControls>
    );
};

export default MapControls;
