import {
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  CheckCircle as VerifiedIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  gender?: string;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('personal');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    gender: 'male',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const response = await fetch('http://localhost:3001/api/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const users = await response.json();
      // For demo, get the first user (in real app, get current user from token)
      if (users.length > 0) {
        const user = users[0];
        setProfile(user);
        const nameParts = (user.name || '').split(' ');
        setFormData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          phone: '',
          address: '',
          gender: 'male',
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!profile) return;
    setSaving(true);
    
    const response = await fetch(`http://localhost:3001/api/users/${profile.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
      }),
    });

    if (response.ok) {
      alert('Profile updated successfully!');
      fetchProfile();
    } else {
      alert('Failed to update profile');
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    if (!profile) return;

    const response = await fetch(`http://localhost:3001/api/users/${profile.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        password: passwordData.newPassword,
      }),
    });

    if (response.ok) {
      alert('Password changed successfully!');
      setPasswordDialogOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      alert('Failed to change password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { id: 'personal', label: 'Personal Information', icon: <PersonIcon /> },
    { id: 'password', label: 'Login & Password', icon: <LockIcon /> },
    { id: 'logout', label: 'Log Out', icon: <LogoutIcon />, color: 'error.main' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Profile Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dashboard • Profile
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left Sidebar - Profile Card */}
        <Paper sx={{ width: 280, p: 3, borderRadius: 3, textAlign: 'center' }}>
          {/* Avatar */}
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: '3rem',
                bgcolor: 'warning.main',
              }}
            >
              {formData.firstName?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'warning.main',
                color: 'white',
                '&:hover': { bgcolor: 'warning.dark' },
              }}
            >
              <CameraIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography variant="h6" fontWeight="600">
            {formData.firstName} {formData.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Sales Manager
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Menu */}
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={selectedSection === item.id}
                  onClick={() => {
                    if (item.id === 'logout') {
                      handleLogout();
                    } else if (item.id === 'password') {
                      setPasswordDialogOpen(true);
                    } else {
                      setSelectedSection(item.id);
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    color: item.color,
                    '&.Mui-selected': {
                      bgcolor: 'warning.light',
                      color: 'warning.dark',
                      '&:hover': { bgcolor: 'warning.light' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Content - Personal Information Form */}
        <Paper sx={{ flex: 1, p: 3, borderRadius: 3 }}>
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
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                First Name
              </Typography>
              <TextField
                fullWidth
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Last Name
              </Typography>
              <TextField
                fullWidth
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
              />
            </Grid>
          </Grid>

          {/* Email */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Email
            </Typography>
            <TextField
              fullWidth
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
              InputProps={{
                endAdornment: (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verified"
                    color="success"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                ),
              }}
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
              variant="outlined"
              placeholder="Enter your address"
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
            />
          </Box>

          {/* Phone */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Phone Number
              </Typography>
              <TextField
                fullWidth
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                variant="outlined"
                placeholder="+253 XX XX XX XX"
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Location
              </Typography>
              <TextField
                fullWidth
                value="Djibouti City"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="warning"
              onClick={fetchProfile}
              sx={{ px: 4 }}
            >
              Discard Changes
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleSaveChanges}
              disabled={saving}
              sx={{ px: 4 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleChangePassword}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfilePage;

