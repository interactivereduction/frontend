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
              <TableCell />
              <TableCell />
              <TableCell>Experiment Number</TableCell>
              <TableCell>Reduction Input</TableCell>
              <TableCell>Reduction Start</TableCell>
              <TableCell>Reduction End</TableCell>
              <TableCell>Title</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reductions.map((reduction) => (
              <Row key={reduction.id} reduction={reduction} />
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

function Row({ reduction }: { reduction: Reduction }): JSX.Element {
  const [open, setOpen] = useState(false);

  const parseReductionOutputs = () => {
    try {
      // First replace single quotes with double quotes to attempt to form a valid JSON string
      const preProcessed = reduction.reduction_outputs.replace(/'/g, '"');
      const parsed = JSON.parse(preProcessed);

      if (Array.isArray(parsed)) {
        return parsed.map((output: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              {output}
              <Button variant="contained" style={{ marginLeft: '10px' }}>
                View data
              </Button>
              <Button variant="contained" style={{ marginLeft: '10px' }}>
                GET
              </Button>
            </TableCell>
          </TableRow>
        ));
      }
    } catch (error) {
      console.error('Failed to parse reduction_outputs as JSON:', reduction.reduction_outputs);
      console.error('Error:', error);
      // Handle cases where parsing fails
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
          [ERROR] Stacktrace placeholder: src\ReductionHistory.tsx Line 206:25: Missing return type on function
          @typescript-eslint/explicit-function-return-type
        </Typography>
      );
    } else if (reduction.reduction_state === 'SUCCESSFUL') {
      return (
        <>
          <Typography variant="subtitle1" style={{ color: 'green' }}>
            [SUCCESS] Reduction performed successfully
          </Typography>
          <Table size="small" aria-label="details">
            <TableBody>{parseReductionOutputs()}</TableBody>
          </Table>
        </>
      );
    } else if (reduction.reduction_state === 'NOT_STARTED') {
      return (
        <Typography variant="subtitle1" style={{ color: 'gray' }}>
          [NOT STARTED] This reduction has not been started yet
        </Typography>
      );
    } else {
      return <></>; // Return empty for other states or include other cases as needed
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
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
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom component="div">
                Reduction Details
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {reductionStatusDisplay()}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default ReductionHistory;
