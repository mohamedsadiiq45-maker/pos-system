import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  Category as CategoryIcon,
  AccountTree as SubcategoryIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  parentId: number | null;
  children?: Category[];
}

function AddCategoryPage() {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParentCategories();
  }, []);

  const fetchParentCategories = async () => {
    const response = await fetch('http://localhost:3001/api/categories/parents', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setParentCategories(data);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }

    setLoading(true);

    const response = await fetch('http://localhost:3001/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: name.trim(),
        parentId: parentId || null,
      }),
    });

    if (response.ok) {
      navigate('/categories');
    } else {
      const error = await response.json();
      alert(error.message || 'Failed to add category');
    }
    setLoading(false);
  };

  // Common electronics categories for suggestions
  const suggestedCategories = [
    'Smartphones', 'Laptops', 'Tablets', 'TVs', 'Audio', 
    'Cameras', 'Gaming', 'Accessories', 'Wearables', 'Networking'
  ];

  const suggestedSubcategories: Record<string, string[]> = {
    'Smartphones': ['iPhone', 'Samsung', 'Xiaomi', 'OnePlus', 'Google Pixel'],
    'Laptops': ['MacBooks', 'Windows Laptops', 'Chromebooks', 'Gaming Laptops'],
    'Audio': ['Headphones', 'Speakers', 'Earbuds', 'Soundbars'],
    'Accessories': ['Chargers', 'Cables', 'Cases', 'Screen Protectors', 'Power Banks'],
  };

  const selectedParent = parentCategories.find(c => c.id.toString() === parentId);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Add Category
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dashboard • Categories • Add New
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              {/* Category Type Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Category Type
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Paper
                    variant="outlined"
                    onClick={() => setParentId('')}
                    sx={{
                      flex: 1,
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderColor: !parentId ? 'warning.main' : 'divider',
                      borderWidth: !parentId ? 2 : 1,
                      bgcolor: !parentId ? 'warning.light' : 'transparent',
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 32, color: !parentId ? 'warning.dark' : 'text.secondary' }} />
                    <Typography variant="body2" fontWeight={!parentId ? 600 : 400}>
                      Main Category
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Top-level category
                    </Typography>
                  </Paper>
                  <Paper
                    variant="outlined"
                    onClick={() => setParentId(parentCategories[0]?.id?.toString() || '')}
                    sx={{
                      flex: 1,
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderColor: parentId ? 'warning.main' : 'divider',
                      borderWidth: parentId ? 2 : 1,
                      bgcolor: parentId ? 'warning.light' : 'transparent',
                    }}
                  >
                    <SubcategoryIcon sx={{ fontSize: 32, color: parentId ? 'warning.dark' : 'text.secondary' }} />
                    <Typography variant="body2" fontWeight={parentId ? 600 : 400}>
                      Subcategory
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Under a parent
                    </Typography>
                  </Paper>
                </Box>
              </Box>

              {/* Parent Category Dropdown */}
              {parentId !== '' && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Parent Category</InputLabel>
                  <Select
                    value={parentId}
                    label="Parent Category"
                    onChange={(e) => setParentId(e.target.value)}
                  >
                    {parentCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                        {category.children && category.children.length > 0 && (
                          <Chip
                            label={`${category.children.length} sub`}
                            size="small"
                            sx={{ ml: 1, height: 20 }}
                          />
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Category Name */}
              <TextField
                fullWidth
                required
                label={parentId ? 'Subcategory Name' : 'Category Name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={parentId ? 'e.g., iPhone, Samsung, MacBooks' : 'e.g., Smartphones, Laptops, Audio'}
                sx={{ mb: 3 }}
              />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/categories')}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {loading ? 'Adding...' : 'Add Category'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Suggestions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              💡 Suggested Categories
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Click to use as category name
            </Typography>

            {!parentId ? (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Main Categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestedCategories.map((cat) => (
                    <Chip
                      key={cat}
                      label={cat}
                      onClick={() => setName(cat)}
                      color={name === cat ? 'warning' : 'default'}
                      variant={name === cat ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </>
            ) : (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Subcategories for {selectedParent?.name || 'selected category'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(suggestedSubcategories[selectedParent?.name || ''] || [
                    'Type A', 'Type B', 'Type C', 'Premium', 'Budget', 'Pro'
                  ]).map((sub) => (
                    <Chip
                      key={sub}
                      label={sub}
                      onClick={() => setName(sub)}
                      color={name === sub ? 'warning' : 'default'}
                      variant={name === sub ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" gutterBottom>
              📂 Category Structure Example
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                📁 Smartphones (Main)<br />
                &nbsp;&nbsp;&nbsp;├── iPhone<br />
                &nbsp;&nbsp;&nbsp;├── Samsung<br />
                &nbsp;&nbsp;&nbsp;└── Xiaomi<br />
                📁 Laptops (Main)<br />
                &nbsp;&nbsp;&nbsp;├── MacBooks<br />
                &nbsp;&nbsp;&nbsp;├── Gaming Laptops<br />
                &nbsp;&nbsp;&nbsp;└── Business Laptops
              </Typography>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddCategoryPage;
