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
  Chip,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as ManagerIcon,
  PointOfSale as CashierIcon,
  Inventory as InventoryIcon,
  Visibility as ViewerIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const roleConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  admin: { label: 'Administrator', color: '#dc3545', icon: <AdminIcon fontSize="small" /> },
  manager: { label: 'Manager', color: '#ff6b35', icon: <ManagerIcon fontSize="small" /> },
  cashier: { label: 'Cashier', color: '#28a745', icon: <CashierIcon fontSize="small" /> },
  inventory_manager: { label: 'Inventory Manager', color: '#17a2b8', icon: <InventoryIcon fontSize="small" /> },
  viewer: { label: 'Viewer', color: '#6c757d', icon: <ViewerIcon fontSize="small" /> },
};

function UserPage() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const canAdd = hasPermission('addUser');
  const canEdit = hasPermission('editUser');
  const canDelete = hasPermission('deleteUser');

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:3001/api/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const response = await fetch(`http://localhost:3001/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      setUsers(users.filter((user) => user.id !== id));
    } else {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleConfig = (role: string) => {
    return roleConfig[role] || { label: role, color: '#6c757d', icon: <CashierIcon fontSize="small" /> };
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboard • Users
          </Typography>
        </Box>
        {canAdd && (
          <Button
            variant="contained"
            color="warning"
            startIcon={<AddIcon />}
            component={Link}
            to="/users/new"
          >
            Add User
          </Button>
        )}
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <TextField
          placeholder="Search users by name, email or role..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Users Table */}
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No users found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const config = getRoleConfig(user.role);
                  return (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: config.color, width: 36, height: 36 }}>
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </Avatar>
                          <Typography fontWeight="500">{user.name || 'Unnamed'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          icon={config.icon}
                          label={config.label}
                          size="small"
                          sx={{
                            bgcolor: `${config.color}15`,
                            color: config.color,
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: config.color },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('en', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell align="center">
                        {canEdit && (
                          <IconButton
                            size="small"
                            color="primary"
                            component={Link}
                            to={`/users/edit/${user.id}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        {canDelete && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(user.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
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

export default UserPage;
