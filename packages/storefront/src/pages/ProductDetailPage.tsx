import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Breadcrumbs,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  FavoriteBorder,
  Share,
  ArrowBack,
  Add,
  Remove,
  LocalShipping,
  Verified,
  SupportAgent,
  NavigateNext,
  Check,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useProduct } from '../hooks/useProducts';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../config';
import ProductCard from '../components/ProductCard';

const PageWrapper = styled(Box)({
  minHeight: '100vh',
  paddingBottom: '80px',
});

const BreadcrumbLink = styled(Link)({
  color: '#6a6a7a',
  textDecoration: 'none',
  fontFamily: 'Outfit, sans-serif',
  fontSize: '0.9rem',
  '&:hover': {
    color: '#00f5ff',
  },
});

const ImageGallery = styled(Box)({
  background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.8) 0%, rgba(26, 26, 37, 0.8) 100%)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  padding: '40px',
  position: 'relative',
  overflow: 'hidden',
});

const MainImage = styled('img')({
  width: '100%',
  height: '400px',
  objectFit: 'contain',
  borderRadius: '16px',
});

const ProductTitle = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 700,
  fontFamily: 'Outfit, sans-serif',
  color: '#ffffff',
  marginBottom: '16px',
  lineHeight: 1.2,
});

const CategoryChip = styled(Chip)({
  backgroundColor: 'rgba(0, 245, 255, 0.1)',
  color: '#00f5ff',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 500,
  border: '1px solid rgba(0, 245, 255, 0.2)',
  marginBottom: '20px',
});

const Price = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 800,
  fontFamily: 'Outfit, sans-serif',
  background: 'linear-gradient(135deg, #00f5ff 0%, #00c4cc 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '24px',
});

const Stock = styled(Box)<{ instock: string }>(({ instock }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '10px',
  backgroundColor: instock === 'true' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 68, 0.1)',
  color: instock === 'true' ? '#00ff88' : '#ff4444',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 500,
  fontSize: '0.9rem',
  marginBottom: '24px',
}));

const QuantityControl = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '24px',
});

const QuantityButton = styled(IconButton)({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  '&:hover': {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  '&.Mui-disabled': {
    color: '#3a3a4a',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
});

const QuantityDisplay = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 600,
  fontFamily: 'Outfit, sans-serif',
  color: '#ffffff',
  minWidth: '48px',
  textAlign: 'center',
});

const AddToCartButton = styled(Button)({
  padding: '16px 40px',
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: 'Outfit, sans-serif',
  borderRadius: '14px',
  textTransform: 'none',
  background: 'linear-gradient(135deg, #00f5ff 0%, #00c4cc 100%)',
  color: '#0a0a0f',
  boxShadow: '0 8px 30px rgba(0, 245, 255, 0.3)',
  flex: 1,
  '&:hover': {
    background: 'linear-gradient(135deg, #00c4cc 0%, #0088aa 100%)',
    boxShadow: '0 12px 40px rgba(0, 245, 255, 0.4)',
  },
  '&.Mui-disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#6a6a7a',
  },
});

const SecondaryButton = styled(IconButton)({
  padding: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '14px',
  '&:hover': {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
});

const FeatureCard = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '20px',
  background: 'rgba(255, 255, 255, 0.02)',
  borderRadius: '14px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
});

const FeatureIcon = styled(Box)({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(0, 196, 204, 0.1) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    color: '#00f5ff',
    fontSize: '24px',
  },
});

