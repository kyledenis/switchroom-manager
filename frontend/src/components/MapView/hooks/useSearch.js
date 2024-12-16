import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useSearch = (map) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef(null);

    const handleSearchToggle = useCallback(() => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            // Focus the input when opening
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isSearchOpen]);

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim() || !map) return;

        const geocoder = new window.google.maps.Geocoder();
        try {
            const { results } = await geocoder.geocode({ address: searchQuery });
            if (results && results[0]) {
                const { location } = results[0].geometry;
                map.panTo(location);
                map.setZoom(18);
            }
        } catch (error) {
            toast.error("Location not found");
        }
    }, [searchQuery, map]);

    const handleSearchKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSearch();
        } else if (e.key === 'Escape') {
            setIsSearchOpen(false);
            setSearchQuery("");
            searchInputRef.current?.blur();
        }
    }, [handleSearch]);

    // Add global escape key handler
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
                setSearchQuery("");
                searchInputRef.current?.blur();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isSearchOpen]);

    return {
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        searchInputRef,
        handleSearchToggle,
        handleSearch,
        handleSearchKeyDown
    };
};
