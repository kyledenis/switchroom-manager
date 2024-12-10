import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoadScript } from '@react-google-maps/api';
import axios from 'axios';

const ListContainer = styled.div`
    max-width: 1200px;
    margin: 0 16px;
    padding: 0;
`;

const SwitchroomCard = styled.div`
    background: rgba(28, 28, 30, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    margin-bottom: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const MiniMapContainer = styled.div`
    width: 240px;
    height: 180px;
    flex-shrink: 0;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    margin: 12px;

    @media (max-width: 768px) {
        width: calc(100% - 24px);
        height: 200px;
    }
`;

const ContentContainer = styled.div`
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h3`
    margin: 0 0 8px 0;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.025em;
`;

const Description = styled.p`
    margin: 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    line-height: 1.4;
`;

const PhotosContainer = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 16px;
    overflow-x: auto;
    padding-bottom: 12px;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }
`;

const PhotoThumbnail = styled.div`
    width: 100px;
    height: 100px;
    flex-shrink: 0;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.05);
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &:hover::after {
        content: 'View';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 8px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        backdrop-filter: blur(4px);
    }
`;

const PhotoModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    max-width: 90%;
    max-height: 90%;
    position: relative;
    border-radius: 16px;
    overflow: hidden;

    img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 16px;
    }

    button {
        position: absolute;
        top: 16px;
        right: 16px;
        background: rgba(0, 0, 0, 0.6);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        backdrop-filter: blur(4px);
        transition: all 0.2s ease;

        &:hover {
            background: rgba(0, 0, 0, 0.8);
            transform: scale(1.1);
        }
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    background: rgba(28, 28, 30, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    margin: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff;
    font-weight: 500;
`;

const ErrorContainer = styled(LoadingContainer)`
    color: #ff453a;
`;

const libraries = ['places'];

function SwitchroomList() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const miniMapRefs = useRef(new Map());
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded) {
            fetchAreas();
        }
    }, [isLoaded]);

    const fetchAreas = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/switchrooms/');
            console.log('Fetched switchrooms:', response.data);
            setAreas(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching areas:', error);
            setError('Failed to load switchrooms. Please try again later.');
            toast.error('Failed to load switchrooms');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoaded) return;

        // Initialize mini maps after areas are loaded
        areas.forEach(area => {
            const mapElement = document.getElementById(`mini-map-${area.id}`);
            if (!mapElement || miniMapRefs.current.has(area.id)) return;

            const map = new window.google.maps.Map(mapElement, {
                zoom: 19,
                mapTypeId: 'satellite',
                disableDefaultUI: true,
                gestureHandling: 'none'
            });

            if (area.area_type === 'POINT') {
                const marker = new window.google.maps.Marker({
                    position: { lat: area.coordinates[0], lng: area.coordinates[1] },
                    map: map
                });
                map.setCenter({ lat: area.coordinates[0], lng: area.coordinates[1] });
            } else if (area.area_type === 'POLYGON' && area.coordinates.length > 0) {
                const bounds = new window.google.maps.LatLngBounds();
                const path = area.coordinates.map(coord => {
                    const point = { lat: coord[0], lng: coord[1] };
                    bounds.extend(point);
                    return point;
                });

                new window.google.maps.Polygon({
                    paths: path,
                    map: map,
                    fillColor: '#2196f3',
                    fillOpacity: 0.3,
                    strokeWeight: 2
                });

                map.fitBounds(bounds);
            }

            miniMapRefs.current.set(area.id, map);
        });

        return () => {
            miniMapRefs.current.clear();
        };
    }, [areas, isLoaded]);

    const handleCardClick = (area) => {
        navigate('/', { state: { selectedArea: area } });
    };

    const getFullImageUrl = (photo) => {
        if (!photo || !photo.image) return '';
        const imageUrl = photo.image;
        if (imageUrl.startsWith('http')) return imageUrl;
        return `http://localhost:8000${imageUrl}`;
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps...</div>;
    }

    if (loading) {
        return <div>Loading switchrooms...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <ListContainer>
            {areas.map(area => (
                <SwitchroomCard key={area.id} onClick={() => handleCardClick(area)}>
                    <MiniMapContainer id={`mini-map-${area.id}`} />
                    <ContentContainer>
                        <Title>{area.name}</Title>
                        <Description>{area.description}</Description>
                        <PhotosContainer>
                            {area.photos.map((photo, index) => (
                                <PhotoThumbnail
                                    key={photo.id || index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPhoto(getFullImageUrl(photo));
                                    }}
                                >
                                    <img
                                        src={getFullImageUrl(photo)}
                                        alt={`${area.name} - Photo ${index + 1}`}
                                        onError={(e) => {
                                            console.error('Error loading image:', photo);
                                            e.target.src = 'https://via.placeholder.com/80?text=Error';
                                        }}
                                    />
                                </PhotoThumbnail>
                            ))}
                        </PhotosContainer>
                    </ContentContainer>
                </SwitchroomCard>
            ))}
            {selectedPhoto && (
                <PhotoModal onClick={() => setSelectedPhoto(null)}>
                    <ModalContent>
                        <button onClick={() => setSelectedPhoto(null)}>×</button>
                        <img src={selectedPhoto} alt="Full size" />
                    </ModalContent>
                </PhotoModal>
            )}
        </ListContainer>
    );
}

export default SwitchroomList;