const SectionTitle = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 600,
  fontFamily: 'Outfit, sans-serif',
  color: '#ffffff',
  marginBottom: '24px',
  '& .accent': {
    background: 'linear-gradient(135deg, #00f5ff 0%, #00c4cc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
});

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id ? parseInt(id) : null);
  const { products: allProducts } = useProducts();
  const { addItem, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const inStock = product ? product.quantity > 0 : false;
  const inCart = product ? isInCart(product.id) : false;

  const handleAddToCart = () => {
    if (product && inStock) {
      addItem(product, quantity);
    }
  };

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.quantity) {
      setQuantity(newQty);
    }
  };

  // Get related products (same category)
  const relatedProducts = product
    ? allProducts.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)
    : [];

  if (loading) {
    return (
      <PageWrapper>
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rounded" height={500} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '24px' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
              <Skeleton variant="text" width="40%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mt: 2 }} />
              <Skeleton variant="text" width="100%" height={100} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mt: 2 }} />
            </Grid>
          </Grid>
        </Container>
      </PageWrapper>
    );
  }

  if (error || !product) {
    return (
      <PageWrapper>
        <Container maxWidth="lg" sx={{ pt: 4, textAlign: 'center' }}>
          <Typography sx={{ color: '#ff4444', fontFamily: 'Outfit', fontSize: '1.2rem', mb: 3 }}>
            Product not found
          </Typography>
          <Button
            component={Link}
            to="/products"
            startIcon={<ArrowBack />}
            sx={{ color: '#00f5ff', fontFamily: 'Outfit', textTransform: 'none' }}
          >
            Back to Products
          </Button>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext sx={{ color: '#3a3a4a', fontSize: '1rem' }} />}
          sx={{ mb: 4 }}
        >
          <BreadcrumbLink to="/">Home</BreadcrumbLink>
          <BreadcrumbLink to="/products">Products</BreadcrumbLink>
          {product.category && (
            <BreadcrumbLink to={`/category/${product.category.id}`}>
              {product.category.name}
            </BreadcrumbLink>
          )}
          <Typography sx={{ color: '#a0a0b0', fontFamily: 'Outfit', fontSize: '0.9rem' }}>
            {product.name}
          </Typography>
        </Breadcrumbs>

        {/* Product Details */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ImageGallery
              component={motion.div}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MainImage
                src={getImageUrl(product.imageUrl)}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </ImageGallery>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <CategoryChip label={product.category?.name || 'Uncategorized'} />
              <ProductTitle>{product.name}</ProductTitle>
              <Price>${product.price.toFixed(2)}</Price>

              <Stock instock={inStock.toString()}>
                {inStock ? <Check /> : null}
                {inStock ? `${product.quantity} in stock` : 'Out of stock'}
              </Stock>

              <Typography sx={{ color: '#a0a0b0', fontFamily: 'Outfit', mb: 3, lineHeight: 1.7 }}>
                Experience premium quality with this exceptional product from our {product.category?.name} collection.
                Sourced from {product.supplier?.name || 'trusted suppliers'} and built to deliver outstanding performance.
              </Typography>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

              {/* Quantity Selector */}
              <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit', mb: 2, fontWeight: 500 }}>
                Quantity
              </Typography>
              <QuantityControl>
                <QuantityButton
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Remove />
                </QuantityButton>
                <QuantityDisplay>{quantity}</QuantityDisplay>
                <QuantityButton
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.quantity}
                >
                  <Add />
                </QuantityButton>
              </QuantityControl>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <AddToCartButton
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  startIcon={inCart ? <Check /> : <ShoppingCart />}
                >
                  {inCart ? 'Added to Cart' : 'Add to Cart'}
                </AddToCartButton>
                <SecondaryButton>
                  <FavoriteBorder />
                </SecondaryButton>
                <SecondaryButton>
                  <Share />
                </SecondaryButton>
              </Box>

              {/* Features */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FeatureCard>
                    <FeatureIcon><LocalShipping /></FeatureIcon>
                    <Box>
                      <Typography sx={{ color: '#fff', fontFamily: 'Outfit', fontWeight: 600 }}>
                        Free Shipping
                      </Typography>
                      <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit', fontSize: '0.85rem' }}>
                        On orders over $50
                      </Typography>
                    </Box>
                  </FeatureCard>
                </Grid>
                <Grid item xs={12}>
                  <FeatureCard>
                    <FeatureIcon><Verified /></FeatureIcon>
                    <Box>
                      <Typography sx={{ color: '#fff', fontFamily: 'Outfit', fontWeight: 600 }}>
                        Quality Guaranteed
                      </Typography>
                      <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit', fontSize: '0.85rem' }}>
                        30-day return policy
                      </Typography>
                    </Box>
                  </FeatureCard>
                </Grid>
                <Grid item xs={12}>
                  <FeatureCard>
                    <FeatureIcon><SupportAgent /></FeatureIcon>
                    <Box>
                      <Typography sx={{ color: '#fff', fontFamily: 'Outfit', fontWeight: 600 }}>
                        Expert Support
                      </Typography>
                      <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit', fontSize: '0.85rem' }}>
                        24/7 customer service
                      </Typography>
                    </Box>
                  </FeatureCard>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mt: 10 }}>
            <SectionTitle>
              Related <span className="accent">Products</span>
            </SectionTitle>
            <Grid container spacing={3}>
              {relatedProducts.map((relatedProduct, index) => (
                <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                  <ProductCard product={relatedProduct} index={index} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Back Button */}
        <Box sx={{ mt: 6 }}>
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBack />}
            sx={{
              color: '#a0a0b0',
              fontFamily: 'Outfit',
              textTransform: 'none',
              '&:hover': { color: '#00f5ff' },
            }}
          >
            Back to Products
          </Button>
        </Box>
      </Container>
    </PageWrapper>
  );
};

export default ProductDetailPage;

