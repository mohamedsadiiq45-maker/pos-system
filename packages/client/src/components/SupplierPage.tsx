import {
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Avatar,
  Grid,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as SupplierIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Inventory as ProductIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Supplier {
  id: number;
  name: string;
  contact?: string;
  email?: string;
  address?: string;
  _count?: {
    products: number;
  };
}

function SupplierPage() {
  const { hasPermission } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const canAdd = hasPermission('addSupplier');
  const canEdit = hasPermission('editSupplier');
  const canDelete = hasPermission('deleteSupplier');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const response = await fetch('http://localhost:3001/api/suppliers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setSuppliers(data);
    }
  };

  const handleDelete = async () => {
    if (!selectedSupplier) return;

    const response = await fetch(`http://localhost:3001/api/suppliers/${selectedSupplier.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      setSuppliers(suppliers.filter((supplier) => supplier.id !== selectedSupplier.id));
      setDeleteDialogOpen(false);
      setSelectedSupplier(null);
    } else {
      const error = await response.json();
      alert(error.message || 'Failed to delete supplier');
    }
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalSuppliers = suppliers.length;
  const suppliersWithProducts = suppliers.filter((s) => s._count && s._count.products > 0).length;
  const totalProducts = suppliers.reduce((sum, s) => sum + (s._count?.products || 0), 0);

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Contact', 'Email', 'Address', 'Products'];
    const rows = filteredSuppliers.map((s) => [
      s.id,
      s.name,
      s.contact || '',
      s.email || '',
      s.address || '',
      s._count?.products || 0,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suppliers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#ff6b35', '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#00bcd4', '#e91e63'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Suppliers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboard • Suppliers
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportToCSV}>
            Export
          </Button>
          {canAdd && (
            <Button
              variant="contained"
              color="warning"
              startIcon={<AddIcon />}
              component={Link}
              to="/suppliers/new"
            >
              Add Supplier
            </Button>
          )}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
                <SupplierIcon sx={{ color: 'warning.main', fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Suppliers
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalSuppliers}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                <BusinessIcon sx={{ color: 'success.main', fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Active Suppliers
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {suppliersWithProducts}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  with products
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                <ProductIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Products Supplied
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalProducts}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search suppliers by name, phone or email..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 350 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            Showing {filteredSuppliers.length} of {totalSuppliers} suppliers
          </Typography>
        </Box>
      </Paper>

      {/* Suppliers Table */}
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Products
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <SupplierIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No suppliers found
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Add your first supplier to get started
                    </Typography>
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<AddIcon />}
                      component={Link}
                      to="/suppliers/new"
                      sx={{ mt: 2 }}
                    >
                      Add Supplier
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            bgcolor: getAvatarColor(supplier.name),
                            width: 44,
                            height: 44,
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(supplier.name)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="600">{supplier.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {supplier.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {supplier.contact ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">{supplier.contact}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          No phone
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {supplier.email ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">{supplier.email}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          No email
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {supplier.address ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                            {supplier.address}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          No address
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${supplier._count?.products || 0} products`}
                        size="small"
                        color={supplier._count?.products ? 'primary' : 'default'}
                        variant={supplier._count?.products ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setViewDialogOpen(true);
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {canEdit && (
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            component={Link}
                            to={`/suppliers/edit/${supplier.id}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canDelete && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectedSupplier(supplier);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Supplier Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: selectedSupplier ? getAvatarColor(selectedSupplier.name) : 'grey',
                width: 56,
                height: 56,
                fontWeight: 600,
                fontSize: '1.25rem',
              }}
            >
              {selectedSupplier ? getInitials(selectedSupplier.name) : ''}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedSupplier?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Supplier ID: {selectedSupplier?.id}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedSupplier && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Contact Information
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <PhoneIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Phone
                            </Typography>
                            <Typography>
                              {selectedSupplier.contact || 'Not provided'}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <EmailIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Email
                            </Typography>
                            <Typography>
                              {selectedSupplier.email || 'Not provided'}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <LocationIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Address
                            </Typography>
                            <Typography>
                              {selectedSupplier.address || 'Not provided'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      bgcolor: 'primary.light',
                      borderColor: 'primary.main',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ProductIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                        <Box>
                          <Typography variant="body2" color="primary.dark">
                            Products Supplied
                          </Typography>
                          <Typography variant="h4" fontWeight="bold" color="primary.dark">
                            {selectedSupplier._count?.products || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewDialogOpen(false)} variant="outlined">
            Close
          </Button>
          {canEdit && (
            <Button
              component={Link}
              to={`/suppliers/edit/${selectedSupplier?.id}`}
              variant="contained"
              color="warning"
              startIcon={<EditIcon />}
            >
              Edit Supplier
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Supplier</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedSupplier?.name}</strong>?
          </Typography>
          {selectedSupplier?._count?.products && selectedSupplier._count.products > 0 && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'error.light',
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="error.dark">
                ⚠️ This supplier has {selectedSupplier._count.products} product(s) assigned.
                You cannot delete suppliers with products.
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={selectedSupplier?._count?.products ? selectedSupplier._count.products > 0 : false}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SupplierPage;
