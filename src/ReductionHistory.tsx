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
  styled,
} from '@mui/material';
import { instruments } from './InstrumentData';

interface Run {
  experiment_number: number;
  filename: string;
  run_start: string;
  run_end: string;
  title: string;
}

const ReductionHistory: React.FC = () => {
  const irApiUrl = process.env.REACT_APP_IR_REST_API_URL;
  const theme = useTheme();
  const history = useHistory();
  const { instrumentName } = useParams<{ instrumentName: string }>();
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<string>(
    instrumentName || instruments[0].name
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
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
      const response = await fetch(
        `${irApiUrl}/instrument/${selectedInstrument}/runs/count`
      );
      const data = await response.json();
      setTotalPages(Math.ceil(data.count / limit));
    } catch (error) {
      console.error('Error fetching run count:', error);
    }
  }, [selectedInstrument, irApiUrl]);

  const fetchRuns = useCallback(async (): Promise<void> => {
    try {
      const offset = (currentPage - 1) * limit;
      const query = `limit=${limit}&offset=${offset}&order_by=${orderBy}&order_direction=${orderDirection}`;
      const response = await fetch(
        `${irApiUrl}/instrument/${selectedInstrument}/runs?${query}`
      );
      const data = await response.json();
      console.log(data);

      setRuns(data);
    } catch (error) {
      console.error('Error fetching runs:', error);
    }
  }, [selectedInstrument, currentPage, orderBy, orderDirection, irApiUrl]);

  useEffect(() => {
    fetchTotalCount();
    fetchRuns();
  }, [fetchTotalCount, fetchRuns]);

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
    setCurrentPage(1); // Reset to page 1 when the instrument changes
    history.push(`/reduction-history/${newInstrument}`);
    fetchTotalCount();
    fetchRuns();
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:nth-of-type(even)': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.background.default
          : 'white',
    },
  }));

  const formatDateTime = (dateTimeStr: string): string => {
    return dateTimeStr.replace('T', '\n');
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
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'experiment_number'}
                  direction={
                    orderBy === 'experiment_number' ? orderDirection : 'asc'
                  }
                  onClick={() => handleSort('experiment_number')}
                >
                  Experiment Number
                </TableSortLabel>
              </TableCell>
              <TableCell>Reduction Input</TableCell>
              <TableCell>Reduction Status</TableCell>
              <TableCell>Reduction Start</TableCell>
              <TableCell>Reduction End</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'run_start'}
                  direction={orderBy === 'run_start' ? orderDirection : 'asc'}
                  onClick={() => handleSort('run_start')}
                >
                  Run Start
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'run_end'}
                  direction={orderBy === 'run_end' ? orderDirection : 'asc'}
                  onClick={() => handleSort('run_end')}
                >
                  Run End
                </TableSortLabel>
              </TableCell>
              <TableCell>Reduction Outputs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {runs.map((run, index) => (
              <StyledTableRow key={index}>
                <TableCell>{run.experiment_number}</TableCell>
                <TableCell>{run.filename}</TableCell>
                <TableCell>[PLACEHOLDER]</TableCell>
                <TableCell>[PLACEHOLDER]</TableCell>
                <TableCell>[PLACEHOLDER]</TableCell>
                <TableCell>{run.title}</TableCell>
                <TableCell>{formatDateTime(run.run_end)}</TableCell>
                <TableCell>{formatDateTime(run.run_end)}</TableCell>
                <TableCell>[PLACEHOLDER]</TableCell>
              </StyledTableRow>
            ))}
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
