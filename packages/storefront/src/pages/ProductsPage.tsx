import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  IconButton,
  Drawer,
  Button,
  InputAdornment,
  Skeleton,
  Pagination,
} from '@mui/material';
import {
  Search,
  FilterList,
  Close,
  GridView,
  ViewList,
  Sort,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
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

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '14px',
    fontFamily: 'Outfit, sans-serif',
    color: '#ffffff',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 245, 255, 0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00f5ff',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6a6a7a',
    fontFamily: 'Outfit, sans-serif',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#00f5ff',
  },
});

const FilterButton = styled(Button)({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: '#ffffff',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 500,
  borderRadius: '12px',
  padding: '12px 24px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
});

const StyledSelect = styled(Select)({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  fontFamily: 'Outfit, sans-serif',
  color: '#ffffff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#00f5ff',
  },
  '& .MuiSvgIcon-root': {
    color: '#6a6a7a',
  },
});

const FilterChip = styled(Chip)({
  backgroundColor: 'rgba(0, 245, 255, 0.1)',
  color: '#00f5ff',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 500,
  border: '1px solid rgba(0, 245, 255, 0.3)',
  '& .MuiChip-deleteIcon': {
    color: '#00f5ff',
    '&:hover': {
      color: '#ffffff',
    },
  },
});

const FilterDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    width: '320px',
    background: 'linear-gradient(180deg, #12121a 0%, #0a0a0f 100%)',
    borderLeft: '1px solid rgba(0, 245, 255, 0.1)',
    padding: '24px',
  },
});

const FilterSection = styled(Box)({
  marginBottom: '32px',
});

const FilterTitle = styled(Typography)({
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '1rem',
  fontFamily: 'Outfit, sans-serif',
  marginBottom: '16px',
});

const ViewToggle = styled(IconButton)<{ active: string }>(({ active }) => ({
  backgroundColor: active === 'true' ? 'rgba(0, 245, 255, 0.2)' : 'transparent',
  color: active === 'true' ? '#00f5ff' : '#6a6a7a',
  borderRadius: '10px',
  border: '1px solid',
  borderColor: active === 'true' ? 'rgba(0, 245, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
  },
}));

const ResultsCount = styled(Typography)({
  color: '#6a6a7a',
  fontSize: '0.95rem',
  fontFamily: 'Outfit, sans-serif',
});

const StyledPagination = styled(Pagination)({
  '& .MuiPaginationItem-root': {
    color: '#a0a0b0',
    fontFamily: 'Outfit, sans-serif',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(0, 245, 255, 0.1)',
      borderColor: 'rgba(0, 245, 255, 0.3)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(0, 245, 255, 0.2)',
      borderColor: '#00f5ff',
      color: '#00f5ff',
      '&:hover': {
        backgroundColor: 'rgba(0, 245, 255, 0.3)',
      },
    },
  },
});

