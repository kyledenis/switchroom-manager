import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import styled from "@emotion/styled";
import { toast } from "react-toastify";
import { Easing, Tween, update } from "@tweenjs/tween.js";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from '@mui/material/CircularProgress';

const libraries = ["drawing"];

// Camera position constants
const START_POSITION = {
    center: {
        lat: -28.263778,
        lng: 134.402009
    },
    zoom: 4,
    tilt: 0,
    heading: 0
};

const MIDDLE_POSITION = {
    center: {
        lat: -37.899874,
        lng: 144.943917
    },
    zoom: 10,
    tilt: 0,
    heading: 0
};

const TILT_START_POSITION = {
    center: {
        lat: -37.818443,
        lng: 144.787437
    },
    zoom: 14,
    tilt: 0,
    heading: 0
};

const PRE_TILT_POSITION = {
    center: {
        lat: -37.831958,
        lng: 144.788857
    },
    zoom: 18,
    tilt: 0,
    heading: 0
};

const END_POSITION = {
    center: {
        lat: -37.831958,
        lng: 144.788857
    },
    zoom: 18,
    tilt: 45,
    heading: 0
};

const STAGE_DURATION = 4000; // 4 seconds per main stage
const TILT_DURATION = 3000; // 3 seconds for just the tilt

const ANIMATION_DURATION = 15000; // 15 seconds

const Container = styled.div`
    height: calc(100vh - 80px);
    display: flex;
    position: relative;
`;

