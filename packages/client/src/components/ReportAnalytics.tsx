import {
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Paper,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';
import { useEffect, useState, useContext } from 'react';
import { DashboardContext } from './DashboardContext';

interface Category {
  id: number;
  name: string;
}

interface DailySale {
  date: string;
  total: number;
  orders?: number;
}

interface ReportAnalyticsProps {
  totalSales: {
    total: number;
    growth: number;
  };
}

function ReportAnalytics({ totalSales }: ReportAnalyticsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  const [average, setAverage] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'year'>('week');

  const context = useContext(DashboardContext);
  const dateRange = context?.dateRange || 'monthly';

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch('http://localhost:3001/api/categories', { headers });
      if (response.ok) {
        const data = await response.json();
        setCategories([{ id: 0, name: 'All' }, ...data]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDailySales = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch all sales
      const salesResponse = await fetch('http://localhost:3001/api/sales', { headers });
      if (salesResponse.ok) {
        const allSales = await salesResponse.json();
        
        // Filter by category if needed
        const categoryId = categories[selectedTab]?.id;
        let filteredSales = allSales;
        
        if (categoryId && categoryId !== 0) {
          filteredSales = allSales.filter((sale: any) =>
            sale.items.some((item: any) => item.product?.category?.id === categoryId)
          );
        }

        // Calculate date range
        const now = new Date();
        let startDate: Date;
        
        switch (viewMode) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        // Filter by date
        filteredSales = filteredSales.filter((sale: any) => 
          new Date(sale.createdAt) >= startDate
        );

        // Group by date
        const salesByDate: Record<string, { total: number; orders: number }> = {};
        
        // Initialize all dates in range
        const currentDate = new Date(startDate);
        while (currentDate <= now) {
          const dateKey = currentDate.toISOString().split('T')[0];
          salesByDate[dateKey] = { total: 0, orders: 0 };
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Fill with actual sales data
        filteredSales.forEach((sale: any) => {
          const dateKey = new Date(sale.createdAt).toISOString().split('T')[0];
          if (salesByDate[dateKey]) {
            salesByDate[dateKey].total += sale.total;
            salesByDate[dateKey].orders += 1;
          }
        });

        // Convert to array
        const salesArray = Object.entries(salesByDate)
          .map(([date, data]) => ({
            date,
            total: data.total,
            orders: data.orders,
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setDailySales(salesArray);
        
        // Calculate average
        const totalSum = salesArray.reduce((sum, day) => sum + day.total, 0);
        setAverage(salesArray.length > 0 ? totalSum / salesArray.length : 0);
      }
    };

    if (categories.length > 0) {
      fetchDailySales();
    }
  }, [selectedTab, categories, viewMode]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'week' | 'month' | 'year' | null) => {
    if (newMode) setViewMode(newMode);
  };

  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    if (viewMode === 'week') {
      return date.toLocaleDateString('en', { weekday: 'short', day: 'numeric' });
    } else if (viewMode === 'month') {
      return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en', { month: 'short' });
    }
  };

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const previousTotal = totalSales.total / (1 + totalSales.growth / 100);
  const growthValue = totalSales.total - previousTotal;
  const isPositiveGrowth = totalSales.growth >= 0;

  const currentPeriodTotal = dailySales.reduce((sum, day) => sum + day.total, 0);
  const currentPeriodOrders = dailySales.reduce((sum, day) => sum + (day.orders || 0), 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Typography variant="subtitle2" fontWeight="600">
            {formatTooltipDate(label)}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="warning.main">
              Sales: <strong>{payload[0].value.toLocaleString()} DJF</strong>
            </Typography>
            {payload[0].payload.orders !== undefined && (
              <Typography variant="body2" color="text.secondary">
                Orders: {payload[0].payload.orders}
              </Typography>
            )}
          </Box>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header with Category Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="600">
            Sales Analytics
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="year">Year</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map((category) => (
              <Tab 
                label={category.name} 
                key={category.id}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Chart */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">
              {viewMode === 'week' ? 'Last 7 Days' : viewMode === 'month' ? 'Last 30 Days' : 'Last 12 Months'}
            </Typography>
            {average > 0 && (
              <Chip 
                label={`Avg: ${average.toLocaleString(undefined, { maximumFractionDigits: 0 })} DJF/day`} 
                size="small" 
                variant="outlined"
                sx={{ ml: 'auto' }}
              />
            )}
          </Box>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={dailySales}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              {average > 0 && (
                <ReferenceLine 
                  y={average} 
                  stroke="#9e9e9e" 
                  strokeDasharray="5 5"
                  label={{ 
                    value: 'Average', 
                    position: 'right', 
                    fill: '#9e9e9e', 
                    fontSize: 11 
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="total"
                stroke="#ff6b35"
                strokeWidth={3}
                fill="url(#colorRevenue)"
                dot={{ fill: '#ff6b35', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ff6b35', strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                borderColor: 'warning.main',
                borderWidth: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Period Revenue
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {currentPeriodTotal.toLocaleString()} DJF
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentPeriodOrders} orders
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Growth Amount
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isPositiveGrowth ? (
                  <TrendingUpIcon color="success" />
                ) : (
                  <TrendingDownIcon color="error" />
                )}
                <Typography 
                  variant="h5" 
                  fontWeight="bold"
                  color={isPositiveGrowth ? 'success.main' : 'error.main'}
                >
                  {isPositiveGrowth ? '+' : ''}{growthValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} DJF
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                bgcolor: isPositiveGrowth ? 'success.light' : 'error.light',
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Growth Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isPositiveGrowth ? (
                  <TrendingUpIcon sx={{ color: 'success.dark' }} />
                ) : (
                  <TrendingDownIcon sx={{ color: 'error.dark' }} />
                )}
                <Typography 
                  variant="h5" 
                  fontWeight="bold"
                  color={isPositiveGrowth ? 'success.dark' : 'error.dark'}
                >
                  {isPositiveGrowth ? '+' : ''}{totalSales.growth.toFixed(1)}%
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                vs previous period
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ReportAnalytics;
