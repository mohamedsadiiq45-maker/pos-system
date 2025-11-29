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
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  category: { name: string };
}

interface Deal {
  id: number;
  productId: number;
  product: Product;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const DealsPage = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    productId: 0,
    discount: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchDeals();
    fetchProducts();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch(`${API_URL}/api/storefront/deals`);
      const data = await res.json();
      setDeals(data);
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenDialog = (deal?: Deal) => {
    if (deal) {
      setEditingDeal(deal);
      setSelectedProduct(deal.product);
      setFormData({
        productId: deal.productId,
        discount: deal.discount,
        startDate: new Date(deal.startDate).toISOString().split('T')[0],
        endDate: new Date(deal.endDate).toISOString().split('T')[0],
        isActive: deal.isActive,
      });
    } else {
      setEditingDeal(null);
      setSelectedProduct(null);
      setFormData({
        productId: 0,
        discount: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDeal(null);
    setSelectedProduct(null);
  };

  const handleSave = async () => {
    try {
      const url = editingDeal
        ? `${API_URL}/api/storefront/deals/${editingDeal.id}`
        : `${API_URL}/api/storefront/deals`;
      const method = editingDeal ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSnackbar({ open: true, message: `Deal ${editingDeal ? 'updated' : 'created'} successfully!`, severity: 'success' });
        fetchDeals();
        handleCloseDialog();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save deal', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;

    try {
      const res = await fetch(`${API_URL}/api/storefront/deals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSnackbar({ open: true, message: 'Deal deleted successfully!', severity: 'success' });
        fetchDeals();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete deal', severity: 'error' });
    }
  };

  const handleToggleActive = async (deal: Deal) => {
    try {
      await fetch(`${API_URL}/api/storefront/deals/${deal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !deal.isActive }),
      });
      fetchDeals();
    } catch (error) {
      console.error('Error toggling deal:', error);
    }
  };

  const isDealActive = (deal: Deal) => {
    const now = new Date();
    const start = new Date(deal.startDate);
    const end = new Date(deal.endDate);
    return deal.isActive && now >= start && now <= end;
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
              Deals of the Day
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage product discounts and promotions
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Deal
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={80}>Image</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Original Price</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Sale Price</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell width={100}>Status</TableCell>
                <TableCell width={120}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No deals yet. Create your first deal!</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={deal.product.imageUrl?.startsWith('/') ? `${API_URL}${deal.product.imageUrl}` : deal.product.imageUrl || ''}
                        sx={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">{deal.product.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {deal.product.category?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>${deal.product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label={`${deal.discount}% OFF`} color="error" size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="success.main">
                        ${(deal.product.price * (1 - deal.discount / 100)).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isDealActive(deal) ? 'Active' : 'Inactive'}
                        color={isDealActive(deal) ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog(deal)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(deal.id)}>
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
        <DialogTitle>{editingDeal ? 'Edit Deal' : 'Create New Deal'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => `${option.name} - $${option.price}`}
              value={selectedProduct}
              onChange={(_, newValue) => {
                setSelectedProduct(newValue);
                setFormData({ ...formData, productId: newValue?.id || 0 });
              }}
              renderInput={(params) => <TextField {...params} label="Select Product" required />}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Avatar
                    variant="rounded"
                    src={option.imageUrl?.startsWith('/') ? `${API_URL}${option.imageUrl}` : option.imageUrl || ''}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Box>
                    <Typography>{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${option.price} - {option.category?.name}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
            <TextField
              fullWidth
              type="number"
              label="Discount Percentage"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
              InputProps={{ inputProps: { min: 1, max: 99 } }}
              helperText={selectedProduct ? `Sale price: $${(selectedProduct.price * (1 - formData.discount / 100)).toFixed(2)}` : ''}
            />
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
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
          <Button variant="contained" onClick={handleSave} disabled={!formData.productId}>
            {editingDeal ? 'Update' : 'Create'}
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

export default DealsPage;

