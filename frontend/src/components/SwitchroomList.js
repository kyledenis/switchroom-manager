import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

function SwitchroomList() {
  const [selectedSwitchroom, setSelectedSwitchroom] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // TODO: Replace with actual API call
  const switchrooms = [
    {
      id: 1,
      name: 'Main Building Switchroom',
      description: 'Primary electrical distribution for main building',
      photos: ['https://via.placeholder.com/300x200'],
      location: { lat: -27.4698, lng: 153.0251 },
    },
    // Add more mock data as needed
  ];

  const handleView = (switchroom) => {
    setSelectedSwitchroom(switchroom);
    setIsDialogOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {switchrooms.map((switchroom) => (
          <Grid item xs={12} sm={6} md={4} key={switchroom.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={switchroom.photos[0]}
                alt={switchroom.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {switchroom.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {switchroom.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  size="small"
                  onClick={() => handleView(switchroom)}
                  sx={{ mr: 1 }}
                >
                  <LocationIcon />
                </IconButton>
                <IconButton size="small" sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedSwitchroom && (
          <>
            <DialogTitle>{selectedSwitchroom.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <img
                  src={selectedSwitchroom.photos[0]}
                  alt={selectedSwitchroom.name}
                  style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {selectedSwitchroom.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Location: {selectedSwitchroom.location.lat},{' '}
                  {selectedSwitchroom.location.lng}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default SwitchroomList;