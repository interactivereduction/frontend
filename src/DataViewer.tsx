import React from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

const DataViewer: React.FC = () => {
  const theme = useTheme();
  const { instrumentName } = useParams<{ instrumentName: string }>();
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h3" component="h1" style={{ color: theme.palette.text.primary }}>
        {instrumentName ? `${instrumentName.toUpperCase()} Data Viewer` : 'Data Viewer'}
      </Typography>

      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
          },
          { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
        ]}
        layout={{ width: 720, height: 440, title: 'A Test Plot' }}
      />
    </div>
  );
};

export default DataViewer;
