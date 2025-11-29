import {
  Typography,
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
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tooltip,
  Grid,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Warning as WarningIcon,
  CheckCircle as InStockIcon,
  Error as OutOfStockIcon,
  Inventory as InventoryIcon,
  TrendingDown as LowStockIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  cost: number;
  imageUrl?: string;
  category?: {
    id: number;
    name: string;
  };
  supplier?: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

function InventoryPage() {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');

  const canAddProduct = hasPermission('addProduct');
  const canEditProduct = hasPermission('editProduct');
  const canAdjustStock = hasPermission('adjustStock');

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

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error', icon: <OutOfStockIcon fontSize="small" /> };
    if (quantity < 10) return { label: 'Critical', color: 'error', icon: <WarningIcon fontSize="small" /> };
    if (quantity < 30) return { label: 'Low Stock', color: 'warning', icon: <LowStockIcon fontSize="small" /> };
    return { label: 'In Stock', color: 'success', icon: <InStockIcon fontSize="small" /> };
  };

  const getStockProgress = (quantity: number) => {
    const maxStock = 100;
    return Math.min((quantity / maxStock) * 100, 100);
  };

  const getProgressColor = (quantity: number) => {
    if (quantity === 0) return 'error';
    if (quantity < 10) return 'error';
    if (quantity < 30) return 'warning';
    return 'success';
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category?.id.toString() === categoryFilter;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'instock' && product.quantity >= 30) ||
      (stockFilter === 'low' && product.quantity > 0 && product.quantity < 30) ||
      (stockFilter === 'out' && product.quantity === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Stats
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.quantity >= 30).length;
  const lowStockCount = products.filter((p) => p.quantity > 0 && p.quantity < 30).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleAdjustStock = async () => {
    if (!selectedProduct || adjustQuantity <= 0) return;

    const newQuantity = adjustType === 'add'
      ? selectedProduct.quantity + adjustQuantity
      : Math.max(0, selectedProduct.quantity - adjustQuantity);

    const response = await fetch(`http://localhost:3001/api/products/${selectedProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ...selectedProduct,
        quantity: newQuantity,
        categoryId: selectedProduct.category?.id,
        supplierId: selectedProduct.supplier?.id,
      }),
    });

    if (response.ok) {
      fetchProducts();
      setAdjustDialogOpen(false);
      setSelectedProduct(null);
      setAdjustQuantity(0);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Quantity', 'Status', 'Price', 'Value'];
    const rows = filteredProducts.map((p) => [
      p.id,
      p.name,
      p.category?.name || 'N/A',
      p.quantity,
      getStockStatus(p.quantity).label,
      p.price,
      p.price * p.quantity,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Inventory Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboard • Inventory
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
          {canAddProduct && (
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
        <Grid item xs={6} md={2.4}>
          <Paper sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
            <InventoryIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">{totalProducts}</Typography>
            <Typography variant="body2" color="text.secondary">Total Products</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2.4}>
          <Paper sx={{ p: 2, borderRadius: 3, textAlign: 'center', bgcolor: 'success.light' }}>
            <InStockIcon sx={{ fontSize: 32, color: 'success.dark', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="success.dark">{inStockCount}</Typography>
            <Typography variant="body2" color="success.dark">In Stock</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2.4}>
          <Paper sx={{ p: 2, borderRadius: 3, textAlign: 'center', bgcolor: 'warning.light' }}>
            <WarningIcon sx={{ fontSize: 32, color: 'warning.dark', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="warning.dark">{lowStockCount}</Typography>
            <Typography variant="body2" color="warning.dark">Low Stock</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2.4}>
          <Paper sx={{ p: 2, borderRadius: 3, textAlign: 'center', bgcolor: 'error.light' }}>
            <OutOfStockIcon sx={{ fontSize: 32, color: 'error.dark', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="error.dark">{outOfStockCount}</Typography>
            <Typography variant="body2" color="error.dark">Out of Stock</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Paper sx={{ p: 2, borderRadius: 3, textAlign: 'center', bgcolor: 'action.hover' }}>
            <Typography variant="body2" color="text.secondary">Total Inventory Value</Typography>
            <Typography variant="h5" fontWeight="bold" color="warning.main">
              {totalValue.toLocaleString()} DJF
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Low Stock Alert */}
      {lowStockCount + outOfStockCount > 0 && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3, borderRadius: 2 }}
          icon={<WarningIcon />}
        >
          <strong>{lowStockCount + outOfStockCount} products</strong> need attention! 
          {outOfStockCount > 0 && ` ${outOfStockCount} out of stock.`}
          {lowStockCount > 0 && ` ${lowStockCount} running low.`}
        </Alert>
      )}

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

      {/* Inventory Table */}
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Stock Level</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Value</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No products found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const status = getStockStatus(product.quantity);
                  return (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            variant="rounded"
                            src={product.imageUrl?.startsWith('/uploads') 
                              ? `http://localhost:3001${product.imageUrl}` 
                              : product.imageUrl}
                            sx={{ width: 40, height: 40, bgcolor: 'action.selected' }}
                          >
                            {product.name[0]}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="500" noWrap sx={{ maxWidth: 200 }}>
                              {product.name}
                            </Typography>
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
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {product.supplier?.name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: 150 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={getStockProgress(product.quantity)}
                              color={getProgressColor(product.quantity) as any}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 30 }}>
                            {Math.round(getStockProgress(product.quantity))}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontWeight="600" fontSize="1.1rem">
                          {product.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={status.icon}
                          label={status.label}
                          size="small"
                          color={status.color as any}
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="500">
                          {(product.price * product.quantity).toLocaleString()} DJF
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Adjust Stock">
                          {canEditProduct && (
                            <IconButton
                              size="small"
                              color="primary"
                              component={Link}
                              to={`/products/edit/${product.id}`}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Tooltip>
                        {canAdjustStock && (
                          <>
                            <Tooltip title="Add Stock">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setAdjustType('add');
                                  setAdjustQuantity(10);
                                  setAdjustDialogOpen(true);
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove Stock">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setAdjustType('remove');
                                  setAdjustQuantity(1);
                                  setAdjustDialogOpen(true);
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
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

      {/* Adjust Stock Dialog */}
      <Dialog open={adjustDialogOpen} onClose={() => setAdjustDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon color="warning" />
            <Typography variant="h6">Adjust Stock</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Avatar
                  variant="rounded"
                  src={selectedProduct.imageUrl?.startsWith('/uploads') 
                    ? `http://localhost:3001${selectedProduct.imageUrl}` 
                    : selectedProduct.imageUrl}
                  sx={{ width: 50, height: 50 }}
                >
                  {selectedProduct.name[0]}
                </Avatar>
                <Box>
                  <Typography fontWeight="600">{selectedProduct.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Stock: <strong>{selectedProduct.quantity}</strong> units
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Button
                  variant={adjustType === 'add' ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => setAdjustType('add')}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add Stock
                </Button>
                <Button
                  variant={adjustType === 'remove' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => setAdjustType('remove')}
                  startIcon={<RemoveIcon />}
                  fullWidth
                >
                  Remove Stock
                </Button>
              </Box>

              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={adjustQuantity}
                onChange={(e) => setAdjustQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                InputProps={{
                  inputProps: { min: 0 },
                }}
                sx={{ mb: 2 }}
              />

              <Paper sx={{ p: 2, bgcolor: adjustType === 'add' ? 'success.light' : 'error.light', borderRadius: 2 }}>
                <Typography variant="body2" color={adjustType === 'add' ? 'success.dark' : 'error.dark'}>
                  New Stock Level: <strong>
                    {adjustType === 'add'
                      ? selectedProduct.quantity + adjustQuantity
                      : Math.max(0, selectedProduct.quantity - adjustQuantity)}
                  </strong> units
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setAdjustDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAdjustStock}
            variant="contained"
            color={adjustType === 'add' ? 'success' : 'error'}
            disabled={adjustQuantity <= 0}
          >
            {adjustType === 'add' ? 'Add Stock' : 'Remove Stock'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InventoryPage;
