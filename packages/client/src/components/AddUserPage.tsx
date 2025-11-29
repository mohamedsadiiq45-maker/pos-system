import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Radio,
  Chip,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Divider,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as ManagerIcon,
  PointOfSale as CashierIcon,
  Inventory as InventoryIcon,
  Visibility as ViewerIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const roleIcons: Record<string, React.ReactNode> = {
  admin: <AdminIcon />,
  manager: <ManagerIcon />,
  cashier: <CashierIcon />,
  inventory_manager: <InventoryIcon />,
  viewer: <ViewerIcon />,
};

const roleColors: Record<string, string> = {
  admin: '#dc3545',
  manager: '#ff6b35',
  cashier: '#28a745',
  inventory_manager: '#17a2b8',
  viewer: '#6c757d',
};

function AddUserPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: 'male',
    phone: '',
    address: '',
    location: 'Djibouti City',
  });
  const [role, setRole] = useState('cashier');
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const response = await fetch('http://localhost:3001/api/users/roles', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setRoles(data);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const response = await fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: fullName,
        email: formData.email,
        password: formData.password,
        role,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        location: formData.location,
      }),
    });

    if (response.ok) {
      navigate('/users');
    } else {
      const error = await response.json();
      alert(error.message || 'Failed to add user');
    }
    setLoading(false);
  };

  const permissionLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    pos: 'POS / Sales',
    products: 'Products',
    categories: 'Categories',
    inventory: 'Inventory',
    sales: 'Sales History',
    suppliers: 'Suppliers',
    users: 'User Management',
    reports: 'Reports',
    settings: 'Settings',
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Add New User
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dashboard • Users • Add New
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Personal Information
              </Typography>

              {/* Gender */}
              <Box sx={{ mb: 3 }}>
                <FormControl>
                  <RadioGroup
                    row
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio color="warning" />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio color="warning" />}
                      label="Female"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              {/* Name Fields */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    First Name *
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                  />
                </Grid>
              </Grid>

              {/* Email */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email Address *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                />
              </Box>

              {/* Password */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Password *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password"
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                />
              </Box>

              {/* Address */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Address
                </Typography>
                <TextField
                  fullWidth
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your address"
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                />
              </Box>

              {/* Phone & Location */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+253 XX XX XX XX"
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Location
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City"
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Role Selection */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Select User Role
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose a role to define what this user can access and manage
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {roles.map((r) => (
                  <Card
                    key={r.id}
                    variant="outlined"
                    onClick={() => setRole(r.id)}
                    sx={{
                      cursor: 'pointer',
                      borderColor: role === r.id ? roleColors[r.id] : 'divider',
                      borderWidth: role === r.id ? 2 : 1,
                      bgcolor: role === r.id ? `${roleColors[r.id]}10` : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: roleColors[r.id],
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Radio
                          checked={role === r.id}
                          size="small"
                          sx={{
                            p: 0,
                            color: roleColors[r.id],
                            '&.Mui-checked': { color: roleColors[r.id] },
                          }}
                        />
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: `${roleColors[r.id]}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: roleColors[r.id],
                            '& svg': { fontSize: 20 },
                          }}
                        >
                          {roleIcons[r.id]}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight="600">
                              {r.name}
                            </Typography>
                            {role === r.id && (
                              <Chip
                                icon={<CheckIcon />}
                                label="Selected"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.65rem',
                                  bgcolor: roleColors[r.id],
                                  color: 'white',
                                  '& .MuiChip-icon': { color: 'white', fontSize: 12 },
                                }}
                              />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {r.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {r.permissions.slice(0, 5).map((perm) => (
                              <Chip
                                key={perm}
                                label={permissionLabels[perm] || perm}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.6rem', height: 20 }}
                              />
                            ))}
                            {r.permissions.length > 5 && (
                              <Chip
                                label={`+${r.permissions.length - 5} more`}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 20 }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => navigate('/users')}
                sx={{ px: 4 }}
              >
                Discard Changes
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="warning"
                disabled={loading}
                sx={{ px: 4 }}
              >
                {loading ? 'Adding User...' : 'Add User'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AddUserPage;
