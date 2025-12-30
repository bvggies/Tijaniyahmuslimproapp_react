/**
 * Design Tokens for Tijaniyah Muslim Pro App
 * Premium glass morphism UI with Islamic design elements
 */

// Extended color palette
export const tokens = {
  colors: {
    // Base colors (dark teal theme)
    background: '#052F2A',
    surface: '#0B3F39',
    surfaceElevated: '#0D4A43',
    
    // Light mint surfaces for cards
    mintSurface: '#CDE8DC',
    mintSurfaceAlt: '#DCEFE6',
    
    // Text colors
    textPrimary: '#E7F5F1',
    textSecondary: '#BBE1D5',
    textTertiary: '#8BC5B5',
    textDark: '#0B3F39',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    
    // Accent colors
    accentGreen: '#11C48D',
    accentTeal: '#00BFA5',
    accentLime: '#AEEA00',
    accentPurple: '#B39DDB',
    accentOrange: '#FFA726',
    accentYellow: '#FFD54F',
    accentYellowDark: '#F57F17',
    accentAmber: '#FFAB40',
    
    // Prayer card gradient
    prayerGradientStart: '#52b788',
    prayerGradientEnd: '#1b4332',
    
    // Glass effect colors
    glassBackground: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.15)',
    glassHighlight: 'rgba(255, 255, 255, 0.25)',
    
    // State colors
    divider: '#114C45',
    primary: '#2E7D32',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    
    // Skeleton
    skeletonBase: 'rgba(255, 255, 255, 0.08)',
    skeletonHighlight: 'rgba(255, 255, 255, 0.15)',
  },
  
  spacing: {
    xxs: 4,
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 36,
    xxxl: 48,
  },
  
  radius: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28,
    pill: 100,
  },
  
  typography: {
    // Font sizes
    size: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
      display: 32,
      hero: 40,
    },
    // Font weights
    weight: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 12,
    },
    glow: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    }),
  },
  
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  
  // Glass button sizes
  glassButton: {
    sm: {
      size: 36,
      iconSize: 18,
    },
    md: {
      size: 44,
      iconSize: 22,
    },
    lg: {
      size: 48,
      iconSize: 24,
    },
  },
  
  // Quick action tile sizes
  quickActionTile: {
    iconContainerSize: 56,
    iconSize: 28,
    borderRadius: 20,
  },
};

// Helper function to create glass styles
export const createGlassStyle = (intensity: 'light' | 'medium' | 'strong' = 'medium') => {
  const intensityMap = {
    light: { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)' },
    medium: { bg: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.15)' },
    strong: { bg: 'rgba(255, 255, 255, 0.12)', border: 'rgba(255, 255, 255, 0.2)' },
  };
  
  return {
    backgroundColor: intensityMap[intensity].bg,
    borderWidth: 1,
    borderColor: intensityMap[intensity].border,
  };
};

export default tokens;

