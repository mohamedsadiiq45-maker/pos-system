import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton, Divider, TextField, Button } from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Send,
  CreditCard,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSettings } from '../context/SettingsContext';
import { API_URL } from '../config';

const FooterWrapper = styled(Box)({
  background: '#0f172a',
  color: '#94a3b8',
  paddingTop: '64px',
  paddingBottom: '24px',
  marginTop: 'auto',
});

const LogoWrapper = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  color: '#ffffff',
  fontWeight: 800,
  fontSize: '1.5rem',
  fontFamily: 'Outfit, sans-serif',
  marginBottom: '16px',
  '& .accent': {
    color: '#2563eb',
  },
});

const LogoImage = styled('img')({
  height: '40px',
  width: 'auto',
  objectFit: 'contain',
});

const FooterLink = styled(Link)({
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '0.9rem',
  display: 'block',
  marginBottom: '12px',
  transition: 'all 0.2s ease',
  fontFamily: 'Outfit, sans-serif',
  '&:hover': {
    color: '#ffffff',
    paddingLeft: '8px',
  },
});

const FooterTitle = styled(Typography)({
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '1.1rem',
  marginBottom: '24px',
  fontFamily: 'Outfit, sans-serif',
});

const ContactItem = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  marginBottom: '16px',
  color: '#94a3b8',
  fontSize: '0.9rem',
  fontFamily: 'Outfit, sans-serif',
  '& svg': {
    color: '#2563eb',
    fontSize: '1.2rem',
    marginTop: '2px',
  },
});

const SocialButton = styled(IconButton)({
  color: '#94a3b8',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  marginRight: '10px',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#ffffff',
    backgroundColor: '#2563eb',
  },
});

const NewsletterInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    color: '#ffffff',
    fontFamily: 'Outfit, sans-serif',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2563eb',
    },
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#64748b',
    opacity: 1,
  },
});

const SubscribeButton = styled(Button)({
  background: '#2563eb',
  color: '#ffffff',
  fontWeight: 600,
  fontFamily: 'Outfit, sans-serif',
  padding: '12px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  '&:hover': {
    background: '#1d4ed8',
  },
});

const Footer: React.FC = () => {
  const { settings } = useSettings();

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

  return (
    <FooterWrapper>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <LogoWrapper to="/">
              <LogoImage 
                src={getLogoUrl()} 
                alt={settings.shopName || 'Store'} 
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
              />
              <span>{settings.shopName || 'ElectroHub'}</span>
            </LogoWrapper>
            <Typography sx={{ mb: 3, fontSize: '0.9rem', lineHeight: 1.8, fontFamily: 'Outfit' }}>
              {settings.storeAbout || settings.shopTagline || 'Your premier destination for cutting-edge electronics. We bring you the latest tech at unbeatable prices with exceptional customer service.'}
            </Typography>
            <Box>
              <SocialButton href={settings.facebookUrl || '#'} target="_blank"><Facebook /></SocialButton>
              <SocialButton href={settings.twitterUrl || '#'} target="_blank"><Twitter /></SocialButton>
              <SocialButton href={settings.instagramUrl || '#'} target="_blank"><Instagram /></SocialButton>
              <SocialButton href={settings.youtubeUrl || '#'} target="_blank"><YouTube /></SocialButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/products">Shop</FooterLink>
            <FooterLink to="/categories">Categories</FooterLink>
            <FooterLink to="/cart">Cart</FooterLink>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={6} md={2}>
            <FooterTitle>Support</FooterTitle>
            <FooterLink to="#">FAQ</FooterLink>
            <FooterLink to="#">Shipping Info</FooterLink>
            <FooterLink to="#">Returns</FooterLink>
            <FooterLink to="#">Track Order</FooterLink>
            <FooterLink to="#">Contact Us</FooterLink>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <FooterTitle>Contact Us</FooterTitle>
            {(settings.storeAddress || settings.shopAddress) && (
              <ContactItem>
                <LocationOn />
                <span>{settings.storeAddress || settings.shopAddress}</span>
              </ContactItem>
            )}
            {(settings.storePhone || settings.shopPhone) && (
              <ContactItem>
                <Phone />
                <span>{settings.storePhone || settings.shopPhone}</span>
              </ContactItem>
            )}
            {(settings.storeEmail || settings.shopEmail) && (
              <ContactItem>
                <Email />
                <span>{settings.storeEmail || settings.shopEmail}</span>
              </ContactItem>
            )}

            {/* Newsletter */}
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 2, fontFamily: 'Outfit' }}>
                Subscribe to Newsletter
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <NewsletterInput
                  placeholder="Enter your email"
                  size="small"
                  fullWidth
                />
                <SubscribeButton>
                  <Send />
                </SubscribeButton>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 4 }} />

        {/* Bottom Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', fontFamily: 'Outfit' }}>
            © {new Date().getFullYear()} {settings.shopName || 'ElectroHub'}. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '0.85rem', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCard sx={{ fontSize: '1.2rem' }} /> Secure Payment
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FooterLink to="#" style={{ marginBottom: 0, fontSize: '0.85rem' }}>Privacy Policy</FooterLink>
              <FooterLink to="#" style={{ marginBottom: 0, fontSize: '0.85rem' }}>Terms of Service</FooterLink>
            </Box>
          </Box>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
