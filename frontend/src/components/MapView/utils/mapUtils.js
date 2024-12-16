import { DEFAULT_SHAPE_OPTIONS } from '../constants/mapConstants';

export const saveShapesToLocalStorage = (shapes) => {
    const shapesData = shapes.map(shape => {
        if (shape instanceof window.google.maps.Marker) {
            return {
                type: 'MARKER',
                position: {
                    lat: shape.getPosition().lat(),
                    lng: shape.getPosition().lng()
                }
            };
        } else if (shape instanceof window.google.maps.Polygon) {
            const path = shape.getPath();
            return {
                type: 'POLYGON',
                coordinates: path.getArray().map(coord => ({
                    lat: coord.lat(),
                    lng: coord.lng()
                }))
            };
        }
        return null;
    }).filter(Boolean);

    localStorage.setItem('savedShapes', JSON.stringify(shapesData));
};

export const restoreShapesFromLocalStorage = (map) => {
    const savedShapesJson = localStorage.getItem('savedShapes');
    if (!savedShapesJson) return [];

    try {
        const shapesData = JSON.parse(savedShapesJson);
        return shapesData.map(shapeData => {
            if (shapeData.type === 'MARKER') {
                return new window.google.maps.Marker({
                    position: shapeData.position,
                    map: map,
                    draggable: false
                });
            } else if (shapeData.type === 'POLYGON') {
                return new window.google.maps.Polygon({
                    paths: shapeData.coordinates,
                    map: map,
                    ...DEFAULT_SHAPE_OPTIONS,
                    editable: false,
                    draggable: false
                });
            }
            return null;
        }).filter(Boolean);
    } catch (error) {
        console.error('Error restoring shapes:', error);
        return [];
    }
};

export const highlightShape = (shape) => {
    if (shape instanceof window.google.maps.Polygon) {
        shape.setOptions({
            strokeWeight: 3,
            strokeColor: "#4CAF50",
            fillColor: "#4CAF50",
            fillOpacity: 0.3,
        });
    }
};

export const unhighlightShape = (shape) => {
    if (shape instanceof window.google.maps.Polygon) {
        shape.setOptions({
            strokeWeight: DEFAULT_SHAPE_OPTIONS.strokeWeight,
            strokeColor: DEFAULT_SHAPE_OPTIONS.strokeColor,
            fillColor: DEFAULT_SHAPE_OPTIONS.fillColor,
            fillOpacity: DEFAULT_SHAPE_OPTIONS.fillOpacity,
        });
    }
};

export const getShapeCoordinates = (shape) => {
    if (shape instanceof window.google.maps.Marker) {
        const position = shape.getPosition();
        return [position.lat(), position.lng()];
    } else if (shape instanceof window.google.maps.Polygon) {
        const path = shape.getPath();
        return path.getArray().map((latLng) => [latLng.lat(), latLng.lng()]);
    }
    return null;
};

export const addShapeListeners = (shape, selectedDrawing, setSelectedDrawing, setSelectedPopupPosition, saveShapesToLocalStorage, drawnShapes) => {
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
            shape.setOptions(DEFAULT_SHAPE_OPTIONS);
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

    // Add drag end listener to save state
    if (shape instanceof window.google.maps.Marker || shape instanceof window.google.maps.Polygon) {
        window.google.maps.event.addListener(shape, 'dragend', () => {
            saveShapesToLocalStorage(drawnShapes);
        });
    }

    // For polygons, add path change listeners
    if (shape instanceof window.google.maps.Polygon) {
        const path = shape.getPath();
        window.google.maps.event.addListener(path, 'set_at', () => {
            saveShapesToLocalStorage(drawnShapes);
        });
        window.google.maps.event.addListener(path, 'insert_at', () => {
            saveShapesToLocalStorage(drawnShapes);
        });
        window.google.maps.event.addListener(path, 'remove_at', () => {
            saveShapesToLocalStorage(drawnShapes);
        });
    }
};
