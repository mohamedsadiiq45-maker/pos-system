import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Skeleton, IconButton, Chip } from '@mui/material';
import {
  ArrowForward,
  ArrowBack,
  LocalShipping,
  Security,
  Support,
  CreditCard,
  KeyboardArrowRight,
  ShoppingCart,
  Favorite,
  Timer,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useHomepage } from '../hooks/useHomepage';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { getImageUrl } from '../config';
import ProductCard from '../components/ProductCard';

// Styled Components
const HeroSection = styled(Box)({
  position: 'relative',
  marginBottom: '24px',
});

const SliderContainer = styled(Box)({
  position: 'relative',
  borderRadius: '16px',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  minHeight: '400px',
});

const SlideContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '48px',
  transform: 'translateY(-50%)',
  zIndex: 2,
  maxWidth: '500px',
  '@media (max-width: 768px)': {
    left: '24px',
    right: '24px',
    maxWidth: 'none',
  },
});

const SlideImage = styled('img')({
  position: 'absolute',
  right: '5%',
  top: '50%',
  transform: 'translateY(-50%)',
  maxHeight: '80%',
  maxWidth: '45%',
  objectFit: 'contain',
  '@media (max-width: 768px)': {
    opacity: 0.3,
    right: 0,
    maxWidth: '60%',
  },
});

const SliderDots = styled(Box)({
  position: 'absolute',
  bottom: '24px',
  left: '48px',
  display: 'flex',
  gap: '8px',
  zIndex: 10,
});

const SliderDot = styled('button')<{ active: boolean }>(({ active }) => ({
  width: active ? '32px' : '10px',
  height: '10px',
  borderRadius: active ? '5px' : '50%',
  background: active ? '#ffffff' : 'rgba(255,255,255,0.4)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
}));

const SliderNav = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(255,255,255,0.9)',
  color: '#1e3a8a',
  zIndex: 10,
  '&:hover': {
    background: '#ffffff',
  },
});

const PromoBanner = styled(Box)({
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
});

const FeatureBar = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '16px',
  background: '#ffffff',
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginTop: '-48px',
  position: 'relative',
  zIndex: 10,
  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
});

const FeatureItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px',
});

const FeatureIcon = styled(Box)({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: '#f1f5f9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#2563eb',
});

const SectionHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

const SectionTitle = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#0f172a',
  fontFamily: 'Outfit, sans-serif',
});

const ViewAllButton = styled(Button)({
  color: '#2563eb',
  fontWeight: 600,
  textTransform: 'none',
  fontFamily: 'Outfit, sans-serif',
  '&:hover': {
    background: 'rgba(37, 99, 235, 0.08)',
  },
});

const DealCard = styled(Box)({
  background: '#ffffff',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid #e2e8f0',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    borderColor: '#2563eb',
  },
});

const DealBadge = styled(Box)({
  position: 'absolute',
  top: '12px',
  left: '12px',
  background: '#ef4444',
  color: '#ffffff',
  padding: '4px 12px',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: 700,
  zIndex: 5,
});

const CountdownBox = styled(Box)({
  display: 'flex',
  gap: '8px',
});

const CountdownItem = styled(Box)({
  background: '#0f172a',
  color: '#ffffff',
  padding: '8px 12px',
  borderRadius: '8px',
  textAlign: 'center',
  minWidth: '50px',
});

const CategoryCard = styled(Link)({
  display: 'block',
  background: '#ffffff',
  borderRadius: '16px',
  padding: '24px',
  textDecoration: 'none',
  border: '1px solid #e2e8f0',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  '&:hover': {
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    borderColor: '#2563eb',
    transform: 'translateY(-4px)',
  },
});

const BrandLogo = styled('img')({
  height: '40px',
  objectFit: 'contain',
  filter: 'grayscale(100%)',
  opacity: 0.6,
  transition: 'all 0.3s ease',
  '&:hover': {
    filter: 'grayscale(0%)',
    opacity: 1,
  },
});

// Countdown Hook
const useCountdown = (endDate: string) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return timeLeft;
};

