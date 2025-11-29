import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a2e',
      light: '#2d2d44',
      dark: '#0f0f1a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6c757d',
      light: '#868e96',
      dark: '#495057',
    },
    warning: {
      main: '#ff6b35',
      light: '#fff3ed',
      dark: '#e55a2b',
      contrastText: '#ffffff',
    },
    success: {
      main: '#28a745',
      light: '#e8f5e9',
      dark: '#1e7e34',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc3545',
      light: '#ffebee',
      dark: '#c82333',
      contrastText: '#ffffff',
    },
    info: {
      main: '#17a2b8',
      light: '#e3f2fd',
      dark: '#138496',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#6c757d',
      disabled: '#adb5bd',
    },
    divider: '#e9ecef',
    action: {
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        containedWarning: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#e55a2b',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            backgroundColor: '#f8f9fa',
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000000',
    },
    secondary: {
      main: '#b0bec5',
      light: '#cfd8dc',
      dark: '#78909c',
    },
    warning: {
      main: '#ff8a50',
      light: '#ffbb93',
      dark: '#c75b39',
      contrastText: '#000000',
    },
    success: {
      main: '#66bb6a',
      light: '#98ee99',
      dark: '#338a3e',
      contrastText: '#000000',
    },
    error: {
      main: '#ef5350',
      light: '#ff867c',
      dark: '#b61827',
      contrastText: '#ffffff',
    },
    info: {
      main: '#4fc3f7',
      light: '#8bf6ff',
      dark: '#0093c4',
    },
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
    text: {
      primary: '#e6edf3',
      secondary: '#8b949e',
      disabled: '#484f58',
    },
    divider: '#30363d',
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#e6edf3',
    },
    h5: {
      fontWeight: 700,
      color: '#e6edf3',
    },
    h6: {
      fontWeight: 600,
      color: '#e6edf3',
    },
    subtitle1: {
      fontWeight: 600,
    },
    body1: {
      color: '#e6edf3',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#e6edf3',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#30363d #0d1117',
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#0d1117',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#30363d',
            borderRadius: 4,
          },
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
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          },
        },
        containedWarning: {
          backgroundColor: '#ff6b35',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#ff8a50',
          },
        },
        containedPrimary: {
          backgroundColor: '#238636',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#2ea043',
          },
        },
        outlined: {
          borderColor: '#30363d',
          color: '#e6edf3',
          '&:hover': {
            borderColor: '#8b949e',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
        text: {
          color: '#e6edf3',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#8b949e',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#e6edf3',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
          borderRadius: 12,
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
        },
        elevation0: {
          border: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        filled: {
          backgroundColor: '#21262d',
          color: '#e6edf3',
        },
        outlined: {
          borderColor: '#30363d',
          color: '#e6edf3',
        },
        colorPrimary: {
          backgroundColor: '#388bfd33',
          color: '#58a6ff',
        },
        colorSuccess: {
          backgroundColor: '#238636',
          color: '#ffffff',
        },
        colorError: {
          backgroundColor: '#da3633',
          color: '#ffffff',
        },
        colorWarning: {
          backgroundColor: '#9e6a03',
          color: '#ffffff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#0d1117',
            '& fieldset': {
              borderColor: '#30363d',
            },
            '&:hover fieldset': {
              borderColor: '#8b949e',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#58a6ff',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#8b949e',
          },
          '& .MuiInputBase-input': {
            color: '#e6edf3',
          },
          '& .MuiInputAdornment-root': {
            color: '#8b949e',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#0d1117',
        },
        icon: {
          color: '#8b949e',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#e6edf3',
          '&:hover': {
            backgroundColor: '#21262d',
          },
          '&.Mui-selected': {
            backgroundColor: '#21262d',
            '&:hover': {
              backgroundColor: '#30363d',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#e6edf3',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: '#e6edf3',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#161b22',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#21262d',
            color: '#e6edf3',
            fontWeight: 600,
            borderBottom: '1px solid #30363d',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            '&:hover': {
              backgroundColor: '#21262d',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #21262d',
          color: '#e6edf3',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#21262d',
            '&:hover': {
              backgroundColor: '#30363d',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#30363d',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#21262d',
          color: '#e6edf3',
        },
        colorDefault: {
          backgroundColor: '#21262d',
          color: '#e6edf3',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#21262d',
          },
          '&.Mui-selected': {
            backgroundColor: '#21262d',
            '&:hover': {
              backgroundColor: '#30363d',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#8b949e',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#e6edf3',
        },
        secondary: {
          color: '#8b949e',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            color: '#8b949e',
            '&.Mui-checked': {
              color: '#ff6b35',
              '& + .MuiSwitch-track': {
                backgroundColor: '#ff6b35',
                opacity: 0.5,
              },
            },
          },
          '& .MuiSwitch-track': {
            backgroundColor: '#30363d',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#21262d',
          borderRadius: 4,
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardWarning: {
          backgroundColor: '#9e6a0333',
          color: '#f0c14b',
          '& .MuiAlert-icon': {
            color: '#f0c14b',
          },
        },
        standardError: {
          backgroundColor: '#da363333',
          color: '#ff7b72',
          '& .MuiAlert-icon': {
            color: '#ff7b72',
          },
        },
        standardSuccess: {
          backgroundColor: '#23863633',
          color: '#56d364',
          '& .MuiAlert-icon': {
            color: '#56d364',
          },
        },
        standardInfo: {
          backgroundColor: '#388bfd33',
          color: '#58a6ff',
          '& .MuiAlert-icon': {
            color: '#58a6ff',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#21262d',
          color: '#e6edf3',
          border: '1px solid #30363d',
          fontSize: '0.75rem',
        },
        arrow: {
          color: '#21262d',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#e6edf3',
        },
        input: {
          '&::placeholder': {
            color: '#8b949e',
            opacity: 1,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#8b949e',
          '&.Mui-focused': {
            color: '#58a6ff',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#8b949e',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#8b949e',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#30363d',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#8b949e',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#58a6ff',
          },
        },
        input: {
          color: '#e6edf3',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#ff6b35',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#8b949e',
          '&.Mui-selected': {
            color: '#e6edf3',
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: '#21262d',
        },
      },
    },
  },
});
