import React, { useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from "@react-google-maps/api";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { AnimatePresence } from "framer-motion";

// Import custom hooks
import { useMapAnimation } from './hooks/useMapAnimation';
import { useShapeManagement } from './hooks/useShapeManagement';
import { useSearch } from './hooks/useSearch';

// Import constants
import { MAP_OPTIONS, GOOGLE_MAPS_LIBRARIES, DEFAULT_SHAPE_OPTIONS, START_POSITION } from './constants/mapConstants';

// Import utils
import { saveShapesToLocalStorage, restoreShapesFromLocalStorage } from './utils/mapUtils';
import { useTheme } from '../../contexts/ThemeContext';

// Import components
import SearchBox from './components/SearchBox';
import DrawingControls from './components/DrawingControls';
import MapControls from './components/MapControls';
import DetailsPanel from './components/DetailsPanel';
import MiniPopup from './components/MiniPopup';
import ViewModeOverlay from './components/ViewModeOverlay';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import UnsavedChangesDialog from './components/UnsavedChangesDialog';

// Import styles
import {
    AppContainer,
    Container,
    MapContainer,
    LoadingOverlay,
    LoadingText,
    InfoPanel
} from './styles/MapStyles';

const MAP_STATE_KEY = 'mapViewState';

const MapView = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES,
    });

    const [map, setMap] = React.useState(null);
    const [drawingManager, setDrawingManager] = React.useState(null);
    const [displayState, setDisplayState] = React.useState(START_POSITION);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
    const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = React.useState(false);
    const updateTimeoutRef = useRef(null);
    const mapListenersRef = useRef([]);
    const location = useLocation();

    const { theme } = useTheme();

    // Update display state
    const updateDisplayState = useCallback(() => {
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(() => {
            if (!map) return;

            try {
                const center = map.getCenter();
                if (center && typeof center.lat === 'function' && typeof center.lng === 'function') {
                    const newState = {
                        center: {
                            lat: center.lat(),
                            lng: center.lng()
                        },
                        zoom: map.getZoom() || START_POSITION.zoom,
                        tilt: map.getTilt() || START_POSITION.tilt,
                        heading: map.getHeading() || START_POSITION.heading
                    };
                    setDisplayState(newState);
                    // Save state to sessionStorage
                    sessionStorage.setItem(MAP_STATE_KEY, JSON.stringify(newState));
                }
            } catch (error) {
                console.error('Error updating display state:', error);
                setDisplayState(START_POSITION);
            }
        }, 100);
    }, [map]);

    // Use custom hooks
    const {
        isAnimating,
        startAnimation,
        isAnimatingRef,
        animationFrameRef,
        animationState
    } = useMapAnimation(map, updateDisplayState);

    const {
        selectedDrawing,
        setSelectedDrawing,
        drawnShapes,
        setDrawnShapes,
        selectedShapeDetails,
        setSelectedShapeDetails,
        isEditMode,
        setIsEditMode,
        isViewMode,
        setIsViewMode,
        shapeDetailsOpen,
        setShapeDetailsOpen,
        selectedPopupPosition,
        setSelectedPopupPosition,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        handleShapeClick,
        handleOverlayComplete,
        handleSaveShapeDetails,
        handleShapeClickRef
    } = useShapeManagement(map, drawingManager);

    const {
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        searchInputRef,
        handleSearchToggle,
        handleSearch,
        handleSearchKeyDown
    } = useSearch(map);

    const handleCloseDetailsPanel = () => {
        if (hasUnsavedChanges) {
            setShowUnsavedChangesDialog(true);
        } else {
            setShapeDetailsOpen(false);
        }
    };

    const handleDeleteConfirmed = () => {
        if (selectedDrawing) {
            selectedDrawing.setMap(null);
            setDrawnShapes(prevShapes => {
                const newShapes = prevShapes.filter(shape => shape !== selectedDrawing);
                saveShapesToLocalStorage(newShapes);
                return newShapes;
            });
            setSelectedDrawing(null);
            setSelectedPopupPosition(null);
            setShowDeleteConfirmation(false);
        }
    };

    // Cleanup function
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
            if (mapListenersRef.current) {
                mapListenersRef.current.forEach(listener => {
                    window.google.maps.event.removeListener(listener);
                });
                mapListenersRef.current = [];
            }
        };
    }, []);

    // Initialize map
    const onMainMapLoad = useCallback((mapInstance) => {
        if (!mapInstance) return;

        setMap(mapInstance);
        mapInstance.setOptions({
            ...MAP_OPTIONS,
            zoomControl: false, // Disable default zoom control
            rotateControl: false,
            clickableIcons: false,
            // Add smooth zoom options
            gestureHandling: "greedy",
            zoomDuration: 500, // Smooth zoom duration
            zoomEasing: true // Enable smooth zoom
        });

        // Set initial position
        mapInstance.setCenter(START_POSITION.center);
        mapInstance.setZoom(START_POSITION.zoom);
        mapInstance.setTilt(START_POSITION.tilt);
        mapInstance.setHeading(START_POSITION.heading);

        // Initialize Drawing Manager
        const drawingManagerInstance = new window.google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: false,
            markerOptions: {
                draggable: true,
            },
            polygonOptions: {
                ...DEFAULT_SHAPE_OPTIONS,
                editable: false,
                draggable: false,
            },
        });

        drawingManagerInstance.setMap(mapInstance);
        setDrawingManager(drawingManagerInstance);

        // Add drawing complete listener
        const drawingCompleteListener = window.google.maps.event.addListener(
            drawingManagerInstance,
            'overlaycomplete',
            handleOverlayComplete
        );

        // Add to cleanup listeners
        mapListenersRef.current.push(drawingCompleteListener);

        // Add map movement listeners
        const mapListeners = [
            mapInstance.addListener('bounds_changed', updateDisplayState),
            mapInstance.addListener('tilt_changed', updateDisplayState),
            mapInstance.addListener('heading_changed', updateDisplayState),
        ];

        mapListenersRef.current = [...mapListenersRef.current, ...mapListeners];
    }, [handleOverlayComplete, updateDisplayState]);

    if (loadError) {
        return (
            <LoadingOverlay>
                <CircularProgress size={48} color="error" />
                <LoadingText>
                    Error loading map
                    <br />
                    <small style={{ opacity: 0.7 }}>
                        Please check your internet connection and API key
                    </small>
                </LoadingText>
            </LoadingOverlay>
        );
    }

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
                            ...MAP_OPTIONS,
                            rotateControl: false,
                            clickableIcons: false,
                        }}
                        onLoad={onMainMapLoad}
                        center={displayState.center}
                        zoom={displayState.zoom}
                        tilt={displayState.tilt}
                        heading={displayState.heading}
                    >
                        <SearchBox
                            isSearchOpen={isSearchOpen}
                            searchQuery={searchQuery}
                            searchInputRef={searchInputRef}
                            handleSearchToggle={handleSearchToggle}
                            handleSearchKeyDown={handleSearchKeyDown}
                            setSearchQuery={setSearchQuery}
                        />

                        <DrawingControls
                            drawingManager={drawingManager}
                            isAnimating={isAnimating}
                        />

                        <MapControls map={map} />

                        <InfoPanel theme={theme}>
                            <div className="info-item">
                                <div className="label">Latitude</div>
                                <div className="value">
                                    {displayState.center.lat.toFixed(6)}°
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="label">Longitude</div>
                                <div className="value">
                                    {displayState.center.lng.toFixed(6)}°
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="label">Zoom</div>
                                <div className="value">
                                    {displayState.zoom.toFixed(1)}x
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="label">Tilt</div>
                                <div className="value">
                                    {displayState.tilt.toFixed(1)}°
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="label">Heading</div>
                                <div className="value">
                                    {displayState.heading.toFixed(1)}°
                                </div>
                            </div>
                        </InfoPanel>

                        {selectedPopupPosition && (
                            <MiniPopup
                                position={selectedPopupPosition}
                                onView={() => setIsViewMode(true)}
                                onEdit={() => {
                                    setShapeDetailsOpen(true);
                                    setIsEditMode(true);
                                }}
                                onDelete={() => setShowDeleteConfirmation(true)}
                            />
                        )}
                    </GoogleMap>
                </MapContainer>

                <AnimatePresence>
                    {shapeDetailsOpen && (
                        <DetailsPanel
                            isOpen={shapeDetailsOpen}
                            selectedShapeDetails={selectedShapeDetails}
                            onClose={handleCloseDetailsPanel}
                            onSave={handleSaveShapeDetails}
                            onChange={setSelectedShapeDetails}
                            setHasUnsavedChanges={setHasUnsavedChanges}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isViewMode && selectedShapeDetails && (
                        <ViewModeOverlay
                            shapeDetails={selectedShapeDetails}
                            onClose={() => setIsViewMode(false)}
                        />
                    )}
                </AnimatePresence>

                <DeleteConfirmationDialog
                    open={showDeleteConfirmation}
                    onClose={() => setShowDeleteConfirmation(false)}
                    onConfirm={handleDeleteConfirmed}
                />

                <UnsavedChangesDialog
                    open={showUnsavedChangesDialog}
                    onClose={() => setShowUnsavedChangesDialog(false)}
                    onDiscard={() => {
                        setShowUnsavedChangesDialog(false);
                        setShapeDetailsOpen(false);
                        setHasUnsavedChanges(false);
                    }}
                    onSave={() => {
                        handleSaveShapeDetails();
                        setShowUnsavedChangesDialog(false);
                    }}
                />
            </Container>
        </AppContainer>
    );
};

export default MapView;

