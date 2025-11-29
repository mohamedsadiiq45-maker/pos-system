import {
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as RevenueIcon,
  ShoppingCart as OrdersIcon,
  Analytics as AverageIcon,
  FileDownload as ExportIcon,
  BarChart as SalesIcon,
  Payment as PaymentIcon,
  Inventory as ItemsIcon,
  Category as CategoryIcon,
  LocalOffer as DiscountIcon,
  Receipt as TaxIcon,
  DateRange as DateIcon,
  LocalAtm as CashIcon,
  PhoneAndroid as MobileIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useEffect, useState } from 'react';

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
      id: number;
      name: string;
      imageUrl?: string;
      category?: {
        id: number;
        name: string;
      };
    };
  }[];
}

interface SalesSummary {
  grossSales: number;
  netSales: number;
  totalOrders: number;
  averageOrder: number;
  totalDiscounts: number;
  totalItems: number;
}

interface DailySale {
  date: string;
  total: number;
  orders: number;
}

interface ItemSale {
  productId: number;
  productName: string;
  imageUrl?: string;
  quantity: number;
  revenue: number;
}

interface CategorySale {
  categoryId: number;
  categoryName: string;
  quantity: number;
  revenue: number;
  percentage: number;
}

interface PaymentSummary {
  method: string;
  total: number;
  count: number;
  percentage: number;
}

const COLORS = ['#ff6b35', '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#00bcd4'];

