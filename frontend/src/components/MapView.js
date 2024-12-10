import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import styled from "@emotion/styled";
import { toast } from "react-toastify";
import { Easing, Tween, update } from "@tweenjs/tween.js";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from '@mui/material/CircularProgress';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PolylineIcon from "@mui/icons-material/Polyline";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

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
    left: 50%;
    transform: translateX(-50%);
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

const StyledMapButton = styled.button`
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

const DrawingControlPanel = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(28, 28, 30, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px;
    color: white;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 200px;
`;

const DrawingButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const StyledButton = styled.button`
    background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
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
        background: rgba(255, 255, 255, 0.2);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    svg {
        font-size: 16px;
        opacity: ${props => props.active ? 1 : 0.7};
    }
`;

const DrawingSubmenu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-left: 12px;
    padding-left: 12px;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

const MapDetailsPanel = styled.div`
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(28, 28, 30, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px 16px;
    color: white;
    z-index: 1000;
    display: grid;
    grid-template-columns: repeat(5, auto);
    gap: 24px;
    font-family: monospace;
    font-size: 13px;
`;

const MapDetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;

    span:first-of-type {
        color: rgba(255, 255, 255, 0.5);
        font-size: 11px;
        text-transform: uppercase;
    }

    span:last-of-type {
        color: rgba(255, 255, 255, 0.9);
    }
`;

const ShapeDetailsModal = styled(Dialog)`
    .MuiDialog-paper {
        background: rgba(28, 28, 30, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        color: white;
        min-width: 400px;
    }
`;

const ShapeDetailsTitle = styled(DialogTitle)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: rgba(255, 255, 255, 0.05);
`;

const ShapeDetailsContent = styled(DialogContent)`
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const ImageUploadArea = styled.div`
    border: 2px dashed rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.05);
    }
