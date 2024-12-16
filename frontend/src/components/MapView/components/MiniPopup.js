import React from 'react';
import { OverlayView } from "@react-google-maps/api";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MiniPopupContainer, PopupButton } from '../styles/MiniPopupStyles';

const MiniPopup = ({ position, onView, onEdit, onDelete }) => {
    return (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(width, height) => ({
                x: -(width / 2),
                y: -height - 10,
            })}
        >
            <MiniPopupContainer
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
            >
                <PopupButton onClick={onView}>
                    <VisibilityIcon /> View
                </PopupButton>
                <PopupButton onClick={onEdit}>
                    <EditIcon /> Edit
                </PopupButton>
                <PopupButton onClick={onDelete}>
                    <DeleteIcon /> Delete
                </PopupButton>
            </MiniPopupContainer>
        </OverlayView>
    );
};

export default MiniPopup;
