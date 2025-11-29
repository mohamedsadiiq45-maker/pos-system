import {
  Typography,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import {
  TrendingUp as SalesIcon,
  ShoppingCart as ProductsIcon,
  People as CustomersIcon,
  AccountBalance as ProfitIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import SummaryCard from './SummaryCard';
import ReportAnalytics from './ReportAnalytics';
import TopSellingProducts from './TopSellingProducts';

function Dashboard() {
  const [totalSales, setTotalSales] = useState({ total: 0, growth: 0 });
  const [totalProductsSold, setTotalProductsSold] = useState({ total: 0, growth: 0 });
  const [totalUsers, setTotalUsers] = useState({ total: 0, growth: 0 });
  const [netProfit, setNetProfit] = useState({ profit: 0, growth: 0 });

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const salesResponse = await fetch('http://localhost:3001/api/sales/summary', { headers });
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setTotalSales(salesData);
      }

      const productsResponse = await fetch('http://localhost:3001/api/products/summary', { headers });
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setTotalProductsSold({ total: productsData.totalProductsSold, growth: productsData.growth });
      }

      const usersResponse = await fetch('http://localhost:3001/api/users/summary', { headers });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setTotalUsers({ total: usersData.totalUsers, growth: usersData.growth });
      }

      const profitResponse = await fetch('http://localhost:3001/api/sales/net-profit', { headers });
      if (profitResponse.ok) {
        const profitData = await profitResponse.json();
        setNetProfit({ profit: profitData.netProfit, growth: profitData.growth });
      }
    };
    fetchSummary();
  }, []);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening with your store.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Sales"
            value={`${(totalSales.total || 0).toFixed(2)} DJF`}
            growth={totalSales.growth || 0}
            icon={<SalesIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Products Sold"
            value={String(totalProductsSold.total || 0)}
            growth={totalProductsSold.growth || 0}
            icon={<ProductsIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Customers"
            value={String(totalUsers.total || 0)}
            growth={totalUsers.growth || 0}
            icon={<CustomersIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Net Profit"
            value={`${(netProfit.profit || 0).toFixed(2)} DJF`}
            growth={netProfit.growth || 0}
            icon={<ProfitIcon />}
            color="info"
          />
        </Grid>

        {/* Report Analytics Section (Left) */}
        <Grid item xs={12} md={8}>
          <ReportAnalytics totalSales={totalSales} />
        </Grid>

        {/* Top-Selling Products Panel (Right) */}
        <Grid item xs={12} md={4}>
          <TopSellingProducts />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
