import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  Collapse,
  Icon,
  Button,
  Tooltip,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { instruments } from './InstrumentData';

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

interface Reduction {
  id: number;
  reduction_start: string;
  reduction_end: string;
  reduction_state: string;
  reduction_status_message: string;
  reduction_inputs: {
    ei: string;
    runno: number;
    wbvan: number;
    monovan: number;
    sam_rmm: number;
    sam_mass: number;
    sum_runs: boolean;
    remove_bkg: boolean;
    mask_file_link: string;
  };
  reduction_outputs: string;
  script: {
    value: string;
  };
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalPages, setTotalPages] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
              <MenuItem key={instrument.id} value={instrument.name}>
                {instrument.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#003088', fontWeight: 'bold' }} />
              <TableCell sx={headerStyles} />
              <TableCell sx={headerStyles}>Experiment number</TableCell>
              <TableCell sx={headerStyles}>Filename</TableCell>
              <TableCell sx={headerStyles}>Reduction start</TableCell>
              <TableCell sx={headerStyles}>Reduction end</TableCell>
              <TableCell sx={headerStyles}>Title</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reductions.map((reduction, index) => (
              <Row key={reduction.id} reduction={reduction} index={index} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

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

function Row({ reduction, index }: { reduction: Reduction; index: number }): JSX.Element {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const parseReductionOutputs = (): JSX.Element | JSX.Element[] | undefined => {
    try {
      // Replace single quotes with double quotes to form a valid JSON string
      const preProcessed = reduction.reduction_outputs.replace(/'/g, '"');
      const parsed = JSON.parse(preProcessed);

      if (Array.isArray(parsed)) {
        return parsed.map((output, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <Box maxHeight="80px" display="flex" justifyContent="space-between" width="100%">
                <Box flex="1" textAlign="left">
                  {output}
                </Box>
                <Box>
                  <Button variant="contained" style={{ marginLeft: '10px' }}>
                    View
                  </Button>
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

  const reductionStatusDisplay = (): JSX.Element => {
    if (reduction.reduction_state === 'ERROR') {
      return (
        <Typography variant="subtitle1" style={{ color: 'red' }}>
          [ERROR] {reduction.reduction_status_message}: src\ReductionHistory.tsx Line 206:25: Missing return type on
          function @typescript-eslint/explicit-function-return-type
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
        <Typography variant="subtitle1" style={{ color: 'gray' }}>
          [NOT STARTED] This reduction has not been started yet
        </Typography>
      );
    } else {
      return <></>;
    }
  };

  const renderReductionInputs = (): JSX.Element | JSX.Element[] => {
    const entries = Object.entries(reduction.reduction_inputs);
    if (entries.length === 0) {
      return <Typography>No input data available.</Typography>;
    }

    return entries.map(([key, value], index) => (
      <Typography key={index} variant="body2">
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
        <TableCell>{formatDateTime(reduction.reduction_start)}</TableCell>
        <TableCell>{formatDateTime(reduction.reduction_end)}</TableCell>
        <TableCell>{reduction.runs[0].title}</TableCell>
      </TableRow>
      <TableRow sx={rowStyles}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom component="div">
                {reductionStatusDisplay()}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Typography variant="h6" gutterBottom component="div">
                    Reduction ouputs
                  </Typography>
                  <Box sx={{ maxHeight: 180, overflowY: 'auto' }}>
                    <Table size="small" aria-label="details">
                      <TableBody>{parseReductionOutputs()}</TableBody>
                    </Table>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" gutterBottom component="div">
                    Run details
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Instrument: {reduction.runs[0].instrument_name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Start: {formatDateTime(reduction.runs[0].run_start)}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    End: {formatDateTime(reduction.runs[0].run_end)}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Good frames: {reduction.runs[0].good_frames.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Raw frames: {reduction.runs[0].raw_frames.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Users: {reduction.runs[0].users}
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography variant="h6" gutterBottom component="div">
                    Reduction inputs
                  </Typography>
                  <Box sx={{ maxHeight: 180, overflowY: 'auto' }}>{renderReductionInputs()}</Box>
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
