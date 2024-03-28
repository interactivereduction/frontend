import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '@mui/material/styles';
import { useParams, useHistory } from 'react-router-dom';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box, Typography } from '@mui/material';
import { instruments } from './InstrumentData';

const DataViewer: React.FC = () => {
  const theme = useTheme();
  const history = useHistory();
  const { instrumentName } = useParams<{ instrumentName: string }>();
  const [selectedInstrument, setSelectedInstrument] = useState<string>(instrumentName || instruments[0].name);

  useEffect(() => {
    if (instrumentName && instruments.some((i) => i.name === instrumentName)) {
      setSelectedInstrument(instrumentName);
    } else {
      // Fallback to the first instrument if the parameter is not valid
      setSelectedInstrument(instruments[0].name);
      history.replace(`/data-viewer/${instruments[0].name}`);
    }
  }, [instrumentName, history]);

  const handleInstrumentChange = (event: SelectChangeEvent): void => {
    const newInstrument = event.target.value as string;
    setSelectedInstrument(newInstrument);
    history.push(`/data-viewer/${newInstrument}`);
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#282828' : 'white';
  const textColor = theme.palette.text.primary;

  return (
    <div style={{ padding: '20px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h3" component="h1" style={{ color: theme.palette.text.primary }}>
          {selectedInstrument.toUpperCase()} Data viewer
        </Typography>

        <FormControl style={{ minWidth: '200px' }}>
          <InputLabel id="instrument-select-label">Instrument</InputLabel>
          <Select
            labelId="instrument-select-label"
            value={selectedInstrument}
            label="Instrument"
            onChange={handleInstrumentChange}
          >
            {instruments.map((instrument) => (
              <MenuItem key={instrument.id} value={instrument.name}>
                {instrument.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
        layout={{
          width: 720,
          height: 440,
          title: 'A Test Plot',
          paper_bgcolor: backgroundColor,
          plot_bgcolor: backgroundColor,
          font: {
            color: textColor,
          },
        }}
      />
    </div>
  );
};

export default DataViewer;
