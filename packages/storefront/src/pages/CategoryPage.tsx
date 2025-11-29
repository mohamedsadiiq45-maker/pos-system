import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Breadcrumbs,
  Skeleton,
  Chip,
} from '@mui/material';
import { NavigateNext, ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ProductCard from '../components/ProductCard';
import { useCategory } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';

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

const BreadcrumbLink = styled(Link)({
  color: '#6a6a7a',
  textDecoration: 'none',
  fontFamily: 'Outfit, sans-serif',
  fontSize: '0.9rem',
  '&:hover': {
    color: '#00f5ff',
  },
});

const SubcategoryChip = styled(Chip)({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: '#a0a0b0',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 500,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  marginRight: '8px',
  marginBottom: '8px',
  '&:hover': {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderColor: 'rgba(0, 245, 255, 0.3)',
    color: '#00f5ff',
  },
});

const BackLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: '#a0a0b0',
  textDecoration: 'none',
  fontFamily: 'Outfit, sans-serif',
  fontSize: '0.95rem',
  marginBottom: '24px',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: '#00f5ff',
  },
});

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { category, loading: categoryLoading } = useCategory(id ? parseInt(id) : null);
  const { products, loading: productsLoading } = useProducts();

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    
    // Get products from this category and its children
    const categoryIds = [category.id];
    if (category.children) {
      categoryIds.push(...category.children.map(c => c.id));
    }
    
    return products.filter(p => categoryIds.includes(p.categoryId));
  }, [category, products]);

  const loading = categoryLoading || productsLoading;

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <PageHeader>
          <Container maxWidth="lg">
            <Skeleton variant="text" width={200} height={50} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
            <Skeleton variant="text" width={300} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          </Container>
        </PageHeader>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {[...Array(8)].map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rounded" height={350} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '20px' }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!category) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
          <Typography sx={{ color: '#ff4444', fontFamily: 'Outfit', fontSize: '1.2rem', mb: 3 }}>
            Category not found
          </Typography>
          <BackLink to="/categories">
            <ArrowBack fontSize="small" />
            Back to Categories
          </BackLink>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      <PageHeader>
        <Container maxWidth="lg">
          <Breadcrumbs
            separator={<NavigateNext sx={{ color: '#3a3a4a', fontSize: '1rem' }} />}
            sx={{ mb: 3 }}
          >
            <BreadcrumbLink to="/">Home</BreadcrumbLink>
            <BreadcrumbLink to="/categories">Categories</BreadcrumbLink>
            {category.parent && (
              <BreadcrumbLink to={`/category/${category.parent.id}`}>
                {category.parent.name}
              </BreadcrumbLink>
            )}
            <Typography sx={{ color: '#a0a0b0', fontFamily: 'Outfit', fontSize: '0.9rem' }}>
              {category.name}
            </Typography>
          </Breadcrumbs>

          <PageTitle>
            {category.name}
          </PageTitle>
          <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit' }}>
            {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'} available
          </Typography>

          {/* Subcategories */}
          {category.children && category.children.length > 0 && (
            <Box sx={{ mt: 3 }}>
              {category.children.map((sub) => (
                <SubcategoryChip
                  key={sub.id}
                  label={sub.name}
                  component={Link}
                  to={`/category/${sub.id}`}
                  clickable
                />
              ))}
            </Box>
          )}
        </Container>
      </PageHeader>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {categoryProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit', fontSize: '1.2rem', mb: 3 }}>
              No products in this category yet
            </Typography>
            <BackLink to="/products">
              <ArrowBack fontSize="small" />
              Browse All Products
            </BackLink>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {categoryProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} index={index} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CategoryPage;

