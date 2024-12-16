import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { DEFAULT_SHAPE_OPTIONS } from '../constants/mapConstants';
import {
    highlightShape,
    unhighlightShape,
    saveShapesToLocalStorage,
    getShapeCoordinates,
    restoreShapesFromLocalStorage
} from '../utils/mapUtils';
import api from '../../../utils/axios';

export const useShapeManagement = (map, drawingManager) => {
    const [selectedDrawing, setSelectedDrawing] = useState(null);
    const [drawnShapes, setDrawnShapes] = useState([]);
    const [selectedShapeDetails, setSelectedShapeDetails] = useState({
        title: "",
        description: "",
        images: [],
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [shapeDetailsOpen, setShapeDetailsOpen] = useState(false);
    const [selectedPopupPosition, setSelectedPopupPosition] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const handleShapeClickRef = useRef(null);

    const handleShapeClick = useCallback((shape, event) => {
        // Prevent bubbling to map click
        if (event && event.stop) {
            event.stop();
        }

        // If clicking the same shape, just update popup position
        if (selectedDrawing === shape) {
            let popupPosition;
            if (shape instanceof window.google.maps.Marker) {
                popupPosition = shape.getPosition();
            } else if (shape instanceof window.google.maps.Polygon) {
                const bounds = new window.google.maps.LatLngBounds();
                shape.getPath().forEach(coord => bounds.extend(coord));
                popupPosition = bounds.getCenter();
            }
            setSelectedPopupPosition(popupPosition);
            return;
        }

        // Deselect previous shape if any
        if (selectedDrawing) {
            unhighlightShape(selectedDrawing);
            if (selectedDrawing instanceof window.google.maps.Polygon) {
                selectedDrawing.setEditable(false);
                selectedDrawing.setDraggable(false);
            } else if (selectedDrawing instanceof window.google.maps.Marker) {
                selectedDrawing.setDraggable(false);
            }
        }

        // Select and highlight the new shape
        setSelectedDrawing(shape);
        if (shape instanceof window.google.maps.Polygon) {
            highlightShape(shape);
        }

        // Calculate popup position
        let popupPosition;
        if (shape instanceof window.google.maps.Marker) {
            popupPosition = shape.getPosition();
        } else if (shape instanceof window.google.maps.Polygon) {
            const bounds = new window.google.maps.LatLngBounds();
            shape.getPath().forEach(coord => bounds.extend(coord));
            popupPosition = bounds.getCenter();
        }

        setSelectedPopupPosition(popupPosition);

        // Reset modes but don't open details panel
        setIsEditMode(false);
        setIsViewMode(false);
        setShapeDetailsOpen(false);
    }, [selectedDrawing]);

    const handleOverlayComplete = useCallback((e) => {
        const shape = e.overlay;
        const isPolygon = shape instanceof window.google.maps.Polygon;
        const isMarker = shape instanceof window.google.maps.Marker;

        // Clear existing shapes if in polygon/rectangle mode
        if (isPolygon) {
            drawnShapes.forEach(shape => {
                if (shape instanceof window.google.maps.Polygon) {
                    shape.setMap(null);
                }
            });
            setDrawnShapes(prev => prev.filter(s => !(s instanceof window.google.maps.Polygon)));
        }

        // Set initial options
        if (isPolygon) {
            shape.setOptions({
                ...DEFAULT_SHAPE_OPTIONS,
                editable: true,
                draggable: true
            });
        } else if (isMarker) {
            shape.setOptions({
                draggable: true
            });
        }

        // Add click listener to the shape
        const clickListener = shape.addListener('click', (event) => {
            if (handleShapeClickRef.current) {
                handleShapeClickRef.current(shape, event);
            }
        });

        // Add the shape to drawnShapes
        setDrawnShapes(prev => [...prev.filter(s => !isPolygon || !(s instanceof window.google.maps.Polygon)), shape]);

        // For new drawings, automatically open edit window
        setSelectedDrawing(shape);
        setSelectedShapeDetails({
            title: "",
            description: "",
            images: []
        });
        setShapeDetailsOpen(true);
        setIsEditMode(true);
        setHasUnsavedChanges(true);

        // Reset drawing mode immediately
        if (drawingManager) {
            drawingManager.setDrawingMode(null);
        }

        // Save to localStorage to persist after refresh
        saveShapesToLocalStorage([...drawnShapes, shape]);

        return () => {
            if (clickListener) {
                window.google.maps.event.removeListener(clickListener);
            }
        };
    }, [drawingManager, drawnShapes]);

    const handleSaveShapeDetails = async () => {
        try {
            if (!selectedDrawing) {
                toast.error("No shape selected");
                return;
            }

            if (!selectedShapeDetails.title.trim()) {
                toast.error("Please enter a title");
                return;
            }

            const shapeData = {
                name: selectedShapeDetails.title,
                description: selectedShapeDetails.description,
                area_type: selectedDrawing instanceof window.google.maps.Marker ? "POINT" : "POLYGON",
                coordinates: getShapeCoordinates(selectedDrawing),
            };

            const formData = new FormData();
            Object.keys(shapeData).forEach((key) => {
                formData.append(key, key === "coordinates" ? JSON.stringify(shapeData[key]) : shapeData[key]);
            });

            if (selectedShapeDetails.images) {
                selectedShapeDetails.images.forEach((image) => {
                    if (image instanceof File) {
                        formData.append("photos", image);
                    }
                });
            }

            const response = await (selectedShapeDetails.id
                ? api.put(`/api/switchrooms/${selectedShapeDetails.id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                : api.post("/api/switchrooms/", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }));

            // Update local state
            const updatedShape = {
                ...selectedDrawing,
                id: response.data.id,
                details: {
                    title: response.data.name,
                    description: response.data.description,
                    images: response.data.photos || [],
                },
            };

            setDrawnShapes(prev => {
                const filtered = prev.filter(s => s !== selectedDrawing);
                return [...filtered, updatedShape];
            });

            setSelectedShapeDetails({
                id: response.data.id,
                title: response.data.name,
                description: response.data.description,
                images: response.data.photos || [],
            });

            setHasUnsavedChanges(false);
            setShapeDetailsOpen(false);
            toast.success(selectedShapeDetails.id ? "Changes saved successfully" : "Area saved successfully");

            // Reset edit mode
            if (selectedDrawing instanceof window.google.maps.Polygon) {
                selectedDrawing.setEditable(false);
                selectedDrawing.setDraggable(false);
            } else if (selectedDrawing instanceof window.google.maps.Marker) {
                selectedDrawing.setDraggable(false);
            }
            setIsEditMode(false);

            // Save to localStorage
            saveShapesToLocalStorage(drawnShapes);
        } catch (error) {
            console.error("Error saving shape:", error);
            toast.error(selectedShapeDetails.id ? "Failed to save changes" : "Failed to save area");
        }
    };

    // Load saved shapes when map is ready
    useEffect(() => {
        if (map) {
            try {
                // Clear existing shapes
                drawnShapes.forEach(shape => shape.setMap(null));

                // Load and restore shapes
                const savedShapes = restoreShapesFromLocalStorage(map);
                savedShapes.forEach(shape => {
                    // Add click listeners to restored shapes
                    if (shape instanceof window.google.maps.Polygon || shape instanceof window.google.maps.Marker) {
                        shape.addListener('click', (e) => handleShapeClick(e, shape));
                    }
                    shape.setMap(map);
                });
                setDrawnShapes(savedShapes);
            } catch (error) {
                console.error('Error loading saved shapes:', error);
            }
        }
    }, [map]);

    return {
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
    };
};
