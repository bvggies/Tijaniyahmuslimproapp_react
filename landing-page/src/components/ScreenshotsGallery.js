import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
  Zoom,
} from '@mui/material';
import {
  Close,
  ChevronLeft,
  ChevronRight,
  PhoneAndroid,
} from '@mui/icons-material';

const screenshots = [
  '/screenshots/IMG_4226.PNG',
  '/screenshots/IMG_4227.PNG',
  '/screenshots/IMG_4228.PNG',
  '/screenshots/IMG_4229.PNG',
  '/screenshots/IMG_4230.PNG',
  '/screenshots/IMG_4231.PNG',
  '/screenshots/IMG_4232.PNG',
  '/screenshots/IMG_4233.PNG',
  '/screenshots/IMG_4234.PNG',
  '/screenshots/IMG_4235.PNG',
  '/screenshots/IMG_4236.PNG',
  '/screenshots/IMG_4237.PNG',
  '/screenshots/IMG_4238.PNG',
];

const ScreenshotsGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (index) => {
    setSelectedImage(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % screenshots.length);
  };

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(5, 47, 42, 0.03) 0%, transparent 50%)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <PhoneAndroid sx={{ fontSize: { xs: 36, md: 48 }, color: '#052F2A' }} />
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: { xs: 1.5, md: 2 },
              color: '#052F2A',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '3rem' },
              px: { xs: 2, md: 0 },
            }}
          >
            See It In Action
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#666',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: { xs: 1.6, md: 1.8 },
              fontSize: { xs: '0.95rem', md: '1.25rem' },
              px: { xs: 2, md: 0 },
            }}
          >
            Explore the beautiful interface and powerful features of Tijaniyah Muslim Pro
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {screenshots.map((screenshot, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Zoom in timeout={300 + index * 50}>
                <Card
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 8px 24px rgba(5, 47, 42, 0.12)',
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-16px) scale(1.08)',
                      boxShadow: '0 24px 48px rgba(5, 47, 42, 0.3)',
                      borderColor: '#D4AF37',
                      '& .screenshot-overlay': {
                        opacity: 1,
                      },
                      '& .screenshot-image': {
                        transform: 'scale(1.15)',
                      },
                    },
                  }}
                  onClick={() => handleOpen(index)}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '177.78%', // 16:9 aspect ratio
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #052F2A 0%, #0A5D52 100%)',
                    }}
                  >
                    <CardMedia
                      className="screenshot-image"
                      component="img"
                      image={screenshot}
                      alt={`App Screenshot ${index + 1}`}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                    <Box
                      className="screenshot-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(5, 47, 42, 0.85) 0%, rgba(212, 175, 55, 0.2) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'rgba(212, 175, 55, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1,
                        }}
                      >
                        <PhoneAndroid sx={{ fontSize: 32, color: '#052F2A' }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          textAlign: 'center',
                          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        View Full Size
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          textAlign: 'center',
                        }}
                      >
                        Screenshot {index + 1}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Full Screen Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderRadius: 2,
            },
          }}
        >
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: { xs: 4, md: 8 },
                right: { xs: 4, md: 8 },
                zIndex: 2,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                minWidth: { xs: '44px', md: 'auto' },
                minHeight: { xs: '44px', md: 'auto' },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <Close sx={{ fontSize: { xs: 24, md: 28 } }} />
            </IconButton>

            {selectedImage !== null && (
              <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>
                <Box
                  component="img"
                  src={screenshots[selectedImage]}
                  alt={`Screenshot ${selectedImage + 1}`}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    maxHeight: '90vh',
                    objectFit: 'contain',
                  }}
                />

                <IconButton
                  onClick={handlePrevious}
                  sx={{
                    position: 'absolute',
                    left: { xs: 4, md: 8 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    minWidth: { xs: '44px', md: 'auto' },
                    minHeight: { xs: '44px', md: 'auto' },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  <ChevronLeft sx={{ fontSize: { xs: 24, md: 28 } }} />
                </IconButton>

                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    right: { xs: 4, md: 8 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    minWidth: { xs: '44px', md: 'auto' },
                    minHeight: { xs: '44px', md: 'auto' },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  <ChevronRight sx={{ fontSize: { xs: 24, md: 28 } }} />
                </IconButton>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {selectedImage + 1} / {screenshots.length}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ScreenshotsGallery;