const ITEMS_PER_PAGE = 12;

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useProducts();
  const { categories } = useCategories();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchParams]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 5000;
    return Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100;
  }, [products]);

  useEffect(() => {
    if (maxPrice > priceRange[1]) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.category?.name.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.categoryId === parseInt(selectedCategory));
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [products, search, selectedCategory, priceRange, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setPriceRange([0, maxPrice]);
    setSortBy('name');
    setPage(1);
    setSearchParams({});
  };

  const activeFiltersCount = [
    search,
    selectedCategory !== 'all',
    priceRange[0] > 0 || priceRange[1] < maxPrice,
  ].filter(Boolean).length;

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <PageHeader>
        <Container maxWidth="lg">
          <PageTitle>
            All <span className="accent">Products</span>
          </PageTitle>
          <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit' }}>
            Browse our complete collection of premium electronics
          </Typography>
        </Container>
      </PageHeader>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search and Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <SearchField
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ flex: 1, minWidth: '250px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#6a6a7a' }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: '180px' }}>
            <InputLabel sx={{ color: '#6a6a7a', fontFamily: 'Outfit' }}>Category</InputLabel>
            <StyledSelect
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>

          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel sx={{ color: '#6a6a7a', fontFamily: 'Outfit' }}>Sort By</InputLabel>
            <StyledSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              startAdornment={<Sort sx={{ color: '#6a6a7a', mr: 1 }} />}
            >
              <MenuItem value="name">Name A-Z</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="newest">Newest First</MenuItem>
            </StyledSelect>
          </FormControl>

          <FilterButton
            startIcon={<FilterList />}
            onClick={() => setFilterDrawerOpen(true)}
          >
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </FilterButton>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <ViewToggle
              active={(viewMode === 'grid').toString()}
              onClick={() => setViewMode('grid')}
            >
              <GridView />
            </ViewToggle>
            <ViewToggle
              active={(viewMode === 'list').toString()}
              onClick={() => setViewMode('list')}
            >
              <ViewList />
            </ViewToggle>
          </Box>
        </Box>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            {search && (
              <FilterChip
                label={`Search: "${search}"`}
                onDelete={() => handleSearchChange('')}
              />
            )}
            {selectedCategory !== 'all' && (
              <FilterChip
                label={`Category: ${categories.find(c => c.id.toString() === selectedCategory)?.name}`}
                onDelete={() => setSelectedCategory('all')}
              />
            )}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <FilterChip
                label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
                onDelete={() => setPriceRange([0, maxPrice])}
              />
            )}
            <Button
              size="small"
              sx={{ color: '#ff4444', fontFamily: 'Outfit', textTransform: 'none' }}
              onClick={clearFilters}
            >
              Clear All
            </Button>
          </Box>
        )}

        {/* Results Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <ResultsCount>
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </ResultsCount>
        </Box>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 3 : 6} key={i}>
                  <Skeleton
                    variant="rounded"
                    height={viewMode === 'grid' ? 350 : 180}
                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : filteredProducts.length === 0 ? (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ textAlign: 'center', py: 10 }}
            >
              <Typography sx={{ color: '#6a6a7a', fontSize: '1.2rem', fontFamily: 'Outfit', mb: 2 }}>
                No products found
              </Typography>
              <Button
                onClick={clearFilters}
                sx={{
                  color: '#00f5ff',
                  fontFamily: 'Outfit',
                  textTransform: 'none',
                  border: '1px solid rgba(0, 245, 255, 0.3)',
                  borderRadius: '12px',
                  px: 3,
                }}
              >
                Clear Filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {paginatedProducts.map((product, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={viewMode === 'grid' ? 3 : 6}
                  key={product.id}
                >
                  <ProductCard product={product} index={index} />
                </Grid>
              ))}
            </Grid>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <StyledPagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              size="large"
            />
          </Box>
        )}
      </Container>

      {/* Filter Drawer */}
      <FilterDrawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.3rem', fontFamily: 'Outfit' }}>
            Filters
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)} sx={{ color: '#6a6a7a' }}>
            <Close />
          </IconButton>
        </Box>

        <FilterSection>
          <FilterTitle>Price Range</FilterTitle>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={(_, value) => setPriceRange(value as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={maxPrice}
              sx={{
                color: '#00f5ff',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#00f5ff',
                },
                '& .MuiSlider-track': {
                  background: 'linear-gradient(90deg, #00f5ff, #00c4cc)',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit', fontSize: '0.9rem' }}>
                ${priceRange[0]}
              </Typography>
              <Typography sx={{ color: '#6a6a7a', fontFamily: 'Outfit', fontSize: '0.9rem' }}>
                ${priceRange[1]}
              </Typography>
            </Box>
          </Box>
        </FilterSection>

        <FilterSection>
          <FilterTitle>Categories</FilterTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              fullWidth
              onClick={() => setSelectedCategory('all')}
              sx={{
                justifyContent: 'flex-start',
                color: selectedCategory === 'all' ? '#00f5ff' : '#a0a0b0',
                backgroundColor: selectedCategory === 'all' ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
                fontFamily: 'Outfit',
                textTransform: 'none',
                borderRadius: '10px',
                py: 1,
              }}
            >
              All Categories
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                fullWidth
                onClick={() => setSelectedCategory(cat.id.toString())}
                sx={{
                  justifyContent: 'flex-start',
                  color: selectedCategory === cat.id.toString() ? '#00f5ff' : '#a0a0b0',
                  backgroundColor: selectedCategory === cat.id.toString() ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
                  fontFamily: 'Outfit',
                  textTransform: 'none',
                  borderRadius: '10px',
                  py: 1,
                }}
              >
                {cat.name}
              </Button>
            ))}
          </Box>
        </FilterSection>

        <Box sx={{ mt: 'auto' }}>
          <Button
            fullWidth
            onClick={clearFilters}
            sx={{
              color: '#ff4444',
              fontFamily: 'Outfit',
              textTransform: 'none',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              borderRadius: '12px',
              py: 1.5,
              mb: 2,
            }}
          >
            Clear All Filters
          </Button>
          <Button
            fullWidth
            onClick={() => setFilterDrawerOpen(false)}
            sx={{
              background: 'linear-gradient(135deg, #00f5ff 0%, #00c4cc 100%)',
              color: '#0a0a0f',
              fontFamily: 'Outfit',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '12px',
              py: 1.5,
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </FilterDrawer>
    </Box>
  );
};

export default ProductsPage;

