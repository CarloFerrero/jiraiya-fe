// Font utilities for Jiraiya Sensei
export const fonts = {
  primary: 'Poppins',
  fallback: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif'
} as const;

export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900
} as const;

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem'
} as const;

// Font loading utility
export const preloadFonts = () => {
  // This ensures the font is loaded as early as possible
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
};

// Typography classes for consistent styling
export const typography = {
  heading: 'font-heading font-semibold tracking-tight',
  body: 'font-sans font-normal leading-relaxed',
  caption: 'font-sans text-sm text-muted-foreground',
  button: 'font-sans font-medium',
  code: 'font-mono text-sm'
} as const;
