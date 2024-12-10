import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, OverlayView } from "@react-google-maps/api";
import styled from "@emotion/styled";
import { toast } from "react-toastify";
import TWEEN from "@tweenjs/tween.js";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PolylineIcon from "@mui/icons-material/Polyline";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const libraries = ["drawing"];

// Camera position constants
const START_POSITION = {
    center: {
        lat: -28.263778,
        lng: 134.402009,
    },
    zoom: 4,
    tilt: 0,
    heading: 0,
};

const MIDDLE_POSITION = {
    center: {
        lat: -37.899874,
        lng: 144.943917,
    },
    zoom: 10,
    tilt: 0,
    heading: 0,
};

const TILT_START_POSITION = {
    center: {
        lat: -37.818443,
        lng: 144.787437,
    },
    zoom: 14,
    tilt: 0,
    heading: 0,
};

const PRE_TILT_POSITION = {
    center: {
        lat: -37.831958,
        lng: 144.788857,
    },
    zoom: 18,
    tilt: 0,
    heading: 0,
};

const END_POSITION = {
    center: {
        lat: -37.831958,
        lng: 144.788857,
    },
    zoom: 18,
    tilt: 45,
    heading: 0,
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
    position: relative;
    height: calc(100vh - 80px);
    transition: width 0.3s ease;
    width: ${(props) =>
        props.isDetailsPanelOpen ? "calc(100% - 400px)" : "100%"};
    padding: 16px;

    .gm-style {
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
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
    top: 24px;
    left: 24px;
    background: rgba(28, 28, 30, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    color: white;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 220px;
`;

const DrawingButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const StyledButton = styled.button`
    background: ${(props) =>
        props.active ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)"};
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
        opacity: ${(props) => (props.active ? 1 : 0.7)};
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
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    background: rgba(28, 28, 30, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px 16px;
    color: white;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(5, auto);
    gap: 24px;
`;

const MapDetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: center;
    min-width: 100px;

    span:first-of-type {
        color: rgba(255, 255, 255, 0.5);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    span:last-of-type {
        font-family: "SF Mono", monospace;
        font-size: 13px;
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

const ShapeDetailsTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    font-size: 18px;
    font-weight: 600;
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

const MiniPopup = styled(motion.div)`
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

const PopupButton = styled.button`
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

const DetailsPanel = styled.div`
    position: fixed;
    top: 80px;
    right: 0;
    bottom: 0;
    width: 400px;
    background: rgba(28, 28, 30, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    padding: 24px;
    color: white;
    z-index: 1;
    overflow-y: auto;
    transition: transform 0.3s ease;
    transform: translateX(${(props) => (props.isOpen ? "0" : "100%")});
`;

const CustomMapControls = styled.div`
    position: absolute;
    right: 24px;
    bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 1;
`;

const MapButton = styled.button`
    width: 48px;
    height: 48px;
    background: rgba(28, 28, 30, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.05);
    }

    svg {
        font-size: 24px;
    }
`;

const defaultShapeOptions = {
    fillColor: "#2196f3",
    fillOpacity: 0.3,
    strokeColor: "#000000",
    strokeWeight: 2,
    clickable: true,
    editable: true,
    draggable: true,
    geodesic: true,
};

const AppContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #1c1c1e;
    background-image: radial-gradient(
        circle at 1px 1px,
        rgba(255, 255, 255, 0.05) 1px,
        transparent 0
    );
    background-size: 40px 40px;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: white;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    svg {
        font-size: 20px;
    }
`;

// Add this at the top of the file, outside of any component
const animationState = {
    hasPlayed: false
};

const MapView = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [map, setMap] = useState(null);
    const [drawingManager, setDrawingManager] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayState, setDisplayState] = useState(null);
    const [selectedDrawing, setSelectedDrawing] = useState(null);
    const [drawnShapes, setDrawnShapes] = useState([]);
    const [activeDrawingMode, setActiveDrawingMode] = useState(null);
    const [selectedDrawingType, setSelectedDrawingType] = useState(null);
    const [shapeDetailsOpen, setShapeDetailsOpen] = useState(false);
    const [selectedPopupPosition, setSelectedPopupPosition] = useState(null);
    const [selectedShapeDetails, setSelectedShapeDetails] = useState({
        title: "",
        description: "",
        images: [],
    });

    const isAnimatingRef = useRef(false);
    const updateTimeoutRef = useRef(null);
    const animationFrameRef = useRef(null);
    const mapListenersRef = useRef([]);
    const fileInputRef = useRef(null);

    const mapOptions = {
        mapTypeId: "hybrid",
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        minZoom: 3,
        maxZoom: 20,
        gestureHandling: "greedy",
        styles: [
            {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "poi",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "transit",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "administrative",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "road",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
        ],
        disableDefaultUI: true,
    };

    const location = useLocation();

    const updateDisplayState = useCallback(() => {
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(() => {
            if (!map) return;

            const center = map.getCenter();
            setDisplayState({
                center: {
                    lat: center.lat(),
                    lng: center.lng()
                },
                zoom: map.getZoom(),
                tilt: map.getTilt(),
                heading: map.getHeading()
            });
        }, 100);
    }, [map]);

    // Cleanup function
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
            // Clean up map listeners
            if (mapListenersRef.current) {
                mapListenersRef.current.forEach(listener => {
                    window.google.maps.event.removeListener(listener);
                });
                mapListenersRef.current = [];
            }
        };
    }, []);

    const startAnimation = useCallback(() => {
        if (!map || isAnimatingRef.current || animationState.hasPlayed) {
            console.log('Animation blocked:', {
                map: !!map,
                isAnimating: isAnimatingRef.current,
                hasAnimated: animationState.hasPlayed
            });
            return;
        }

        isAnimatingRef.current = true;
        setIsAnimating(true);

        const animate = () => {
            // First stage: Start to Middle
            TWEEN.removeAll();
            let currentPosition = {
                lat: START_POSITION.center.lat,
                lng: START_POSITION.center.lng,
                zoom: START_POSITION.zoom,
                tilt: START_POSITION.tilt,
                heading: START_POSITION.heading
            };

            // Create the first tween
            new TWEEN.Tween(currentPosition)
                .to({
                    lat: MIDDLE_POSITION.center.lat,
                    lng: MIDDLE_POSITION.center.lng,
                    zoom: MIDDLE_POSITION.zoom
                }, STAGE_DURATION)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    map.moveCamera({
                        center: { lat: currentPosition.lat, lng: currentPosition.lng },
                        zoom: currentPosition.zoom,
                        tilt: currentPosition.tilt,
                        heading: currentPosition.heading
                    });
                })
                .onComplete(() => {
                    // Second stage: Middle to Tilt Start
                    new TWEEN.Tween(currentPosition)
                        .to({
                            lat: TILT_START_POSITION.center.lat,
                            lng: TILT_START_POSITION.center.lng,
                            zoom: TILT_START_POSITION.zoom
                        }, STAGE_DURATION)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onUpdate(() => {
                            map.moveCamera({
                                center: { lat: currentPosition.lat, lng: currentPosition.lng },
                                zoom: currentPosition.zoom,
                                tilt: currentPosition.tilt,
                                heading: currentPosition.heading
                            });
                        })
                        .onComplete(() => {
                            // Third stage: Tilt Start to Pre-Tilt
                            new TWEEN.Tween(currentPosition)
                                .to({
                                    lat: PRE_TILT_POSITION.center.lat,
                                    lng: PRE_TILT_POSITION.center.lng,
                                    zoom: PRE_TILT_POSITION.zoom
                                }, STAGE_DURATION)
                                .easing(TWEEN.Easing.Quadratic.InOut)
                                .onUpdate(() => {
                                    map.moveCamera({
                                        center: { lat: currentPosition.lat, lng: currentPosition.lng },
                                        zoom: currentPosition.zoom,
                                        tilt: currentPosition.tilt,
                                        heading: currentPosition.heading
                                    });
                                })
                                .onComplete(() => {
                                    // Final stage: Add tilt
                                    new TWEEN.Tween(currentPosition)
                                        .to({
                                            tilt: END_POSITION.tilt
                                        }, TILT_DURATION)
                                        .easing(TWEEN.Easing.Quadratic.InOut)
                                        .onUpdate(() => {
                                            map.moveCamera({
                                                center: { lat: currentPosition.lat, lng: currentPosition.lng },
                                                zoom: currentPosition.zoom,
                                                tilt: currentPosition.tilt,
                                                heading: currentPosition.heading
                                            });
                                        })
                                        .onComplete(() => {
                                            console.log('Animation complete');
                                            isAnimatingRef.current = false;
                                            setIsAnimating(false);
                                            animationState.hasPlayed = true;
                                            updateDisplayState();
                                        })
                                        .start();
                                })
                                .start();
                        })
                        .start();
                })
                .start();

            // Animation loop
            const animate = (time) => {
                if (isAnimatingRef.current) {
                    TWEEN.update(time);
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        };

        animate();
    }, [map, isAnimating, updateDisplayState]);

    useEffect(() => {
        let timer;
        if (map && !isAnimatingRef.current && !animationState.hasPlayed) {
            timer = setTimeout(startAnimation, 2000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [map, startAnimation]);

    const onMainMapLoad = useCallback((mapInstance) => {
        setMap(mapInstance);

        if (mapInstance) {
            // Try to restore previous state
            const savedState = localStorage.getItem("lastMapState");
            if (savedState && animationState.hasPlayed) {
                try {
                    const state = JSON.parse(savedState);
                    if (state && state.center && typeof state.center.lat === 'number') {
                        mapInstance.moveCamera(state);
                    } else {
                        mapInstance.moveCamera(START_POSITION);
                    }
                } catch (error) {
                    console.error('Error restoring map state:', error);
                    mapInstance.moveCamera(START_POSITION);
                }
            } else {
                mapInstance.moveCamera(START_POSITION);
            }

            // Initialize Drawing Manager with consistent styling
            const drawingManagerInstance = new window.google.maps.drawing.DrawingManager({
                drawingMode: null,
                drawingControl: false,
                markerOptions: {
                    draggable: true,
                },
                polygonOptions: {
                    ...defaultShapeOptions,
                    editable: true,
                    draggable: true,
                },
                rectangleOptions: {
                    ...defaultShapeOptions,
                    editable: true,
                    draggable: true,
                },
            });

            drawingManagerInstance.setMap(mapInstance);
            setDrawingManager(drawingManagerInstance);

            // Add drawing complete listener
            window.google.maps.event.addListener(
                drawingManagerInstance,
                'overlaycomplete',
                (event) => {
                    const shape = event.overlay;
                    drawingManagerInstance.setDrawingMode(null);
                    setActiveDrawingMode(null);
                    setDrawnShapes((prevShapes) => [...prevShapes, shape]);
                    addShapeListeners(shape);
                    setSelectedDrawing(shape);
                }
            );

            // Add map event listeners
            const mapListeners = [
                mapInstance.addListener('bounds_changed', updateDisplayState),
                mapInstance.addListener('tilt_changed', updateDisplayState),
                mapInstance.addListener('heading_changed', updateDisplayState),
            ];

            mapListenersRef.current = mapListeners;
        }
    }, [updateDisplayState]);

    const highlightShape = (shape) => {
        if (shape instanceof window.google.maps.Polygon) {
            shape.setOptions({
                strokeWeight: 3,
                strokeColor: "#4CAF50",
                fillColor: "#4CAF50",
                fillOpacity: 0.3,
            });
        }
    };

    const unhighlightShape = (shape) => {
        if (shape instanceof window.google.maps.Polygon) {
            shape.setOptions({
                strokeWeight: defaultShapeOptions.strokeWeight,
                strokeColor: defaultShapeOptions.strokeColor,
                fillColor: defaultShapeOptions.fillColor,
                fillOpacity: defaultShapeOptions.fillOpacity,
            });
        }
    };

    const addShapeListeners = (shape) => {
        // Mouse enter listener for hover effect
        window.google.maps.event.addListener(shape, "mouseover", () => {
            if (shape !== selectedDrawing) {
                shape.setOptions({
                    strokeWeight: 2,
                    strokeColor: "#4CAF50",
                    fillOpacity: 0.2,
                });
            }
        });

        // Mouse leave listener to remove hover effect
        window.google.maps.event.addListener(shape, "mouseout", () => {
            if (shape !== selectedDrawing) {
                shape.setOptions(defaultShapeOptions);
            }
        });

        // Click listener for selection/deselection
        window.google.maps.event.addListener(shape, "click", (e) => {
            if (selectedDrawing === shape) {
                // Deselect if clicking the same shape
                unhighlightShape(shape);
                setSelectedDrawing(null);
                setSelectedPopupPosition(null);
            } else {
                // Deselect previous shape if any
                if (selectedDrawing) {
                    unhighlightShape(selectedDrawing);
                }
                // Select new shape
                setSelectedDrawing(shape);
                highlightShape(shape);

                // Calculate popup position
                const bounds = new window.google.maps.LatLngBounds();
                if (shape instanceof window.google.maps.Polygon) {
                    shape.getPath().forEach((coord) => bounds.extend(coord));
                } else {
                    bounds.extend(shape.getPosition());
                }
                const center = bounds.getCenter();
                setSelectedPopupPosition({
                    lat: center.lat(),
                    lng: center.lng(),
                });
            }
        });
    };

    const handleDeleteSelected = () => {
        if (selectedDrawing) {
            // Remove the shape from the map
            selectedDrawing.setMap(null);
            // Remove from drawn shapes array
            setDrawnShapes((prev) =>
                prev.filter(({ shape }) => shape !== selectedDrawing),
            );
            setSelectedDrawing(null);
        }
    };

    // Add keyboard listener for delete key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                (e.key === "Delete" || e.key === "Backspace") &&
                selectedDrawing
            ) {
                handleDeleteSelected();
            } else if (e.key === "Escape") {
                // Deselect on escape
                if (selectedDrawing instanceof window.google.maps.Polygon) {
                    selectedDrawing.setOptions({
                        strokeWeight: defaultShapeOptions.strokeWeight,
                        strokeColor: defaultShapeOptions.strokeColor,
                    });
                }
                setSelectedDrawing(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedDrawing]);

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

    const handleRefresh = useCallback(() => {
        if (!map || isAnimatingRef.current) return;
        updateDisplayState();
    }, [map, updateDisplayState]);

    // Update map details on any map change
    useEffect(() => {
        if (!map) return;

        const events = [
            "bounds_changed",
            "tilt_changed",
            "heading_changed",
            "zoom_changed",
        ];
        const listeners = events.map((event) =>
            map.addListener(event, () => {
                requestAnimationFrame(updateDisplayState);
            }),
        );

        return () => {
            listeners.forEach((listener) => listener.remove());
        };
    }, [map, updateDisplayState]);

    useEffect(() => {
        // Load saved shapes on mount
        const loadSavedShapes = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/switchrooms/",
                );
                const savedShapes = response.data;

                savedShapes.forEach((shapeData) => {
                    // Recreate the shape on the map
                    if (map && shapeData.coordinates) {
                        let shape;
                        if (shapeData.area_type === "POINT") {
                            shape = new window.google.maps.Marker({
                                position: {
                                    lat: shapeData.coordinates[0],
                                    lng: shapeData.coordinates[1],
                                },
                                map: map,
                                draggable: true,
                            });
                        } else if (shapeData.area_type === "POLYGON") {
                            const path = shapeData.coordinates.map((coord) => ({
                                lat: coord[0],
                                lng: coord[1],
                            }));
                            shape = new window.google.maps.Polygon({
                                paths: path,
                                map: map,
                                fillColor: "#2196f3",
                                fillOpacity: 0.3,
                                strokeWeight: 2,
                                clickable: true,
                                editable: true,
                                draggable: true,
                            });
                        }

                        if (shape) {
                            // Add click listener
                            window.google.maps.event.addListener(
                                shape,
                                "click",
                                () => {
                                    setSelectedDrawing(shape);
                                    setSelectedShapeDetails({
                                        id: shapeData.id,
                                        title: shapeData.name,
                                        description: shapeData.description,
                                        images: shapeData.photos || [],
                                    });
                                    setShapeDetailsOpen(true);
                                },
                            );

                            // Store the shape with its database ID
                            setDrawnShapes((prev) => [
                                ...prev,
                                {
                                    id: shapeData.id,
                                    type: shapeData.area_type,
                                    shape,
                                    details: {
                                        title: shapeData.name,
                                        description: shapeData.description,
                                        images: shapeData.photos || [],
                                    },
                                },
                            ]);
                        }
                    }
                });
            } catch (error) {
                console.error("Error loading saved shapes:", error);
                toast.error("Failed to load saved areas");
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

        setSelectedDrawing(shape);
        setSelectedShapeDetails({
            title: "",
            description: "",
            images: [],
        });
        setShapeDetailsOpen(true);
    };

    const handleSaveShapeDetails = async () => {
        try {
            const shapeData = {
                name: selectedShapeDetails.title,
                description: selectedShapeDetails.description,
                area_type:
                    selectedDrawing instanceof window.google.maps.Marker
                        ? "POINT"
                        : "POLYGON",
                coordinates: getShapeCoordinates(selectedDrawing),
            };

            // Create FormData for image upload
            const formData = new FormData();
            Object.keys(shapeData).forEach((key) => {
                formData.append(
                    key,
                    key === "coordinates"
                        ? JSON.stringify(shapeData[key])
                        : shapeData[key],
                );
            });

            // Append images if any
            selectedShapeDetails.images.forEach((image) => {
                if (image instanceof File) {
                    formData.append("photos", image);
                }
            });

            let response;
            if (selectedShapeDetails.id) {
                // Update existing shape
                response = await axios.put(
                    `http://localhost:8000/api/switchrooms/${selectedShapeDetails.id}/`,
                    formData,
                );
            } else {
                // Create new shape
                response = await axios.post(
                    "http://localhost:8000/api/switchrooms/",
                    formData,
                );
            }

            // Update local state
            const updatedShape = {
                id: response.data.id,
                type: shapeData.area_type,
                shape: selectedDrawing,
                details: {
                    title: response.data.name,
                    description: response.data.description,
                    images: response.data.photos || [],
                },
            };

            setDrawnShapes((prev) => {
                const filtered = prev.filter(
                    (s) => s.shape !== selectedDrawing,
                );
                return [...filtered, updatedShape];
            });

            setShapeDetailsOpen(false);
            toast.success("Area saved successfully");
        } catch (error) {
            console.error("Error saving shape:", error);
            toast.error("Failed to save area");
        }
    };

    const getShapeCoordinates = (shape) => {
        if (shape instanceof window.google.maps.Marker) {
            const position = shape.getPosition();
            return [position.lat(), position.lng()];
        } else if (shape instanceof window.google.maps.Polygon) {
            const path = shape.getPath();
            return path
                .getArray()
                .map((latLng) => [latLng.lat(), latLng.lng()]);
        }
        return null;
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setSelectedShapeDetails((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
        }));
    };

    // Store map state when unmounting
    useEffect(() => {
        return () => {
            if (map && !isAnimatingRef.current) {
                try {
                    const center = map.getCenter();
                    if (
                        center &&
                        typeof center.lat === "function" &&
                        typeof center.lng === "function"
                    ) {
                        const state = {
                            center: {
                                lat: center.lat(),
                                lng: center.lng(),
                            },
                            zoom: map.getZoom() || START_POSITION.zoom,
                            tilt: map.getTilt() || START_POSITION.tilt,
                            heading: map.getHeading() || START_POSITION.heading,
                        };
                        localStorage.setItem(
                            "lastMapState",
                            JSON.stringify(state),
                        );
                    }
                } catch (error) {
                    console.error("Error saving map state:", error);
                }
            }
        };
    }, [map]);

    useEffect(() => {
        if (location.state?.selectedArea && location.state?.fromList && map) {
            const area = location.state.selectedArea;
            // Find the corresponding shape
            const shape = drawnShapes.find((shape) => {
                if (shape instanceof window.google.maps.Polygon) {
                    const path = shape.getPath();
                    const coords = path.getArray().map((coord) => ({
                        lat: coord.lat(),
                        lng: coord.lng(),
                    }));
                    return (
                        JSON.stringify(coords) ===
                        JSON.stringify(area.coordinates)
                    );
                }
                return false;
            });

            if (shape) {
                // Deselect previous shape if any
                if (selectedDrawing) {
                    unhighlightShape(selectedDrawing);
                }

                // Select and highlight the new shape
                setSelectedDrawing(shape);
                highlightShape(shape);

                // Calculate bounds and center
                const bounds = new window.google.maps.LatLngBounds();
                if (shape instanceof window.google.maps.Polygon) {
                    shape.getPath().forEach((coord) => bounds.extend(coord));
                }
                const center = bounds.getCenter();
                setSelectedPopupPosition({
                    lat: center.lat(),
                    lng: center.lng(),
                });

                // Pan and zoom to the shape
                map.panTo(center);
                map.setZoom(18);
                map.setTilt(45);

                // Open the details panel
                setShapeDetailsOpen(true);
            }
        }
    }, [location.state, map, drawnShapes]);

    const handleRotateLeft = useCallback(() => {
        if (!map) return;
        map.setHeading((map.getHeading() || 0) - 45);
    }, [map]);

    const handleRotateRight = useCallback(() => {
        if (!map) return;
        map.setHeading((map.getHeading() || 0) + 45);
    }, [map]);

    if (!isLoaded) {
        return (
            <LoadingOverlay>
                <CircularProgress size={48} color="inherit" />
                <LoadingText>
                    Loading map...
                    <br />
                    <small style={{ opacity: 0.7 }}>
                        This may take a few moments
                    </small>
                </LoadingText>
            </LoadingOverlay>
        );
    }

    return (
        <AppContainer>
            <Container>
                <MapContainer isDetailsPanelOpen={shapeDetailsOpen}>
                    <GoogleMap
                        mapContainerStyle={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "16px",
                        }}
                        options={{
                            ...mapOptions,
                            rotateControl: false, // Disable default rotate control
                        }}
                        onLoad={onMainMapLoad}
                    >
                        {selectedPopupPosition && (
                            <OverlayView
                                position={selectedPopupPosition}
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                getPixelPositionOffset={(width, height) => ({
                                    x: -(width / 2),
                                    y: -height - 10,
                                })}
                            >
                                <MiniPopup
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                >
                                    <PopupButton
                                        onClick={() =>
                                            setShapeDetailsOpen(true)
                                        }
                                    >
                                        <VisibilityIcon /> View
                                    </PopupButton>
                                    <PopupButton onClick={handleDeleteSelected}>
                                        <DeleteIcon /> Delete
                                    </PopupButton>
                                </MiniPopup>
                            </OverlayView>
                        )}
                        <DrawingControlPanel>
                            <DrawingButtonGroup>
                                <StyledButton
                                    active={
                                        activeDrawingMode ===
                                        window.google.maps.drawing.OverlayType
                                            .MARKER
                                    }
                                    onClick={() =>
                                        handleDrawingMode(
                                            window.google.maps.drawing
                                                .OverlayType.MARKER,
                                        )
                                    }
                                    disabled={isAnimating}
                                >
                                    <LocationOnIcon /> Add Marker
                                </StyledButton>

                                <StyledButton
                                    active={
                                        activeDrawingMode ===
                                        window.google.maps.drawing.OverlayType
                                            .POLYGON
                                    }
                                    onClick={() =>
                                        handleDrawingMode(
                                            window.google.maps.drawing
                                                .OverlayType.POLYGON,
                                        )
                                    }
                                    disabled={isAnimating}
                                >
                                    <PolylineIcon /> Draw Area
                                </StyledButton>

                                {activeDrawingMode ===
                                    window.google.maps.drawing.OverlayType
                                        .POLYGON && (
                                    <DrawingSubmenu>
                                        <StyledButton
                                            active={
                                                selectedDrawingType ===
                                                "polygon"
                                            }
                                            onClick={() =>
                                                handleDrawingMode(
                                                    window.google.maps.drawing
                                                        .OverlayType.POLYGON,
                                                    "polygon",
                                                )
                                            }
                                        >
                                            <PolylineIcon /> Polygon
                                        </StyledButton>
                                        <StyledButton
                                            active={
                                                selectedDrawingType ===
                                                "rectangle"
                                            }
                                            onClick={() =>
                                                handleDrawingMode(
                                                    window.google.maps.drawing
                                                        .OverlayType.RECTANGLE,
                                                    "rectangle",
                                                )
                                            }
                                        >
                                            <CropSquareIcon /> Rectangle
                                        </StyledButton>
                                    </DrawingSubmenu>
                                )}
                            </DrawingButtonGroup>
                        </DrawingControlPanel>
                        <CustomMapControls>
                            <MapButton
                                onClick={() =>
                                    map?.setZoom((map.getZoom() || 0) + 1)
                                }
                            >
                                <AddIcon />
                            </MapButton>
                            <MapButton
                                onClick={() =>
                                    map?.setZoom((map.getZoom() || 0) - 1)
                                }
                            >
                                <RemoveIcon />
                            </MapButton>
                            <MapButton
                                onClick={() => {
                                    const currentTilt = map?.getTilt() || 0;
                                    map?.setTilt(currentTilt >= 45 ? 0 : 45);
                                }}
                            >
                                <ThreeDRotationIcon />
                            </MapButton>
                            <MapButton onClick={handleRotateLeft}>
                                <RotateLeftIcon />
                            </MapButton>
                            <MapButton onClick={handleRotateRight}>
                                <RotateRightIcon />
                            </MapButton>
                        </CustomMapControls>
                        <MapDetailsPanel>
                            <MapDetailItem>
                                <span>Latitude</span>
                                <span>
                                    {displayState?.center?.lat?.toFixed(6) ??
                                        "0.000000"}
                                    °
                                </span>
                            </MapDetailItem>
                            <MapDetailItem>
                                <span>Longitude</span>
                                <span>
                                    {displayState?.center?.lng?.toFixed(6) ??
                                        "0.000000"}
                                    °
                                </span>
                            </MapDetailItem>
                            <MapDetailItem>
                                <span>Zoom</span>
                                <span>
                                    {displayState?.zoom?.toFixed(1) ?? "0.0"}
                                </span>
                            </MapDetailItem>
                            <MapDetailItem>
                                <span>Tilt</span>
                                <span>
                                    {displayState?.tilt?.toFixed(1) ?? "0.0"}°
                                </span>
                            </MapDetailItem>
                            <MapDetailItem>
                                <span>Heading</span>
                                <span>
                                    {displayState?.heading?.toFixed(1) ?? "0.0"}
                                    °
                                </span>
                            </MapDetailItem>
                        </MapDetailsPanel>
                    </GoogleMap>
                </MapContainer>

                <AnimatePresence>
                    {shapeDetailsOpen && (
                        <DetailsPanel isOpen={shapeDetailsOpen}>
                            <ShapeDetailsTitle>
                                Area Details
                                <CloseButton
                                    onClick={() => setShapeDetailsOpen(false)}
                                >
                                    <CloseIcon />
                                </CloseButton>
                            </ShapeDetailsTitle>
                            <ShapeDetailsContent>
                                <TextField
                                    label="Title"
                                    value={selectedShapeDetails.title}
                                    onChange={(e) =>
                                        setSelectedShapeDetails((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    fullWidth
                                    variant="outlined"
                                />
                                <TextField
                                    label="Description"
                                    value={selectedShapeDetails.description}
                                    onChange={(e) =>
                                        setSelectedShapeDetails((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                />
                                <ImageUploadArea
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <p>Click to upload images</p>
                                    {selectedShapeDetails.images.length > 0 && (
                                        <p>
                                            {selectedShapeDetails.images.length}{" "}
                                            image(s) selected
                                        </p>
                                    )}
                                </ImageUploadArea>
                            </ShapeDetailsContent>
                            <DialogActions>
                                <Button
                                    onClick={() => setShapeDetailsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveShapeDetails}
                                    variant="contained"
                                >
                                    Save
                                </Button>
                            </DialogActions>
                        </DetailsPanel>
                    )}
                </AnimatePresence>
            </Container>
        </AppContainer>
    );
};

export default MapView;
