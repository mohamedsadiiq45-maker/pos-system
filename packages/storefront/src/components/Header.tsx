import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  InputBase,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Button,
  Divider,
  Container,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ShoppingCart,
  Search,
  Menu as MenuIcon,
  Close,
  Phone,
  Email,
  Person,
  Favorite,
  KeyboardArrowDown,
  LocalShipping,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useCategories } from '../hooks/useCategories';
import { API_URL } from '../config';

const TopBar = styled(Box)({
  background: '#0f172a',
  color: '#94a3b8',
  fontSize: '0.8rem',
  padding: '8px 0',
});

const MainHeader = styled(AppBar)({
  background: '#ffffff',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
});

const LogoWrapper = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  color: '#0f172a',
  fontWeight: 800,
  fontSize: '1.5rem',
  fontFamily: 'Outfit, sans-serif',
  '& .accent': {
    color: '#2563eb',
  },
});

const LogoImage = styled('img')({
  height: '40px',
  width: 'auto',
  objectFit: 'contain',
});

const SearchWrapper = styled('div')({
  display: 'flex',
  flex: 1,
  maxWidth: '600px',
  margin: '0 32px',
  '@media (max-width: 900px)': {
    display: 'none',
  },
});

const SearchInput = styled(InputBase)({
  flex: 1,
  padding: '10px 16px',
  background: '#f8fafc',
  border: '2px solid #e2e8f0',
  borderRight: 'none',
  borderRadius: '8px 0 0 8px',
  fontFamily: 'Outfit, sans-serif',
  '&:focus-within': {
    borderColor: '#2563eb',
  },
});

const SearchButton = styled(Button)({
  background: '#2563eb',
  color: '#ffffff',
  padding: '0 24px',
  borderRadius: '0 8px 8px 0',
  minWidth: 'auto',
  '&:hover': {
    background: '#1d4ed8',
  },
});

const NavLinks = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  '@media (max-width: 900px)': {
    display: 'none',
  },
});

const NavLink = styled(Button)({
  color: '#0f172a',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  padding: '8px 16px',
  fontFamily: 'Outfit, sans-serif',
  '&:hover': {
    color: '#2563eb',
    background: 'rgba(37, 99, 235, 0.08)',
  },
});

const IconButtonStyled = styled(IconButton)({
  color: '#0f172a',
  '&:hover': {
    background: 'rgba(37, 99, 235, 0.08)',
    color: '#2563eb',
  },
});

const CartButton = styled(Button)({
  background: '#2563eb',
  color: '#ffffff',
  fontWeight: 600,
  fontFamily: 'Outfit, sans-serif',
  borderRadius: '8px',
  padding: '8px 20px',
  textTransform: 'none',
  gap: '8px',
  '&:hover': {
    background: '#1d4ed8',
  },
});

const StyledBadge = styled(Badge)({
  '& .MuiBadge-badge': {
    background: '#ef4444',
    color: '#ffffff',
    fontWeight: 600,
    fontFamily: 'Outfit, sans-serif',
    fontSize: '0.7rem',
  },
});

const MobileDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    width: '300px',
    background: '#ffffff',
  },
});

