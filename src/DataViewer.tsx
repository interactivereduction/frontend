import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from '@mui/material/styles';
import { useParams, useHistory } from 'react-router-dom';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import Typography from '@mui/material/Typography';
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

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h3" component="h1" style={{ color: theme.palette.text.primary }}>
        {selectedInstrument.toUpperCase()} Data Viewer
      </Typography>

      <FormControl style={{ margin: '20px 0' }}>
        <InputLabel id="instrument-select-label">Instrument</InputLabel>
        <Select labelId="instrument-select-label" value={selectedInstrument} onChange={handleInstrumentChange}>
          {instruments.map((instrument) => (
            <MenuItem key={instrument.id} value={instrument.name}>
              {instrument.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