`;

const MapView = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [map, setMap] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayState, setDisplayState] = useState(START_POSITION);
    const [drawingManager, setDrawingManager] = useState(null);
    const [activeDrawingMode, setActiveDrawingMode] = useState(null);
    const [drawnShapes, setDrawnShapes] = useState([]);
    const [selectedDrawingType, setSelectedDrawingType] = useState(null);
    const [selectedShape, setSelectedShape] = useState(null);
    const [shapeDetailsOpen, setShapeDetailsOpen] = useState(false);
    const [selectedShapeDetails, setSelectedShapeDetails] = useState({
        title: '',
        description: '',
        images: []
    });
    const fileInputRef = useRef(null);

    const isAnimatingRef = useRef(false);
    const hasAnimatedRef = useRef(false);
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

                setDisplayState(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(newState)) {
                        return newState;
                    }
                    return prev;
                });
            }
        }, 100);
    }, [map]);

    const animate = useCallback((time) => {
        animationFrameRef.current = requestAnimationFrame(animate);
        update(time);
    }, []);

    const startAnimation = useCallback(() => {
        if (!map || isAnimatingRef.current || hasAnimatedRef.current) {
            console.log('Animation blocked:', {
                map: !!map,
                isAnimating: isAnimatingRef.current,
                hasAnimated: hasAnimatedRef.current
            });
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
                    hasAnimatedRef.current = true;
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

    const onMainMapLoad = useCallback((mapInstance) => {
        console.log('Map loaded');
        setMap(mapInstance);

        if (mapInstance) {
            // Set initial position
            mapInstance.moveCamera(START_POSITION);

            // Initialize Drawing Manager
            const drawingManagerInstance = new window.google.maps.drawing.DrawingManager({
                drawingMode: null,
                drawingControl: false,
                drawingControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_RIGHT,
                    drawingModes: [
                        window.google.maps.drawing.OverlayType.MARKER,
                        window.google.maps.drawing.OverlayType.POLYGON,
                    ],
                },
                markerOptions: {
                    draggable: true,
                },
                polygonOptions: {
                    fillColor: '#2196f3',
                    fillOpacity: 0.3,
                    strokeWeight: 2,
                    clickable: true,
                    editable: true,
                    draggable: true,
                    zIndex: 1,
                },
            });

            drawingManagerInstance.setMap(mapInstance);
            setDrawingManager(drawingManagerInstance);

            // Add drawing complete listener
            window.google.maps.event.addListener(drawingManagerInstance, 'overlaycomplete', (event) => {
                // Disable drawing mode after shape is complete
                drawingManagerInstance.setDrawingMode(null);
                setActiveDrawingMode(null);

                const shape = event.overlay;
                setDrawnShapes(prev => [...prev, { type: event.type, shape }]);

                // Add listeners for the new shape
                if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
                    // Add vertex listeners for editing
                    const path = shape.getPath();
                    window.google.maps.event.addListener(path, 'set_at', () => {
                        // Handle polygon edit
                        console.log('Polygon edited');
                    });
                    window.google.maps.event.addListener(path, 'insert_at', () => {
                        // Handle polygon edit
                        console.log('Polygon vertex added');
                    });
                }

                // Add click listener for selection
                window.google.maps.event.addListener(shape, 'click', () => {
                    // Handle shape selection
                    console.log('Shape clicked');
                });
            });

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

    const clearDrawings = () => {
        drawnShapes.forEach(({ shape }) => {
            shape.setMap(null);
        });
        setDrawnShapes([]);
    };

    // Auto-start animation effect
    useEffect(() => {
        let timer;
        if (map && !isAnimatingRef.current && !hasAnimatedRef.current) {
            timer = setTimeout(startAnimation, 2000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [map, startAnimation]);

    const handleRefresh = useCallback(() => {
        if (!map || isAnimatingRef.current) return;
        updateDisplayState();
    }, [map, updateDisplayState]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isAnimatingRef.current = false;
            hasAnimatedRef.current = false;
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

    // Update map details on any map change
    useEffect(() => {
        if (!map) return;

        const events = ['bounds_changed', 'tilt_changed', 'heading_changed', 'zoom_changed'];
        const listeners = events.map(event =>
            map.addListener(event, () => {
                requestAnimationFrame(updateDisplayState);
            })
        );

        return () => {
            listeners.forEach(listener => listener.remove());
        };
    }, [map, updateDisplayState]);

    useEffect(() => {
        // Load saved shapes on mount
        const loadSavedShapes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/switchrooms/');
                const savedShapes = response.data;

                savedShapes.forEach(shapeData => {
                    // Recreate the shape on the map
                    if (map && shapeData.coordinates) {
                        let shape;
                        if (shapeData.area_type === 'POINT') {
                            shape = new window.google.maps.Marker({
                                position: {
                                    lat: shapeData.coordinates[0],
                                    lng: shapeData.coordinates[1]
                                },
                                map: map,
                                draggable: true
                            });
                        } else if (shapeData.area_type === 'POLYGON') {
                            const path = shapeData.coordinates.map(coord => ({
                                lat: coord[0],
                                lng: coord[1]
                            }));
                            shape = new window.google.maps.Polygon({
                                paths: path,
                                map: map,
                                fillColor: '#2196f3',
                                fillOpacity: 0.3,
                                strokeWeight: 2,
                                clickable: true,
                                editable: true,
                                draggable: true
                            });
                        }

                        if (shape) {
                            // Add click listener
                            window.google.maps.event.addListener(shape, 'click', () => {
                                setSelectedShape(shape);
                                setSelectedShapeDetails({
                                    id: shapeData.id,
                                    title: shapeData.name,
                                    description: shapeData.description,
                                    images: shapeData.photos || []
                                });
                                setShapeDetailsOpen(true);
                            });

                            // Store the shape with its database ID
                            setDrawnShapes(prev => [...prev, {
                                id: shapeData.id,
                                type: shapeData.area_type,
                                shape,
                                details: {
                                    title: shapeData.name,
                                    description: shapeData.description,
                                    images: shapeData.photos || []
                                }
                            }]);
                        }
                    }
                });
            } catch (error) {
                console.error('Error loading saved shapes:', error);
                toast.error('Failed to load saved areas');
            }
        };

        if (map) {
            loadSavedShapes();
        }
    }, [map]);

    const handleShapeComplete = async (event) => {
        const shape = event.overlay;
        drawingManager.setDrawingMode(null);
        setActiveDrawingMode(null);

        setSelectedShape(shape);
        setSelectedShapeDetails({
            title: '',
            description: '',
            images: []
        });
        setShapeDetailsOpen(true);
    };

    const handleSaveShapeDetails = async () => {
        try {
            const shapeData = {
                name: selectedShapeDetails.title,
                description: selectedShapeDetails.description,
                area_type: selectedShape instanceof window.google.maps.Marker ? 'POINT' : 'POLYGON',
                coordinates: getShapeCoordinates(selectedShape)
            };

            // Create FormData for image upload
            const formData = new FormData();
            Object.keys(shapeData).forEach(key => {
                formData.append(key,
                    key === 'coordinates' ? JSON.stringify(shapeData[key]) : shapeData[key]
                );
            });

            // Append images if any
            selectedShapeDetails.images.forEach(image => {
                if (image instanceof File) {
                    formData.append('photos', image);
                }
            });

            let response;
            if (selectedShapeDetails.id) {
                // Update existing shape
                response = await axios.put(
                    `http://localhost:8000/api/switchrooms/${selectedShapeDetails.id}/`,
                    formData
                );
            } else {
                // Create new shape
                response = await axios.post('http://localhost:8000/api/switchrooms/', formData);
            }

            // Update local state
            const updatedShape = {
                id: response.data.id,
                type: shapeData.area_type,
                shape: selectedShape,
                details: {
                    title: response.data.name,
                    description: response.data.description,
                    images: response.data.photos || []
                }
            };

            setDrawnShapes(prev => {
                const filtered = prev.filter(s => s.shape !== selectedShape);
                return [...filtered, updatedShape];
            });

            setShapeDetailsOpen(false);
            toast.success('Area saved successfully');
        } catch (error) {
            console.error('Error saving shape:', error);
            toast.error('Failed to save area');
        }
    };

    const getShapeCoordinates = (shape) => {
        if (shape instanceof window.google.maps.Marker) {
            const position = shape.getPosition();
            return [position.lat(), position.lng()];
        } else if (shape instanceof window.google.maps.Polygon) {
            const path = shape.getPath();
            return path.getArray().map(latLng => [latLng.lat(), latLng.lng()]);
        }
        return null;
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setSelectedShapeDetails(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

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

            <DrawingControlPanel>
                <DrawingButtonGroup>
                    <StyledButton
                        active={activeDrawingMode === window.google.maps.drawing.OverlayType.MARKER}
                        onClick={() => handleDrawingMode(window.google.maps.drawing.OverlayType.MARKER)}
                        disabled={isAnimating}
                    >
                        <LocationOnIcon /> Add Marker
                    </StyledButton>

                    <StyledButton
                        active={activeDrawingMode === window.google.maps.drawing.OverlayType.POLYGON}
                        onClick={() => handleDrawingMode(window.google.maps.drawing.OverlayType.POLYGON)}
                        disabled={isAnimating}
                    >
                        <PolylineIcon /> Draw Area
                    </StyledButton>

                    {activeDrawingMode === window.google.maps.drawing.OverlayType.POLYGON && (
                        <DrawingSubmenu>
                            <StyledButton
                                active={selectedDrawingType === 'polygon'}
                                onClick={() => handleDrawingMode(window.google.maps.drawing.OverlayType.POLYGON, 'polygon')}
                            >
                                <PolylineIcon /> Polygon
                            </StyledButton>
                            <StyledButton
                                active={selectedDrawingType === 'rectangle'}
                                onClick={() => handleDrawingMode(window.google.maps.drawing.OverlayType.RECTANGLE, 'rectangle')}
                            >
                                <CropSquareIcon /> Rectangle
                            </StyledButton>
                        </DrawingSubmenu>
                    )}

                    <StyledButton
                        onClick={clearDrawings}
                        disabled={isAnimating || drawnShapes.length === 0}
                    >
                        <DeleteIcon /> Clear All
                    </StyledButton>
                </DrawingButtonGroup>
            </DrawingControlPanel>

            <MapDetailsPanel>
                <MapDetailItem>
                    <span>Latitude</span>
                    <span>{displayState?.center?.lat?.toFixed(6) ?? '0.000000'}°</span>
                </MapDetailItem>
                <MapDetailItem>
                    <span>Longitude</span>
                    <span>{displayState?.center?.lng?.toFixed(6) ?? '0.000000'}°</span>
                </MapDetailItem>
                <MapDetailItem>
                    <span>Zoom</span>
                    <span>{displayState?.zoom?.toFixed(1) ?? '0.0'}</span>
                </MapDetailItem>
                <MapDetailItem>
                    <span>Tilt</span>
                    <span>{displayState?.tilt?.toFixed(1) ?? '0.0'}°</span>
                </MapDetailItem>
                <MapDetailItem>
                    <span>Heading</span>
                    <span>{displayState?.heading?.toFixed(1) ?? '0.0'}°</span>
                </MapDetailItem>
            </MapDetailsPanel>

            <ShapeDetailsModal
                open={shapeDetailsOpen}
                onClose={() => setShapeDetailsOpen(false)}
            >
                <ShapeDetailsTitle>
                    <span>Area Details</span>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setShapeDetailsOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </ShapeDetailsTitle>
                <ShapeDetailsContent>
                    <TextField
                        label="Title"
                        value={selectedShapeDetails.title}
                        onChange={(e) => setSelectedShapeDetails(prev => ({
                            ...prev,
                            title: e.target.value
                        }))}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="Description"
                        value={selectedShapeDetails.description}
                        onChange={(e) => setSelectedShapeDetails(prev => ({
                            ...prev,
                            description: e.target.value
                        }))}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                    />
                    <ImageUploadArea onClick={() => fileInputRef.current?.click()}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <p>Click to upload images</p>
                        {selectedShapeDetails.images.length > 0 && (
                            <p>{selectedShapeDetails.images.length} image(s) selected</p>
                        )}
                    </ImageUploadArea>
                </ShapeDetailsContent>
                <DialogActions>
                    <Button onClick={() => setShapeDetailsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveShapeDetails} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </ShapeDetailsModal>
        </Container>
    );
};

export default MapView;
