import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

interface Slider {
  id: number;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  imageUrl: string;
  isActive: boolean;
  order: number;
}

const SlidersPage = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    imageUrl: '',
    isActive: true,
    order: 0,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/storefront/sliders`);
      const data = await res.json();
      setSliders(data);
    } catch (error) {
      console.error('Error fetching sliders:', error);
    }
  };

  const handleOpenDialog = (slider?: Slider) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData({
        title: slider.title,
        subtitle: slider.subtitle || '',
        buttonText: slider.buttonText || '',
        buttonLink: slider.buttonLink || '',
        imageUrl: slider.imageUrl,
        isActive: slider.isActive,
        order: slider.order,
      });
    } else {
      setEditingSlider(null);
      setFormData({
        title: '',
        subtitle: '',
        buttonText: '',
        buttonLink: '',
        imageUrl: '',
        isActive: true,
        order: sliders.length,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSlider(null);
  };

  const handleSave = async () => {
    try {
      const url = editingSlider
        ? `${API_URL}/api/storefront/sliders/${editingSlider.id}`
        : `${API_URL}/api/storefront/sliders`;
      const method = editingSlider ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSnackbar({ open: true, message: `Slider ${editingSlider ? 'updated' : 'created'} successfully!`, severity: 'success' });
        fetchSliders();
        handleCloseDialog();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save slider', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this slider?')) return;

    try {
      const res = await fetch(`${API_URL}/api/storefront/sliders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSnackbar({ open: true, message: 'Slider deleted successfully!', severity: 'success' });
        fetchSliders();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete slider', severity: 'error' });
    }
  };

  const handleToggleActive = async (slider: Slider) => {
    try {
      await fetch(`${API_URL}/api/storefront/sliders/${slider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...slider, isActive: !slider.isActive }),
      });
      fetchSliders();
    } catch (error) {
      console.error('Error toggling slider:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={Link} to="/storefront">
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Hero Sliders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage homepage carousel banners
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Slider
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50}>#</TableCell>
                <TableCell width={80}>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Subtitle</TableCell>
                <TableCell>Button</TableCell>
                <TableCell width={100}>Status</TableCell>
                <TableCell width={120}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sliders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No sliders yet. Add your first slider!</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sliders.map((slider, index) => (
                  <TableRow key={slider.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={slider.imageUrl.startsWith('/') ? `${API_URL}${slider.imageUrl}` : slider.imageUrl}
                        sx={{ width: 60, height: 40 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">{slider.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                        {slider.subtitle || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {slider.buttonText ? (
                        <Chip label={slider.buttonText} size="small" variant="outlined" />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={slider.isActive}
                        onChange={() => handleToggleActive(slider)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog(slider)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(slider.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSlider ? 'Edit Slider' : 'Add New Slider'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
              helperText="Use /uploads/filename.jpg for uploaded images or a full URL"
            />
            <TextField
              fullWidth
              label="Button Text"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              placeholder="Shop Now"
            />
            <TextField
              fullWidth
              label="Button Link"
              value={formData.buttonLink}
              onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
              placeholder="/products"
            />
            <TextField
              fullWidth
              type="number"
              label="Order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!formData.title || !formData.imageUrl}>
            {editingSlider ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SlidersPage;

