import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoadScript } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import api from '../utils/axios';
import { useTheme } from '../contexts/ThemeContext';
import LoadingScreen from './common/LoadingScreen';

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    text-align: center;
    gap: 12px;
`;

const ListContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
`;

const SwitchroomCard = styled(motion.div)`
    background: ${props => props.theme === 'dark' ? '#1c1c1e' : '#ffffff'};
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 16px;
    margin-bottom: 16px;
    display: flex;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${props => props.theme === 'dark' ? '#2c2c2e' : '#f5f5f5'};
        transform: translateY(-2px);
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
    background: ${props => props.theme === 'dark' ? '#2c2c2e' : '#f5f5f5'};

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
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.025em;
`;

const Description = styled.p`
    margin: 0;
    color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
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
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
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
    background: ${props => props.theme === 'dark' ? '#2c2c2e' : '#f5f5f5'};

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
        background: rgba(0, 0, 0, 0.7);
        color: white;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        backdrop-filter: blur(4px);
    }
`;

const CardActions = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 16px;
`;

const ActionButton = styled.button`
    background: ${props => props.theme === 'dark' ? '#2c2c2e' : '#f5f5f5'};
    border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 8px;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    padding: 8px 16px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: ${props => props.theme === 'dark' ? '#3c3c3e' : '#e0e0e0'};
    }

    &.delete {
        color: #ff453a;
        border-color: rgba(255, 69, 58, 0.2);
        background: rgba(255, 69, 58, 0.1);

        &:hover {
            background: rgba(255, 69, 58, 0.2);
        }
    }
`;

const StyledDialog = styled(Dialog)`
    .MuiDialog-paper {
        background: ${props => props.theme === 'dark' ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
        color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
        border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    }

    .MuiDialogTitle-root {
        background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    }

    .MuiDialogContent-root {
        color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'};
    }

    .MuiButton-root {
        color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    }

    .MuiButton-contained {
        background: ${props => props.theme === 'dark' ? '#2c2c2e' : '#f5f5f5'};

        &:hover {
            background: ${props => props.theme === 'dark' ? '#3c3c3e' : '#e0e0e0'};
        }

        &.delete {
            background: #ff453a;
            color: white;

            &:hover {
                background: #ff3b2f;
            }
        }
    }
`;

function SwitchroomList() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['drawing', 'places'],
    });

    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [areaToDelete, setAreaToDelete] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const { theme } = useTheme();
    const navigate = useNavigate();
    const miniMapRefs = useRef(new Map());

    useEffect(() => {
        if (isLoaded) {
            fetchAreas();
        }
    }, [isLoaded]);

    const fetchAreas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/switchrooms/');
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
        navigate('/', {
            state: {
                selectedArea: area,
                fromList: true
            }
        });
    };

    const getFullImageUrl = (photo) => {
        if (!photo || !photo.image) return '';
        const imageUrl = photo.image;
        if (imageUrl.startsWith('http')) return imageUrl;
        return imageUrl;
    };

    const handleDeleteClick = (e, area) => {
        e.stopPropagation();
        setAreaToDelete(area);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!areaToDelete) return;

        try {
            await api.delete(`/api/switchrooms/${areaToDelete.id}/`);
            toast.success('Area deleted successfully');
            setAreas(areas.filter(area => area.id !== areaToDelete.id));
        } catch (error) {
            console.error('Error deleting area:', error);
            toast.error('Failed to delete area');
        }

        setDeleteDialogOpen(false);
        setAreaToDelete(null);
    };

    if (loadError) {
        return (
            <ErrorContainer>
                <div>Error loading maps</div>
                <div style={{ fontSize: '14px', opacity: 0.7 }}>Please check your internet connection and try again</div>
            </ErrorContainer>
        );
    }

    if (!isLoaded) {
        return <LoadingScreen message="Loading maps..." subMessage="This may take a few moments" />;
    }

    if (loading) {
        return <LoadingScreen message="Loading switchrooms..." subMessage="Fetching data from server" />;
    }

    if (error) {
        return <LoadingScreen message={error} subMessage="Please try again later" />;
    }

    return (
        <ListContainer>
            {areas.map(area => (
                <SwitchroomCard
                    key={area.id}
                    onClick={() => handleCardClick(area)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    theme={theme}
                >
                    <MiniMapContainer id={`mini-map-${area.id}`} theme={theme} />
                    <ContentContainer>
                        <Title theme={theme}>{area.name}</Title>
                        <Description theme={theme}>{area.description}</Description>
                        {area.photos && area.photos.length > 0 && (
                            <PhotosContainer theme={theme}>
                                {area.photos.map((photo, index) => (
                                    <PhotoThumbnail
                                        key={photo.id || index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPhoto(getFullImageUrl(photo));
                                        }}
                                        theme={theme}
                                    >
                                        <img
                                            src={getFullImageUrl(photo)}
                                            alt={`${area.name} - Photo ${index + 1}`}
                                            onError={(e) => {
                                                console.error('Error loading image:', photo);
                                                e.target.src = 'https://via.placeholder.com/100?text=Error';
                                            }}
                                        />
                                    </PhotoThumbnail>
                                ))}
                            </PhotosContainer>
                        )}
                        <CardActions>
                            <ActionButton
                                onClick={(e) => handleDeleteClick(e, area)}
                                className="delete"
                                theme={theme}
                            >
                                <DeleteIcon /> Delete
                            </ActionButton>
                        </CardActions>
                    </ContentContainer>
                </SwitchroomCard>
            ))}

            <StyledDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                theme={theme}
            >
                <DialogTitle>Delete Area</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this area? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        className="delete"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </StyledDialog>
        </ListContainer>
    );
}

export default SwitchroomList;
