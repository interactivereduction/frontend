// React components
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Material UI components
import {
  Box,
  Button,
  Collapse,
  FormControl,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  Paper,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Local data
import { instruments } from './InstrumentData';

// Represents a single run with metadata and frame statistics
interface Run {
  experiment_number: number;
  filename: string;
  run_start: string;
  run_end: string;
  title: string;
  users: string;
  good_frames: number;
  raw_frames: number;
  instrument_name: string;
}

// Describes the details of a reduction for one or more runs
interface Reduction {
  id: number;
  reduction_start: string;
  reduction_end: string;
  reduction_state: string;
  reduction_status_message: string;
  reduction_inputs: {
    [key: string]: string | number | boolean | null;
  };
  reduction_outputs: string;
  script: {
    value: string;
  };
  runs: Run[];
}

const ReductionHistory: React.FC = () => {
  const fiaApiUrl = process.env.REACT_APP_FIA_REST_API_URL;
  const history = useHistory();
  const theme = useTheme();
  const { instrumentName } = useParams<{ instrumentName: string }>();
  const [reductions, setReductions] = useState<Reduction[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<string>(instrumentName || instruments[0].name);
  const [currentPage, setCurrentPage] = useState(0); // Page index starts at 0 for TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = useState<string>('run_start');

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
      setTotalRows(data.count);
    } catch (error) {
      console.error('Error fetching run count:', error);
    }
  }, [selectedInstrument, fiaApiUrl]);

  const fetchReductions = useCallback(async (): Promise<void> => {
    try {
      const offset = currentPage * rowsPerPage;
      const query = `limit=${rowsPerPage}&offset=${offset}&order_by=${orderBy}&order_direction=${orderDirection}&include_runs=true`;
      const response = await fetch(`${fiaApiUrl}/instrument/${selectedInstrument}/reductions?${query}`);
      const data = await response.json();
      setReductions(data);
    } catch (error) {
      console.error('Error fetching reductions:', error);
    }
  }, [selectedInstrument, currentPage, rowsPerPage, orderBy, orderDirection, fiaApiUrl]);

  useEffect(() => {
    fetchTotalCount();
    fetchReductions();
  }, [fetchTotalCount, fetchReductions, currentPage, rowsPerPage]);

  const handleInstrumentChange = (event: SelectChangeEvent<string>): void => {
    const newInstrument = event.target.value;
    setSelectedInstrument(newInstrument);
    setCurrentPage(0);
    history.push(`/reduction-history/${newInstrument}`);
    fetchTotalCount();
    fetchReductions();
  };

  const handleSort = (property: string): void => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setCurrentPage(0); // Reset to the first page
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const headerStyles = {
    color: 'white',
    backgroundColor: '#003088',
    fontWeight: 'bold',
    borderRight: `1px solid #1f4996`,
    '&:last-child': {
      borderRight: 'none',
    },
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
              <MenuItem key={instrument.name} value={instrument.name}>
                {instrument.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {reductions.length === 0 ? (
        <Typography variant="h6" style={{ textAlign: 'center', marginTop: '20px', color: theme.palette.text.primary }}>
          No reductions to show for this instrument
        </Typography>
      ) : (
        <>
          <TablePagination
            component="div"
            count={totalRows}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <TableContainer component={Paper} style={{ maxHeight: '740px', overflowY: 'scroll' }}>
            <Table aria-label="collapsible table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ ...headerStyles, width: '10%' }} colSpan={2}>
                    {selectedInstrument}
                  </TableCell>
                  <TableCell
                    style={{ ...headerStyles, width: '10%' }}
                    sortDirection={orderBy === 'experiment_number' ? orderDirection : false}
                    onClick={() => handleSort('experiment_number')}
                  >
                    Experiment Number {orderBy === 'experiment_number' ? (orderDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableCell>
                  <TableCell
                    style={{ ...headerStyles, width: '10%' }}
                    sortDirection={orderBy === 'filename' ? orderDirection : false}
                    onClick={() => handleSort('filename')}
                  >
                    Filename {orderBy === 'filename' ? (orderDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableCell>
                  <TableCell
                    style={{ ...headerStyles, width: '15%' }}
                    sortDirection={orderBy === 'run_start' ? orderDirection : false}
                    onClick={() => handleSort('run_start')}
                  >
                    Run start {orderBy === 'run_start' ? (orderDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableCell>
                  <TableCell
                    style={{ ...headerStyles, width: '15%' }}
                    sortDirection={orderBy === 'run_end' ? orderDirection : false}
                    onClick={() => handleSort('run_end')}
                  >
                    Run end {orderBy === 'run_end' ? (orderDirection === 'asc' ? '↑' : '↓') : ''}
                  </TableCell>
                  {/* API doesn't allow for sorting by title */}
                  <TableCell style={{ ...headerStyles, width: '40%' }}>Title</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {reductions.map((reduction, index) => (
                  <Row key={reduction.id} reduction={reduction} index={index} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

function Row({ reduction, index }: { reduction: Reduction; index: number }): JSX.Element {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const ReductionStatusIcon = ({ state }: { state: string }): JSX.Element => {
    const getIconComponent = (): JSX.Element => {
      switch (state) {
        case 'ERROR':
          return <ErrorOutlineIcon color="error" />;
        case 'SUCCESSFUL':
          return <CheckCircleOutlineIcon color="success" />;
        case 'UNSUCCESSFUL':
          return <WarningAmberIcon color="warning" />;
        case 'NOT_STARTED':
          return <HighlightOffIcon color="action" />;
        default:
          return <Icon>help_outline</Icon>;
      }
    };
    return (
      <Tooltip title={state}>
        <span>{getIconComponent()}</span>
      </Tooltip>
    );
  };

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

  const parseReductionOutputs = (): JSX.Element | JSX.Element[] | undefined => {
    try {
      // Replace single quotes with double quotes to form a valid JSON string
      const preProcessed = reduction.reduction_outputs.replace(/'/g, '"');
      const parsed = JSON.parse(preProcessed);

      if (Array.isArray(parsed)) {
        return parsed.map((output, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <Box maxHeight="80px" display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Box flex="1" textAlign="left">
                  {output}
                </Box>
                <Box>
                  <Tooltip title="Will be added in the future">
                    <span>
                      {/* Span is necessary because Tooltip doesn't work directly on disabled elements */}
                      <Button variant="contained" style={{ marginLeft: '10px' }} disabled>
                        View
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title="Will be added in the future">
                    <span>
                      {/* Span is necessary because Tooltip doesn't work directly on disabled elements */}
                      <Button variant="contained" style={{ marginLeft: '10px' }} disabled>
                        Download
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </Box>
            </TableCell>
          </TableRow>
        ));
      }
    } catch (error) {
      console.error('Failed to parse reduction_outputs as JSON:', reduction.reduction_outputs);
      console.error('Error:', error);
      return (
        <TableRow>
          <TableCell>{reduction.reduction_outputs}</TableCell>
        </TableRow>
      );
    }
  };

  const renderReductionStatus = (): JSX.Element => {
    if (reduction.reduction_state === 'ERROR') {
      return (
        <Typography variant="subtitle1" style={{ color: 'red', fontWeight: 'bold' }}>
          [ERROR] {reduction.reduction_status_message}
        </Typography>
      );
    } else if (reduction.reduction_state === 'SUCCESSFUL') {
      return (
        <Typography variant="subtitle1" style={{ color: '#2e7d32', fontWeight: 'bold' }}>
          [SUCCESS] Reduction performed successfully
        </Typography>
      );
    } else if (reduction.reduction_state === 'NOT_STARTED') {
      return (
        <Typography variant="subtitle1" style={{ color: 'gray', fontWeight: 'bold' }}>
          [NOT STARTED] This reduction has not been started yet
        </Typography>
      );
    } else if (reduction.reduction_state === 'UNSUCCESSFUL') {
      return (
        <Typography variant="subtitle1" style={{ color: '#ed6c02', fontWeight: 'bold' }}>
          [NOT STARTED] {reduction.reduction_status_message}
        </Typography>
      );
    } else {
      return <></>;
    }
  };

  const renderReductionInputs = (): JSX.Element | JSX.Element[] => {
    const entries = Object.entries(reduction.reduction_inputs);
    if (entries.length === 0) {
      return <Typography sx={{ fontWeight: 'bold' }}>No input data available</Typography>;
    }

    return entries.map(([key, value], index) => (
      <Typography key={index} variant="body2" sx={{ fontWeight: 'bold' }}>
        {`${key}: ${value}`}
      </Typography>
    ));
  };

  const rowStyles = {
    backgroundColor:
      index % 2 === 0
        ? theme.palette.mode === 'light'
          ? '#ececec'
          : '#2d2d2d' // Conditionally set for even rows based on theme mode
        : theme.palette.background.default, // Default for odd rows
  };

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          ...rowStyles,
          '&:hover': { backgroundColor: theme.palette.action.hover },
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <ReductionStatusIcon state={reduction.reduction_state} />
        </TableCell>
        <TableCell component="th" scope="row">
          {reduction.runs[0].experiment_number}
        </TableCell>
        <TableCell>{extractFileName(reduction.runs[0].filename)}</TableCell>
        <TableCell>{formatDateTime(reduction.runs[0].run_start)}</TableCell>
        <TableCell>{formatDateTime(reduction.runs[0].run_end)}</TableCell>
        <TableCell>{reduction.runs[0].title}</TableCell>
      </TableRow>
      <TableRow sx={rowStyles}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom component="div">
                {renderReductionStatus()}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                    Reduction ouputs
                  <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    <Table size="small" aria-label="details">
                      <TableBody>{parseReductionOutputs()}</TableBody>
                    </Table>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                    Run details
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Reduction ID: {reduction.id}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Instrument: {reduction.runs[0].instrument_name}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Reduction start: {formatDateTime(reduction.reduction_start)}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Reduction end: {formatDateTime(reduction.reduction_start)}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Good frames: {reduction.runs[0].good_frames.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Raw frames: {reduction.runs[0].raw_frames.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Users: {reduction.runs[0].users}
                  </Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                    Reduction inputs
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>{renderReductionInputs()}</Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default ReductionHistory;
