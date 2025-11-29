import {
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  Grid,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
  Print as PrintIcon,
  LocalAtm as CashIcon,
  PhoneAndroid as MobileIcon,
  NoteAdd as NoteIcon,
  Backspace as BackspaceIcon,
} from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

interface CartItem extends Product {
  cartQuantity: number;
  note?: string;
}

function NewSalePage() {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [mobileWallet, setMobileWallet] = useState<string>('');
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [orderNumber] = useState(() => Math.floor(Math.random() * 1000) + 1);
  const receiptRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const canApplyDiscount = hasPermission('applyDiscount');

  useEffect(() => {
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

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === null || product.category?.id === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId: number, change: number) => {
    setCart(
      cart
        .map((item) =>
          item.id === productId
            ? { ...item, cartQuantity: Math.max(0, item.cartQuantity + change) }
            : item
        )
        .filter((item) => item.cartQuantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const dueAmount = Math.max(0, total - (parseFloat(amountPaid) || 0));

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Please add items to cart');
      return;
    }
    setAmountPaid(total.toFixed(2));
    setCheckoutDialogOpen(true);
  };

  const handleNumpadClick = (value: string) => {
    if (value === 'x') {
      setAmountPaid(amountPaid.slice(0, -1));
    } else if (value === '.') {
      if (!amountPaid.includes('.')) {
        setAmountPaid(amountPaid + value);
      }
    } else {
      setAmountPaid(amountPaid + value);
    }
  };

  const handleQuickAmount = (amount: number) => {
    setAmountPaid((parseFloat(amountPaid || '0') + amount).toString());
  };

  const handleConfirmSale = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    if (paymentMethod === 'mobile' && !mobileWallet) {
      alert('Please select a mobile wallet');
      return;
    }

    const saleData = {
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.cartQuantity,
        price: item.price,
      })),
      total,
      discount: discountAmount,
      paymentMethod: paymentMethod === 'mobile' ? `Mobile - ${mobileWallet}` : 'Cash',
    };

    const response = await fetch('http://localhost:3001/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(saleData),
    });

    if (response.ok) {
      const sale = await response.json();
      const paidAmount = parseFloat(amountPaid || '0');
      const changeGiven = paidAmount > total ? paidAmount - total : 0;
      
      setLastSale({
        ...sale,
        items: cart,
        subtotal,
        discountAmount,
        total,
        amountPaid: paidAmount,
        changeGiven,
        paymentMethod: paymentMethod === 'mobile' ? `Mobile - ${mobileWallet}` : 'Cash',
        date: new Date(),
      });
      setCheckoutDialogOpen(false);
      setReceiptDialogOpen(true);
      // Reset for next sale
      setCart([]);
      setDiscount(0);
      setAmountPaid('');
      setPaymentMethod('');
      setMobileWallet('');
    } else {
      alert('Failed to create sale');
    }
  };

  const handlePrintReceipt = () => {
    const printContent = receiptRef.current;
    if (printContent) {
      const printWindow = window.open('', '', 'width=400,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .divider { border-top: 1px dashed #000; margin: 10px 0; }
                .item { display: flex; justify-content: space-between; margin: 5px 0; }
                .total { font-weight: bold; font-size: 1.2em; }
                .footer { text-align: center; margin-top: 20px; font-size: 0.9em; }
              </style>
            </head>
            <body>${printContent.innerHTML}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleCloseReceipt = (print: boolean) => {
    if (print) handlePrintReceipt();
    setReceiptDialogOpen(false);
    setCart([]);
    setDiscount(0);
    setPaymentMethod('');
    setMobileWallet('');
    setAmountPaid('');
    setLastSale(null);
  };

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return 'https://via.placeholder.com/150?text=No+Image';
    if (imageUrl.startsWith('/uploads')) return `http://localhost:3001${imageUrl}`;
    return imageUrl;
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  return (
    <Box sx={{ height: 'calc(100vh - 48px)' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Point of Sale (POS)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboard • POS
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" color="warning" startIcon={<AddIcon />}>
            + New
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100% - 80px)' }}>
        {/* Left Panel - Products */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                placeholder="Search in products"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>All Category</InputLabel>
                <Select
                  value={selectedCategory || ''}
                  label="All Category"
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Category Chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Show All"
                onClick={() => setSelectedCategory(null)}
                color={selectedCategory === null ? 'warning' : 'default'}
                variant={selectedCategory === null ? 'filled' : 'outlined'}
                sx={{ fontWeight: 500 }}
              />
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  onClick={() => setSelectedCategory(category.id)}
                  color={selectedCategory === category.id ? 'warning' : 'default'}
                  variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Box>
          </Paper>

          {/* Products Grid */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Grid container spacing={2}>
              {filteredProducts.map((product) => (
                <Grid item xs={6} sm={4} md={3} key={product.id}>
                  <Card
                    onClick={() => product.quantity > 0 && addToCart(product)}
                    sx={{
                      cursor: product.quantity > 0 ? 'pointer' : 'not-allowed',
                      opacity: product.quantity === 0 ? 0.5 : 1,
                      borderRadius: 3,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      transition: 'all 0.2s',
                      '&:hover': product.quantity > 0 ? {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      } : {},
                      position: 'relative',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      sx={{ objectFit: 'cover', bgcolor: 'action.hover' }}
                    />
                    {product.quantity < 10 && product.quantity > 0 && (
                      <Chip
                        label={`${product.quantity} left`}
                        size="small"
                        color="error"
                        sx={{ position: 'absolute', top: 8, right: 8, fontSize: '0.7rem' }}
                      />
                    )}
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="body2" fontWeight="500" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body1" color="warning.main" fontWeight="bold">
                        {product.price.toFixed(2)} DJF
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Right Panel - Order */}
        <Paper
          elevation={0}
          sx={{
            width: 380,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Order Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CartIcon color="action" />
              <Typography variant="h6" fontWeight="bold">
                Order #{orderNumber}
              </Typography>
              <Badge badgeContent={cartItemCount} color="warning" sx={{ ml: 'auto' }} />
            </Box>
          </Box>

          {/* Cart Items */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {cart.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <CartIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                <Typography>No items in order</Typography>
                <Typography variant="body2">Click products to add</Typography>
              </Box>
            ) : (
              cart.map((item) => (
                <Paper
                  key={item.id}
                  variant="outlined"
                  sx={{ p: 1.5, mb: 1.5, borderRadius: 2 }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box
                      component="img"
                      src={getImageUrl(item.imageUrl)}
                      alt={item.name}
                      sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight="600">
                          {item.name}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeFromCart(item.id)}
                          sx={{ mt: -0.5, mr: -0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="warning.main" fontWeight="bold">
                        {item.price.toFixed(2)} × {item.cartQuantity} = {(item.price * item.cartQuantity).toFixed(2)} DJF
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          sx={{ border: '1px solid', borderColor: 'divider', width: 28, height: 28 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>
                          {item.cartQuantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          sx={{ border: '1px solid', borderColor: 'divider', width: 28, height: 28 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                        <Button size="small" startIcon={<NoteIcon />} sx={{ ml: 'auto', fontSize: '0.7rem' }}>
                          Add Notes
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))
            )}
          </Box>

          {/* Order Summary */}
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Sub total:</Typography>
              <Typography fontWeight="500">{subtotal.toFixed(2)} DJF</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
              <Typography color="text.secondary">Discount:</Typography>
              <Tooltip title={!canApplyDiscount ? "You don't have permission to apply discounts" : ""}>
                <TextField
                  size="small"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                  sx={{ width: 100 }}
                  inputProps={{ min: 0, max: 100, style: { textAlign: 'right' } }}
                  disabled={!canApplyDiscount}
                />
              </Tooltip>
            </Box>
            {discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="error.main">Discount Amount:</Typography>
                <Typography color="error.main">-{discountAmount.toFixed(2)} DJF</Typography>
              </Box>
            )}
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Total:</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {total.toFixed(2)} DJF
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={cart.length === 0}
                startIcon={<PaymentIcon />}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Bill & Payment
              </Button>
              <Button
                variant="contained"
                color="success"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={cart.length === 0}
                startIcon={<PrintIcon />}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Bill & Print
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Payment Dialog */}
      <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaymentIcon color="primary" />
              <Typography variant="h6">Collect Payment</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">Order #{orderNumber}</Typography>
              <Typography variant="h6" color="warning.main" fontWeight="bold">
                {total.toFixed(2)} DJF
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Payment Method Selection */}
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
            Payment Method
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Paper
              variant="outlined"
              onClick={() => { setPaymentMethod('cash'); setMobileWallet(''); }}
              sx={{
                flex: 1,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                borderColor: paymentMethod === 'cash' ? 'warning.main' : 'divider',
                borderWidth: paymentMethod === 'cash' ? 2 : 1,
                bgcolor: paymentMethod === 'cash' ? 'warning.light' : 'transparent',
              }}
            >
              <CashIcon sx={{ fontSize: 32, color: paymentMethod === 'cash' ? 'warning.dark' : 'text.secondary' }} />
              <Typography variant="body2" fontWeight={paymentMethod === 'cash' ? 600 : 400}>Cash</Typography>
            </Paper>
            <Paper
              variant="outlined"
              onClick={() => setPaymentMethod('mobile')}
              sx={{
                flex: 1,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                borderColor: paymentMethod === 'mobile' ? 'warning.main' : 'divider',
                borderWidth: paymentMethod === 'mobile' ? 2 : 1,
                bgcolor: paymentMethod === 'mobile' ? 'warning.light' : 'transparent',
              }}
            >
              <MobileIcon sx={{ fontSize: 32, color: paymentMethod === 'mobile' ? 'warning.dark' : 'text.secondary' }} />
              <Typography variant="body2" fontWeight={paymentMethod === 'mobile' ? 600 : 400}>Mobile Wallet</Typography>
            </Paper>
          </Box>

          {/* Mobile Wallet Selection */}
          {paymentMethod === 'mobile' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Select Mobile Wallet</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Waafi', 'Cac Pay', 'D-Money', 'Saba Pay', 'East Africa Pay'].map((wallet) => (
                  <Chip
                    key={wallet}
                    label={wallet}
                    onClick={() => setMobileWallet(wallet)}
                    color={mobileWallet === wallet ? 'warning' : 'default'}
                    variant={mobileWallet === wallet ? 'filled' : 'outlined'}
                    sx={{ fontWeight: mobileWallet === wallet ? 600 : 400 }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Amount Paid Input */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Amount Received from Customer
            </Typography>
            <TextField
              fullWidth
              value={amountPaid}
              placeholder="Enter amount paid"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                setAmountPaid(value);
              }}
              InputProps={{
                sx: { 
                  fontSize: '1.8rem', 
                  fontWeight: 'bold',
                  bgcolor: 'background.default',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="h6" color="text.secondary">DJF</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Payment Summary */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Total Bill</Typography>
              <Typography fontWeight="600">{total.toFixed(2)} DJF</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Amount Paid</Typography>
              <Typography fontWeight="600" color="primary.main">
                {parseFloat(amountPaid || '0').toFixed(2)} DJF
              </Typography>
            </Box>
          </Paper>

          {/* Quick Amount Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {[1000, 5000, 10000].map((amount) => (
              <Button
                key={amount}
                variant="outlined"
                onClick={() => handleQuickAmount(amount)}
                sx={{ flex: 1, minWidth: 80 }}
              >
                {amount.toLocaleString()} DJF
              </Button>
            ))}
            <Button
              variant="outlined"
              color="warning"
              onClick={() => setAmountPaid(total.toString())}
              sx={{ flex: 1, minWidth: 80 }}
            >
              Exact
            </Button>
          </Box>

          {/* Numpad */}
          <Grid container spacing={1}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'x'].map((key) => (
              <Grid item xs={4} key={key}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleNumpadClick(key)}
                  sx={{
                    py: 1.5,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: key === 'x' ? 'error.main' : 'text.primary',
                  }}
                >
                  {key === 'x' ? <BackspaceIcon /> : key}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setCheckoutDialogOpen(false)}
            variant="outlined"
            size="large"
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSale}
            variant="contained"
            color="warning"
            size="large"
            disabled={
              !paymentMethod || 
              (paymentMethod === 'mobile' && !mobileWallet) ||
              parseFloat(amountPaid || '0') < total
            }
            sx={{ flex: 1 }}
          >
            {parseFloat(amountPaid || '0') < total 
              ? `Need ${(total - parseFloat(amountPaid || '0')).toFixed(2)} DJF more`
              : 'Complete Payment'
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon color="success" />
            <Typography variant="h6">Sale Completed!</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Change to Give Back - Large Display */}
          {lastSale?.changeGiven > 0 && (
            <Paper 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2,
                bgcolor: 'success.light',
                border: '3px solid',
                borderColor: 'success.main',
                textAlign: 'center',
              }}
            >
              <Typography variant="body1" color="success.dark" fontWeight="500">
                💵 CHANGE TO GIVE BACK TO CUSTOMER
              </Typography>
              <Typography variant="h2" fontWeight="bold" color="success.dark" sx={{ my: 1 }}>
                {lastSale?.changeGiven?.toLocaleString()} DJF
              </Typography>
              <Typography variant="body2" color="success.dark">
                Customer paid {lastSale?.amountPaid?.toLocaleString()} DJF for {lastSale?.total?.toLocaleString()} DJF bill
              </Typography>
            </Paper>
          )}
          
          <Typography gutterBottom>Would you like to print a receipt?</Typography>
          <Paper ref={receiptRef} sx={{ p: 2, mt: 2, border: '1px dashed', borderColor: 'divider' }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <img src="/logo.svg" alt="Logo" style={{ width: 60, marginBottom: 8 }} />
              <Typography variant="h6" fontWeight="bold">Super Electronics</Typography>
              <Typography variant="body2" color="text.secondary">Djibouti City, Djibouti</Typography>
              <Typography variant="body2" color="text.secondary">Tel: +253 21 XX XX XX</Typography>
            </Box>
            <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
            <Typography variant="body2">Date: {lastSale?.date?.toLocaleString()}</Typography>
            <Typography variant="body2">Receipt #: {lastSale?.id}</Typography>
            <Typography variant="body2">Payment: {lastSale?.paymentMethod}</Typography>
            <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
            <Typography variant="body2" fontWeight="bold" gutterBottom>Items:</Typography>
            {lastSale?.items?.map((item: CartItem, i: number) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">{item.cartQuantity}x {item.name}</Typography>
                <Typography variant="body2">{(item.price * item.cartQuantity).toFixed(2)} DJF</Typography>
              </Box>
            ))}
            <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">{lastSale?.subtotal?.toFixed(2)} DJF</Typography>
            </Box>
            {lastSale?.discountAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Discount:</Typography>
                <Typography variant="body2">-{lastSale?.discountAmount?.toFixed(2)} DJF</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography fontWeight="bold">TOTAL:</Typography>
              <Typography fontWeight="bold">{lastSale?.total?.toFixed(2)} DJF</Typography>
            </Box>
            <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Amount Paid:</Typography>
              <Typography variant="body2">{lastSale?.amountPaid?.toFixed(2)} DJF</Typography>
            </Box>
            {lastSale?.changeGiven > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" fontWeight="bold">Change Given:</Typography>
                <Typography variant="body2" fontWeight="bold">{lastSale?.changeGiven?.toFixed(2)} DJF</Typography>
              </Box>
            )}
            <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">Thank you for shopping!</Typography>
              <Typography variant="caption" color="text.secondary">Keep receipt for warranty claims</Typography>
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => handleCloseReceipt(false)} variant="outlined">No, Thanks</Button>
          <Button onClick={() => handleCloseReceipt(true)} variant="contained" color="success" startIcon={<PrintIcon />}>
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default NewSalePage;
