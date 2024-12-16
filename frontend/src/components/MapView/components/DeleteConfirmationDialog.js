import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                Are you sure you want to delete this item?
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} color="error">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