function SalesReportPage() {
  const [dateRange, setDateRange] = useState('7');
  const [selectedReport, setSelectedReport] = useState('summary');
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState<SalesSummary>({
    grossSales: 0,
    netSales: 0,
    totalOrders: 0,
    averageOrder: 0,
    totalDiscounts: 0,
    totalItems: 0,
  });
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary[]>([]);
  const [itemSales, setItemSales] = useState<ItemSale[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySale[]>([]);

  useEffect(() => {
    fetchSalesData();
  }, [dateRange]);

  const fetchSalesData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch all sales
    const salesResponse = await fetch('http://localhost:3001/api/sales', { headers });
    if (salesResponse.ok) {
      const allSales: Sale[] = await salesResponse.json();
      
      // Filter by date range
      const now = new Date();
      const daysAgo = parseInt(dateRange);
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      
      const filteredSales = allSales.filter(sale => new Date(sale.createdAt) >= startDate);
      setSales(filteredSales);

      // Calculate summary
      const grossSales = filteredSales.reduce((sum, sale) => sum + sale.total + (sale.discount || 0), 0);
      const netSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
      const totalDiscounts = filteredSales.reduce((sum, sale) => sum + (sale.discount || 0), 0);
      const totalItems = filteredSales.reduce((sum, sale) => 
        sum + sale.items.reduce((s, i) => s + i.quantity, 0), 0);
      
      setSummary({
        grossSales,
        netSales,
        totalOrders: filteredSales.length,
        averageOrder: filteredSales.length > 0 ? netSales / filteredSales.length : 0,
        totalDiscounts,
        totalItems,
      });

      // Calculate daily sales
      const dailyMap: Record<string, { total: number; orders: number }> = {};
      filteredSales.forEach(sale => {
        const date = new Date(sale.createdAt).toISOString().split('T')[0];
        if (!dailyMap[date]) {
          dailyMap[date] = { total: 0, orders: 0 };
        }
        dailyMap[date].total += sale.total;
        dailyMap[date].orders += 1;
      });
      
      const dailyData = Object.entries(dailyMap)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));
      setDailySales(dailyData);

      // Calculate payment method breakdown
      const paymentMap: Record<string, { total: number; count: number }> = {};
      filteredSales.forEach(sale => {
        const method = sale.paymentMethod || 'Cash';
        if (!paymentMap[method]) {
          paymentMap[method] = { total: 0, count: 0 };
        }
        paymentMap[method].total += sale.total;
        paymentMap[method].count += 1;
      });
      
      const totalPayments = Object.values(paymentMap).reduce((sum, p) => sum + p.total, 0);
      setPaymentSummary(
        Object.entries(paymentMap).map(([method, data]) => ({
          method,
          total: data.total,
          count: data.count,
          percentage: totalPayments > 0 ? (data.total / totalPayments) * 100 : 0,
        }))
      );

      // Calculate item sales
      const itemMap: Record<number, ItemSale> = {};
      filteredSales.forEach(sale => {
        sale.items.forEach(item => {
          const productId = item.product.id;
          if (!itemMap[productId]) {
            itemMap[productId] = {
              productId,
              productName: item.product.name,
              imageUrl: item.product.imageUrl,
              quantity: 0,
              revenue: 0,
            };
          }
          itemMap[productId].quantity += item.quantity;
          itemMap[productId].revenue += item.price * item.quantity;
        });
      });
      
      const itemData = Object.values(itemMap).sort((a, b) => b.revenue - a.revenue);
      setItemSales(itemData);

      // Calculate category sales
      const categoryMap: Record<number, CategorySale> = {};
      filteredSales.forEach(sale => {
        sale.items.forEach(item => {
          const categoryId = item.product.category?.id || 0;
          const categoryName = item.product.category?.name || 'Uncategorized';
          if (!categoryMap[categoryId]) {
            categoryMap[categoryId] = {
              categoryId,
              categoryName,
              quantity: 0,
              revenue: 0,
              percentage: 0,
            };
          }
          categoryMap[categoryId].quantity += item.quantity;
          categoryMap[categoryId].revenue += item.price * item.quantity;
        });
      });
      
      const totalCategoryRevenue = Object.values(categoryMap).reduce((sum, c) => sum + c.revenue, 0);
      const categoryData = Object.values(categoryMap)
        .map(cat => ({
          ...cat,
          percentage: totalCategoryRevenue > 0 ? (cat.revenue / totalCategoryRevenue) * 100 : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue);
      setCategorySales(categoryData);
    }
  };

  const handleExport = () => {
    let csvContent = '';
    
    if (selectedReport === 'summary') {
      csvContent = [
        ['Metric', 'Value'],
        ['Gross Sales', `${summary.grossSales.toFixed(2)} DJF`],
        ['Total Discounts', `${summary.totalDiscounts.toFixed(2)} DJF`],
        ['Net Sales', `${summary.netSales.toFixed(2)} DJF`],
        ['Total Orders', summary.totalOrders],
        ['Total Items Sold', summary.totalItems],
        ['Average Order', `${summary.averageOrder.toFixed(2)} DJF`],
      ].map(row => row.join(',')).join('\n');
    } else if (selectedReport === 'payment') {
      csvContent = [
        ['Payment Method', 'Transactions', 'Total', 'Percentage'],
        ...paymentSummary.map(p => [p.method, p.count, `${p.total.toFixed(2)} DJF`, `${p.percentage.toFixed(1)}%`])
      ].map(row => row.join(',')).join('\n');
    } else if (selectedReport === 'items') {
      csvContent = [
        ['Product', 'Quantity Sold', 'Revenue'],
        ...itemSales.map(i => [i.productName, i.quantity, `${i.revenue.toFixed(2)} DJF`])
      ].map(row => row.join(',')).join('\n');
    } else if (selectedReport === 'category') {
      csvContent = [
        ['Category', 'Items Sold', 'Revenue', 'Percentage'],
        ...categorySales.map(c => [c.categoryName, c.quantity, `${c.revenue.toFixed(2)} DJF`, `${c.percentage.toFixed(1)}%`])
      ].map(row => row.join(',')).join('\n');
    } else if (selectedReport === 'discounts') {
      csvContent = [
        ['Metric', 'Value'],
        ['Total Discounts Given', `${summary.totalDiscounts.toFixed(2)} DJF`],
        ['Orders with Discount', sales.filter(s => s.discount > 0).length],
        ['Average Discount', `${(summary.totalDiscounts / Math.max(sales.filter(s => s.discount > 0).length, 1)).toFixed(2)} DJF`],
      ].map(row => row.join(',')).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const reportMenuItems = [
    { id: 'summary', label: 'Sales Summary', icon: <SalesIcon /> },
    { id: 'payment', label: 'Payment Method', icon: <PaymentIcon /> },
    { id: 'items', label: 'Item Sales', icon: <ItemsIcon /> },
    { id: 'category', label: 'Category Sales', icon: <CategoryIcon /> },
    { id: 'discounts', label: 'Discounts', icon: <DiscountIcon /> },
  ];

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'payment':
        return (
          <Paper sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Payment Method Breakdown
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentSummary}
                        dataKey="total"
                        nameKey="method"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ method, percentage }) => `${method}: ${percentage.toFixed(0)}%`}
                      >
                        {paymentSummary.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} DJF`} />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Orders</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paymentSummary.map((item, index) => (
                          <TableRow key={item.method}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                                {item.method.includes('Mobile') ? <MobileIcon fontSize="small" /> : <CashIcon fontSize="small" />}
                                {item.method}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={item.count} size="small" />
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="600">{item.total.toLocaleString()} DJF</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.percentage.toFixed(1)}%
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        );

      case 'items':
        return (
          <Paper sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Top Selling Products
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Qty Sold</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Revenue</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 200 }}>Performance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemSales.slice(0, 10).map((item, index) => {
                    const maxRevenue = itemSales[0]?.revenue || 1;
                    const percentage = (item.revenue / maxRevenue) * 100;
                    return (
                      <TableRow key={item.productId} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              variant="rounded"
                              src={item.imageUrl?.startsWith('/uploads') 
                                ? `http://localhost:3001${item.imageUrl}` 
                                : item.imageUrl}
                              sx={{ width: 40, height: 40 }}
                            >
                              {item.productName[0]}
                            </Avatar>
                            <Typography fontWeight="500">{item.productName}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={item.quantity} color="primary" size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="600">{item.revenue.toLocaleString()} DJF</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{ flex: 1, height: 8, borderRadius: 4 }}
                              color="warning"
                            />
                            <Typography variant="caption" sx={{ minWidth: 40 }}>
                              {percentage.toFixed(0)}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );

      case 'category':
        return (
          <Paper sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Sales by Category
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categorySales}
                        dataKey="revenue"
                        nameKey="categoryName"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        label={({ categoryName, percentage }) => `${categoryName}: ${percentage.toFixed(0)}%`}
                      >
                        {categorySales.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} DJF`} />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={7}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Items</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Revenue</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Share</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categorySales.map((cat, index) => (
                          <TableRow key={cat.categoryId}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: COLORS[index % COLORS.length] }} />
                                <CategoryIcon fontSize="small" color="action" />
                                {cat.categoryName}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={cat.quantity} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="600">{cat.revenue.toLocaleString()} DJF</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={`${cat.percentage.toFixed(1)}%`} 
                                size="small" 
                                color={cat.percentage > 30 ? 'success' : cat.percentage > 15 ? 'warning' : 'default'}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        );

      case 'discounts':
        const ordersWithDiscount = sales.filter(s => s.discount > 0);
        const avgDiscount = ordersWithDiscount.length > 0 
          ? summary.totalDiscounts / ordersWithDiscount.length 
          : 0;
        const discountPercentage = summary.grossSales > 0 
          ? (summary.totalDiscounts / summary.grossSales) * 100 
          : 0;

        return (
          <Paper sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Discount Analysis
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <DiscountIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">{summary.totalDiscounts.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Discounts (DJF)</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <OrdersIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">{ordersWithDiscount.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Orders with Discount</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <AverageIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">{avgDiscount.toFixed(0)}</Typography>
                  <Typography variant="body2" color="text.secondary">Avg Discount (DJF)</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <TrendingDownIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">{discountPercentage.toFixed(1)}%</Typography>
                  <Typography variant="body2" color="text.secondary">Discount Rate</Typography>
                </Paper>
              </Grid>
            </Grid>

            {ordersWithDiscount.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'background.default' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Original</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Discount</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Final</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ordersWithDiscount.slice(0, 10).map(sale => (
                      <TableRow key={sale.id} hover>
                        <TableCell>
                          <Typography fontWeight="500" color="primary.main">
                            #{sale.id.toString().padStart(6, '0')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(sale.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          {(sale.total + sale.discount).toLocaleString()} DJF
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`-${sale.discount.toLocaleString()} DJF`} 
                            size="small" 
                            color="error"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="600">{sale.total.toLocaleString()} DJF</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <DiscountIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary">No discounts applied in this period</Typography>
              </Box>
            )}
          </Paper>
        );

      default: // summary
        return (
          <>
            {/* Sales Chart */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  Sales Trend
                </Typography>
                <Chip 
                  label={`${dailySales.length} days`} 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
              {dailySales.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={dailySales}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ff6b35" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        if (parseInt(dateRange) <= 7) {
                          return d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' });
                        } else if (parseInt(dateRange) <= 30) {
                          return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                        } else {
                          return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                        }
                      }}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: '#e0e0e0' }}
                      interval={parseInt(dateRange) > 30 ? Math.floor(dailySales.length / 10) : 0}
                    />
                    <YAxis 
                      tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString()}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      width={50}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <Paper sx={{ p: 1.5, boxShadow: 3 }}>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(label).toLocaleDateString('en', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold" color="warning.main">
                                {(payload[0].value as number).toLocaleString()} DJF
                              </Typography>
                              {payload[0].payload.orders && (
                                <Typography variant="caption" color="text.secondary">
                                  {payload[0].payload.orders} orders
                                </Typography>
                              )}
                            </Paper>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#ff6b35"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                      dot={{ fill: '#ff6b35', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 6, stroke: '#ff6b35', strokeWidth: 2, fill: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">No sales data for this period</Typography>
                </Box>
              )}
            </Paper>

            {/* Summary Table */}
            <Paper sx={{ borderRadius: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'background.default' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Gross Sales</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="600">{summary.grossSales.toLocaleString()} DJF</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Discounts</TableCell>
                      <TableCell align="right">
                        <Typography color="error.main">-{summary.totalDiscounts.toLocaleString()} DJF</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ bgcolor: 'success.light' }}>
                      <TableCell><Typography fontWeight="600">Net Sales</Typography></TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold" color="success.dark">{summary.netSales.toLocaleString()} DJF</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Orders</TableCell>
                      <TableCell align="right">{summary.totalOrders}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Items Sold</TableCell>
                      <TableCell align="right">{summary.totalItems}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average Order Value</TableCell>
                      <TableCell align="right">{summary.averageOrder.toLocaleString(undefined, { maximumFractionDigits: 0 })} DJF</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        );
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Sales Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboard • Reports
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              startAdornment={<DateIcon sx={{ mr: 1, color: 'text.secondary' }} />}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="365">Last Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left Sidebar - Report Types */}
        <Paper sx={{ width: 240, p: 1, borderRadius: 3, height: 'fit-content' }}>
          <List>
            {reportMenuItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={selectedReport === item.id}
                  onClick={() => setSelectedReport(item.id)}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'warning.light',
                      color: 'warning.dark',
                      '&:hover': { bgcolor: 'warning.light' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2.5, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'warning.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RevenueIcon sx={{ color: 'warning.main' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Revenue
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {summary.netSales.toLocaleString()} DJF
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2.5, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'success.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <OrdersIcon sx={{ color: 'success.main' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Orders
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {summary.totalOrders}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2.5, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'info.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AverageIcon sx={{ color: 'info.main' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Average Order
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {summary.averageOrder.toLocaleString(undefined, { maximumFractionDigits: 0 })} DJF
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Dynamic Report Content */}
          {renderReportContent()}
        </Box>
      </Box>
    </Box>
  );
}

export default SalesReportPage;
