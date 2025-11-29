import {
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  SubdirectoryArrowRight as SubIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Category {
  id: number;
  name: string;
  parentId: number | null;
  parent?: Category;
  children?: Category[];
  _count?: {
    products: number;
  };
}

function CategoryPage() {
  const { hasPermission } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const canAdd = hasPermission('addCategory');
  const canEdit = hasPermission('editCategory');
  const canDelete = hasPermission('deleteCategory');

  const fetchCategories = async () => {
    const response = await fetch('http://localhost:3001/api/categories', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setCategories(data);
      // Auto-expand parent categories that have children
      const parentsWithChildren = new Set(
        data.filter((c: Category) => c.children && c.children.length > 0).map((c: Category) => c.id)
      );
      setExpandedCategories(parentsWithChildren);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? Subcategories will become main categories.')) return;

    const response = await fetch(`http://localhost:3001/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      fetchCategories();
    } else {
      const error = await response.json();
      alert(error.message || 'Failed to delete category');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Get parent categories (categories without parentId)
  const parentCategories = categories.filter((c) => !c.parentId);
  
  // Get children for a parent
  const getChildren = (parentId: number) => categories.filter((c) => c.parentId === parentId);

  // Filter categories
  const filteredParentCategories = parentCategories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getChildren(c.id).some((child) => child.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalCategories = categories.length;
  const totalMainCategories = parentCategories.length;
  const totalSubcategories = categories.filter((c) => c.parentId).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboard • Categories
          </Typography>
        </Box>
        {canAdd && (
          <Button
            variant="contained"
            color="warning"
            startIcon={<AddIcon />}
            component={Link}
            to="/categories/new"
          >
            Add Category
          </Button>
        )}
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">Total Categories</Typography>
          <Typography variant="h4" fontWeight="bold">{totalCategories}</Typography>
        </Paper>
        <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">Main Categories</Typography>
          <Typography variant="h4" fontWeight="bold" color="warning.main">{totalMainCategories}</Typography>
        </Paper>
        <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">Subcategories</Typography>
          <Typography variant="h4" fontWeight="bold" color="primary.main">{totalSubcategories}</Typography>
        </Paper>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <TextField
          placeholder="Search categories..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Categories Table */}
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 50 }}></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Products</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Subcategories</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredParentCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No categories found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredParentCategories.map((category) => {
                  const children = getChildren(category.id);
                  const hasChildren = children.length > 0;
                  const isExpanded = expandedCategories.has(category.id);

                  return (
                    <>
                      {/* Parent Category Row */}
                      <TableRow key={category.id} hover>
                        <TableCell>
                          {hasChildren && (
                            <IconButton size="small" onClick={() => toggleExpand(category.id)}>
                              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CategoryIcon color="warning" />
                            <Typography fontWeight="600">{category.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label="Main" size="small" color="warning" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={category._count?.products || 0} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {hasChildren && (
                            <Chip 
                              label={children.length} 
                              size="small" 
                              color="primary"
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {canEdit && (
                            <IconButton
                              size="small"
                              color="primary"
                              component={Link}
                              to={`/categories/edit/${category.id}`}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          {canDelete && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(category.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Subcategory Rows */}
                      {hasChildren && (
                        <TableRow>
                          <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                            <Collapse in={isExpanded}>
                              <Table size="small">
                                <TableBody>
                                  {children
                                    .filter((child) =>
                                      searchTerm === '' ||
                                      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      category.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((child) => (
                                      <TableRow key={child.id} hover>
                                        <TableCell sx={{ width: 50 }}></TableCell>
                                        <TableCell>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 3 }}>
                                            <SubIcon color="action" fontSize="small" />
                                            <Typography>{child.name}</Typography>
                                          </Box>
                                        </TableCell>
                                        <TableCell>
                                          <Chip label="Sub" size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell align="center">
                                          <Chip 
                                            label={child._count?.products || 0} 
                                            size="small" 
                                            variant="outlined"
                                          />
                                        </TableCell>
                                        <TableCell align="center">-</TableCell>
                                        <TableCell align="center">
                                          {canEdit && (
                                            <IconButton
                                              size="small"
                                              color="primary"
                                              component={Link}
                                              to={`/categories/edit/${child.id}`}
                                            >
                                              <EditIcon fontSize="small" />
                                            </IconButton>
                                          )}
                                          {canDelete && (
                                            <IconButton
                                              size="small"
                                              color="error"
                                              onClick={() => handleDelete(child.id)}
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default CategoryPage;
