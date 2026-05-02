import { createTheme } from '@mui/material/styles';

export const crmTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2B7FD4', light: '#EBF4FF', dark: '#1B5EA3' },
    secondary: { main: '#179E6F', light: '#E8F8F2', dark: '#0E6B4A' },
    error: { main: '#DC3545', light: '#FEE2E2' },
    warning: { main: '#D97706', light: '#FEF3C7' },
    success: { main: '#179E6F', light: '#E8F8F2' },
    grey: {
      50: '#F9F8F6',
      100: '#F2F1EE',
      200: '#ECEAE6',
      300: '#D8D6CF',
      400: '#B4B2A9',
      500: '#9B9992',
      600: '#78776F',
      700: '#5C5B57',
      800: '#3A3937',
      900: '#18181A',
    },
    background: {
      default: '#F9F8F6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#18181A',
      secondary: '#5C5B57',
      disabled: '#9B9992',
    },
    divider: 'rgba(0,0,0,0.08)',
  },

  typography: {
    fontFamily: 'var(--font-primary)',
    fontSize: 12,
    h1: { fontFamily: 'var(--font-primary)', fontWeight: 800 },
    h2: { fontFamily: 'var(--font-primary)', fontWeight: 700 },
    h3: { fontFamily: 'var(--font-primary)', fontWeight: 700 },
    h4: { fontFamily: 'var(--font-primary)', fontWeight: 600 },
    h5: { fontFamily: 'var(--font-primary)', fontWeight: 600 },
    h6: { fontFamily: 'var(--font-primary)', fontWeight: 600 },
    caption: { fontSize: '0.625rem', letterSpacing: '0.3px' },
    overline: {
      fontSize: '0.59375rem',
      letterSpacing: '0.8px',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },

  shape: { borderRadius: 6 },

  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06)',
    '0 2px 6px rgba(0,0,0,0.07)',
    '0 4px 12px rgba(0,0,0,0.08)',
    '0 6px 16px rgba(0,0,0,0.09)',
    '0 8px 24px rgba(0,0,0,0.10)',
    '0 10px 28px rgba(0,0,0,0.11)',
    '0 12px 32px rgba(0,0,0,0.12)',
    '0 14px 38px rgba(0,0,0,0.12)',
    '0 16px 40px rgba(0,0,0,0.13)',
    '0 18px 44px rgba(0,0,0,0.13)',
    '0 20px 48px rgba(0,0,0,0.14)',
    '0 22px 52px rgba(0,0,0,0.14)',
    '0 24px 56px rgba(0,0,0,0.15)',
    '0 26px 58px rgba(0,0,0,0.15)',
    '0 28px 60px rgba(0,0,0,0.16)',
    '0 30px 64px rgba(0,0,0,0.16)',
    '0 32px 68px rgba(0,0,0,0.17)',
    '0 34px 70px rgba(0,0,0,0.17)',
    '0 36px 72px rgba(0,0,0,0.18)',
    '0 38px 76px rgba(0,0,0,0.18)',
    '0 40px 80px rgba(0,0,0,0.19)',
    '0 42px 82px rgba(0,0,0,0.19)',
    '0 44px 84px rgba(0,0,0,0.20)',
    '0 2px 12px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * { box-sizing: border-box; }
        html, body, #root { height: 100%; }
      `,
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-primary)',
          fontWeight: 500,
          fontSize: '0.6875rem',
          textTransform: 'none',
          borderRadius: '5px',
          letterSpacing: '0',
          padding: '4px 10px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-primary)',
          fontSize: '0.75rem',
          fontWeight: 500,
          height: '20px',
          borderRadius: '20px',
        },
        label: { paddingLeft: '7px', paddingRight: '7px' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: 'var(--font-primary)',
          fontSize: '0.75rem',
          background: '#18181A',
          borderRadius: '5px',
          padding: '5px 9px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-primary)',
          fontSize: '0.75rem',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'rgba(0,0,0,0.12)',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontFamily: 'var(--font-primary)',
          fontSize: '0.75rem',
          fontWeight: 700,
        },
      },
    },
  },
});

