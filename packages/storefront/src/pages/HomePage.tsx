import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PublicIcon from '@mui/icons-material/Public';

const services = [
  {
    title: 'Emergency Food Support',
    description: 'Weekly food packages, nutrition support, and emergency meal distributions for families in crisis.',
    icon: <VolunteerActivismIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
  {
    title: 'Healthcare Outreach',
    description: 'Mobile health screening, medicine support, maternal care referrals, and awareness campaigns.',
    icon: <HealthAndSafetyIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
  {
    title: 'Education Assistance',
    description: 'School supplies, tuition aid, learning clubs, and mentorship for children and vulnerable youth.',
    icon: <SchoolIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
  {
    title: 'Clean Water Initiatives',
    description: 'Safe water points, household filters, sanitation support, and hygiene training for communities.',
    icon: <WaterDropIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
];

const impactStats = [
  { label: 'Families Supported', value: '3,500+' },
  { label: 'Children Supported in Education', value: '1,200+' },
  { label: 'Community Volunteers', value: '260+' },
  { label: 'Water & Sanitation Projects', value: '48' },
];

const HomePage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e2e8f0' }}>
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', py: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <FavoriteIcon color="primary" />
            <Typography variant="h6" fontWeight={800} color="primary.main">
              Alwacyi Foundation
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button color="inherit" href="#services">Services</Button>
            <Button color="inherit" href="#impact">Impact</Button>
            <Button color="inherit" href="#about">About</Button>
            <Button variant="contained" color="primary">Donate Now</Button>
          </Stack>
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
          <Chip label="Nonprofit • Community First" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, maxWidth: 850 }}>
            Ending poverty with practical support, dignity, and long-term opportunity.
          </Typography>
          <Typography sx={{ mt: 3, maxWidth: 760, fontSize: { xs: '1rem', md: '1.15rem' } }}>
            Alwacyi Foundation is a humanitarian organization helping poor people through food relief, healthcare,
            education, and clean water programs that strengthen families and communities.
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

      <Container id="services" maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 1 }}>
          Core Services
        </Typography>
        <Typography color="text.secondary" textAlign="center" sx={{ mb: 5 }}>
          Focused, measurable programs designed to meet urgent needs and build resilience.
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

      <Box id="impact" sx={{ py: { xs: 6, md: 8 }, bgcolor: '#ecfdf5' }}>
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

      <Container id="about" maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <PublicIcon color="primary" />
                  <Typography variant="h5" fontWeight={800}>Our Vision</Typography>
                </Stack>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  A society where every family has access to food, healthcare, education, and safe living conditions.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  <ListItem disableGutters>
                    <ListItemIcon><TaskAltIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Transparent use of donations and resources" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon><TaskAltIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Programs driven by local community needs" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon><TaskAltIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Partnership model with volunteers and institutions" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, bgcolor: '#0f172a', color: 'white', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <HandshakeIcon sx={{ color: '#fde68a' }} />
                  <Typography variant="h5" fontWeight={800}>How You Can Help</Typography>
                </Stack>
                <Typography sx={{ color: '#cbd5e1', mb: 3 }}>
                  Your support directly funds life-changing assistance for poor communities.
                </Typography>
                <Stack spacing={1.5}>
                  <Button variant="contained" color="secondary">Donate Monthly</Button>
                  <Button variant="outlined" sx={{ borderColor: '#94a3b8', color: '#f8fafc' }}>Sponsor a Child</Button>
                  <Button variant="outlined" sx={{ borderColor: '#94a3b8', color: '#f8fafc' }}>Join as Volunteer</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ py: 8, borderTop: '1px solid #e2e8f0' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
            Join Alwacyi Foundation in Changing Lives
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Through donations, partnerships, and volunteering, you help us reach more families and build stronger,
            healthier communities.
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