const MapContainer = styled.div`
    flex: 1;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    margin: 0 16px 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ZoomControlPanel = styled.div`
    position: absolute;
    top: 20px;
    right: 40px;
    background: rgba(28, 28, 30, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    color: white;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 300px;
`;

const Button = styled.button`
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 13px;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const CoordinatesDisplay = styled.div`
    font-family: monospace;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
`;

const RefreshButton = styled.button`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 6px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    svg {
        font-size: 16px;
    }
`;

const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(28, 28, 30, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 2000;
    gap: 16px;
`;

const LoadingText = styled.div`
    font-size: 16px;
    font-weight: 500;
    text-align: center;
`;

const MapView = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [map, setMap] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayState, setDisplayState] = useState(START_POSITION);

    const isAnimatingRef = useRef(false);
    const animationFrameRef = useRef(null);
    const cameraOptions = useRef({ ...START_POSITION });
    const updateTimeoutRef = useRef(null);
    const mapListenersRef = useRef([]);

    const mapOptions = {
        mapTypeId: 'hybrid',
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        minZoom: 3,
        maxZoom: 20,
        gestureHandling: 'greedy',
        styles: [
            {
                featureType: 'all',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'poi',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'transit',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'administrative',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'road',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    };

    const updateDisplayState = useCallback(() => {
        if (!map || isAnimatingRef.current) return;

        // Clear any pending updates
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        // Debounce the update
        updateTimeoutRef.current = setTimeout(() => {
            const center = map.getCenter();
            if (center) {
                const newState = {
                    center: { lat: center.lat(), lng: center.lng() },
                    zoom: map.getZoom(),
                    tilt: map.getTilt(),
                    heading: map.getHeading()
                };

                // Only update if values have changed
                setDisplayState(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(newState)) {
                        return newState;
                    }
                    return prev;
                });
            }
        }, 100);
    }, [map]);

    const onMainMapLoad = useCallback((mapInstance) => {
        console.log('Map loaded');
        setMap(mapInstance);

        if (mapInstance) {
            // Set initial position
            mapInstance.moveCamera(START_POSITION);

            // Clean up previous listeners
            mapListenersRef.current.forEach(listener => listener.remove());
            mapListenersRef.current = [];

            // Add new listeners
            const addListener = (event) => {
                const listener = mapInstance.addListener(event, updateDisplayState);
                mapListenersRef.current.push(listener);
            };

            ['idle', 'tilt_changed', 'heading_changed'].forEach(addListener);

            // Initial state update
            updateDisplayState();
        }
    }, [updateDisplayState]);

    const animate = useCallback((time) => {
        animationFrameRef.current = requestAnimationFrame(animate);
        update(time);
    }, []);

    const handleAnimationClick = useCallback(() => {
        if (!map || isAnimating) {
            console.log('Animation blocked:', { map: !!map, isAnimating });
            return;
        }

        try {
            setIsAnimating(true);
            isAnimatingRef.current = true;

            console.log('Starting animation');

            // Reset to start position
            cameraOptions.current = { ...START_POSITION };
            map.moveCamera(START_POSITION);

            // Stage 1: Start to Middle (Australia to Melbourne)
            const stage1 = new Tween(cameraOptions.current)
                .to(MIDDLE_POSITION, STAGE_DURATION)
                .easing(Easing.Cubic.InOut)
                .onUpdate(() => {
                    if (map) {
                        map.moveCamera(cameraOptions.current);
                    }
                });

            // Stage 2: Middle to Tilt Start (Closer to target)
            const stage2 = new Tween(cameraOptions.current)
                .to(TILT_START_POSITION, STAGE_DURATION)
                .easing(Easing.Cubic.InOut)
                .onUpdate(() => {
                    if (map) {
                        map.moveCamera(cameraOptions.current);
                    }
                });

            // Stage 3: Move to final position (no tilt yet)
            const stage3 = new Tween(cameraOptions.current)
                .to(PRE_TILT_POSITION, STAGE_DURATION)
                .easing(Easing.Cubic.InOut)
                .onUpdate(() => {
                    if (map) {
                        map.moveCamera(cameraOptions.current);
                    }
                });

            // Stage 4: Apply tilt only
            const stage4 = new Tween(cameraOptions.current)
                .to(END_POSITION, TILT_DURATION)
                .easing(Easing.Cubic.InOut)
                .onUpdate(() => {
                    if (map) {
                        map.moveCamera(cameraOptions.current);
                    }
                })
                .onComplete(() => {
                    console.log('Animation complete');
                    isAnimatingRef.current = false;
                    setIsAnimating(false);
                    updateDisplayState();
                });

            // Chain all animations
            stage1.chain(stage2);
            stage2.chain(stage3);
            stage3.chain(stage4);
            stage1.start();

            // Start the animation loop
            animationFrameRef.current = requestAnimationFrame(animate);

        } catch (error) {
            console.error('Animation failed:', error);
            toast.error('Animation failed: ' + error.message);
            isAnimatingRef.current = false;
            setIsAnimating(false);
        }
    }, [map, isAnimating, animate, updateDisplayState]);

    const handleRefresh = useCallback(() => {
        if (!map || isAnimatingRef.current) return;
        updateDisplayState();
    }, [map, updateDisplayState]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isAnimatingRef.current = false;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
            mapListenersRef.current.forEach(listener => listener.remove());
            mapListenersRef.current = [];
        };
    }, []);

    if (!isLoaded) {
        return (
            <LoadingOverlay>
                <CircularProgress size={48} color="inherit" />
                <LoadingText>
                    Loading map...
                    <br />
                    <small style={{ opacity: 0.7 }}>This may take a few moments</small>
                </LoadingText>
            </LoadingOverlay>
        );
    }

    return (
        <Container>
            <MapContainer>
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '16px' }}
                    options={mapOptions}
                    onLoad={onMainMapLoad}
                />
            </MapContainer>

            <ZoomControlPanel>
                <Button
                    onClick={handleAnimationClick}
                    disabled={isAnimating}
                >
                    {isAnimating ? 'Animating...' : 'Start Animation'}
                </Button>

                <CoordinatesDisplay>
                    Lat: {displayState?.center?.lat?.toFixed(6) ?? '0.000000'}°
                    <br />
                    Lng: {displayState?.center?.lng?.toFixed(6) ?? '0.000000'}°
                    <br />
                    Zoom: {displayState?.zoom?.toFixed(1) ?? '0.0'}
                    <br />
                    Tilt: {displayState?.tilt?.toFixed(1) ?? '0.0'}°
                    <br />
                    Heading: {displayState?.heading?.toFixed(1) ?? '0.0'}°
                    <RefreshButton onClick={handleRefresh}>
                        <RefreshIcon />
                    </RefreshButton>
                </CoordinatesDisplay>
            </ZoomControlPanel>
        </Container>
    );
};

export default MapView;
