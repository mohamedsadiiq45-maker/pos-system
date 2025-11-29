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
} from '@mui/material';
import {
  Category as CategoryIcon,
  AccountTree as SubcategoryIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  parentId: number | null;
  children?: Category[];
}

function EditCategoryPage() {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCategory();
    fetchParentCategories();
  }, [id]);

  const fetchCategory = async () => {
    const response = await fetch(`http://localhost:3001/api/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setName(data.name || '');
      setParentId(data.parentId?.toString() || '');
      setHasChildren(data.children && data.children.length > 0);
    }
  };

  const fetchParentCategories = async () => {
    const response = await fetch('http://localhost:3001/api/categories/parents', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      // Filter out the current category to prevent self-reference
      setParentCategories(data.filter((c: Category) => c.id.toString() !== id));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }

    setLoading(true);

    const response = await fetch(`http://localhost:3001/api/categories/${id}`, {
      method: 'PUT',
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
      alert(error.message || 'Failed to update category');
    }
    setLoading(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Edit Category
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dashboard • Categories • Edit
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
                {hasChildren && (
                  <Chip 
                    label="This category has subcategories - it cannot become a subcategory" 
                    color="info" 
                    size="small" 
                    sx={{ mb: 2 }}
                  />
                )}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Paper
                    variant="outlined"
                    onClick={() => !hasChildren && setParentId('')}
                    sx={{
                      flex: 1,
                      p: 2,
                      textAlign: 'center',
                      cursor: hasChildren ? 'not-allowed' : 'pointer',
                      borderColor: !parentId ? 'warning.main' : 'divider',
                      borderWidth: !parentId ? 2 : 1,
                      bgcolor: !parentId ? 'warning.light' : 'transparent',
                      opacity: hasChildren && parentId ? 0.5 : 1,
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
                    onClick={() => !hasChildren && setParentId(parentCategories[0]?.id?.toString() || 'select')}
                    sx={{
                      flex: 1,
                      p: 2,
                      textAlign: 'center',
                      cursor: hasChildren ? 'not-allowed' : 'pointer',
                      borderColor: parentId ? 'warning.main' : 'divider',
                      borderWidth: parentId ? 2 : 1,
                      bgcolor: parentId ? 'warning.light' : 'transparent',
                      opacity: hasChildren ? 0.5 : 1,
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
              {parentId !== '' && !hasChildren && (
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

              {/* Current Parent Info */}
              {parentId && hasChildren && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Current Parent: {parentCategories.find(c => c.id.toString() === parentId)?.name || 'None'}
                  </Typography>
                </Box>
              )}

              {/* Category Name */}
              <TextField
                fullWidth
                required
                label={parentId ? 'Subcategory Name' : 'Category Name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Info Panel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              ℹ️ Category Information
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Main Category:</strong> A top-level category that can contain subcategories and products.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Subcategory:</strong> A category that belongs to a main category. Helps organize products more specifically.
              </Typography>
              {hasChildren && (
                <Paper sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                  <Typography variant="body2" color="warning.dark">
                    ⚠️ This category has subcategories. To change it to a subcategory, you must first move or delete its subcategories.
                  </Typography>
                </Paper>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EditCategoryPage;
