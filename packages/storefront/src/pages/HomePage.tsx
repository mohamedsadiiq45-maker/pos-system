import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SchoolIcon from '@mui/icons-material/School';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import GroupsIcon from '@mui/icons-material/Groups';
import FavoriteIcon from '@mui/icons-material/Favorite';

const services = [
  {
    title: 'Emergency Food Support',
    description: 'We provide food packages and cooked meals to families facing hunger and crisis.',
    icon: <VolunteerActivismIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
  {
    title: 'Healthcare Outreach',
    description: 'Free health screening, medicine support, and referrals for poor and vulnerable communities.',
    icon: <HealthAndSafetyIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
  {
    title: 'Education Assistance',
    description: 'School materials, scholarships, and mentorship programs for children and youth.',
    icon: <SchoolIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
  {
    title: 'Clean Water Initiatives',
    description: 'Building access to clean and safe water through wells, filters, and hygiene campaigns.',
    icon: <WaterDropIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
];

const impactStats = [
  { label: 'Families Supported', value: '3,500+' },
  { label: 'Children in School Programs', value: '1,200+' },
  { label: 'Community Volunteers', value: '260+' },
  { label: 'Clean Water Projects', value: '48' },
];

const HomePage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e2e8f0' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <FavoriteIcon color="primary" />
            <Typography variant="h6" fontWeight={800} color="primary.main">
              Alwacyi Foundation
            </Typography>
          </Stack>
          <Button variant="contained" color="primary">Donate Now</Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #14532d 0%, #22c55e 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Chip label="Serving with compassion" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, maxWidth: 800 }}>
            Helping poor people live with dignity, hope, and opportunity.
          </Typography>
          <Typography sx={{ mt: 3, maxWidth: 720, fontSize: { xs: '1rem', md: '1.15rem' } }}>
            Alwacyi Foundation is a humanitarian organization committed to reducing poverty through food relief,
            healthcare support, education, and community empowerment.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <Button variant="contained" color="secondary" size="large">Become a Partner</Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
            >
              Volunteer With Us
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 1 }}>
          Our Services
        </Typography>
        <Typography color="text.secondary" textAlign="center" sx={{ mb: 5 }}>
          We focus on practical support for families and communities in need.
        </Typography>

        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} key={service.title}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 10px 25px rgba(15,23,42,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  {service.icon}
                  <Typography variant="h6" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
                    {service.title}
                  </Typography>
                  <Typography color="text.secondary">{service.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#ecfdf5' }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
            <GroupsIcon color="primary" />
            <Typography variant="h4" fontWeight={800}>
              Impact Snapshot
            </Typography>
          </Stack>
          <Grid container spacing={2.5}>
            {impactStats.map((stat) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <Card sx={{ textAlign: 'center', borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h4" fontWeight={800} color="primary.main">
                      {stat.value}
                    </Typography>
                    <Typography color="text.secondary">{stat.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
            Join Alwacyi Foundation in Changing Lives
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Whether through donations, partnerships, or volunteering, your support helps us reach more people in
            poverty and build stronger communities.
          </Typography>
          <Button variant="contained" size="large" color="primary">
            Contact the Foundation
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
