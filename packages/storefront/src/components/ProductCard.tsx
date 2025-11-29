import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import { ShoppingCart, Favorite, Visibility } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../config';

const Card = styled(motion.div)({
  background: '#ffffff',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid #e2e8f0',
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&:hover': {
    borderColor: '#2563eb',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    '& .product-image': {
      transform: 'scale(1.05)',
    },
    '& .action-buttons': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
});

const ImageWrapper = styled(Box)({
  position: 'relative',
  aspectRatio: '1',
  overflow: 'hidden',
  background: '#f8fafc',
});

const ProductImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  padding: '16px',
  transition: 'transform 0.4s ease',
});

const ActionButtons = styled(Box)({
  position: 'absolute',
  top: '12px',
  right: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  opacity: 0,
  transform: 'translateY(-10px)',
  transition: 'all 0.3s ease',
});

const ActionButton = styled(IconButton)({
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  border: '1px solid #e2e8f0',
  color: '#64748b',
  padding: '8px',
  '&:hover': {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderColor: '#2563eb',
  },
});

const Content = styled(Box)({
  padding: '16px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const CategoryLabel = styled(Typography)({
  fontSize: '0.7rem',
  fontWeight: 600,
  color: '#2563eb',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '4px',
  fontFamily: 'Outfit, sans-serif',
});

const ProductName = styled(Typography)({
  color: '#0f172a',
  fontWeight: 600,
  fontSize: '0.9rem',
  fontFamily: 'Outfit, sans-serif',
  marginBottom: '8px',
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  flex: 1,
  '&:hover': {
    color: '#2563eb',
  },
});

const PriceRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 'auto',
});

const Price = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.1rem',
  fontFamily: 'Outfit, sans-serif',
  color: '#2563eb',
});

const StockBadge = styled(Box)<{ instock: string }>(({ instock }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '0.7rem',
  fontWeight: 500,
  fontFamily: 'Outfit, sans-serif',
  backgroundColor: instock === 'true' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
  color: instock === 'true' ? '#10b981' : '#ef4444',
}));

const NewBadge = styled(Box)({
  position: 'absolute',
  top: '12px',
  left: '12px',
  background: '#10b981',
  color: '#ffffff',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '0.7rem',
  fontWeight: 700,
  zIndex: 5,
  fontFamily: 'Outfit, sans-serif',
});

const AddToCartButton = styled(IconButton)({
  backgroundColor: '#2563eb',
  color: '#ffffff',
  padding: '8px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#1d4ed8',
  },
  '&.added': {
    backgroundColor: '#10b981',
  },
});

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addItem, isInCart } = useCart();
  const inStock = product.quantity > 0;
  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inStock && !inCart) {
      addItem(product);
    }
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <ImageWrapper>
          {product.isNewArrival && <NewBadge>NEW</NewBadge>}
          <ProductImage
            className="product-image"
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <ActionButtons className="action-buttons">
            <ActionButton size="small">
              <Favorite fontSize="small" />
            </ActionButton>
            <ActionButton size="small">
              <Visibility fontSize="small" />
            </ActionButton>
          </ActionButtons>
        </ImageWrapper>

        <Content>
          <CategoryLabel>{product.category?.name || 'Uncategorized'}</CategoryLabel>
          <ProductName>{product.name}</ProductName>
          <PriceRow>
            <Price>${product.price.toFixed(2)}</Price>
            <AddToCartButton 
              size="small" 
              onClick={handleAddToCart}
              className={inCart ? 'added' : ''}
              disabled={!inStock}
            >
              <ShoppingCart fontSize="small" />
            </AddToCartButton>
          </PriceRow>
        </Content>
      </Link>
    </Card>
  );
};

export default ProductCard;
