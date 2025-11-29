import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Avatar,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useContext } from 'react';
import { DashboardContext } from './DashboardContext';

interface TopBarProps {
  toggleTheme: () => void;
  themeMode: 'light' | 'dark';
}

function TopBar({ toggleTheme, themeMode }: TopBarProps) {
  const context = useContext(DashboardContext);
  if (!context) {
    return null;
  }
  const { dateRange, setDateRange } = context;

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          My POS
        </Typography>

        <Box sx={{ flexGrow: 1, ml: 4, display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" sx={{ fontWeight: 'bold' }}>Dashboard</Button>
          <Button color="inherit">Orders</Button>
          <Button color="inherit">Transactions</Button>
          <Button color="inherit">Reports</Button>
          <Button color="inherit">Inventory</Button>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <FormControlLabel
          control={<Switch checked={true} />}
          label="Show Statistics"
        />

        <Select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ mx: 2 }}
        >
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </Select>

        <Button variant="contained" color="primary">
          Add New Order
        </Button>

        <IconButton color="inherit" sx={{ mx: 1 }}>
          <Badge badgeContent={4} color="primary">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <FormControlLabel
          control={<Switch checked={themeMode === 'dark'} onChange={toggleTheme} />}
          label={themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Avatar sx={{ width: 32, height: 32 }}>S</Avatar>
          <Box sx={{ ml: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Sadik
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Admin
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;