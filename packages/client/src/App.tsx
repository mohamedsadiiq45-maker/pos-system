import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PointOfSale as POSIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  LocalShipping as SupplierIcon,
  Receipt as SalesIcon,
  People as UsersIcon,
  Assessment as ReportsIcon,
  Logout as LogoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  ShoppingCart as ProductIcon,
  Settings as SettingsIcon,
  PhotoLibrary as MediaIcon,
  Storefront as StorefrontIcon,
  ViewCarousel as SliderIcon,
  LocalOffer as DealIcon,
  Star as FeaturedIcon,
  Business as BrandIcon,
  Store as StoreInfoIcon,
} from '@mui/icons-material';
import { lightTheme, darkTheme } from './components/Theme';
import { useAuth, getRoleName, Permissions } from './context/AuthContext';
import { useSettings } from './context/SettingsContext';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  permission?: keyof Permissions;
  isNew?: boolean;
}

// Get initial theme from localStorage or system preference
const getInitialTheme = (): 'light' | 'dark' => {
  // First check localStorage for user's saved preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  
  // If no saved preference, check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, permissions, isLoading, logout, hasPermission } = useAuth();
  const { settings } = useSettings();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(getInitialTheme);

  // Listen for system theme changes (only if user hasn't set a preference)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      // Save user's preference to localStorage
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  };

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Menu items with permissions
  const mainMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/', permission: 'viewDashboard' },
    { label: 'POS', icon: <POSIcon />, path: '/sales/new', permission: 'accessPOS' },
    { label: 'Products', icon: <ProductIcon />, path: '/products', permission: 'viewProducts' },
    { label: 'Categories', icon: <CategoryIcon />, path: '/categories', permission: 'viewCategories' },
    { label: 'Inventory', icon: <InventoryIcon />, path: '/inventory', permission: 'viewInventory' },
  ];

  const offeringMenuItems: MenuItem[] = [
    { label: 'Sales', icon: <SalesIcon />, path: '/sales', permission: 'viewSalesHistory' },
    { label: 'Suppliers', icon: <SupplierIcon />, path: '/suppliers', permission: 'viewSuppliers' },
  ];

  const storefrontMenuItems: MenuItem[] = [
    { label: 'Storefront', icon: <StorefrontIcon />, path: '/storefront', permission: 'manageSettings', isNew: true },
    { label: 'Sliders', icon: <SliderIcon />, path: '/storefront/sliders', permission: 'manageSettings' },
    { label: 'Deals', icon: <DealIcon />, path: '/storefront/deals', permission: 'manageSettings' },
    { label: 'Brands', icon: <BrandIcon />, path: '/storefront/brands', permission: 'manageSettings' },
  ];

  const backOfficeMenuItems: MenuItem[] = [
    { label: 'Users', icon: <UsersIcon />, path: '/users', permission: 'viewUsers' },
    { label: 'Reports', icon: <ReportsIcon />, path: '/reports/sales', permission: 'viewReports' },
    { label: 'Media', icon: <MediaIcon />, path: '/media', permission: 'manageSettings' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings', permission: 'manageSettings' },
  ];

  // Filter menu items based on permissions
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter((item) => !item.permission || hasPermission(item.permission));
  };

  const filteredMainMenu = filterMenuItems(mainMenuItems);
  const filteredOfferingMenu = filterMenuItems(offeringMenuItems);
  const filteredStorefrontMenu = filterMenuItems(storefrontMenuItems);
  const filteredBackOfficeMenu = filterMenuItems(backOfficeMenuItems);

  const MenuSection = ({ title, items }: { title?: string; items: MenuItem[] }) => {
    if (items.length === 0) return null;
    
    return (
      <>
        {title && (
          <Typography
            variant="caption"
            sx={{
              px: 2,
              py: 1,
              display: 'block',
              color: 'text.secondary',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {title}
          </Typography>
        )}
        <List sx={{ px: 1 }}>
          {items.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    '&:hover': {
                      bgcolor: themeMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
                {item.isNew && (
                  <Chip
                    label="New"
                    size="small"
                    color="warning"
                    sx={{ height: 20, fontSize: '0.65rem' }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </>
    );
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 260,
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Logo */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src={settings.logoUrl.startsWith('/uploads') ? `http://localhost:3001${settings.logoUrl}` : settings.logoUrl}
              alt={settings.shopName}
              sx={{ width: 45, height: 45, objectFit: 'contain' }}
              onError={(e: any) => { e.target.src = '/logo.svg'; }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                {settings.shopName.split(' ')[0] || 'Super'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {settings.shopName.split(' ').slice(1).join(' ') || settings.shopTagline || 'Electronics'}
              </Typography>
            </Box>
          </Box>

          {/* User Profile */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Box
              component={Link}
              to="/profile"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'grey.100',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'grey.200',
                },
              }}
            >
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'warning.main' }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight="600" noWrap>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user ? getRoleName(user.role) : 'Guest'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Main Menu */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <MenuSection items={filteredMainMenu} />
            {filteredOfferingMenu.length > 0 && (
              <>
                <Divider sx={{ my: 1.5, mx: 2 }} />
                <MenuSection title="Offering" items={filteredOfferingMenu} />
              </>
            )}
            {filteredStorefrontMenu.length > 0 && (
              <>
                <Divider sx={{ my: 1.5, mx: 2 }} />
                <MenuSection title="Storefront" items={filteredStorefrontMenu} />
              </>
            )}
            {filteredBackOfficeMenu.length > 0 && (
              <>
                <Divider sx={{ my: 1.5, mx: 2 }} />
                <MenuSection title="Back Office" items={filteredBackOfficeMenu} />
              </>
            )}
          </Box>

          {/* Bottom Section */}
          <Box sx={{ p: 2 }}>
            {/* Theme Toggle */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1,
                mb: 1,
                borderRadius: 2,
                bgcolor: themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'grey.100',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {themeMode === 'light' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                <Typography variant="body2">
                  {themeMode === 'light' ? 'Light Mode' : 'Dark Mode'}
                </Typography>
              </Box>
              <Switch
                checked={themeMode === 'dark'}
                onChange={toggleTheme}
                size="small"
              />
            </Box>

            {/* Logout Button */}
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.light',
                  color: 'error.contrastText',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            bgcolor: themeMode === 'dark' ? 'background.default' : 'grey.50',
            overflow: 'auto',
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
