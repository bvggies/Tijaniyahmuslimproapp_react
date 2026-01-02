import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  Email,
} from '@mui/icons-material';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#052F2A',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              🕌 Tijaniyah Muslim Pro
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
              Your Complete Islamic Companion for Spiritual Growth. 
              Supporting Muslims worldwide in their journey of faith.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <IconButton
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                aria-label="Facebook"
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                aria-label="Twitter"
              >
                <Twitter />
              </IconButton>
              <IconButton
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                aria-label="Instagram"
              >
                <Instagram />
              </IconButton>
              <IconButton
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                aria-label="Email"
              >
                <Email />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              App
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: 'white' },
                }}
              >
                Features
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: 'white' },
                }}
              >
                Download
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/privacy-policy')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: 'white' },
                }}
              >
                Privacy Policy
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/terms-and-conditions')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: 'white' },
                }}
              >
                Terms & Conditions
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
              Email: support@tijaniyahmuslimpro.com
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Privacy: privacy@tijaniyahmuslimpro.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            © {new Date().getFullYear()} Tijaniyah Muslim Pro. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

