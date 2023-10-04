import * as React from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const ReductionHistory: React.FC = () => {
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
          ? `${instrumentName.toUpperCase()} Reduction History Page`
          : 'Reduction History Page'}
      </Typography>
      <Typography variant="body1" style={{ color: theme.palette.text.primary }}>
        This is the reduction history page. Content will be added soon.
      </Typography>
    </div>
  );
};

export default ReductionHistory;
