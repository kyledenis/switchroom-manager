import React from 'react';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
    FullPagePopup,
    FullPageContent,
    FullPageHeader,
    FullPageTitle,
    FullPageDescription,
    ImageGrid,
    ImageContainer,
    CloseButton
} from '../styles/ViewModeStyles';

const ViewModeOverlay = ({ shapeDetails, onClose }) => {
    return (
        <FullPagePopup
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <FullPageContent>
                <FullPageHeader>
                    <FullPageTitle>{shapeDetails.title || 'Untitled Area'}</FullPageTitle>
                    <CloseButton onClick={onClose}>
                        <FullscreenExitIcon />
                    </CloseButton>
                </FullPageHeader>

                <FullPageDescription>
                    {shapeDetails.description || 'No description available.'}
                </FullPageDescription>

                {shapeDetails.images && shapeDetails.images.length > 0 && (
                    <ImageGrid>
                        {shapeDetails.images.map((image, index) => (
                            <ImageContainer key={index}>
                                <img
                                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                    alt={`Image ${index + 1}`}
                                />
                            </ImageContainer>
                        ))}
                    </ImageGrid>
                )}
            </FullPageContent>
        </FullPagePopup>
    );
};

export default ViewModeOverlay;
