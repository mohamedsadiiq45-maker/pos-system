import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingBag,
  ArrowForward,
  LocalShipping,
  Security,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../config';

const PageHeader = styled(Box)({
  padding: '60px 0 40px',
  background: 'linear-gradient(180deg, rgba(0, 245, 255, 0.03) 0%, transparent 100%)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
});

const PageTitle = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  fontFamily: 'Outfit, sans-serif',
  color: '#ffffff',
  marginBottom: '8px',
  '& .accent': {
    background: 'linear-gradient(135deg, #00f5ff 0%, #00c4cc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
});

const CartItemCard = styled(motion.div)({
  background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.8) 0%, rgba(26, 26, 37, 0.8) 100%)',
  borderRadius: '20px',
  padding: '24px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  marginBottom: '16px',
  display: 'flex',
  gap: '24px',
  alignItems: 'center',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const ItemImage = styled('img')({
  width: '120px',
  height: '120px',
  objectFit: 'contain',
  borderRadius: '16px',
  background: 'rgba(0, 0, 0, 0.3)',
  padding: '12px',
});

const ItemDetails = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const ItemName = styled(Typography)({
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '1.1rem',
  fontFamily: 'Outfit, sans-serif',
  textDecoration: 'none',
  '&:hover': {
    color: '#00f5ff',
  },
});

const ItemCategory = styled(Typography)({
  color: '#6a6a7a',
  fontSize: '0.85rem',
  fontFamily: 'Outfit, sans-serif',
});

const ItemPrice = styled(Typography)({
  color: '#00f5ff',
  fontWeight: 700,
  fontSize: '1.25rem',
  fontFamily: 'Outfit, sans-serif',
});

const QuantityControl = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  padding: '4px',
});

const QuantityButton = styled(IconButton)({
  color: '#ffffff',
  padding: '8px',
  '&:hover': {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
  },
  '&.Mui-disabled': {
    color: '#3a3a4a',
  },
});

const QuantityDisplay = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: 'Outfit, sans-serif',
  color: '#ffffff',
  minWidth: '40px',
  textAlign: 'center',
});

const RemoveButton = styled(IconButton)({
  color: '#ff4444',
  backgroundColor: 'rgba(255, 68, 68, 0.1)',
  borderRadius: '10px',
  '&:hover': {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
  },
});

const SummaryCard = styled(Box)({
  background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.9) 0%, rgba(26, 26, 37, 0.9) 100%)',
  borderRadius: '24px',
  padding: '32px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  position: 'sticky',
  top: '100px',
});

const SummaryRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
});

const SummaryLabel = styled(Typography)({
  color: '#a0a0b0',
  fontFamily: 'Outfit, sans-serif',
  fontSize: '0.95rem',
});

const SummaryValue = styled(Typography)({
  color: '#ffffff',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 600,
  fontSize: '0.95rem',
});

const TotalLabel = styled(Typography)({
  color: '#ffffff',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 600,
  fontSize: '1.1rem',
});

const TotalValue = styled(Typography)({
  fontWeight: 800,
  fontSize: '1.75rem',
  fontFamily: 'Outfit, sans-serif',
  background: 'linear-gradient(135deg, #00f5ff 0%, #00c4cc 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

const CheckoutButton = styled(Button)({
  width: '100%',
  padding: '16px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: 'Outfit, sans-serif',
  borderRadius: '14px',
  textTransform: 'none',
  background: 'linear-gradient(135deg, #00f5ff 0%, #00c4cc 100%)',
  color: '#0a0a0f',
  boxShadow: '0 8px 30px rgba(0, 245, 255, 0.3)',
  marginTop: '24px',
  '&:hover': {
    background: 'linear-gradient(135deg, #00c4cc 0%, #0088aa 100%)',
    boxShadow: '0 12px 40px rgba(0, 245, 255, 0.4)',
  },
});

const ContinueShoppingButton = styled(Button)({
  width: '100%',
  padding: '14px 32px',
  fontSize: '0.95rem',
  fontWeight: 600,
  fontFamily: 'Outfit, sans-serif',
  borderRadius: '14px',
  textTransform: 'none',
  backgroundColor: 'transparent',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginTop: '12px',
  '&:hover': {
    borderColor: '#00f5ff',
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
  },
});

const FeatureItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
  '& svg': {
    color: '#00f5ff',
    fontSize: '1.3rem',
  },
});

const EmptyCart = styled(Box)({
  textAlign: 'center',
  padding: '80px 20px',
});