const HomePage: React.FC = () => {
  const { data, loading } = useHomepage();
  const { products: allProducts, loading: productsLoading } = useProducts();
  const { settings } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { sliders, deals, brands, categories, newArrivals, featuredProducts, topProducts } = data;

  // Auto-slide
  useEffect(() => {
    if (sliders.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliders.length]);

  const features = [
    { icon: <LocalShipping />, title: 'Free Delivery', desc: 'Orders over $50' },
    { icon: <Security />, title: 'Secure Payment', desc: '100% Protected' },
    { icon: <Support />, title: '24/7 Support', desc: 'Dedicated support' },
    { icon: <CreditCard />, title: 'Easy Returns', desc: '30-day returns' },
  ];

  // Get first deal for countdown
  const activeDeal = deals[0];

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ pt: 2, pb: 8 }}>
        <Grid container spacing={2}>
          {/* Main Slider */}
          <Grid item xs={12} lg={8}>
            <HeroSection>
              <SliderContainer>
                {loading ? (
                  <Skeleton variant="rectangular" height={400} />
                ) : sliders.length > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'absolute', inset: 0 }}
                      >
                        <SlideContent>
                          <Typography
                            variant="overline"
                            sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 2, mb: 1 }}
                          >
                            {settings.shopName || 'ELECTROHUB'}
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{ color: '#fff', fontWeight: 800, mb: 2, fontFamily: 'Outfit', lineHeight: 1.2 }}
                          >
                            {sliders[currentSlide]?.title || 'Premium Electronics'}
                          </Typography>
                          <Typography
                            sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, fontSize: '1.1rem' }}
                          >
                            {sliders[currentSlide]?.subtitle || 'Discover our collection'}
                          </Typography>
                          {sliders[currentSlide]?.buttonText && (
                            <Button
                              component={Link}
                              to={sliders[currentSlide]?.buttonLink || '/products'}
                              variant="contained"
                              size="large"
                              endIcon={<ArrowForward />}
                              sx={{
                                bgcolor: '#fff',
                                color: '#1e3a8a',
                                fontWeight: 600,
                                px: 4,
                                py: 1.5,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontFamily: 'Outfit',
                                '&:hover': { bgcolor: '#f1f5f9' },
                              }}
                            >
                              {sliders[currentSlide]?.buttonText}
                            </Button>
                          )}
                        </SlideContent>
                        <SlideImage
                          src={getImageUrl(sliders[currentSlide]?.imageUrl)}
                          alt={sliders[currentSlide]?.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>

                    <SliderNav sx={{ left: 16 }} onClick={() => setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)}>
                      <ArrowBack />
                    </SliderNav>
                    <SliderNav sx={{ right: 16 }} onClick={() => setCurrentSlide((prev) => (prev + 1) % sliders.length)}>
                      <ArrowForward />
                    </SliderNav>

                    <SliderDots>
                      {sliders.map((_, index) => (
                        <SliderDot
                          key={index}
                          active={index === currentSlide}
                          onClick={() => setCurrentSlide(index)}
                        />
                      ))}
                    </SliderDots>
                  </>
                ) : (
                  <Box sx={{ p: 6, textAlign: 'center' }}>
                    <SlideContent sx={{ position: 'relative', transform: 'none', left: 0 }}>
                      <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, mb: 2, fontFamily: 'Outfit' }}>
                        Welcome to {settings.shopName || 'ElectroHub'}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
                        {settings.shopTagline || 'Your premier electronics destination'}
                      </Typography>
                      <Button
                        component={Link}
                        to="/products"
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                          bgcolor: '#fff',
                          color: '#1e3a8a',
                          fontWeight: 600,
                          px: 4,
                          borderRadius: '12px',
                          textTransform: 'none',
                        }}
                      >
                        Shop Now
                      </Button>
                    </SlideContent>
                  </Box>
                )}
              </SliderContainer>
            </HeroSection>
          </Grid>

          {/* Side Banners */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              {allProducts.slice(0, 2).map((product, index) => (
                <Grid item xs={6} lg={12} key={product.id}>
                  <PromoBanner
                    component={Link}
                    to={`/product/${product.id}`}
                    sx={{
                      height: { xs: 180, lg: 194 },
                      background: index === 0 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      px: 3,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Outfit', mb: 0.5 }}>
                        {product.name}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>
                        ${product.price}
                      </Typography>
                      <Chip
                        label="Shop Now"
                        size="small"
                        sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
                      />
                    </Box>
                    <Box
                      component="img"
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      sx={{ height: '80%', maxWidth: '40%', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                  </PromoBanner>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Feature Bar */}
        <FeatureBar>
          {features.map((feature, index) => (
            <FeatureItem key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', fontFamily: 'Outfit' }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'Outfit' }}>
                  {feature.desc}
                </Typography>
              </Box>
            </FeatureItem>
          ))}
        </FeatureBar>
      </Container>

      {/* Deals of the Day */}
      {deals.length > 0 && (
        <Box sx={{ py: 6, bgcolor: '#fff' }}>
          <Container maxWidth="xl">
            <SectionHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <SectionTitle>
                  <Timer sx={{ verticalAlign: 'middle', mr: 1, color: '#ef4444' }} />
                  Deals of the Day
                </SectionTitle>
                {activeDeal && (
                  <CountdownDisplay endDate={activeDeal.endDate} />
                )}
              </Box>
              <ViewAllButton component={Link} to="/products" endIcon={<KeyboardArrowRight />}>
                View All
              </ViewAllButton>
            </SectionHeader>

            <Grid container spacing={3}>
              {deals.slice(0, 5).map((deal) => (
                <Grid item xs={6} sm={4} md={2.4} key={deal.id}>
                  <DealCard>
                    <Box sx={{ position: 'relative', aspectRatio: '1', bgcolor: '#f8fafc', p: 2 }}>
                      <DealBadge>-{deal.discount}%</DealBadge>
                      <img
                        src={getImageUrl(deal.product.imageUrl)}
                        alt={deal.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500, mb: 0.5, fontFamily: 'Outfit' }}>
                        {deal.product.category?.name}
                      </Typography>
                      <Typography
                        component={Link}
                        to={`/product/${deal.product.id}`}
                        sx={{
                          display: 'block',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#0f172a',
                          textDecoration: 'none',
                          fontFamily: 'Outfit',
                          mb: 1,
                          '&:hover': { color: '#2563eb' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {deal.product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb', fontFamily: 'Outfit' }}>
                          ${(deal.product.price * (1 - deal.discount / 100)).toFixed(2)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through', fontFamily: 'Outfit' }}>
                          ${deal.product.price.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </DealCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Best Sellers */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="xl">
          <SectionHeader>
            <SectionTitle>Top Selling Products</SectionTitle>
            <ViewAllButton component={Link} to="/products" endIcon={<KeyboardArrowRight />}>
              View All
            </ViewAllButton>
          </SectionHeader>

          <Grid container spacing={3}>
            {(productsLoading ? Array(5).fill(null) : (topProducts.length > 0 ? topProducts : allProducts).slice(0, 5)).map((product, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={product?.id || index}>
                {productsLoading || !product ? (
                  <Skeleton variant="rounded" height={320} sx={{ borderRadius: '16px' }} />
                ) : (
                  <ProductCard product={product} index={index} />
                )}
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories */}
      <Box sx={{ py: 6, bgcolor: '#fff' }}>
        <Container maxWidth="xl">
          <SectionHeader>
            <SectionTitle>Shop by Category</SectionTitle>
            <ViewAllButton component={Link} to="/categories" endIcon={<KeyboardArrowRight />}>
              View All
            </ViewAllButton>
          </SectionHeader>

          <Grid container spacing={3}>
            {categories.slice(0, 6).map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <CategoryCard to={`/category/${category.id}`}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      bgcolor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {category.imageUrl ? (
                      <img
                        src={getImageUrl(category.imageUrl)}
                        alt={category.name}
                        style={{ width: 40, height: 40, objectFit: 'contain' }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: '1.5rem' }}>📦</Typography>
                    )}
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem', fontFamily: 'Outfit' }}>
                    {category.name}
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'Outfit' }}>
                    {category._count?.products || 0} Products
                  </Typography>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* New Arrivals */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="xl">
          <SectionHeader>
            <SectionTitle>New Arrivals</SectionTitle>
            <ViewAllButton component={Link} to="/products" endIcon={<KeyboardArrowRight />}>
              View All
            </ViewAllButton>
          </SectionHeader>

          <Grid container spacing={3}>
            {(newArrivals.length > 0 ? newArrivals : allProducts).slice(0, 5).map((product, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={product.id}>
                <ProductCard product={product} index={index} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Brand Partners */}
      {brands.length > 0 && (
        <Box sx={{ py: 6, bgcolor: '#fff' }}>
          <Container maxWidth="xl">
            <Typography sx={{ textAlign: 'center', color: '#64748b', mb: 4, fontFamily: 'Outfit' }}>
              Trusted by Leading Brands
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 6 }}>
              {brands.map((brand) => (
                <Box
                  key={brand.id}
                  component={brand.link ? 'a' : 'div'}
                  href={brand.link || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ cursor: brand.link ? 'pointer' : 'default' }}
                >
                  <BrandLogo
                    src={getImageUrl(brand.logoUrl)}
                    alt={brand.name}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* Featured Products */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="xl">
          <SectionHeader>
            <SectionTitle>Featured Products</SectionTitle>
            <ViewAllButton component={Link} to="/products" endIcon={<KeyboardArrowRight />}>
              View All
            </ViewAllButton>
          </SectionHeader>

          <Grid container spacing={3}>
            {(featuredProducts.length > 0 ? featuredProducts : allProducts).slice(0, 10).map((product, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={product.id}>
                <ProductCard product={product} index={index} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Newsletter CTA */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              borderRadius: '24px',
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              color: '#fff',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Outfit' }}>
              Subscribe to Our Newsletter
            </Typography>
            <Typography sx={{ opacity: 0.9, mb: 3 }}>
              Get the latest updates on new products and upcoming sales
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                maxWidth: 500,
                mx: 'auto',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1rem',
                  fontFamily: 'Outfit, sans-serif',
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#0f172a',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontFamily: 'Outfit',
                  '&:hover': { bgcolor: '#1e293b' },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

// Countdown Display Component
const CountdownDisplay: React.FC<{ endDate: string }> = ({ endDate }) => {
  const time = useCountdown(endDate);

  return (
    <CountdownBox>
      {[
        { value: time.days, label: 'Days' },
        { value: time.hours, label: 'Hours' },
        { value: time.minutes, label: 'Min' },
        { value: time.seconds, label: 'Sec' },
      ].map((item) => (
        <CountdownItem key={item.label}>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>
            {item.value.toString().padStart(2, '0')}
          </Typography>
          <Typography sx={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', mt: 0.5 }}>
            {item.label}
          </Typography>
        </CountdownItem>
      ))}
    </CountdownBox>
  );
};

export default HomePage;
