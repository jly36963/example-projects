import { createMuiTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

// theme (for material-ui)
const theme = createMuiTheme({
  typography: {
    fontSize: 12,
  },
  palette: {
    // primary: {},
    secondary: {
      light: grey[300],
      main: grey[500],
      dark: grey[700],
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
});

export default theme;