const EmptyCartIcon = styled(Box)({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(0, 196, 204, 0.1) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  '& svg': {
    color: '#00f5ff',
    fontSize: '48px',
  },
});

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();

  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <PageHeader>
          <Container maxWidth="lg">
            <PageTitle>
              Your <span className="accent">Cart</span>
            </PageTitle>
          </Container>
        </PageHeader>

        <Container maxWidth="lg">
          <EmptyCart>
            <EmptyCartIcon>
              <ShoppingBag />
            </EmptyCartIcon>
            <Typography sx={{ color: '#ffffff', fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              Your cart is empty
            </Typography>
            <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit', mb: 4, maxWidth: '400px', mx: 'auto' }}>
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </Typography>
            <Button
              component={Link}
              to="/products"
              endIcon={<ArrowForward />}
              sx={{
                background: 'linear-gradient(135deg, #00f5ff 0%, #00c4cc 100%)',
                color: '#0a0a0f',
                fontWeight: 600,
                fontFamily: 'Outfit',
                px: 4,
                py: 1.5,
                borderRadius: '14px',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00c4cc 0%, #0088aa 100%)',
                },
              }}
            >
              Start Shopping
            </Button>
          </EmptyCart>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      <PageHeader>
        <Container maxWidth="lg">
          <PageTitle>
            Your <span className="accent">Cart</span>
          </PageTitle>
          <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </Typography>
        </Container>
      </PageHeader>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <AnimatePresence>
              {items.map((item) => (
                <CartItemCard
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/product/${item.product.id}`}>
                    <ItemImage
                      src={getImageUrl(item.product.imageUrl)}
                      alt={item.product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </Link>

                  <ItemDetails>
                    <ItemName component={Link} to={`/product/${item.product.id}`}>
                      {item.product.name}
                    </ItemName>
                    <ItemCategory>
                      {item.product.category?.name || 'Uncategorized'}
                    </ItemCategory>
                    <ItemPrice>${item.product.price.toFixed(2)}</ItemPrice>
                  </ItemDetails>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <QuantityControl>
                      <QuantityButton
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        size="small"
                      >
                        <Remove fontSize="small" />
                      </QuantityButton>
                      <QuantityDisplay>{item.quantity}</QuantityDisplay>
                      <QuantityButton
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.quantity}
                        size="small"
                      >
                        <Add fontSize="small" />
                      </QuantityButton>
                    </QuantityControl>

                    <Typography sx={{ color: '#fff', fontFamily: 'Outfit', fontWeight: 700, minWidth: '100px', textAlign: 'right' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Typography>

                    <RemoveButton onClick={() => removeItem(item.product.id)}>
                      <Delete />
                    </RemoveButton>
                  </Box>
                </CartItemCard>
              ))}
            </AnimatePresence>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                onClick={clearCart}
                sx={{
                  color: '#ff4444',
                  fontFamily: 'Outfit',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'rgba(255, 68, 68, 0.1)' },
                }}
              >
                Clear Cart
              </Button>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <SummaryCard>
              <Typography sx={{ color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: '1.25rem', mb: 3 }}>
                Order Summary
              </Typography>

              <SummaryRow>
                <SummaryLabel>Subtotal</SummaryLabel>
                <SummaryValue>${subtotal.toFixed(2)}</SummaryValue>
              </SummaryRow>

              <SummaryRow>
                <SummaryLabel>Shipping</SummaryLabel>
                <SummaryValue sx={{ color: shipping === 0 ? '#00ff88' : '#fff' }}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </SummaryValue>
              </SummaryRow>

              <SummaryRow>
                <SummaryLabel>Tax (8%)</SummaryLabel>
                <SummaryValue>${tax.toFixed(2)}</SummaryValue>
              </SummaryRow>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

              <SummaryRow>
                <TotalLabel>Total</TotalLabel>
                <TotalValue>${total.toFixed(2)}</TotalValue>
              </SummaryRow>

              <CheckoutButton endIcon={<ArrowForward />}>
                Proceed to Checkout
              </CheckoutButton>

              <ContinueShoppingButton component={Link} to="/products">
                Continue Shopping
              </ContinueShoppingButton>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

              <FeatureItem>
                <LocalShipping />
                <Typography sx={{ color: '#a0a0b0', fontFamily: 'Outfit', fontSize: '0.85rem' }}>
                  Free shipping on orders over $50
                </Typography>
              </FeatureItem>

              <FeatureItem>
                <Security />
                <Typography sx={{ color: '#a0a0b0', fontFamily: 'Outfit', fontSize: '0.85rem' }}>
                  Secure checkout with SSL encryption
                </Typography>
              </FeatureItem>
            </SummaryCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;

