import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Radio,
  Avatar,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Inventory as InventoryIcon,
  Payments as PriceIcon,
  Category as CategoryIcon,
  Description as DescIcon,
  Settings as SpecsIcon,
  Image as ImageIcon,
  LocalShipping as SupplierIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
  contact?: string;
  email?: string;
  address?: string;
}

function AddProductPage() {
  // Basic Info
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');

  // Pricing
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');

  // Inventory
  const [quantity, setQuantity] = useState('');
  const [minStock, setMinStock] = useState('5');

  // Classification
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');

  // Technical Specs (Electronics specific)
  const [warranty, setWarranty] = useState('12');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [powerSpecs, setPowerSpecs] = useState('');
  const [connectivity, setConnectivity] = useState<string[]>([]);

  // Image
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // New Supplier Dialog
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
  });
  const [addingSupplier, setAddingSupplier] = useState(false);

  const connectivityOptions = [
    'USB-A', 'USB-C', 'USB-B', 'Micro USB',
    'Bluetooth', 'WiFi', 'NFC', 'HDMI',
    'DisplayPort', 'VGA', 'Ethernet', 'Lightning',
    '3.5mm Audio', 'SD Card', 'Wireless'
  ];

  const warrantyOptions = [
    { value: '0', label: 'No Warranty' },
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '1 Year' },
    { value: '24', label: '2 Years' },
    { value: '36', label: '3 Years' },
  ];

  const colorOptions = [
    'Black', 'White', 'Silver', 'Gold', 'Space Gray',
    'Blue', 'Red', 'Green', 'Pink', 'Purple', 'Other'
  ];

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch('http://localhost:3001/api/categories', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (response.ok) {
      const data = await response.json();
      setCategories(data);
    }
  };

  const fetchSuppliers = async () => {
    const response = await fetch('http://localhost:3001/api/suppliers', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (response.ok) {
      const data = await response.json();
      setSuppliers(data);
    }
  };

  const handleAddSupplier = async () => {
    if (!newSupplier.name.trim()) {
      alert('Please enter supplier name');
      return;
    }

    setAddingSupplier(true);

    const response = await fetch('http://localhost:3001/api/suppliers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newSupplier),
    });

    if (response.ok) {
      const supplier = await response.json();
      setSuppliers([...suppliers, supplier]);
      setSupplierId(supplier.id.toString());
      setSupplierDialogOpen(false);
      setNewSupplier({ name: '', contact: '', email: '', address: '' });
    } else {
      const error = await response.json();
      alert(error.message || 'Failed to add supplier');
    }
    setAddingSupplier(false);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.imageUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const toggleConnectivity = (option: string) => {
    setConnectivity((prev) =>
      prev.includes(option)
        ? prev.filter((c) => c !== option)
        : [...prev, option]
    );
  };

  const generateSKU = () => {
    const brandCode = brand.substring(0, 3).toUpperCase() || 'PRD';
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setSku(`${brandCode}-${randomNum}`);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !price || !cost || !quantity || !categoryId || !supplierId) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Combine all data into description/specs for storage
    const fullDescription = [
      description,
      brand && `Brand: ${brand}`,
      model && `Model: ${model}`,
      warranty !== '0' && `Warranty: ${warrantyOptions.find(w => w.value === warranty)?.label}`,
      color && `Color: ${color}`,
      weight && `Weight: ${weight}`,
      dimensions && `Dimensions: ${dimensions}`,
      powerSpecs && `Power: ${powerSpecs}`,
      connectivity.length > 0 && `Connectivity: ${connectivity.join(', ')}`,
    ].filter(Boolean).join(' | ');

    const response = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: `${brand ? brand + ' ' : ''}${name}${model ? ' ' + model : ''}`,
        price: parseFloat(price),
        cost: parseFloat(cost),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        supplierId: parseInt(supplierId),
        imageUrl,
      }),
    });

    if (response.ok) {
      navigate('/products');
    } else {
      const error = await response.json();
      alert(error.message || 'Failed to add product');
    }
    setLoading(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Add New Product
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dashboard • Products • Add New Electronic Product
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Basic Information */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DescIcon color="warning" />
                <Typography variant="h6" fontWeight="600">
                  Basic Information
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., iPhone 15 Pro Max"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g., Apple, Samsung, Sony"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Model Number"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g., A2849, SM-S918B"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SKU / Barcode"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g., APL-0001"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button size="small" onClick={generateSKU}>
                            Generate
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description, features, and specifications..."
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Pricing */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PriceIcon color="warning" />
                <Typography variant="h6" fontWeight="600">
                  Pricing
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Cost Price (Purchase Price)"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="0.00"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">DJF</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Selling Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">DJF</InputAdornment>,
                    }}
                  />
                </Grid>
                {cost && price && (
                  <Grid item xs={12}>
                    {(() => {
                      const profitAmount = parseFloat(price) - parseFloat(cost);
                      const profitMargin = (profitAmount / parseFloat(cost)) * 100;
                      const isProfit = profitAmount >= 0;
                      return (
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: isProfit ? 'success.light' : 'error.light', 
                          borderRadius: 2 
                        }}>
                          <Typography variant="body2" color={isProfit ? 'success.dark' : 'error.dark'}>
                            <strong>Profit Margin:</strong>{' '}
                            {profitMargin.toFixed(1)}%
                            {' | '}
                            <strong>{isProfit ? 'Profit' : 'Loss'} per unit:</strong>{' '}
                            {isProfit ? '' : '-'}{Math.abs(profitAmount).toFixed(2)} DJF
                          </Typography>
                        </Box>
                      );
                    })()}
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Inventory */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <InventoryIcon color="warning" />
                <Typography variant="h6" fontWeight="600">
                  Inventory
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Quantity in Stock"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Low Stock Alert (Minimum)"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    placeholder="5"
                    helperText="Alert when stock falls below this number"
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Technical Specifications */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SpecsIcon color="warning" />
                <Typography variant="h6" fontWeight="600">
                  Technical Specifications
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Warranty Period</InputLabel>
                    <Select
                      value={warranty}
                      label="Warranty Period"
                      onChange={(e) => setWarranty(e.target.value)}
                    >
                      {warrantyOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={color}
                      label="Color"
                      onChange={(e) => setColor(e.target.value)}
                    >
                      {colorOptions.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 250g, 1.5kg"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dimensions"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g., 15 x 7 x 1 cm"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Power Specifications"
                    value={powerSpecs}
                    onChange={(e) => setPowerSpecs(e.target.value)}
                    placeholder="e.g., 220V, 50Hz, 65W USB-C Charger"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Connectivity Options
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {connectivityOptions.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        onClick={() => toggleConnectivity(option)}
                        color={connectivity.includes(option) ? 'warning' : 'default'}
                        variant={connectivity.includes(option) ? 'filled' : 'outlined'}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Category */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CategoryIcon color="warning" />
                <Typography variant="h6" fontWeight="600">
                  Category
                </Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel>Category *</InputLabel>
                <Select
                  required
                  value={categoryId}
                  label="Category *"
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>

            {/* Supplier */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SupplierIcon color="warning" />
                  <Typography variant="h6" fontWeight="600">
                    Supplier
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setSupplierDialogOpen(true)}
                  color="warning"
                >
                  Add New
                </Button>
              </Box>

              {suppliers.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <SupplierIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    No suppliers registered
                  </Typography>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<AddIcon />}
                    onClick={() => setSupplierDialogOpen(true)}
                  >
                    Add First Supplier
                  </Button>
                </Box>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Select supplier for this product *
                  </Typography>
                  <List sx={{ maxHeight: 250, overflow: 'auto' }}>
                    {suppliers.map((supplier) => (
                      <ListItem
                        key={supplier.id}
                        onClick={() => setSupplierId(supplier.id.toString())}
                        sx={{
                          border: '1px solid',
                          borderColor: supplierId === supplier.id.toString() ? 'warning.main' : 'divider',
                          borderRadius: 2,
                          mb: 1,
                          cursor: 'pointer',
                          bgcolor: supplierId === supplier.id.toString() ? 'warning.light' : 'transparent',
                          '&:hover': {
                            bgcolor: supplierId === supplier.id.toString() ? 'warning.light' : 'background.default',
                          },
                        }}
                      >
                        <ListItemIcon>
                          <Radio
                            checked={supplierId === supplier.id.toString()}
                            color="warning"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography fontWeight={supplierId === supplier.id.toString() ? 600 : 400}>
                              {supplier.name}
                            </Typography>
                          }
                          secondary={supplier.contact || 'No contact info'}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Paper>

            {/* Product Image */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ImageIcon color="warning" />
                <Typography variant="h6" fontWeight="600">
                  Product Image
                </Typography>
              </Box>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
                id="image-upload"
              />

              {imagePreview ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'contain',
                      borderRadius: 2,
                      mb: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Image
                  </Button>
                </Box>
              ) : (
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'warning.main',
                      bgcolor: 'warning.light',
                    },
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Click to upload product image
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    PNG, JPG up to 5MB
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="warning"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/products')}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Add Supplier Dialog */}
      <Dialog open={supplierDialogOpen} onClose={() => setSupplierDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SupplierIcon color="warning" />
            <Typography variant="h6">Add New Supplier</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Register a new supplier for your electronics store
          </Typography>

          <TextField
            fullWidth
            required
            label="Supplier / Company Name"
            value={newSupplier.name}
            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
            placeholder="e.g., Apple Inc., Samsung Electronics"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Contact Phone"
            value={newSupplier.contact}
            onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
            placeholder="+253 XX XX XX XX"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={newSupplier.email}
            onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
            placeholder="supplier@example.com"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Address"
            value={newSupplier.address}
            onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
            placeholder="City, Country"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => {
              setSupplierDialogOpen(false);
              setNewSupplier({ name: '', contact: '', email: '', address: '' });
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSupplier}
            variant="contained"
            color="warning"
            disabled={addingSupplier || !newSupplier.name.trim()}
          >
            {addingSupplier ? 'Adding...' : 'Add Supplier'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddProductPage;
