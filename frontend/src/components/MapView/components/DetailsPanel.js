import React, { useState, useCallback, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DialogActions } from '@mui/material';
import {
    DetailsPanelContainer,
    DetailsPanelTitle,
    DetailsPanelContent,
    CloseButton,
    ImageUploadArea
} from '../styles/DetailsPanelStyles';

const DetailsPanel = ({
    isOpen,
    selectedShapeDetails,
    onClose,
    onSave,
    onChange,
    setHasUnsavedChanges
}) => {
    const fileInputRef = useRef(null);
    const { theme } = useTheme();

    const handleTitleChange = (e) => {
        onChange(prev => ({
            ...prev,
            title: e.target.value
        }));
        setHasUnsavedChanges(true);
    };

    const handleDescriptionChange = (e) => {
        onChange(prev => ({
            ...prev,
            description: e.target.value
        }));
        setHasUnsavedChanges(true);
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        onChange(prev => ({
            ...prev,
            images: [...prev.images, ...files],
        }));
        setHasUnsavedChanges(true);
    };

    return (
        <DetailsPanelContainer isOpen={isOpen} theme={theme}>
            <DetailsPanelTitle theme={theme}>
                Area Details
                <CloseButton onClick={onClose} theme={theme}>
                    <CloseIcon />
                </CloseButton>
            </DetailsPanelTitle>
            <DetailsPanelContent theme={theme}>
                <TextField
                    label="Title"
                    value={selectedShapeDetails.title}
                    onChange={handleTitleChange}
                    fullWidth
                    variant="outlined"
                    required
                />
                <TextField
                    label="Description"
                    value={selectedShapeDetails.description}
                    onChange={handleDescriptionChange}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                />
                <ImageUploadArea
                    onClick={() => fileInputRef.current?.click()}
                    theme={theme}
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
            </DetailsPanelContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={onSave}
                    variant="contained"
                    color="primary"
                >
                    Save
                </Button>
            </DialogActions>
        </DetailsPanelContainer>
    );
};

export default DetailsPanel;
