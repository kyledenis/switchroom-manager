import { useState, useRef, useCallback, useEffect } from 'react';
import TWEEN from '@tweenjs/tween.js';
import {
    START_POSITION,
    MIDDLE_POSITION,
    TILT_START_POSITION,
    PRE_TILT_POSITION,
    END_POSITION,
    STAGE_DURATION,
    TILT_DURATION,
    ANIMATION_START_DELAY
} from '../constants/mapConstants';

// Animation state singleton
const animationState = {
    hasPlayed: false
};

export const useMapAnimation = (map, updateDisplayState) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const isAnimatingRef = useRef(false);
    const animationFrameRef = useRef(null);

    // Set initial map position
    useEffect(() => {
        if (map) {
            const savedState = sessionStorage.getItem('mapState');
            if (savedState) {
                const state = JSON.parse(savedState);
                map.moveCamera(state);
                updateDisplayState();
            } else {
                map.moveCamera(START_POSITION);
                updateDisplayState();
            }
        }
    }, [map, updateDisplayState]);

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

        // Cancel any existing animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        // Single animation loop for all tweens
        const animationLoop = (time) => {
            if (isAnimatingRef.current) {
                TWEEN.update(time);
                animationFrameRef.current = requestAnimationFrame(animationLoop);
            }
        };

        TWEEN.removeAll();
        let currentPosition = { ...START_POSITION.center, zoom: START_POSITION.zoom, tilt: START_POSITION.tilt, heading: START_POSITION.heading };

        // Create a single chain of tweens
        const startToMiddle = new TWEEN.Tween(currentPosition)
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
            });

        const middleToTiltStart = new TWEEN.Tween(currentPosition)
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
            });

        const tiltStartToPreTilt = new TWEEN.Tween(currentPosition)
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
            });

        const addTilt = new TWEEN.Tween(currentPosition)
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
                map.moveCamera(END_POSITION);
                console.log('Animation complete');
                isAnimatingRef.current = false;
                setIsAnimating(false);
                animationState.hasPlayed = true;
                updateDisplayState();

                // Clean up animation frame
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                    animationFrameRef.current = null;
                }
            });

        // Chain the tweens
        startToMiddle.chain(middleToTiltStart);
        middleToTiltStart.chain(tiltStartToPreTilt);
        tiltStartToPreTilt.chain(addTilt);

        // Start the animation loop and the first tween after delay
        setTimeout(() => {
            animationFrameRef.current = requestAnimationFrame(animationLoop);
            startToMiddle.start();
        }, ANIMATION_START_DELAY);
    }, [map, updateDisplayState]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            TWEEN.removeAll();
        };
    }, []);

    // Add event listeners for map movement
    useEffect(() => {
        if (!map) return;

        const events = ['bounds_changed', 'tilt_changed', 'heading_changed', 'zoom_changed'];
        const listeners = events.map(event =>
            map.addListener(event, () => {
                if (!isAnimatingRef.current) {
                    requestAnimationFrame(updateDisplayState);
                }
            })
        );

        return () => {
            listeners.forEach(listener => {
                if (listener) {
                    window.google.maps.event.removeListener(listener);
                }
            });
        };
    }, [map, updateDisplayState]);

    // Add animation start delay
    useEffect(() => {
        let timer;
        if (map && !isAnimatingRef.current && !animationState.hasPlayed) {
            timer = setTimeout(startAnimation, ANIMATION_START_DELAY);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [map, startAnimation]);

    return {
        isAnimating,
        startAnimation,
        isAnimatingRef,
        animationFrameRef,
        animationState
    };
};
