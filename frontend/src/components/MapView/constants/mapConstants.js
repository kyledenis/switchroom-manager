// Map position constants
export const START_POSITION = {
    center: {
        lat: -28.263778,
        lng: 134.402009,
    },
    zoom: 4,
    tilt: 0,
    heading: 0,
};

export const MIDDLE_POSITION = {
    center: {
        lat: -37.899874,
        lng: 144.943917,
    },
    zoom: 10,
    tilt: 0,
    heading: 0,
};

export const TILT_START_POSITION = {
    center: {
        lat: -37.818443,
        lng: 144.787437,
    },
    zoom: 14,
    tilt: 0,
    heading: 0,
};

export const PRE_TILT_POSITION = {
    center: {
        lat: -37.831958,
        lng: 144.788857,
    },
    zoom: 18,
    tilt: 0,
    heading: 0,
};

export const END_POSITION = {
    center: {
        lat: -37.831958,
        lng: 144.788857,
    },
    zoom: 18,
    tilt: 45,
    heading: 0,
};

// Animation durations
export const STAGE_DURATION = 4000; // 4 seconds per main stage
export const TILT_DURATION = 3000; // 3 seconds for just the tilt
export const ANIMATION_START_DELAY = 2000; // 2 second delay before animation starts

// Map options
export const MAP_OPTIONS = {
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
            stylers: [{ visibility: "on" }],
        },
    ],
    disableDefaultUI: true,
};

// Shape options
export const DEFAULT_SHAPE_OPTIONS = {
    fillColor: "#2196f3",
    fillOpacity: 0.3,
    strokeColor: "#000000",
    strokeWeight: 2,
    clickable: true,
    editable: false,
    draggable: false,
    geodesic: true,
};

// Libraries
export const GOOGLE_MAPS_LIBRARIES = ["drawing", "places"];
