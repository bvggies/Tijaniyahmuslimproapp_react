import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
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
  MenuBook,
  School,
  LocationOn,
  LiveTv,
  Chat,
  AccountBalance,
  Translate,
  Security,
  CloudSync,
  AutoAwesome,
  Gavel,
  History,
  LocalLibrary,
  Person,
  Star,
  Diamond,
  RadioButtonChecked,
  CheckCircleOutline,
  Today,
  LibraryBooks,
  Handshake,
  Bookmark,
  LocationCity,
  PlayCircle,
  SmartToy,
  AttachMoney,
} from '@mui/icons-material';
import Navbar from './Navbar';
import Footer from './Footer';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Core Features
  const coreFeatures = [
    {
      icon: <AccessTime sx={{ fontSize: 40 }} />,
      title: 'Prayer Times',
      description: 'Accurate prayer time calculations based on your location with multiple calculation methods (Muslim World League, Umm al-Qura, etc.) and customizable notifications.',
      category: 'Core',
      color: '#2196F3',
    },
    {
      icon: <Explore sx={{ fontSize: 40 }} />,
      title: 'Qibla Compass',
      description: 'Beautiful Qibla compass with device sensors to find the direction of the Kaaba from anywhere in the world.',
      category: 'Core',
      color: '#4CAF50',
    },
    {
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      title: 'Islamic Calendar',
      description: 'Hijri calendar with accurate Islamic dates, holidays, and special occasions. Multiple calendar types (Umm al-Qura, Tabular, Kuwaiti) with lunar calendar support.',
      category: 'Core',
      color: '#FF9800',
    },
    {
      icon: <VolumeUp sx={{ fontSize: 40 }} />,
      title: 'Azan & Audio',
      description: 'Beautiful Azan recordings from famous mosques worldwide with high-quality Islamic audio content and background playback support.',
      category: 'Core',
      color: '#9C27B0',
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'Digital Tasbih',
      description: 'Elegant digital dhikr counter with multiple dhikr formulas, progress tracking, and beautiful Islamic-themed interface.',
      category: 'Core',
      color: '#E91E63',
    },
    {
      icon: <MenuBook sx={{ fontSize: 40 }} />,
      title: 'Quran Reader',
      description: 'Read the Holy Quran with translations, multiple recitations, and beautiful typography for an enhanced reading experience.',
      category: 'Core',
      color: '#00BCD4',
    },
  ];

  // Tijaniyya-Specific Features
  const tijaniyyaFeatures = [
    {
      icon: <Book sx={{ fontSize: 40 }} />,
      title: 'Wazifa Practice',
      description: 'Complete Wazifa with proper niyyah (intention) supplications, step-by-step guidance for daily practice, and digital counters for accurate recitation.',
      category: 'Tijaniyya',
      color: '#FF6F00',
    },
    {
      icon: <Favorite sx={{ fontSize: 40 }} />,
      title: 'Lazim Practice',
      description: 'Morning and Evening Lazim routines with proper niyyah supplications, interactive step-by-step guidance, and completion tracking.',
      category: 'Tijaniyya',
      color: '#C2185B',
    },
    {
      icon: <Mosque sx={{ fontSize: 40 }} />,
      title: 'Zikr Jum\'ah',
      description: 'Special Friday dhikr (Haylala) practices with proper niyyah supplications and complete guidance for between Asr and Maghrib.',
      category: 'Tijaniyya',
      color: '#7B1FA2',
    },
    {
      icon: <Handshake sx={{ fontSize: 40 }} />,
      title: 'Niyyah Supplications',
      description: 'Authentic intention prayers for all Tijani practices with Arabic text, transliteration, and English translation.',
      category: 'Tijaniyya',
      color: '#512DA8',
    },
    {
      icon: <Star sx={{ fontSize: 40 }} />,
      title: 'Tariqa Tijaniyyah',
      description: 'Learn about The Tijānī Path with comprehensive teachings and historical context.',
      category: 'Tijaniyya',
      color: '#0B9A6F',
    },
    {
      icon: <Gavel sx={{ fontSize: 40 }} />,
      title: 'Tijaniya Fiqh',
      description: 'The Conditions of Tijaniya Fiqh with detailed explanations and guidance.',
      category: 'Tijaniyya',
      color: '#1B5E20',
    },
    {
      icon: <LibraryBooks sx={{ fontSize: 40 }} />,
      title: 'Resources for Beginners',
      description: 'Islamic Terms & Phrases to help beginners understand Tijaniyya practices.',
      category: 'Tijaniyya',
      color: '#4CAF50',
    },
    {
      icon: <Diamond sx={{ fontSize: 40 }} />,
      title: 'Proof of Tasawwuf',
      description: 'Dhikr is the Greatest Obligation - comprehensive proof and explanations.',
      category: 'Tijaniyya',
      color: '#9C27B0',
    },
    {
      icon: <Handshake sx={{ fontSize: 40 }} />,
      title: 'Duas of Tijaniyya',
      description: 'Complete collection of Tijani Duas with proper recitation guidance.',
      category: 'Tijaniyya',
      color: '#00BCD4',
    },
    {
      icon: <Bookmark sx={{ fontSize: 40 }} />,
      title: 'Dua Khatmul Wazifa',
      description: 'Closing Prayer of Wazifa with proper instructions and meanings.',
      category: 'Tijaniyya',
      color: '#E91E63',
    },
    {
      icon: <Favorite sx={{ fontSize: 40 }} />,
      title: 'Dua Rabil Ibadi',
      description: 'Prayer to the Lord of Servants with Arabic text and translations.',
      category: 'Tijaniyya',
      color: '#673AB7',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Dua Hasbil Muhaiminu',
      description: 'The Protector is Sufficient for Me - powerful supplication with guidance.',
      category: 'Tijaniyya',
      color: '#3F51B5',
    },
  ];

  // Educational & Community Features
  const educationalFeatures = [
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Islamic Lessons',
      description: 'Comprehensive Islamic education with Tijaniyya Tariqa teachings, history, scholar biographies, and interactive learning modules.',
      category: 'Education',
      color: '#607D8B',
    },
    {
      icon: <Person sx={{ fontSize: 40 }} />,
      title: 'Scholars',
      description: 'Learn from Islamic scholars and teachers with biographies, contributions, and teachings from respected Tijaniyya scholars.',
      category: 'Education',
      color: '#795548',
    },
    {
      icon: <Groups sx={{ fontSize: 40 }} />,
      title: 'Community',
      description: 'Connect with fellow Muslims worldwide, share Islamic knowledge and experiences, ask questions, and get community support.',
      category: 'Community',
      color: '#E91E63',
    },
    {
      icon: <LocationCity sx={{ fontSize: 40 }} />,
      title: 'Mosque Finder',
      description: 'Find nearby mosques and prayer facilities with location-based search and directions.',
      category: 'Tools',
      color: '#795548',
    },
    {
      icon: <PlayCircle sx={{ fontSize: 40 }} />,
      title: 'Makkah Live',
      description: 'Watch live streams from the Holy Kaaba and experience the spiritual atmosphere of Makkah.',
      category: 'Tools',
      color: '#F44336',
    },
    {
      icon: <History sx={{ fontSize: 40 }} />,
      title: 'Islamic Journal',
      description: 'Reflect on your spiritual journey with a personal journal to track your progress and thoughts.',
      category: 'Tools',
      color: '#FF5722',
    },
    {
      icon: <SmartToy sx={{ fontSize: 40 }} />,
      title: 'AI Noor',
      description: 'AI-powered Islamic assistant to answer your questions and provide guidance on Islamic matters.',
      category: 'Tools',
      color: '#9C27B0',
    },
    {
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      title: 'Donation System',
      description: 'Support Islamic education and causes with transparent donation tracking, multiple payment options, and impact reports.',
      category: 'Community',
      color: '#4CAF50',
    },
    {
      icon: <Translate sx={{ fontSize: 40 }} />,
      title: 'Multi-Language Support',
      description: 'Available in English, Arabic, French, and Hausa with easy language switching and culturally appropriate translations.',
      category: 'Core',
      color: '#00ACC1',
    },
    {
      icon: <CloudSync sx={{ fontSize: 40 }} />,
      title: 'Offline Functionality',
      description: 'Core features work offline with sync across multiple devices and regular updates with new features.',
      category: 'Core',
      color: '#5C6BC0',
    },
  ];

  const allFeatures = [...coreFeatures, ...tijaniyyaFeatures, ...educationalFeatures];

  return (
    <Box>
      <Navbar />
      <Box sx={{ pt: 10 }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #052F2A 0%, #0A5D52 50%, #0D7A6B 100%)',
            color: 'white',
            py: { xs: 8, md: 15 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
            },
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Fade in timeout={1000}>
                  <Box>
                    <Box
                      component="img"
                      src="/logo.png"
                      alt="Tijaniyah Muslim Pro"
                      sx={{
                        height: { xs: 80, md: 120 },
                        width: 'auto',
                        mb: 3,
                        filter: 'drop-shadow(0 4px 20px rgba(212, 175, 55, 0.3))',
                      }}
                    />
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: '2.5rem', md: '3.8rem' },
                        fontWeight: 800,
                        mb: 3,
                        lineHeight: 1.2,
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #D4AF37 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Your Complete Islamic Companion
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 4,
                        color: 'rgba(255,255,255,0.95)',
                        fontWeight: 400,
                        lineHeight: 1.7,
                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                      }}
                    >
                      Designed specifically for followers of the Tijaniyya Tariqa and all Muslims seeking spiritual growth. 
                      All-in-one Islamic tools in the palm of your hand.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          background: 'linear-gradient(135deg, #D4AF37 0%, #E5C866 100%)',
                          color: '#052F2A',
                          fontWeight: 700,
                          px: 4,
                          py: 1.8,
                          fontSize: '1.1rem',
                          boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #E5C866 0%, #D4AF37 100%)',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 12px 32px rgba(212, 175, 55, 0.5)',
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
                          borderColor: 'rgba(255,255,255,0.8)',
                          borderWidth: 2,
                          color: 'white',
                          fontWeight: 600,
                          px: 4,
                          py: 1.8,
                          fontSize: '1.1rem',
                          backdropFilter: 'blur(10px)',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        onClick={() => {
                          const element = document.querySelector('#features');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Explore Features
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#D4AF37', fontSize: 24 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                          Free to Download
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#D4AF37', fontSize: 24 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                          Works Offline
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#D4AF37', fontSize: 24 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                          Multi-Language
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Fade>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grow in timeout={1500}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Box
                      component="img"
                      src="/logo.png"
                      alt="Tijaniyah Muslim Pro"
                      sx={{
                        width: '100%',
                        maxWidth: { xs: 300, md: 500 },
                        height: 'auto',
                        filter: 'drop-shadow(0 20px 60px rgba(212, 175, 55, 0.3))',
                        animation: 'float 6s ease-in-out infinite',
                        '@keyframes float': {
                          '0%, 100%': { transform: 'translateY(0px)' },
                          '50%': { transform: 'translateY(-20px)' },
                        },
                      }}
                    />
                  </Box>
                </Grow>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box id="features" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#F8F9FA' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  color: '#052F2A',
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Comprehensive Features
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#666',
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.8,
                }}
              >
                Everything you need for your spiritual journey in one beautiful, comprehensive app
              </Typography>
            </Box>

            {/* Core Features */}
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: '#052F2A',
                  textAlign: 'center',
                }}
              >
                Core Islamic Features
              </Typography>
              <Grid container spacing={3}>
                {coreFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Grow in timeout={300 + index * 50}>
                      <Card
                        sx={{
                          height: '100%',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: '1px solid rgba(5, 47, 42, 0.1)',
                          '&:hover': {
                            transform: 'translateY(-12px) scale(1.02)',
                            boxShadow: `0 20px 40px ${feature.color}20`,
                            borderColor: feature.color,
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3.5 }}>
                          <Box
                            sx={{
                              color: feature.color,
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            {feature.icon}
                            <Chip
                              label={feature.category}
                              size="small"
                              sx={{
                                backgroundColor: `${feature.color}15`,
                                color: feature.color,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              mb: 1.5,
                              color: '#052F2A',
                              fontSize: '1.3rem',
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#666',
                              lineHeight: 1.8,
                              fontSize: '0.95rem',
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
            </Box>

            {/* Tijaniyya Features */}
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: '#052F2A',
                  textAlign: 'center',
                }}
              >
                Tijaniyya-Specific Features
              </Typography>
              <Grid container spacing={3}>
                {tijaniyyaFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Grow in timeout={300 + index * 50}>
                      <Card
                        sx={{
                          height: '100%',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: '1px solid rgba(5, 47, 42, 0.1)',
                          '&:hover': {
                            transform: 'translateY(-12px) scale(1.02)',
                            boxShadow: `0 20px 40px ${feature.color}20`,
                            borderColor: feature.color,
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3.5 }}>
                          <Box
                            sx={{
                              color: feature.color,
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            {feature.icon}
                            <Chip
                              label={feature.category}
                              size="small"
                              sx={{
                                backgroundColor: `${feature.color}15`,
                                color: feature.color,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              mb: 1.5,
                              color: '#052F2A',
                              fontSize: '1.3rem',
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#666',
                              lineHeight: 1.8,
                              fontSize: '0.95rem',
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
            </Box>

            {/* Educational & Community Features */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: '#052F2A',
                  textAlign: 'center',
                }}
              >
                Education & Community Features
              </Typography>
              <Grid container spacing={3}>
                {educationalFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Grow in timeout={300 + index * 50}>
                      <Card
                        sx={{
                          height: '100%',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: '1px solid rgba(5, 47, 42, 0.1)',
                          '&:hover': {
                            transform: 'translateY(-12px) scale(1.02)',
                            boxShadow: `0 20px 40px ${feature.color}20`,
                            borderColor: feature.color,
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3.5 }}>
                          <Box
                            sx={{
                              color: feature.color,
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            {feature.icon}
                            <Chip
                              label={feature.category}
                              size="small"
                              sx={{
                                backgroundColor: `${feature.color}15`,
                                color: feature.color,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              mb: 1.5,
                              color: '#052F2A',
                              fontSize: '1.3rem',
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#666',
                              lineHeight: 1.8,
                              fontSize: '0.95rem',
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
            </Box>
          </Container>
        </Box>

        {/* Why Choose Section */}
        <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  color: '#052F2A',
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Why Choose Tijaniyah Muslim Pro?
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {[
                {
                  icon: <CheckCircle sx={{ fontSize: 60 }} />,
                  title: 'Authentic',
                  description: 'Based on authentic Islamic teachings and Tijaniyya practices',
                  color: '#4CAF50',
                },
                {
                  icon: <AutoAwesome sx={{ fontSize: 60 }} />,
                  title: 'Comprehensive',
                  description: 'All-in-one Islamic companion with 30+ features',
                  color: '#2196F3',
                },
                {
                  icon: <Security sx={{ fontSize: 60 }} />,
                  title: 'User-Friendly',
                  description: 'Intuitive design for all ages with beautiful interface',
                  color: '#FF9800',
                },
                {
                  icon: <CloudSync sx={{ fontSize: 60 }} />,
                  title: 'Reliable',
                  description: 'Accurate calculations, offline functionality, and trusted content',
                  color: '#9C27B0',
                },
                {
                  icon: <Groups sx={{ fontSize: 60 }} />,
                  title: 'Community',
                  description: 'Connect with like-minded Muslims worldwide',
                  color: '#E91E63',
                },
                {
                  icon: <Translate sx={{ fontSize: 60 }} />,
                  title: 'Multi-Language',
                  description: 'Available in English, Arabic, French, and Hausa',
                  color: '#00BCD4',
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Grow in timeout={400 + index * 100}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 4,
                        borderRadius: 3,
                        background: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 12px 32px ${item.color}20`,
                        },
                      }}
                    >
                      <Box sx={{ color: item.color, mb: 2 }}>
                        {item.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#052F2A' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Download Section */}
        <Box
          id="download"
          sx={{
            background: 'linear-gradient(135deg, #052F2A 0%, #0A5D52 50%, #0D7A6B 100%)',
            color: 'white',
            py: { xs: 10, md: 15 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
            },
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="Tijaniyah Muslim Pro"
                sx={{
                  height: { xs: 100, md: 150 },
                  width: 'auto',
                  mb: 4,
                  filter: 'drop-shadow(0 8px 32px rgba(212, 175, 55, 0.4))',
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #D4AF37 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Start Your Spiritual Journey Today
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 5,
                  color: 'rgba(255,255,255,0.95)',
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                }}
              >
                Download Tijaniyah Muslim Pro now and experience the most comprehensive Islamic app with 30+ features designed for your spiritual growth
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #E5C866 100%)',
                    color: '#052F2A',
                    fontWeight: 700,
                    px: 5,
                    py: 2,
                    fontSize: '1.2rem',
                    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E5C866 0%, #D4AF37 100%)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(212, 175, 55, 0.5)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  startIcon={<Download />}
                >
                  Download on Google Play
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.8)',
                    borderWidth: 2,
                    color: 'white',
                    fontWeight: 600,
                    px: 5,
                    py: 2,
                    fontSize: '1.2rem',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  startIcon={<Download />}
                >
                  Download on App Store
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
