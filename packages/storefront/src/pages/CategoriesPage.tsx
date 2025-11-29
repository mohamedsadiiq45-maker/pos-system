import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Grid, Skeleton } from '@mui/material';
import { ArrowForward, Inventory2 } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useCategories } from '../hooks/useCategories';

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

const CategoryCard = styled(motion(Link))({
  display: 'block',
  background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.9) 0%, rgba(26, 26, 37, 0.9) 100%)',
  borderRadius: '24px',
  padding: '40px',
  textDecoration: 'none',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: 'rgba(0, 245, 255, 0.4)',
    transform: 'translateY(-8px)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 50px rgba(0, 245, 255, 0.15)',
    '& .category-icon': {
      transform: 'scale(1.1)',
      borderColor: '#00f5ff',
    },
    '& .category-arrow': {
      transform: 'translateX(5px)',
      color: '#00f5ff',
    },
    '&::before': {
      opacity: 1,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #00f5ff, #ff00aa, #ffcc00)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '20%',
    right: '-50%',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(0, 245, 255, 0.05) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
});

const CategoryIcon = styled(Box)({
  width: '80px',
  height: '80px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(0, 196, 204, 0.1) 100%)',
  border: '1px solid rgba(0, 245, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
  transition: 'all 0.4s ease',
  '& svg': {
    color: '#00f5ff',
    fontSize: '36px',
  },
});

const CategoryName = styled(Typography)({
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '1.4rem',
  fontFamily: 'Outfit, sans-serif',
  marginBottom: '8px',
});

const ProductCount = styled(Typography)({
  color: '#6a6a7a',
  fontSize: '0.95rem',
  fontFamily: 'Outfit, sans-serif',
  marginBottom: '20px',
});

const SubcategoryList = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '24px',
});

const SubcategoryChip = styled('span')({
  display: 'inline-block',
  padding: '6px 12px',
  borderRadius: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: '#a0a0b0',
  fontSize: '0.8rem',
  fontFamily: 'Outfit, sans-serif',
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

const BrowseLink = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#a0a0b0',
  fontSize: '0.95rem',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 500,
  marginTop: 'auto',
  '& svg': {
    transition: 'all 0.3s ease',
  },
});

const CategoriesPage: React.FC = () => {
  const { parentCategories, loading } = useCategories();

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      <PageHeader>
        <Container maxWidth="lg">
          <PageTitle>
            Shop by <span className="accent">Category</span>
          </PageTitle>
          <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit' }}>
            Browse our collection organized by category
          </Typography>
        </Container>
      </PageHeader>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={3}>
          {loading ? (
            [...Array(6)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton
                  variant="rounded"
                  height={250}
                  sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '24px' }}
                />
              </Grid>
            ))
          ) : parentCategories.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit', fontSize: '1.2rem' }}>
                  No categories found
                </Typography>
              </Box>
            </Grid>
          ) : (
            parentCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <CategoryCard
                  to={`/category/${category.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Box>
                    <CategoryIcon className="category-icon">
                      <Inventory2 />
                    </CategoryIcon>
                    <CategoryName>{category.name}</CategoryName>
                    <ProductCount>
                      {category._count?.products || 0} products
                    </ProductCount>

                    {category.children && category.children.length > 0 && (
                      <SubcategoryList>
                        {category.children.slice(0, 3).map((sub) => (
                          <SubcategoryChip key={sub.id}>{sub.name}</SubcategoryChip>
                        ))}
                        {category.children.length > 3 && (
                          <SubcategoryChip>+{category.children.length - 3} more</SubcategoryChip>
                        )}
                      </SubcategoryList>
                    )}
                  </Box>

                  <BrowseLink>
                    Browse Category
                    <ArrowForward className="category-arrow" sx={{ fontSize: '1.2rem' }} />
                  </BrowseLink>
                </CategoryCard>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoriesPage;

