import * as React from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const LiveReduction: React.FC = () => {
  const theme = useTheme();
  const { instrumentName } = useParams<{ instrumentName: string }>();
  return (
    <div>
      <Typography
        variant="h3"
        component="h1"
        style={{ color: theme.palette.text.primary }}
      >
        {instrumentName
          ? `${instrumentName.toUpperCase()} Live Reduction Page`
          : 'Live Reduction Page'}
      </Typography>
      <Typography variant="body1" style={{ color: theme.palette.text.primary }}>
        This is the live reduction page. Content will be added soon.
      </Typography>
    </div>
  );
};

export default LiveReduction;
