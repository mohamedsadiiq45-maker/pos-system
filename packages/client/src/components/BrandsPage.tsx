import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

interface Brand {
  id: number;
  name: string;
  logoUrl: string;
  link: string | null;
  isActive: boolean;
  order: number;
}

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    link: '',
    isActive: true,
    order: 0,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${API_URL}/api/storefront/brands`);
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleOpenDialog = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        logoUrl: brand.logoUrl,
        link: brand.link || '',
        isActive: brand.isActive,
        order: brand.order,
      });
    } else {
      setEditingBrand(null);
      setFormData({
        name: '',
        logoUrl: '',
        link: '',
        isActive: true,
        order: brands.length,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBrand(null);
  };

  const handleSave = async () => {
    try {
      const url = editingBrand
        ? `${API_URL}/api/storefront/brands/${editingBrand.id}`
        : `${API_URL}/api/storefront/brands`;
      const method = editingBrand ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSnackbar({ open: true, message: `Brand ${editingBrand ? 'updated' : 'created'} successfully!`, severity: 'success' });
        fetchBrands();
        handleCloseDialog();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save brand', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;

    try {
      const res = await fetch(`${API_URL}/api/storefront/brands/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSnackbar({ open: true, message: 'Brand deleted successfully!', severity: 'success' });
        fetchBrands();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete brand', severity: 'error' });
    }
  };

  const handleToggleActive = async (brand: Brand) => {
    try {
      await fetch(`${API_URL}/api/storefront/brands/${brand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brand, isActive: !brand.isActive }),
      });
      fetchBrands();
    } catch (error) {
      console.error('Error toggling brand:', error);
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
              Brand Partners
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage brand logos displayed on your store
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Brand
        </Button>
      </Box>

      {brands.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No brands yet. Add your first brand partner!
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Add Brand
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {brands.map((brand) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={brand.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: brand.isActive ? 1 : 0.6 }}>
                <Box
                  sx={{
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                    p: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={brand.logoUrl.startsWith('/') ? `${API_URL}${brand.logoUrl}` : brand.logoUrl}
                    alt={brand.name}
                    sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e: any) => { e.target.src = '/placeholder.svg'; }}
                  />
                </Box>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="medium">
                      {brand.name}
                    </Typography>
                    {!brand.isActive && <Chip label="Inactive" size="small" />}
                  </Box>
                  {brand.link && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <LinkIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {brand.link}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={brand.isActive}
                        onChange={() => handleToggleActive(brand)}
                        size="small"
                      />
                    }
                    label="Active"
                  />
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog(brand)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(brand.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Brand Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Logo URL"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              required
              helperText="Use /uploads/filename.jpg for uploaded images or a full URL"
            />
            <TextField
              fullWidth
              label="Website Link (optional)"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://brand-website.com"
            />
            <TextField
              fullWidth
              type="number"
              label="Display Order"
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
          <Button variant="contained" onClick={handleSave} disabled={!formData.name || !formData.logoUrl}>
            {editingBrand ? 'Update' : 'Create'}
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

export default BrandsPage;

