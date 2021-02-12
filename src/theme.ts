import { ThemeOptions } from '@material-ui/core';

export const themeOptions: ThemeOptions = {
  palette: {
    primary: { main: '#0644d7' },
    secondary: { main: '#feed5f' },
  },
  typography: {
    fontFamily: [
      'Montserrat',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h4: { fontSize: 22, fontWeight: 600 },
    h5: { fontSize: 18, fontWeight: 600 },
    h6: { fontSize: 16, fontWeight: 500 },
  },
};
