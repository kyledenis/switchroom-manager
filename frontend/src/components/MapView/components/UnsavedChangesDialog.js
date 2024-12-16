import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const UnsavedChangesDialog = ({ open, onClose, onDiscard, onSave }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogContent>
                You have unsaved changes. Do you want to save them before closing?
            </DialogContent>
            <DialogActions>
                <Button onClick={onDiscard}>Discard</Button>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UnsavedChangesDialog;
