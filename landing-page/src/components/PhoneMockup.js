import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

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

const PhoneMockup = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: 200, sm: 250, md: 350 },
        height: { xs: 400, sm: 500, md: 700 },
        mx: 'auto',
        perspective: '1000px',
      }}
    >
      {/* Phone Frame */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          borderRadius: { xs: '30px', md: '45px' },
          padding: { xs: '8px', md: '12px' },
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(255, 255, 255, 0.1) inset',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: { xs: '12px', md: '18px' },
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '80px', md: '120px' },
            height: { xs: '20px', md: '30px' },
            background: '#000',
            borderRadius: { xs: '0 0 15px 15px', md: '0 0 20px 20px' },
            zIndex: 2,
          },
        }}
      >
        {/* Screen */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: { xs: '22px', md: '33px' },
            overflow: 'hidden',
            position: 'relative',
            background: '#000',
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Screenshots Carousel */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${screenshots.length * 100}%`,
              height: '100%',
              display: 'flex',
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(-${currentIndex * (100 / screenshots.length)}%)`,
            }}
          >
            {screenshots.map((screenshot, index) => (
              <Box
                key={index}
                sx={{
                  width: `${100 / screenshots.length}%`,
                  height: '100%',
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img"
                  src={screenshot}
                  alt={`App Screen ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Indicator Dots */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: '10px', md: '15px' },
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: { xs: '6px', md: '8px' },
              zIndex: 3,
            }}
          >
            {screenshots.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: '6px', md: '8px' },
                  height: { xs: '6px', md: '8px' },
                  borderRadius: '50%',
                  background: currentIndex === index ? '#D4AF37' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    background: currentIndex === index ? '#E5C866' : 'rgba(255, 255, 255, 0.5)',
                  },
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Glow Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '120%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: -1,
          filter: 'blur(40px)',
          animation: 'pulse 3s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.5 },
            '50%': { opacity: 0.8 },
          },
        }}
      />
    </Box>
  );
};

export default PhoneMockup;

