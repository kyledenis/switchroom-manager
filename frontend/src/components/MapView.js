import React, { useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Box, Paper, Fab, Dialog, TextField, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix Leaflet icon issues
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photos: [],
  });

  const handleCreate = (e) => {
    const layer = e.layer;
    setSelectedArea(layer);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    // TODO: Send data to backend
    console.log('Submitting:', {
      ...formData,
      coordinates: selectedArea.toGeoJSON(),
    });
    setIsDialogOpen(false);
    setFormData({ name: '', description: '', photos: [] });
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', position: 'relative' }}>
      <Paper elevation={3} sx={{ height: '100%', overflow: 'hidden' }}>
        <MapContainer
          center={[-27.4698, 153.0251]} // Brisbane coordinates
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleCreate}
              draw={{
                rectangle: true,
                polygon: true,
                circle: false,
                circlemarker: false,
                marker: true,
                polyline: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </Paper>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <Box sx={{ p: 3, minWidth: 400 }}>
          <TextField
            fullWidth
            label="Switchroom Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, photos: Array.from(e.target.files) })
            }
            style={{ marginTop: 16 }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => setIsDialogOpen(false)}
              sx={{ mr: 1 }}
              color="inherit"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

export default MapView;