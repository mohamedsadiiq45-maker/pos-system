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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  LocalShipping as SupplierIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Warning as LowStockIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  cost: number;
  quantity: number;
  imageUrl?: string;
  category: {
    id: number;
    name: string;
  };
  supplier: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

function ProductPage() {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const canAdd = hasPermission('addProduct');
  const canEdit = hasPermission('editProduct');
  const canDelete = hasPermission('deleteProduct');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('http://localhost:3001/api/products', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setProducts(data);
    }
  };

  const fetchCategories = async () => {
    const response = await fetch('http://localhost:3001/api/categories', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setCategories(data);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    const response = await fetch(`http://localhost:3001/api/products/${selectedProduct.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      setProducts(products.filter((product) => product.id !== selectedProduct.id));
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    } else {
      alert('Failed to delete product');
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category?.id?.toString() === categoryFilter;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'instock' && product.quantity >= 10) ||
      (stockFilter === 'low' && product.quantity > 0 && product.quantity < 10) ||
      (stockFilter === 'out' && product.quantity === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const lowStockCount = products.filter((p) => p.quantity > 0 && p.quantity < 10).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' };
    if (quantity < 10) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Price', 'Cost', 'Quantity', 'Supplier', 'Value'];
    const rows = filteredProducts.map((p) => [
      p.id,
      p.name,
      p.category?.name || 'N/A',
      p.price,
      p.cost || 0,
      p.quantity,
      p.supplier?.name || 'N/A',
      p.price * p.quantity,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboard • Products
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
          >
            Export
          </Button>
          {canAdd && (
            <Button
              variant="contained"
              color="warning"
              startIcon={<AddIcon />}
              component={Link}
              to="/products/new"
            >
              Add Product
            </Button>
          )}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                <InventoryIcon sx={{ color: 'primary.main' }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Products</Typography>
                <Typography variant="h5" fontWeight="bold">{totalProducts}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48 }}>
                <CategoryIcon sx={{ color: 'warning.main' }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Categories</Typography>
                <Typography variant="h5" fontWeight="bold">{categories.length}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: lowStockCount > 0 ? 'warning.light' : undefined }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                <LowStockIcon sx={{ color: 'white' }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color={lowStockCount > 0 ? 'warning.dark' : 'text.secondary'}>
                  Low Stock
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={lowStockCount > 0 ? 'warning.dark' : undefined}>
                  {lowStockCount}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                <SupplierIcon sx={{ color: 'success.main' }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Value</Typography>
                <Typography variant="h6" fontWeight="bold">{totalValue.toLocaleString()} DJF</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search products..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id.toString()}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Stock Status</InputLabel>
            <Select
              value={stockFilter}
              label="Stock Status"
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="instock">In Stock</MenuItem>
              <MenuItem value="low">Low Stock</MenuItem>
              <MenuItem value="out">Out of Stock</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            Showing {filteredProducts.length} of {totalProducts} products
          </Typography>
        </Box>
      </Paper>

      {/* Products Table */}
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Cost</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Stock</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <InventoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No products found</Typography>
                    <Typography variant="body2" color="text.disabled">
                      Try adjusting your search or filters
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.quantity);
                  const profit = product.price - (product.cost || 0);
                  const profitMargin = product.cost ? ((profit / product.cost) * 100).toFixed(0) : 0;
                  
                  return (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            variant="rounded"
                            src={product.imageUrl?.startsWith('/uploads')
                              ? `http://localhost:3001${product.imageUrl}`
                              : product.imageUrl}
                            sx={{ width: 48, height: 48, bgcolor: 'action.selected' }}
                          >
                            {product.name[0]}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="500">{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {product.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.category?.name || 'N/A'}
                          size="small"
                          variant="outlined"
                          icon={<CategoryIcon />}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="600">{product.price.toLocaleString()} DJF</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {(product.cost || 0).toLocaleString()} DJF
                        </Typography>
                        {product.cost > 0 && (
                          <Typography variant="caption" color="success.main">
                            +{profitMargin}% margin
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          fontWeight="600"
                          color={product.quantity === 0 ? 'error.main' : product.quantity < 10 ? 'warning.main' : 'text.primary'}
                        >
                          {product.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={stockStatus.label}
                          size="small"
                          color={stockStatus.color as any}
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {product.supplier?.name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedProduct(product);
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
                              to={`/products/edit/${product.id}`}
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
                                setSelectedProduct(product);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Product Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Product Details</Typography>
        </DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box>
              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Avatar
                  variant="rounded"
                  src={selectedProduct.imageUrl?.startsWith('/uploads')
                    ? `http://localhost:3001${selectedProduct.imageUrl}`
                    : selectedProduct.imageUrl}
                  sx={{ width: 120, height: 120, bgcolor: 'action.selected' }}
                >
                  {selectedProduct.name[0]}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">{selectedProduct.name}</Typography>
                  <Chip
                    label={selectedProduct.category?.name}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Supplied by {selectedProduct.supplier?.name}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Selling Price</Typography>
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {selectedProduct.price.toLocaleString()} DJF
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Cost Price</Typography>
                  <Typography variant="h6">
                    {(selectedProduct.cost || 0).toLocaleString()} DJF
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Stock Quantity</Typography>
                  <Typography variant="h6">{selectedProduct.quantity}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Stock Value</Typography>
                  <Typography variant="h6">
                    {(selectedProduct.price * selectedProduct.quantity).toLocaleString()} DJF
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Profit per Unit</Typography>
                  <Typography variant="h6" color="success.main">
                    {(selectedProduct.price - (selectedProduct.cost || 0)).toLocaleString()} DJF
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={getStockStatus(selectedProduct.quantity).label}
                    color={getStockStatus(selectedProduct.quantity).color as any}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
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
              to={`/products/edit/${selectedProduct?.id}`}
              variant="contained"
              color="warning"
              startIcon={<EditIcon />}
            >
              Edit Product
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductPage;
