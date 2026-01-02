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
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, mb: { xs: 1.5, md: 2 } }}>
              <Box
                component="img"
                src="/logo.png"
                alt="Tijaniyah Muslim Pro Logo"
                sx={{
                  height: { xs: 40, md: 50 },
                  width: 'auto',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Tijaniyah Muslim Pro
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: { xs: 1.5, md: 2 }, color: 'rgba(255,255,255,0.8)', fontSize: { xs: '0.85rem', md: '0.875rem' }, lineHeight: { xs: 1.6, md: 1.75 } }}>
              Your Complete Islamic Companion for Spiritual Growth. 
              Supporting Muslims worldwide in their journey of faith.
            </Typography>
            <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 }, mt: { xs: 1.5, md: 2 } }}>
              <IconButton
                sx={{ 
                  color: 'white', 
                  minWidth: { xs: '44px', md: 'auto' },
                  minHeight: { xs: '44px', md: 'auto' },
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } 
                }}
                aria-label="Facebook"
              >
                <Facebook sx={{ fontSize: { xs: 20, md: 24 } }} />
              </IconButton>
              <IconButton
                sx={{ 
                  color: 'white',
                  minWidth: { xs: '44px', md: 'auto' },
                  minHeight: { xs: '44px', md: 'auto' },
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } 
                }}
                aria-label="Twitter"
              >
                <Twitter sx={{ fontSize: { xs: 20, md: 24 } }} />
              </IconButton>
              <IconButton
                sx={{ 
                  color: 'white',
                  minWidth: { xs: '44px', md: 'auto' },
                  minHeight: { xs: '44px', md: 'auto' },
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } 
                }}
                aria-label="Instagram"
              >
                <Instagram sx={{ fontSize: { xs: 20, md: 24 } }} />
              </IconButton>
              <IconButton
                sx={{ 
                  color: 'white',
                  minWidth: { xs: '44px', md: 'auto' },
                  minHeight: { xs: '44px', md: 'auto' },
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } 
                }}
                aria-label="Email"
              >
                <Email sx={{ fontSize: { xs: 20, md: 24 } }} />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' }, mb: { xs: 1, md: 2 } }}>
              App
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.75, md: 1 } }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: { xs: '0.85rem', md: '0.875rem' },
                  minHeight: { xs: '44px', md: 'auto' },
                  py: { xs: 0.5, md: 0 },
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
                  fontSize: { xs: '0.85rem', md: '0.875rem' },
                  minHeight: { xs: '44px', md: 'auto' },
                  py: { xs: 0.5, md: 0 },
                  '&:hover': { color: 'white' },
                }}
              >
                Download
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' }, mb: { xs: 1, md: 2 } }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.75, md: 1 } }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/privacy-policy')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: { xs: '0.85rem', md: '0.875rem' },
                  minHeight: { xs: '44px', md: 'auto' },
                  py: { xs: 0.5, md: 0 },
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
                  fontSize: { xs: '0.85rem', md: '0.875rem' },
                  minHeight: { xs: '44px', md: 'auto' },
                  py: { xs: 0.5, md: 0 },
                  '&:hover': { color: 'white' },
                }}
              >
                Terms & Conditions
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' }, mb: { xs: 1, md: 2 } }}>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1, fontSize: { xs: '0.85rem', md: '0.875rem' }, wordBreak: 'break-word' }}>
              Email: support@tijaniyahmuslimpro.com
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: '0.85rem', md: '0.875rem' }, wordBreak: 'break-word' }}>
              Privacy: privacy@tijaniyahmuslimpro.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: 'rgba(255,255,255,0.2)' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
            © {new Date().getFullYear()} Tijaniyah Muslim Pro. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

