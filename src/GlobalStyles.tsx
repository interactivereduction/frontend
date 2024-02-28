import React from 'react';
import {
  ThemeProvider,
  StyledEngineProvider,
  Theme,
  createTheme,
} from '@mui/material/styles';

let theme: Theme = createTheme();

document.addEventListener('scigateway', (e) => {
  const action = (e as CustomEvent).detail;
  if (
    action.type === 'scigateway:api:send_themeoptions' &&
    action.payload &&
    action.payload.theme
  ) {
    theme = action.payload.theme;
  }
});

class GlobalStyles extends React.Component<{ children: React.ReactNode }> {
  public constructor(props: { children: React.ReactNode }) {
    super(props);
  }

  public render(): React.ReactElement {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>{this.props.children}</ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

export default GlobalStyles;
