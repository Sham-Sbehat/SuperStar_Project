import { createTheme } from '@mui/material/styles'

const primary = '#1565c0'
const primaryDark = '#0d47a1'
const grey50 = '#fafafa'
const grey100 = '#f5f5f5'
const grey200 = '#eeeeee'
const grey300 = '#e0e0e0'
const grey700 = '#616161'
const grey800 = '#424242'
const grey900 = '#212121'

export const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: { main: primary, dark: primaryDark },
    secondary: { main: grey700 },
    background: {
      default: grey100,
      paper: '#ffffff',
    },
    text: {
      primary: grey900,
      secondary: grey700,
    },
    divider: grey200,
  },
  typography: {
    fontFamily: '"Cairo", "Segoe UI", system-ui, sans-serif',
    h1: { fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.5rem' },
    h3: { fontWeight: 600, fontSize: '1.25rem' },
    h4: { fontWeight: 600, fontSize: '1.125rem' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontSize: '0.9375rem' },
    body2: { fontSize: '0.875rem' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: grey100,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          textAlign: 'right',
          direction: 'rtl',
        },
        inputMultiline: {
          textAlign: 'right',
          direction: 'rtl',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          textAlign: 'right',
          right: 40,
          left: 14,
          transformOrigin: 'top right',
          maxWidth: 'calc(100% - 28px)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        shrink: {
          transform: 'translate(-14px, -9px) scale(0.75)',
          transformOrigin: 'top right',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          '& legend': {
            textAlign: 'right',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid ' + grey200,
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderBottom: '1px solid ' + grey200,
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
        flexContainer: {
          gap: 4,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderLeft: '1px solid ' + grey200,
          boxShadow: '4px 0 24px rgba(0,0,0,0.06)',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700,
            backgroundColor: grey50,
            color: grey800,
            borderBottom: '1px solid ' + grey300,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: grey200,
          padding: '14px 16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
  },
})
