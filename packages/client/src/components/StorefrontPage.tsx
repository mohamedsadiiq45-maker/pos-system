import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Storefront as StorefrontIcon,
  ViewCarousel as SliderIcon,
  LocalOffer as DealIcon,
  Business as BrandIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

interface StoreInfo {
  storeName: string;
  storeTagline: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  storeAbout: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

interface Stats {
  sliders: number;
  deals: number;
  brands: number;
  featuredSections: number;
}

const StorefrontPage = () => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    storeName: '',
    storeTagline: '',
    storePhone: '',
    storeEmail: '',
    storeAddress: '',
    storeAbout: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
  });
  const [stats, setStats] = useState<Stats>({ sliders: 0, deals: 0, brands: 0, featuredSections: 0 });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchStoreInfo();
    fetchStats();
  }, []);

  const fetchStoreInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/api/storefront/store-info`);
      const data = await res.json();
      setStoreInfo({
        storeName: data.storeName || '',
        storeTagline: data.storeTagline || '',
        storePhone: data.storePhone || '',
        storeEmail: data.storeEmail || '',
        storeAddress: data.storeAddress || '',
        storeAbout: data.storeAbout || '',
        facebookUrl: data.facebookUrl || '',
        twitterUrl: data.twitterUrl || '',
        instagramUrl: data.instagramUrl || '',
        youtubeUrl: data.youtubeUrl || '',
      });
    } catch (error) {
      console.error('Error fetching store info:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [sliders, deals, brands, sections] = await Promise.all([
        fetch(`${API_URL}/api/storefront/sliders`).then(r => r.json()),
        fetch(`${API_URL}/api/storefront/deals`).then(r => r.json()),
        fetch(`${API_URL}/api/storefront/brands`).then(r => r.json()),
        fetch(`${API_URL}/api/storefront/featured-sections`).then(r => r.json()),
      ]);
      setStats({
        sliders: sliders.length,
        deals: deals.length,
        brands: brands.length,
        featuredSections: sections.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/storefront/store-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeInfo),
      });
      if (res.ok) {
        setSnackbar({ open: true, message: 'Store info saved successfully!', severity: 'success' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save store info', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { title: 'Sliders', count: stats.sliders, icon: <SliderIcon />, path: '/storefront/sliders', color: '#2196f3' },
    { title: 'Deals', count: stats.deals, icon: <DealIcon />, path: '/storefront/deals', color: '#f44336' },
    { title: 'Brands', count: stats.brands, icon: <BrandIcon />, path: '/storefront/brands', color: '#4caf50' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Storefront Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your online store content and appearance
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<OpenIcon />}
          href="http://localhost:5175"
          target="_blank"
        >
          View Store
        </Button>
      </Box>

      {/* Quick Links */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickLinks.map((link) => (
          <Grid item xs={12} sm={6} md={4} key={link.title}>
            <Card
              component={Link}
              to={link.path}
              sx={{
                textDecoration: 'none',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: `${link.color}15`,
                    color: link.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {link.icon}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {link.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {link.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Store Information */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <StorefrontIcon /> Store Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Store Name"
              value={storeInfo.storeName}
              onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })}
              placeholder="ElectroHub"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tagline"
              value={storeInfo.storeTagline}
              onChange={(e) => setStoreInfo({ ...storeInfo, storeTagline: e.target.value })}
              placeholder="Your Premier Electronics Destination"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={storeInfo.storePhone}
              onChange={(e) => setStoreInfo({ ...storeInfo, storePhone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              value={storeInfo.storeEmail}
              onChange={(e) => setStoreInfo({ ...storeInfo, storeEmail: e.target.value })}
              placeholder="support@electrohub.com"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={storeInfo.storeAddress}
              onChange={(e) => setStoreInfo({ ...storeInfo, storeAddress: e.target.value })}
              placeholder="123 Tech Street, Digital City, DC 12345"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="About Us"
              value={storeInfo.storeAbout}
              onChange={(e) => setStoreInfo({ ...storeInfo, storeAbout: e.target.value })}
              placeholder="Your premier destination for cutting-edge electronics..."
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Social Media Links
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Facebook URL"
              value={storeInfo.facebookUrl}
              onChange={(e) => setStoreInfo({ ...storeInfo, facebookUrl: e.target.value })}
              placeholder="https://facebook.com/yourstore"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Twitter URL"
              value={storeInfo.twitterUrl}
              onChange={(e) => setStoreInfo({ ...storeInfo, twitterUrl: e.target.value })}
              placeholder="https://twitter.com/yourstore"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Instagram URL"
              value={storeInfo.instagramUrl}
              onChange={(e) => setStoreInfo({ ...storeInfo, instagramUrl: e.target.value })}
              placeholder="https://instagram.com/yourstore"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="YouTube URL"
              value={storeInfo.youtubeUrl}
              onChange={(e) => setStoreInfo({ ...storeInfo, youtubeUrl: e.target.value })}
              placeholder="https://youtube.com/yourstore"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

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

export default StorefrontPage;

