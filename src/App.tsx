import React from 'react';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Instrument from './Instrument';

const theme = createTheme();

const App: React.FC = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ margin: 0, padding: 0, width: '91vw' }}>
        <Instrument />
      </div>
    </ThemeProvider>
  );
};

export default App;
