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
  const irApiUrl = process.env.REACT_APP_IR_REST_API_URL;
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
      const response = await fetch(`${irApiUrl}/instrument/${selectedInstrument}/reductions/count`);
      const data = await response.json();
      setTotalPages(Math.ceil(data.count / limit));
    } catch (error) {
      console.error('Error fetching run count:', error);
    }
  }, [selectedInstrument, irApiUrl]);

  const fetchReductions = useCallback(async (): Promise<void> => {
    try {
      const offset = (currentPage - 1) * limit;
      const query = `limit=${limit}&offset=${offset}&order_by=${orderBy}&order_direction=${orderDirection}&include_runs=true`;
      const response = await fetch(`${irApiUrl}/instrument/${selectedInstrument}/reductions?${query}`);
      const data = await response.json();
      setReductions(data);
    } catch (error) {
      console.error('Error fetching runs:', error);
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number): void => {
    setCurrentPage(page);
  };

  const handleInstrumentChange = (event: SelectChangeEvent): void => {
    const newInstrument = event.target.value as string;
    setSelectedInstrument(newInstrument);
    setCurrentPage(1); // Reset to page 1 when the instrument changes
    history.push(`/reduction-history/${newInstrument}`);
    fetchTotalCount();
    fetchReductions();
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : 'white',
    },
  }));

  const formatDateTime = (dateTimeStr: string | null): string => {
    if (dateTimeStr === null) {
      return '';
    }
    return dateTimeStr.replace('T', '\n');
  };

  const extractFileName = (path: string): string => {
    const fileNameWithExtension = path.split('/').pop();

    if (typeof fileNameWithExtension === 'undefined') {
      return '';
    }
    const fileName = fileNameWithExtension.split('.')[0];
    return fileName;
  };

  const formatReductionStatus = (status: string, statusMessage: string): string => {
    let formattedSatatus = status;
    if (status === 'NOT_STARTED') {
      formattedSatatus = 'NOT STARTED';
    }

    if (statusMessage && statusMessage.trim().length > 0) {
      formattedSatatus += ` - ${statusMessage}`;
    }

    return formattedSatatus;
  };

  const getStatusColor = (state: string): string => {
    switch (state) {
      case 'UNSUCCESSFUL':
      case 'ERROR':
        return 'rgba(255, 0, 0, 0.2)'; // Light red background
      case 'SUCCESSFUL':
        return 'rgba(0, 255, 0, 0.2)'; // Light green background
      case 'NOT_STARTED':
        return 'rgba(255, 255, 0, 0.2)'; // Light yellow background
      default:
        return 'inherit'; // Default background color
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h3" component="h1" style={{ color: theme.palette.text.primary }}>
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
                  direction={orderBy === 'experiment_number' ? orderDirection : 'asc'}
                  onClick={() => handleSort('experiment_number')}
                >
                  Experiment Number
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'filename'}
                  direction={orderBy === 'filename' ? orderDirection : 'asc'}
                  onClick={() => handleSort('filename')}
                >
                  Reduction Input
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'reduction_state'}
                  direction={orderBy === 'reduction_state' ? orderDirection : 'asc'}
                  onClick={() => handleSort('reduction_state')}
                >
                  Reduction Status
                </TableSortLabel>
              </TableCell>
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
              <TableCell>Title</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'reduction_start'}
                  direction={orderBy === 'reduction_start' ? orderDirection : 'asc'}
                  onClick={() => handleSort('reduction_start')}
                >
                  Reduction Start
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'reduction_end'}
                  direction={orderBy === 'reduction_end' ? orderDirection : 'asc'}
                  onClick={() => handleSort('reduction_end')}
                >
                  Reduction End
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'reduction_outputs'}
                  direction={orderBy === 'reduction_outputs' ? orderDirection : 'asc'}
                  onClick={() => handleSort('reduction_outputs')}
                >
                  Reduction Outputs
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reductions.map((reduction, index) => (
              <StyledTableRow key={index}>
                <TableCell>{reduction.runs[0].experiment_number}</TableCell>
                <TableCell>{extractFileName(reduction.runs[0].filename)}</TableCell>
                <TableCell style={{ backgroundColor: getStatusColor(reduction.reduction_state) }}>
                  {formatReductionStatus(reduction.reduction_state, reduction.reduction_status_message)}
                </TableCell>
                <TableCell>{formatDateTime(reduction.runs[0].run_start)}</TableCell>
                <TableCell>{formatDateTime(reduction.runs[0].run_end)}</TableCell>
                <TableCell>{reduction.runs[0].title}</TableCell>
                <TableCell>{formatDateTime(reduction.reduction_start)}</TableCell>
                <TableCell>{formatDateTime(reduction.reduction_end)}</TableCell>
                <TableCell>{reduction.reduction_outputs}</TableCell>
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
