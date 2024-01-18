import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TableSortLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Box,
} from '@mui/material';
import { instruments } from './InstrumentData';

interface Run {
  experiment_number: number;
  filename: string;
  run_start: string;
  run_end: string;
}

interface Reduction {
  reduction_state: string;
  runs: Run[];
}

interface ReductionResponse {
  id: number;
}

const ReductionHistory: React.FC = () => {
  const irApiUrl = process.env.REACT_APP_IR_REST_API_URL;
  const theme = useTheme();
  const history = useHistory();
  const { instrumentName } = useParams<{ instrumentName: string }>();
  const [reductions, setReductions] = useState<Reduction[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<string>(
    instrumentName || instruments[0].name
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');
  const limit = 20;

  const fetchTotalCount = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(
        `${irApiUrl}/instrument/${selectedInstrument}/reductions/count`
      );
      const data = await response.json();
      setTotalPages(Math.ceil(data.count / limit));
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  }, [selectedInstrument, irApiUrl]);

  const fetchReductions = useCallback(async (): Promise<void> => {
    try {
      const offset = (currentPage - 1) * limit;
      let query = `limit=${limit}&offset=${offset}`;
      if (orderBy) {
        query += `&order_by=${orderBy}&order_direction=${orderDirection}`;
      }
      const response = await fetch(
        `${irApiUrl}/instrument/${selectedInstrument}/reductions?${query}`
      );
      const data = await response.json();

      const reductionDetails = await Promise.all(
        data.map(async (reduction: ReductionResponse) => {
          const res = await fetch(`${irApiUrl}/reduction/${reduction.id}`);
          return res.json();
        })
      );

      setReductions(reductionDetails);
    } catch (error) {
      console.error('Error fetching reductions:', error);
    }
  }, [selectedInstrument, currentPage, orderBy, orderDirection, irApiUrl]);

  useEffect(() => {
    fetchTotalCount();
    fetchReductions();
  }, [fetchTotalCount, fetchReductions]);

  const handleSort = (property: string): void => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ): void => {
    setCurrentPage(page);
  };

  const handleInstrumentChange = (event: SelectChangeEvent): void => {
    const newInstrument = event.target.value as string;
    setSelectedInstrument(newInstrument);
    history.push(`/reduction-history/${newInstrument}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="20px"
      >
        <Typography
          variant="h3"
          component="h1"
          style={{ color: theme.palette.text.primary }}
        >
          {`${selectedInstrument.toUpperCase()} Reduction History`}
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>RB Number</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'reduction_state'}
                  direction={
                    orderBy === 'reduction_state' ? orderDirection : 'asc'
                  }
                  onClick={() => handleSort('reduction_state')}
                >
                  Reduction State
                </TableSortLabel>
              </TableCell>
              <TableCell>Run Start</TableCell>
              <TableCell>Run End</TableCell>
              <TableCell>Run Output</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reductions.map((reduction, reductionIndex) =>
              reduction.runs.map((run, runIndex) => (
                <TableRow key={`${reductionIndex}-${runIndex}`}>
                  <TableCell>{run.experiment_number}</TableCell>
                  <TableCell>{reduction.reduction_state}</TableCell>
                  <TableCell>{run.run_start}</TableCell>
                  <TableCell>{run.run_end}</TableCell>
                  <TableCell>{run.filename}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ marginTop: 2, marginBottom: 2 }}
        />
      )}
    </div>
  );
};

export default ReductionHistory;
