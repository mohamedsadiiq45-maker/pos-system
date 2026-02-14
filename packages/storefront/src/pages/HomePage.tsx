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
import HandshakeIcon from '@mui/icons-material/Handshake';

const services = [
  {
    title: 'Food & Emergency Relief',
    description: 'Rapid assistance for vulnerable families with food packs, meals, and urgent household support.',
    icon: <VolunteerActivismIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
  {
    title: 'Health & Wellbeing',
    description: 'Community health outreach, medical referrals, and support for mothers, children, and elders.',
    icon: <HealthAndSafetyIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
  {
    title: 'Education Support',
    description: 'School fees, materials, and mentorship that keep children and youth in safe learning pathways.',
    icon: <SchoolIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
  {
    title: 'Water & Sanitation',
    description: 'Clean water access, hygiene supplies, and sanitation programs that protect community health.',
    icon: <WaterDropIcon sx={{ fontSize: 34, color: 'primary.main' }} />,
  },
];

const HomePage: React.FC = () => {
  return (
    <Box>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #dbe6f0' }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box component="img" src="/alwacyi-logo.svg" alt="Al-Wacyi Foundation Logo" sx={{ width: 50, height: 50 }} />
            <Box>
              <Typography fontWeight={800} color="primary.main" lineHeight={1.1}>Al-Wacyi Foundation</Typography>
              <Typography variant="caption" color="text.secondary">Hope • Care • Opportunity</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" href="#services">Services</Button>
            <Button color="inherit" href="#impact">Impact</Button>
            <Button variant="contained" color="secondary">Donate</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ background: 'linear-gradient(135deg, #1f5c89 0%, #2b7ab3 55%, #61a9d5 100%)', color: 'white' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip label="Trusted Community Nonprofit" sx={{ bgcolor: 'rgba(255,255,255,.18)', color: 'white', mb: 2 }} />
              <Typography variant="h2" sx={{ fontSize: { xs: '2.1rem', md: '3.25rem' }, maxWidth: 700 }}>
                Restoring dignity for poor families through action-driven humanitarian programs.
              </Typography>
              <Typography sx={{ mt: 2.5, color: '#dbeafe', maxWidth: 650 }}>
                Al-Wacyi Foundation works with communities, volunteers, and partners to deliver urgent relief and
                long-term support in food security, education, healthcare, and clean water.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                <Button size="large" variant="contained" color="secondary">Support a Family</Button>
                <Button size="large" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,.7)' }}>
                  Join as Volunteer
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.94)', borderRadius: 4 }}>
                <Box component="img" src="/alwacyi-logo.svg" alt="Al-Wacyi Foundation emblem" sx={{ width: '100%', maxWidth: 320, display: 'block', mx: 'auto' }} />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container id="services" maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Typography variant="h4" textAlign="center" sx={{ mb: 1 }}>Our Core Services</Typography>
        <Typography color="text.secondary" textAlign="center" sx={{ mb: 5 }}>
          Professionally managed programs focused on immediate relief and sustainable impact.
        </Typography>
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item xs={12} md={6} key={service.title}>
              <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 12px 30px rgba(15,23,42,.06)' }}>
                <CardContent sx={{ p: 3 }}>
                  {service.icon}
                  <Typography variant="h6" sx={{ mt: 1.5, mb: 1 }}>{service.title}</Typography>
                  <Typography color="text.secondary">{service.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box id="impact" sx={{ bgcolor: '#f0f9ff', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {[
              ['3,500+', 'Families supported'],
              ['1,200+', 'Children in education support'],
              ['260+', 'Volunteers mobilized'],
              ['48', 'Water & sanitation projects'],
            ].map(([value, label]) => (
              <Grid item xs={6} md={3} key={label}>
                <Card sx={{ textAlign: 'center', py: 2, borderRadius: 3 }}>
                  <Typography variant="h4" color="primary.main" fontWeight={800}>{value}</Typography>
                  <Typography color="text.secondary">{label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <HandshakeIcon color="secondary" sx={{ fontSize: 36, mb: 1 }} />
        <Typography variant="h4" sx={{ mb: 1.5 }}>Partner with Al-Wacyi Foundation</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Your donations and partnerships directly fund life-saving interventions and long-term community progress.
        </Typography>
        <Button variant="contained" color="primary" size="large">Contact the Foundation</Button>
      </Container>
    </Box>
  );
};

export default HomePage;
