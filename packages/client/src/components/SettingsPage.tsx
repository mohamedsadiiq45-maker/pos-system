import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment,
  Avatar,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Store as StoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  Payments as CurrencyIcon,
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  Save as SaveIcon,
  Restore as ResetIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon,
  PointOfSale as POSIcon,
  Percent as TaxIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface Settings {
  shopName: string;
  shopTagline: string;
  shopEmail: string;
  shopPhone: string;
  shopAddress: string;
  shopWebsite: string;
  currency: string;
  currencySymbol: string;
  taxRate: string;
  taxEnabled: string;
  receiptFooter: string;
  lowStockThreshold: string;
  logoUrl: string;
}

const defaultSettings: Settings = {
  shopName: 'Super Electronics',
  shopTagline: 'Your Electronics Partner',
  shopEmail: 'contact@superelectronics.com',
  shopPhone: '+253 77 00 00 00',
  shopAddress: 'Djibouti City, Djibouti',
  shopWebsite: 'www.superelectronics.com',
  currency: 'DJF',
  currencySymbol: 'DJF',
  taxRate: '0',
  taxEnabled: 'false',
  receiptFooter: 'Thank you for shopping with us!',
  lowStockThreshold: '10',
  logoUrl: '/logo.svg',
};

type SettingsSection = 'business' | 'currency' | 'pos' | 'inventory';

