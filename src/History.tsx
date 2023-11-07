import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const RunHistory: React.FC = () => {
  const theme = useTheme();
  return (
    <div>
      <Typography
        variant="h3"
        component="h1"
        style={{ color: theme.palette.text.primary }}
      >
        Instrument History Page
      </Typography>
      <Typography variant="body1" style={{ color: theme.palette.text.primary }}>
        This is the instrument history page. Content will be added soon.
      </Typography>
    </div>
  );
};

export default RunHistory;
