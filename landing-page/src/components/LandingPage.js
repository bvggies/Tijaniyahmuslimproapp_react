import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
} from '@mui/material';
import {
  AccessTime,
  Explore,
  CalendarToday,
  VolumeUp,
  Psychology,
  Groups,
  Book,
  Favorite,
  Mosque,
  Download,
  CheckCircle,
} from '@mui/icons-material';
import Navbar from './Navbar';
import Footer from './Footer';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <AccessTime sx={{ fontSize: 40 }} />,
      title: 'Prayer Times',
      description: 'Accurate prayer time calculations based on your location with multiple calculation methods.',
    },
    {
      icon: <Explore sx={{ fontSize: 40 }} />,
      title: 'Qibla Compass',
      description: 'Beautiful Qibla compass with device sensors to find the direction of the Kaaba.',
    },
    {
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      title: 'Islamic Calendar',
      description: 'Hijri calendar with accurate Islamic dates, holidays, and special occasions.',
    },
    {
      icon: <VolumeUp sx={{ fontSize: 40 }} />,
      title: 'Azan & Audio',
      description: 'Beautiful Azan recordings from famous mosques worldwide with high-quality audio.',
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'Digital Tasbih',
      description: 'Elegant digital dhikr counter with multiple formulas and progress tracking.',
    },
    {
      icon: <Book sx={{ fontSize: 40 }} />,
      title: 'Wazifa Practice',
      description: 'Complete Wazifa with proper niyyah supplications and step-by-step guidance.',
    },
    {
      icon: <Favorite sx={{ fontSize: 40 }} />,
      title: 'Lazim Practice',
      description: 'Morning and Evening Lazim routines with proper niyyah supplications.',
    },
    {
      icon: <Mosque sx={{ fontSize: 40 }} />,
      title: 'Zikr Jum\'ah',
      description: 'Special Friday dhikr practices with complete guidance for spiritual growth.',
    },
    {
      icon: <Groups sx={{ fontSize: 40 }} />,
      title: 'Community',
      description: 'Connect with fellow Muslims worldwide and share Islamic knowledge.',
    },
  ];

  return (
    <Box>
      <Navbar />
      <Box sx={{ pt: 10 }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #052F2A 0%, #0A5D52 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
            },
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Fade in timeout={1000}>
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        fontWeight: 800,
                        mb: 3,
                        lineHeight: 1.2,
                      }}
                    >
                      Your Complete Islamic Companion
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 4,
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 400,
                        lineHeight: 1.6,
                      }}
                    >
                      Designed specifically for followers of the Tijaniyya Tariqa and all Muslims seeking spiritual growth. 
                      All-in-one Islamic tools in the palm of your hand.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          backgroundColor: '#D4AF37',
                          color: '#052F2A',
                          fontWeight: 700,
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': {
                            backgroundColor: '#E5C866',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        startIcon={<Download />}
                        onClick={() => {
                          const element = document.querySelector('#download');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Download Now
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                        }}
                        onClick={() => {
                          const element = document.querySelector('#features');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Learn More
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grow in timeout={1500}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      fontSize: '10rem',
                      opacity: 0.9,
                    }}
                  >
                    🕌
                  </Box>
                </Grow>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box id="features" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#F8F9FA' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#052F2A',
                }}
              >
                Powerful Features
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#666',
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                Everything you need for your spiritual journey in one beautiful app
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Grow in timeout={500 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(5, 47, 42, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            color: '#052F2A',
                            mb: 2,
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 600,
                            mb: 1.5,
                            color: '#052F2A',
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            lineHeight: 1.7,
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Why Choose Section */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#052F2A',
                }}
              >
                Why Choose Tijaniyah Muslim Pro?
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <CheckCircle sx={{ fontSize: 60, color: '#052F2A', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A' }}>
                    Authentic
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Based on authentic Islamic teachings and Tijaniyya practices
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <CheckCircle sx={{ fontSize: 60, color: '#052F2A', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A' }}>
                    Comprehensive
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    All-in-one Islamic companion with everything you need
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <CheckCircle sx={{ fontSize: 60, color: '#052F2A', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A' }}>
                    User-Friendly
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Intuitive design for all ages with beautiful interface
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Download Section */}
        <Box
          id="download"
          sx={{
            background: 'linear-gradient(135deg, #052F2A 0%, #0A5D52 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Start Your Spiritual Journey Today
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                Download Tijaniyah Muslim Pro now and experience the most comprehensive Islamic app
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#D4AF37',
                    color: '#052F2A',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: '#E5C866',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  startIcon={<Download />}
                >
                  Google Play
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                  startIcon={<Download />}
                >
                  App Store
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage;