function SettingsPage() {
  const { user } = useAuth();
  const { refreshSettings: refreshGlobalSettings } = useSettings();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' });
  const [resetDialog, setResetDialog] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>('business');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    // Check if settings have changed
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, originalSettings]);

  const fetchSettings = async () => {
    try {
      console.log('Fetching settings...');
      const response = await fetch('http://localhost:3001/api/settings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Settings loaded:', data);
        setSettings(data);
        setOriginalSettings(data);
      } else {
        console.error('Failed to fetch settings:', response.status);
        setSnackbar({ open: true, message: 'Failed to load settings', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setSnackbar({ open: true, message: 'Failed to connect to server', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving settings:', settings);
      const response = await fetch('http://localhost:3001/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Settings saved successfully:', data);
        setSettings(data);
        setOriginalSettings(data);
        // Refresh global settings so sidebar updates
        await refreshGlobalSettings();
        setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' });
      } else {
        const errorData = await response.json();
        console.error('Failed to save settings:', errorData);
        throw new Error(errorData.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      setSnackbar({ open: true, message: 'Failed to save settings. Please try again.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/settings/reset', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setOriginalSettings(data);
        // Refresh global settings so sidebar updates
        await refreshGlobalSettings();
        setSnackbar({ open: true, message: 'Settings reset to defaults!', severity: 'success' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to reset settings', severity: 'error' });
    }
    setResetDialog(false);
  };

  const handleChange = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [key]: e.target.value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newLogoUrl = data.imageUrl;
        
        // Update local state
        const updatedSettings = { ...settings, logoUrl: newLogoUrl };
        setSettings(updatedSettings);
        
        // Auto-save the logo to database
        const saveResponse = await fetch('http://localhost:3001/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(updatedSettings),
        });

        if (saveResponse.ok) {
          const savedData = await saveResponse.json();
          setSettings(savedData);
          setOriginalSettings(savedData);
          // Refresh global settings so sidebar updates with new logo
          await refreshGlobalSettings();
          setSnackbar({ open: true, message: 'Logo uploaded and saved!', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Logo uploaded but failed to save. Click Save Changes.', severity: 'warning' });
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      setSnackbar({ open: true, message: 'Failed to upload logo', severity: 'error' });
    }
  };

  const menuItems = [
    { id: 'business' as SettingsSection, label: 'Business Info', icon: <BusinessIcon /> },
    { id: 'currency' as SettingsSection, label: 'Currency & Tax', icon: <CurrencyIcon /> },
    { id: 'pos' as SettingsSection, label: 'POS & Receipts', icon: <POSIcon /> },
    { id: 'inventory' as SettingsSection, label: 'Inventory', icon: <InventoryIcon /> },
  ];

  const renderBusinessSettings = () => (
    <Box>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        Business Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure your shop details that appear on receipts and throughout the system.
      </Typography>

      {/* Logo Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Shop Logo
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 2 }}>
          <Avatar
            src={settings.logoUrl.startsWith('/') ? settings.logoUrl : `http://localhost:3001${settings.logoUrl}`}
            sx={{ width: 100, height: 100, bgcolor: 'background.default' }}
            variant="rounded"
          >
            <StoreIcon sx={{ fontSize: 48 }} />
          </Avatar>
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload New Logo
              <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
            </Button>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              Recommended: 200x200px, PNG or SVG
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Shop Details */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Shop Details
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Shop Name"
              value={settings.shopName}
              onChange={handleChange('shopName')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StoreIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tagline"
              value={settings.shopTagline}
              onChange={handleChange('shopTagline')}
              placeholder="Your catchy tagline"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={settings.shopEmail}
              onChange={handleChange('shopEmail')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={settings.shopPhone}
              onChange={handleChange('shopPhone')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={settings.shopAddress}
              onChange={handleChange('shopAddress')}
              multiline
              rows={2}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Website"
              value={settings.shopWebsite}
              onChange={handleChange('shopWebsite')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WebsiteIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  const renderCurrencySettings = () => (
    <Box>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        Currency & Tax Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure currency display and tax calculation settings.
      </Typography>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Currency
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Currency Code"
              value={settings.currency}
              onChange={handleChange('currency')}
              placeholder="e.g., DJF, USD, EUR"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Currency Symbol"
              value={settings.currencySymbol}
              onChange={handleChange('currencySymbol')}
              placeholder="e.g., DJF, $, €"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Tax Settings
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.taxEnabled === 'true'}
                  onChange={(e) => setSettings({ ...settings, taxEnabled: e.target.checked ? 'true' : 'false' })}
                  color="warning"
                />
              }
              label="Enable Tax Calculation"
            />
          </Grid>
          {settings.taxEnabled === 'true' && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tax Rate"
                type="number"
                value={settings.taxRate}
                onChange={handleChange('taxRate')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TaxIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );

  const renderPOSSettings = () => (
    <Box>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        POS & Receipt Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure how receipts look and POS behavior.
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Receipt Customization
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Receipt Footer Message"
              value={settings.receiptFooter}
              onChange={handleChange('receiptFooter')}
              multiline
              rows={2}
              placeholder="Message to display at the bottom of receipts"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ReceiptIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* Receipt Preview */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Receipt Preview
          </Typography>
          <Card variant="outlined" sx={{ maxWidth: 300, mx: 'auto', mt: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Avatar
                src={settings.logoUrl.startsWith('/') ? settings.logoUrl : `http://localhost:3001${settings.logoUrl}`}
                sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
                variant="rounded"
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {settings.shopName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {settings.shopTagline}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="caption" display="block">
                {settings.shopAddress}
              </Typography>
              <Typography variant="caption" display="block">
                {settings.shopPhone}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" sx={{ my: 1 }}>
                --- Items ---
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                <Typography variant="caption">Sample Item x1</Typography>
                <Typography variant="caption">100 {settings.currencySymbol}</Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                <Typography variant="body2" fontWeight="bold">Total</Typography>
                <Typography variant="body2" fontWeight="bold">100 {settings.currencySymbol}</Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {settings.receiptFooter}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Box>
  );

  const renderInventorySettings = () => (
    <Box>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        Inventory Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure inventory alerts and thresholds.
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Stock Alerts
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Low Stock Threshold"
              type="number"
              value={settings.lowStockThreshold}
              onChange={handleChange('lowStockThreshold')}
              helperText="Products below this quantity will be marked as low stock"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InventoryIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">units</InputAdornment>,
              }}
              inputProps={{ min: 1 }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography>Loading settings...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboard • Settings
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ResetIcon />}
            onClick={() => setResetDialog(true)}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {hasChanges && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          You have unsaved changes. Don't forget to save!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Sidebar Menu */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'warning.main', color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon />
                <Typography variant="subtitle1" fontWeight="600">
                  Settings Menu
                </Typography>
              </Box>
            </Box>
            <List sx={{ py: 0 }}>
              {menuItems.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    selected={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    sx={{
                      '&.Mui-selected': {
                        borderLeft: '3px solid',
                        borderColor: 'warning.main',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: activeSection === item.id ? 'warning.main' : 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: activeSection === item.id ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Settings Content */}
        <Grid item xs={12} md={9}>
          {activeSection === 'business' && renderBusinessSettings()}
          {activeSection === 'currency' && renderCurrencySettings()}
          {activeSection === 'pos' && renderPOSSettings()}
          {activeSection === 'inventory' && renderInventorySettings()}
        </Grid>
      </Grid>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialog} onClose={() => setResetDialog(false)}>
        <DialogTitle>Reset Settings?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all settings to their default values? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setResetDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleReset} variant="contained" color="error">
            Reset All Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SettingsPage;

