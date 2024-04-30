import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Typography, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Box } from '@mui/material';
import { instruments } from './InstrumentData';

interface Run {
  experiment_number: number;
  filename: string;
  run_start: string;
  run_end: string;
  title: string;
}
interface Reduction {
  id: number;
  reduction_start: string;
  reduction_end: string;
  reduction_state: string;
  reduction_status_message: string;
  reduction_inputs: Record<string, string>;
  reduction_outputs: string;
  runs: Run[];
}

const ReductionHistory: React.FC = () => {
  const fiaApiUrl = process.env.REACT_APP_FIA_REST_API_URL;
  const theme = useTheme();
  const history = useHistory();
  const { instrumentName } = useParams<{ instrumentName: string }>();
  const [reductions, setReductions] = useState<Reduction[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<string>(instrumentName || instruments[0].name);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = useState<string>('run_start');
  const limit = 20;

  useEffect(() => {
    if (instrumentName && instruments.some((i) => i.name === instrumentName)) {
      setSelectedInstrument(instrumentName);
    } else {
      // Fallback to the first instrument if the parameter is not valid
      setSelectedInstrument(instruments[0].name);
      history.replace(`/reduction-history/${instruments[0].name}`);
    }
  }, [instrumentName, history]);

  const fetchTotalCount = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${fiaApiUrl}/instrument/${selectedInstrument}/reductions/count`);
      const data = await response.json();
      setTotalPages(Math.ceil(data.count / limit));
    } catch (error) {
      console.error('Error fetching run count:', error);
    }
  }, [selectedInstrument, fiaApiUrl]);

  const fetchReductions = useCallback(async (): Promise<void> => {
    try {
      const offset = (currentPage - 1) * limit;
      const query = `limit=${limit}&offset=${offset}&order_by=${orderBy}&order_direction=${orderDirection}&include_runs=true`;
      const response = await fetch(`${fiaApiUrl}/instrument/${selectedInstrument}/reductions?${query}`);
      const data = await response.json();
      setReductions(data);
    } catch (error) {
      console.error('Error fetching reductions:', error);
    }
  }, [selectedInstrument, currentPage, orderBy, orderDirection, fiaApiUrl]);

  useEffect(() => {
    fetchTotalCount();
    fetchReductions();
  }, [fetchTotalCount, fetchReductions]);

  const handleInstrumentChange = (event: SelectChangeEvent): void => {
    const newInstrument = event.target.value as string;
    setSelectedInstrument(newInstrument);
    setCurrentPage(1); // Reset to page 1 when the instrument changes
    history.push(`/reduction-history/${newInstrument}`);
    fetchTotalCount();
    fetchReductions();
  };

  return (
    <div style={{ padding: '20px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h3" component="h1" style={{ color: theme.palette.text.primary }}>
          {selectedInstrument.toUpperCase()} reduction history
        </Typography>

        <FormControl style={{ width: '200px', marginLeft: '20px' }}>
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
    </div>
  );
};

export default ReductionHistory;
