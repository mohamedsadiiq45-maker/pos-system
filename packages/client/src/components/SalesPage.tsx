import {
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  Avatar,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as OrdersIcon,
  Payments as RevenueIcon,
  CreditCard as PaymentIcon,
  CalendarToday as TodayIcon,
  DateRange as DateRangeIcon,
  LocalAtm as CashIcon,
  PhoneAndroid as MobileIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Sale {
  id: number;
  total: number;
  discount: number;
  paymentMethod: string;
  createdAt: string;
  items: {
    quantity: number;
    price: number;
    product: {
      name: string;
      imageUrl?: string;
    };
  }[];
}

function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const response = await fetch('http://localhost:3001/api/sales', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setSales(data);
    }
  };

  // Date filter logic
  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateFilter) {
      case 'today':
        return { start: today, end: now };
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);
        return { start: weekStart, end: now };
      case 'month':
        const monthStart = new Date(today);
        monthStart.setDate(today.getDate() - 30);
        return { start: monthStart, end: now };
      case 'custom':
        return { start: customStartDate, end: customEndDate };
      default:
        return { start: null, end: null };
    }
  };

  // Filter sales
  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.id.toString().includes(searchTerm) ||
      sale.items.some((item) => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPayment = paymentFilter === 'all' ||
      (paymentFilter === 'cash' && sale.paymentMethod === 'Cash') ||
      (paymentFilter === 'mobile' && sale.paymentMethod?.includes('Mobile'));
    
    const { start, end } = getDateRange();
    const saleDate = new Date(sale.createdAt);
    const matchesDate = !start || !end || (saleDate >= start && saleDate <= end);
    
    return matchesSearch && matchesPayment && matchesDate;
  });

  // Stats calculations
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = filteredSales.length;
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalItems = filteredSales.reduce((sum, sale) => sum + sale.items.reduce((s, i) => s + i.quantity, 0), 0);
  const cashSales = filteredSales.filter((s) => s.paymentMethod === 'Cash').length;
  const mobileSales = filteredSales.filter((s) => s.paymentMethod?.includes('Mobile')).length;

  const getPaymentMethodColor = (method: string) => {
    if (method?.includes('Mobile') || method?.includes('E-Wallet')) return 'info';
    if (method === 'Cash') return 'success';
    return 'default';
  };

  const getPaymentMethodLabel = (method: string) => {
    if (method?.includes('Mobile')) {
      const wallet = method.replace('Mobile - ', '');
      return wallet;
    }
    return method || 'Cash';
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, sale: Sale) => {
    setAnchorEl(event.currentTarget);
    setSelectedSale(sale);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handlePrintReceipt = () => {
    if (!selectedSale) return;
    const printWindow = window.open('', '', 'width=400,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${selectedSale.id}</title>
            <style>
              body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .divider { border-top: 1px dashed #000; margin: 10px 0; }
              .item { display: flex; justify-content: space-between; margin: 5px 0; }
              .total { font-weight: bold; font-size: 1.2em; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Super Electronics</h2>
              <p>Djibouti City, Djibouti</p>
              <p>Tel: +253 21 XX XX XX</p>
            </div>
            <div class="divider"></div>
            <p>Receipt #: ${selectedSale.id.toString().padStart(6, '0')}</p>
            <p>Date: ${new Date(selectedSale.createdAt).toLocaleString()}</p>
            <p>Payment: ${selectedSale.paymentMethod || 'Cash'}</p>
            <div class="divider"></div>
            <p><strong>Items:</strong></p>
            ${selectedSale.items.map((item) => `
              <div class="item">
                <span>${item.quantity}x ${item.product.name}</span>
                <span>${(item.price * item.quantity).toLocaleString()} DJF</span>
              </div>
            `).join('')}
            <div class="divider"></div>
            ${selectedSale.discount > 0 ? `
              <div class="item">
                <span>Discount:</span>
                <span>-${selectedSale.discount.toLocaleString()} DJF</span>
              </div>
            ` : ''}
            <div class="item total">
              <span>TOTAL:</span>
              <span>${selectedSale.total.toLocaleString()} DJF</span>
            </div>
            <div class="divider"></div>
            <p style="text-align: center;">Thank you for shopping!</p>
            <p style="text-align: center; font-size: 0.8em;">Keep receipt for warranty</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    handleMenuClose();
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Items', 'Payment Method', 'Discount', 'Total'];
    const rows = filteredSales.map((sale) => [
      `#${sale.id.toString().padStart(6, '0')}`,
      new Date(sale.createdAt).toLocaleString(),
      sale.items.length,
      sale.paymentMethod || 'Cash',
      sale.discount,
      sale.total,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Sales History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dashboard • Sales
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
            <Button
              variant="contained"
              color="warning"
              startIcon={<AddIcon />}
              component={Link}
              to="/sales/new"
            >
              New Sale
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light', width: 50, height: 50 }}>
                  <RevenueIcon sx={{ color: 'warning.dark' }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  <Typography variant="h5" fontWeight="bold">{totalRevenue.toLocaleString()}</Typography>
                  <Typography variant="caption" color="text.secondary">DJF</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', width: 50, height: 50 }}>
                  <OrdersIcon sx={{ color: 'primary.dark' }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                  <Typography variant="h5" fontWeight="bold">{totalOrders}</Typography>
                  <Typography variant="caption" color="text.secondary">{totalItems} items sold</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', width: 50, height: 50 }}>
                  <TrendingUpIcon sx={{ color: 'success.dark' }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Average Order</Typography>
                  <Typography variant="h5" fontWeight="bold">{averageOrder.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                  <Typography variant="caption" color="text.secondary">DJF</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.light', width: 50, height: 50 }}>
                  <PaymentIcon sx={{ color: 'info.dark' }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Payment Split</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip icon={<CashIcon />} label={cashSales} size="small" color="success" />
                    <Chip icon={<MobileIcon />} label={mobileSales} size="small" color="info" />
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Date Filter Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 3 }}>
          <Tabs
            value={dateFilter}
            onChange={(_, val) => setDateFilter(val)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<ReceiptIcon />} iconPosition="start" label="All Time" value="all" />
            <Tab icon={<TodayIcon />} iconPosition="start" label="Today" value="today" />
            <Tab icon={<DateRangeIcon />} iconPosition="start" label="Last 7 Days" value="week" />
            <Tab icon={<DateRangeIcon />} iconPosition="start" label="Last 30 Days" value="month" />
            <Tab icon={<DateRangeIcon />} iconPosition="start" label="Custom Range" value="custom" />
          </Tabs>
          
          {dateFilter === 'custom' && (
            <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <DatePicker
                label="Start Date"
                value={customStartDate}
                onChange={(date) => setCustomStartDate(date)}
                slotProps={{ textField: { size: 'small' } }}
              />
              <Typography>to</Typography>
              <DatePicker
                label="End Date"
                value={customEndDate}
                onChange={(date) => setCustomEndDate(date)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Box>
          )}
        </Paper>

        {/* Search & Filters */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search Order ID or Product..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentFilter}
                label="Payment Method"
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <MenuItem value="all">All Payments</MenuItem>
                <MenuItem value="cash">Cash Only</MenuItem>
                <MenuItem value="mobile">Mobile Wallet</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              Showing {filteredSales.length} of {sales.length} sales
            </Typography>
          </Box>
        </Paper>

        {/* Sales Table */}
        <Paper sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Products</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Items</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <ReceiptIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">No sales found</Typography>
                      <Typography variant="body2" color="text.disabled">
                        Try adjusting your filters or date range
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id} hover>
                      <TableCell>
                        <Typography fontWeight="600" color="primary.main">
                          #{sale.id.toString().padStart(6, '0')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(sale.createdAt).toLocaleDateString('en', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(sale.createdAt).toLocaleTimeString('en', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {sale.items.slice(0, 2).map((item, i) => (
                            <Tooltip key={i} title={item.product.name}>
                              <Avatar
                                variant="rounded"
                                src={item.product.imageUrl?.startsWith('/uploads')
                                  ? `http://localhost:3001${item.product.imageUrl}`
                                  : item.product.imageUrl}
                                sx={{ width: 32, height: 32, bgcolor: 'action.selected' }}
                              >
                                {item.product.name[0]}
                              </Avatar>
                            </Tooltip>
                          ))}
                          {sale.items.length > 2 && (
                            <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: 'action.selected', fontSize: 12 }}>
                              +{sale.items.length - 2}
                            </Avatar>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${sale.items.reduce((s, i) => s + i.quantity, 0)} items`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={sale.paymentMethod?.includes('Mobile') ? <MobileIcon /> : <CashIcon />}
                          label={getPaymentMethodLabel(sale.paymentMethod)}
                          color={getPaymentMethodColor(sale.paymentMethod)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold" fontSize="1.1rem">
                          {sale.total.toLocaleString()} DJF
                        </Typography>
                        {sale.discount > 0 && (
                          <Typography variant="caption" color="error.main">
                            -{sale.discount.toLocaleString()} discount
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedSale(sale);
                              setViewDialogOpen(true);
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Receipt">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedSale(sale);
                              setTimeout(handlePrintReceipt, 100);
                            }}
                          >
                            <PrintIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, sale)}>
                          <MoreIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Actions Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleViewDetails}>
            <ViewIcon sx={{ mr: 1 }} fontSize="small" />
            View Details
          </MenuItem>
          <MenuItem onClick={handlePrintReceipt}>
            <PrintIcon sx={{ mr: 1 }} fontSize="small" />
            Print Receipt
          </MenuItem>
        </Menu>

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">Order #{selectedSale?.id.toString().padStart(6, '0')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedSale && new Date(selectedSale.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Chip
                icon={selectedSale?.paymentMethod?.includes('Mobile') ? <MobileIcon /> : <CashIcon />}
                label={getPaymentMethodLabel(selectedSale?.paymentMethod || '')}
                color={getPaymentMethodColor(selectedSale?.paymentMethod || '')}
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedSale && (
              <>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  ORDER ITEMS
                </Typography>
                {selectedSale.items.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 1.5,
                      borderBottom: index < selectedSale.items.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={item.product.imageUrl?.startsWith('/uploads')
                        ? `http://localhost:3001${item.product.imageUrl}`
                        : item.product.imageUrl}
                      sx={{ width: 50, height: 50 }}
                    >
                      {item.product.name[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="500">{item.product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} × {item.price.toLocaleString()} DJF
                      </Typography>
                    </Box>
                    <Typography fontWeight="600">
                      {(item.price * item.quantity).toLocaleString()} DJF
                    </Typography>
                  </Box>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>{(selectedSale.total + selectedSale.discount).toLocaleString()} DJF</Typography>
                </Box>
                {selectedSale.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography color="text.secondary">Discount</Typography>
                    <Typography color="error.main">-{selectedSale.discount.toLocaleString()} DJF</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, mt: 1, bgcolor: 'background.default', mx: -3, px: 3 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="warning.main" fontWeight="bold">
                    {selectedSale.total.toLocaleString()} DJF
                  </Typography>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setViewDialogOpen(false)} variant="outlined">
              Close
            </Button>
            <Button
              onClick={() => {
                setViewDialogOpen(false);
                handlePrintReceipt();
              }}
              variant="contained"
              color="warning"
              startIcon={<PrintIcon />}
            >
              Print Receipt
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

export default SalesPage;
