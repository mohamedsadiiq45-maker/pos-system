import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  InputAdornment,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AddSupplierPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Supplier name is required';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    const response = await fetch('http://localhost:3001/api/suppliers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name, contact, email, address }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message || 'Failed to add supplier. Please try again.');
      return;
    }
    navigate('/suppliers');
  };

  const getInitials = (name: string) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Add Supplier
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suppliers • Add New Supplier
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          component={Link}
          to="/suppliers"
        >
          Back to Suppliers
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Preview Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'warning.main',
                fontSize: '2.5rem',
                fontWeight: 600,
                mx: 'auto',
                mb: 2,
              }}
            >
              {getInitials(name)}
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              {name || 'Supplier Name'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              New Supplier
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2" color={contact ? 'text.primary' : 'text.disabled'}>
                  {contact || 'Phone number'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2" color={email ? 'text.primary' : 'text.disabled'}>
                  {email || 'Email address'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
                <Typography variant="body2" color={address ? 'text.primary' : 'text.disabled'}>
                  {address || 'Address'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Basic Information */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BusinessIcon color="warning" />
                <Typography variant="subtitle1" fontWeight="600">
                  Basic Information
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Supplier Name"
                    name="name"
                    placeholder="Enter supplier or company name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Contact Information */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PhoneIcon color="warning" />
                <Typography variant="subtitle1" fontWeight="600">
                  Contact Information
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="contact"
                    label="Phone Number"
                    name="contact"
                    placeholder="e.g., +253 77 12 34 56"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="e.g., supplier@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Address */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationIcon color="warning" />
                <Typography variant="subtitle1" fontWeight="600">
                  Location
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="address"
                    label="Business Address"
                    name="address"
                    placeholder="Enter full address"
                    multiline
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/suppliers"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  startIcon={<SaveIcon />}
                >
                  Add Supplier
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddSupplierPage;