const CategoriesNav = styled(Box)({
  background: '#2563eb',
  display: 'none',
  '@media (min-width: 900px)': {
    display: 'block',
  },
});

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesAnchor, setCategoriesAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { getItemCount, getTotal } = useCart();
  const { settings } = useSettings();
  const { parentCategories } = useCategories();

  // Get logo URL - handle both relative and absolute paths
  const getLogoUrl = () => {
    if (!settings.logoUrl || settings.logoUrl === '/logo.svg') {
      return '/logo.svg';
    }
    if (settings.logoUrl.startsWith('http')) {
      return settings.logoUrl;
    }
    return `${API_URL}${settings.logoUrl}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <LogoWrapper to="/" onClick={() => setMobileOpen(false)}>
          <LogoImage 
            src={getLogoUrl()} 
            alt={settings.shopName || 'Store'} 
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
          />
          <span>{settings.shopName || 'ElectroHub'}</span>
        </LogoWrapper>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <Divider />

      {/* Mobile Search */}
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <SearchInput
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, borderRadius: '8px', borderRight: '2px solid #e2e8f0' }}
            />
            <SearchButton type="submit" sx={{ borderRadius: '8px' }}>
              <Search />
            </SearchButton>
          </Box>
        </form>
      </Box>
      <Divider />

      <List sx={{ flex: 1, p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" onClick={() => setMobileOpen(false)}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/products" onClick={() => setMobileOpen(false)}>
            <ListItemText primary="All Products" />
          </ListItemButton>
        </ListItem>

        <Typography variant="overline" sx={{ color: '#64748b', px: 2, pt: 2, display: 'block' }}>
          Categories
        </Typography>

        {parentCategories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton component={Link} to={`/category/${category.id}`} onClick={() => setMobileOpen(false)}>
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          component={Link}
          to="/cart"
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={() => setMobileOpen(false)}
          sx={{
            background: '#2563eb',
            fontWeight: 600,
            fontFamily: 'Outfit',
            borderRadius: '10px',
            py: 1.5,
            '&:hover': { background: '#1d4ed8' },
          }}
        >
          Cart ({getItemCount()}) - ${getTotal().toFixed(2)}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Top Bar */}
      <TopBar>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {(settings.shopPhone || settings.storePhone) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Phone sx={{ fontSize: '0.9rem' }} />
                <span>{settings.storePhone || settings.shopPhone}</span>
              </Box>
            )}
            {(settings.shopEmail || settings.storeEmail) && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                <Email sx={{ fontSize: '0.9rem' }} />
                <span>{settings.storeEmail || settings.shopEmail}</span>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping sx={{ fontSize: '0.9rem' }} />
            <span>Free Shipping on Orders Over $50</span>
          </Box>
        </Container>
      </TopBar>

      {/* Main Header */}
      <MainHeader position="sticky" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1 }}>
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' }, color: '#0f172a' }}
            >
              <MenuIcon />
            </IconButton>

            <LogoWrapper to="/">
              <LogoImage 
                src={getLogoUrl()} 
                alt={settings.shopName || 'Store'} 
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
              />
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.1, fontFamily: 'Outfit' }}>
                  {settings.shopName || 'ElectroHub'}
                </Typography>
                {settings.shopTagline && (
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1, fontFamily: 'Outfit' }}>
                    {settings.shopTagline}
                  </Typography>
                )}
              </Box>
            </LogoWrapper>

            <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <SearchWrapper>
                <SearchInput
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchButton type="submit">
                  <Search />
                </SearchButton>
              </SearchWrapper>
            </form>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButtonStyled sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Person />
              </IconButtonStyled>
              <IconButtonStyled sx={{ display: { xs: 'none', md: 'flex' } }}>
                <StyledBadge badgeContent={0}>
                  <Favorite />
                </StyledBadge>
              </IconButtonStyled>

              <CartButton component={Link} to="/cart">
                <StyledBadge badgeContent={getItemCount()} max={99}>
                  <ShoppingCart />
                </StyledBadge>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
                  <Typography sx={{ fontSize: '0.7rem', opacity: 0.8, lineHeight: 1 }}>Your Cart</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.2 }}>${getTotal().toFixed(2)}</Typography>
                </Box>
              </CartButton>
            </Box>
          </Toolbar>
        </Container>
      </MainHeader>

      {/* Categories Navigation */}
      <CategoriesNav>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              onClick={(e) => setCategoriesAnchor(e.currentTarget)}
              endIcon={<KeyboardArrowDown />}
              sx={{
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                fontFamily: 'Outfit',
                py: 1.5,
                px: 2,
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 0,
                '&:hover': { background: 'rgba(0,0,0,0.3)' },
              }}
            >
              All Categories
            </Button>
            <Menu
              anchorEl={categoriesAnchor}
              open={Boolean(categoriesAnchor)}
              onClose={() => setCategoriesAnchor(null)}
              PaperProps={{
                sx: { minWidth: 220, mt: 0.5 },
              }}
            >
              {parentCategories.map((cat) => (
                <MenuItem
                  key={cat.id}
                  component={Link}
                  to={`/category/${cat.id}`}
                  onClick={() => setCategoriesAnchor(null)}
                  sx={{ fontFamily: 'Outfit' }}
                >
                  {cat.name}
                </MenuItem>
              ))}
            </Menu>

            <NavLinks sx={{ ml: 2 }}>
              <NavLink component={Link} to="/" sx={{ color: '#fff', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' } }}>Home</NavLink>
              <NavLink component={Link} to="/products" sx={{ color: '#fff', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' } }}>Shop</NavLink>
              {parentCategories.slice(0, 5).map((cat) => (
                <NavLink key={cat.id} component={Link} to={`/category/${cat.id}`} sx={{ color: '#fff', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' } }}>
                  {cat.name}
                </NavLink>
              ))}
            </NavLinks>
          </Box>
        </Container>
      </CategoriesNav>

      <MobileDrawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}>
        {drawer}
      </MobileDrawer>
    </>
  );
};

export default Header;
