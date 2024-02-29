import React from 'react';
import { ThemeProvider, StyledEngineProvider, Theme, createTheme } from '@mui/material/styles';

interface State {
  theme: Theme;
}

class GlobalStyles extends React.Component<{ children: React.ReactNode }, State> {
  public constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      theme: createTheme(),
    };
  }

  componentDidMount(): void {
    document.addEventListener('scigateway', this.handleThemeChange);
  }

  componentWillUnmount(): void {
    document.removeEventListener('scigateway', this.handleThemeChange);
  }

  handleThemeChange = (e: Event): void => {
    console.log('Received a scigateway event:', e);
    console.log('Action structure:', (e as CustomEvent).detail);
    const action = (e as CustomEvent).detail;
    if (action.type === 'scigateway:api:send_themeoptions' && action.payload && action.payload.theme) {
      this.setState({ theme: action.payload.theme });

      console.log('Received theme:', action.payload.theme);
      console.log('Current theme mode after setting:', this.state.theme.palette.mode);
    }
  };

  public render(): React.ReactElement {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={this.state.theme}>{this.props.children}</ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

export default GlobalStyles;
