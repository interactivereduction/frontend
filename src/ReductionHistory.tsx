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
import { instruments } from './InstrumentData'; // Adjust the import path as needed

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

// Define the expected structure of your reduction response
interface ReductionResponse {
  id: number;
  // other properties that the response might have
}

const ReductionHistory: React.FC = () => {
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
        `http://localhost:8000/instrument/${selectedInstrument}/reductions/count`
      );
      const data = await response.json();
      setTotalPages(Math.ceil(data.count / limit));
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  }, [selectedInstrument]);

  const fetchReductions = useCallback(async (): Promise<void> => {
    try {
      const offset = (currentPage - 1) * limit;
      let query = `limit=${limit}&offset=${offset}`;
      if (orderBy) {
        query += `&order_by=${orderBy}&order_direction=${orderDirection}`;
      }
      const response = await fetch(
        `http://localhost:8000/instrument/${selectedInstrument}/reductions?${query}`
      );
      const data = await response.json();

      const reductionDetails = await Promise.all(
        data.map(async (reduction: ReductionResponse) => {
          const res = await fetch(
            `http://localhost:8000/reduction/${reduction.id}`
          );
          return res.json();
        })
      );

      setReductions(reductionDetails);
    } catch (error) {
      console.error('Error fetching reductions:', error);
    }
  }, [selectedInstrument, currentPage, orderBy, orderDirection]);

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

  const handleInstrumentChange = (event: SelectChangeEvent<string>): void => {
    const newInstrument = event.target.value as string;
    setSelectedInstrument(newInstrument);
    history.push(`/reduction-history/${newInstrument}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      {' '}
      {/* Added padding to the container div */}
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
          {' '}
          {/* Added margin to the left of the FormControl */}
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

// import * as React from 'react';
// import { useParams } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import {
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Pagination,
//   TableSortLabel,
// } from '@mui/material';

// interface Run {
//   experiment_number: number;
//   filename: string;
//   instrument_name: string;
//   run_start: string;
//   run_end: string;
// }

// interface Reduction {
//   reduction_state: string;
//   runs: Run[];
// }

// const ReductionHistory: React.FC = () => {
//   const theme = useTheme();
//   const { instrumentName } = useParams<{ instrumentName: string }>();
//   const [reductions, setReductions] = React.useState<Reduction[]>([]);
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const [totalPages, setTotalPages] = React.useState(0);
//   const [orderDirection, setOrderDirection] = React.useState<'asc' | 'desc'>(
//     'asc'
//   );
//   const [orderBy, setOrderBy] = React.useState<string>('');
//   const limit = 20;

//   const fetchTotalCount = async (): Promise<void> => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/instrument/${instrumentName}/reductions/count`
//       );
//       const data = await response.json();
//       setTotalPages(Math.ceil(data.count / limit));
//     } catch (error) {
//       console.error('Error fetching total count:', error);
//     }
//   };

//   const handleSort = (property: string): void => {
//     const isAsc = orderBy === property && orderDirection === 'asc';
//     setOrderDirection(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const fetchReductions = async (): Promise<void> => {
//     try {
//       const offset = (currentPage - 1) * limit;
//       let query = `limit=${limit}&offset=${offset}`;
//       if (orderBy) {
//         query += `&order_by=${orderBy}&order_direction=${orderDirection}`;
//       }
//       const response = await fetch(
//         `http://localhost:8000/instrument/${instrumentName}/reductions?${query}`
//       );
//       const data = await response.json();

//       const reductionDetails = await Promise.all(
//         data.map(async (reduction: any) => {
//           const res = await fetch(
//             `http://localhost:8000/reduction/${reduction.id}`
//           );
//           return res.json();
//         })
//       );

//       setReductions(reductionDetails);
//     } catch (error) {
//       console.error('Error fetching reductions:', error);
//     }
//   };

//   React.useEffect(() => {
//     if (instrumentName) {
//       fetchTotalCount();
//       fetchReductions();
//     }
//   }, [instrumentName]);

//   React.useEffect(() => {
//     if (instrumentName) {
//       fetchReductions();
//     }
//   }, [instrumentName, currentPage, orderBy, orderDirection]);

//   const handlePageChange = (
//     event: React.ChangeEvent<unknown>,
//     page: number
//   ): void => {
//     setCurrentPage(page);
//   };

//   return (
//     <div>
//       <Typography
//         variant="h3"
//         component="h1"
//         style={{ color: theme.palette.text.primary }}
//       >
//         {instrumentName
//           ? `${instrumentName.toUpperCase()} Reduction History`
//           : 'Reduction History'}
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>RB Number</TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'reduction_state'}
//                   direction={
//                     orderBy === 'reduction_state' ? orderDirection : 'asc'
//                   }
//                   onClick={() => handleSort('reduction_state')}
//                 >
//                   Reduction State
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>Run Start</TableCell>
//               <TableCell>Run End</TableCell>
//               <TableCell>Run Output</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {reductions.map((reduction, reductionIndex) =>
//               reduction.runs.map((run, runIndex) => (
//                 <TableRow key={`${reductionIndex}-${runIndex}`}>
//                   <TableCell>{run.experiment_number}</TableCell>
//                   <TableCell>{reduction.reduction_state}</TableCell>
//                   <TableCell>{run.run_start}</TableCell>
//                   <TableCell>{run.run_end}</TableCell>
//                   <TableCell>{run.filename}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {totalPages > 1 && (
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           sx={{ marginTop: 2, marginBottom: 2 }}
//         />
//       )}
//     </div>
//   );
// };

// export default ReductionHistory;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import {
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Pagination,
// } from '@mui/material';

// interface Run {
//   experiment_number: number;
//   filename: string;
//   instrument_name: string;
//   run_start: string;
//   run_end: string;
// }

// interface Reduction {
//   reduction_state: string;
//   runs: Run[];
// }

// const ReductionHistory: React.FC = () => {
//   const theme = useTheme();
//   const { instrumentName } = useParams<{ instrumentName: string }>();
//   const [reductions, setReductions] = useState<Reduction[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const limit = 10;

//   const fetchTotalCount = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/instrument/${instrumentName}/reductions/count`
//       );
//       const data = await response.json();
//       setTotalPages(Math.ceil(data.count / limit));
//     } catch (error) {
//       console.error('Error fetching total count:', error);
//     }
//   };

//   const fetchReductions = async (): Promise<void> => {
//     try {
//       const offset = (currentPage - 1) * limit;
//       const response = await fetch(
//         `http://localhost:8000/instrument/${instrumentName}/reductions?limit=${limit}&offset=${offset}`
//       );
//       const data = await response.json();

//       const reductionDetails = await Promise.all(
//         data.map(async (reduction: any) => {
//           const res = await fetch(
//             `http://localhost:8000/reduction/${reduction.id}`
//           );
//           return res.json();
//         })
//       );

//       setReductions(reductionDetails);
//     } catch (error) {
//       console.error('Error fetching reductions:', error);
//     }
//   };

//   useEffect(() => {
//     if (instrumentName) {
//       fetchTotalCount();
//       fetchReductions();
//     }
//   }, [instrumentName]);

//   useEffect(() => {
//     if (instrumentName) {
//       fetchReductions();
//     }
//   }, [instrumentName, currentPage]);

//   const handlePageChange = (
//     event: React.ChangeEvent<unknown>,
//     page: number
//   ): void => {
//     setCurrentPage(page);
//   };

//   return (
//     <div>
//       <Typography
//         variant="h3"
//         component="h1"
//         style={{ color: theme.palette.text.primary }}
//       >
//         {instrumentName
//           ? `${instrumentName.toUpperCase()} Reduction History`
//           : 'Reduction History'}
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>RB Number</TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'reduction_state'}
//                   direction={
//                     orderBy === 'reduction_state' ? orderDirection : 'asc'
//                   }
//                   onClick={() => handleSort('reduction_state')}
//                 >
//                   Reduction State
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>Run Start</TableCell>
//               <TableCell>Run End</TableCell>
//               <TableCell>Run Output</TableCell> {/* Non-sortable column */}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {reductions.map((reduction, reductionIndex) =>
//               reduction.runs.map((run, runIndex) => (
//                 <TableRow key={`${reductionIndex}-${runIndex}`}>
//                   <TableCell>{run.experiment_number}</TableCell>
//                   <TableCell>{reduction.reduction_state}</TableCell>
//                   <TableCell>{run.run_start}</TableCell>
//                   <TableCell>{run.run_end}</TableCell>
//                   <TableCell>{run.filename}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {totalPages > 1 && (
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           sx={{ marginTop: 2, marginBottom: 2 }}
//         />
//       )}
//     </div>
//   );
// };

// export default ReductionHistory;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import {
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Pagination,
//   TableSortLabel,
// } from '@mui/material';

// // Define interfaces for your data
// interface Run {
//   experiment_number: number;
//   filename: string;
//   instrument_name: string;
//   run_start: string;
//   run_end: string;
// }

// interface Reduction {
//   id: number;
//   reduction_state: string;
//   runs: Run[];
// }

// const ReductionHistory: React.FC = () => {
//   const theme = useTheme();
//   const { instrumentName } = useParams<{ instrumentName: string }>();
//   const [reductions, setReductions] = useState<Reduction[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
//   const [orderBy, setOrderBy] = useState<string>('');
//   const limit = 10;
//   // Define a list of valid keys for sorting
//   const validSortKeys: (keyof Reduction)[] = [
//     'experiment_number',
//     'reduction_state',
//     'run_start',
//     'run_end',
//   ];

//   const isValidKey = (key: string): key is keyof Reduction => {
//     return validSortKeys.includes(key as keyof Reduction);
//   };

//   const applySorting = (
//     data: Reduction[],
//     field: string,
//     direction: 'asc' | 'desc'
//   ): Reduction[] => {
//     if (!isValidKey(field)) {
//       console.warn(`Invalid sort field: ${field}`);
//       return data;
//     }

//     return data.sort((a, b) => {
//       if (direction === 'asc') {
//         return a[field] < b[field] ? -1 : 1;
//       } else {
//         return a[field] > b[field] ? -1 : 1;
//       }
//     });
//   };

//   const fetchTotalCount = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/instrument/${instrumentName}/reductions/count`
//       );
//       const data = await response.json();
//       setTotalPages(Math.ceil(data.count / limit));
//     } catch (error) {
//       console.error('Error fetching total count:', error);
//     }
//   };

//   const handleSort = (property: string): void => {
//     const isAsc = orderBy === property && orderDirection === 'asc';
//     setOrderDirection(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const fetchAndCombineData = async (): Promise<void> => {
//     try {
//       const offset = (currentPage - 1) * limit;
//       const response = await fetch(
//         `http://localhost:8000/instrument/${instrumentName}/reductions?limit=${limit}&offset=${offset}`
//       );
//       const initialData = await response.json();

//       const detailedDataPromises = initialData.map((reduction: any) =>
//         fetch(`http://localhost:8000/reduction/${reduction.id}`).then((res) =>
//           res.json()
//         )
//       );
//       const detailedData = await Promise.all(detailedDataPromises);

//       const combinedData = initialData.map((item: any, index: number) => ({
//         ...item,
//         ...detailedData[index],
//       }));

//       const sortedData = applySorting(combinedData, orderBy, orderDirection);
//       setReductions(sortedData);
//     } catch (error) {
//       console.error('Error fetching and combining data:', error);
//     }
//   };

//   useEffect(() => {
//     if (instrumentName) {
//       fetchTotalCount();
//       fetchAndCombineData();
//     }
//   }, [instrumentName]);

//   useEffect(() => {
//     if (instrumentName) {
//       fetchAndCombineData();
//     }
//   }, [instrumentName, currentPage, orderBy, orderDirection]);

//   const handlePageChange = (
//     event: React.ChangeEvent<unknown>,
//     page: number
//   ): void => {
//     setCurrentPage(page);
//   };

//   return (
//     <div>
//       <Typography
//         variant="h3"
//         component="h1"
//         style={{ color: theme.palette.text.primary }}
//       >
//         {instrumentName
//           ? `${instrumentName.toUpperCase()} Reduction History`
//           : 'Reduction History'}
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>RB Number</TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'reduction_state'}
//                   direction={
//                     orderBy === 'reduction_state' ? orderDirection : 'asc'
//                   }
//                   onClick={() => handleSort('reduction_state')}
//                 >
//                   Reduction State
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>Run Start</TableCell>{' '}
//               {/* can't be sorted with current API configuration */}
//               <TableCell>Run End</TableCell>{' '}
//               {/* can't be sorted with current API configuration */}
//               <TableCell>Run Output</TableCell>{' '}
//               {/* can't be sorted with current API configuration */}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {reductions.map((reduction, reductionIndex) =>
//               reduction.runs.map((run, runIndex) => (
//                 <TableRow key={`${reductionIndex}-${runIndex}`}>
//                   <TableCell>{run.experiment_number}</TableCell>
//                   <TableCell>{reduction.reduction_state}</TableCell>
//                   <TableCell>{run.run_start}</TableCell>
//                   <TableCell>{run.run_end}</TableCell>
//                   <TableCell>{run.filename}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {totalPages > 1 && (
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           sx={{ marginTop: 2, marginBottom: 2 }}
//         />
//       )}
//     </div>
//   );
// };

// export default ReductionHistory;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import {
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Pagination,
//   TableSortLabel,
// } from '@mui/material';

// // Define interfaces for your data
// interface Run {
//   experiment_number: number;
//   filename: string;
//   instrument_name: string;
//   run_start: string;
//   run_end: string;
// }

// interface Reduction {
//   id: number;
//   reduction_state: string;
//   runs: Run[];
// }

// const ReductionHistory: React.FC = () => {
//   const theme = useTheme();
//   const { instrumentName } = useParams<{ instrumentName: string }>();
//   const [reductions, setReductions] = useState<Reduction[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
//   const [orderBy, setOrderBy] = useState<string>('');
//   const limit = 10;

//   const fetchTotalCount = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/instrument/${instrumentName}/reductions/count`
//       );
//       const data = await response.json();
//       setTotalPages(Math.ceil(data.count / limit));
//     } catch (error) {
//       console.error('Error fetching total count:', error);
//     }
//   };

//   const handleSort = (property: string): void => {
//     const isAsc = orderBy === property && orderDirection === 'asc';
//     setOrderDirection(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const fetchAndCombineData = async (): Promise<void> => {
//     try {
//       const offset = (currentPage - 1) * limit;
//       const response = await fetch(
//         `http://localhost:8000/instrument/${instrumentName}/reductions?limit=${limit}&offset=${offset}`
//       );
//       const initialData = await response.json();

//       const detailedDataPromises = initialData.map((reduction: any) =>
//         fetch(`http://localhost:8000/reduction/${reduction.id}`).then((res) =>
//           res.json()
//         )
//       );
//       const detailedData = await Promise.all(detailedDataPromises);

//       const combinedData = initialData.map((item: any, index: number) => ({
//         ...item,
//         ...detailedData[index],
//       }));

//       const sortedData = applySorting(combinedData, orderBy, orderDirection);
//       setReductions(sortedData);
//     } catch (error) {
//       console.error('Error fetching and combining data:', error);
//     }
//   };

//   useEffect(() => {
//     if (instrumentName) {
//       fetchTotalCount();
//       fetchAndCombineData();
//     }
//   }, [instrumentName]);

//   useEffect(() => {
//     if (instrumentName) {
//       fetchAndCombineData();
//     }
//   }, [instrumentName, currentPage, orderBy, orderDirection]);

//   const handlePageChange = (
//     event: React.ChangeEvent<unknown>,
//     page: number
//   ): void => {
//     setCurrentPage(page);
//   };

//   const applySorting = (
//     data: Reduction[],
//     field: string,
//     direction: 'asc' | 'desc'
//   ): Reduction[] => {
//     return data.sort((a, b) => {
//       if (a[field] === undefined || b[field] === undefined) {
//         return 0;
//       }
//       if (direction === 'asc') {
//         return a[field] < b[field] ? -1 : 1;
//       } else {
//         return a[field] > b[field] ? -1 : 1;
//       }
//     });
//   };

//   return (
//     <div>
//       <Typography
//         variant="h3"
//         component="h1"
//         style={{ color: theme.palette.text.primary }}
//       >
//         {instrumentName
//           ? `${instrumentName.toUpperCase()} Reduction History`
//           : 'Reduction History'}
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'experiment_number'}
//                   direction={
//                     orderBy === 'experiment_number' ? orderDirection : 'asc'
//                   }
//                   onClick={() => handleSort('experiment_number')}
//                 >
//                   RB Number
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'reduction_state'}
//                   direction={
//                     orderBy === 'reduction_state' ? orderDirection : 'asc'
//                   }
//                   onClick={() => handleSort('reduction_state')}
//                 >
//                   Reduction State
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'run_start'}
//                   direction={orderBy === 'run_start' ? orderDirection : 'asc'}
//                   onClick={() => handleSort('run_start')}
//                 >
//                   Run Start
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'run_end'}
//                   direction={orderBy === 'run_end' ? orderDirection : 'asc'}
//                   onClick={() => handleSort('run_end')}
//                 >
//                   Run End
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>Run Output</TableCell> {/* Non-sortable column */}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {reductions.map((reduction, reductionIndex) =>
//               reduction.runs.map((run, runIndex) => (
//                 <TableRow key={`${reductionIndex}-${runIndex}`}>
//                   <TableCell>{run.experiment_number}</TableCell>
//                   <TableCell>{reduction.reduction_state}</TableCell>
//                   <TableCell>{run.run_start}</TableCell>
//                   <TableCell>{run.run_end}</TableCell>
//                   <TableCell>{run.filename}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {totalPages > 1 && (
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           sx={{ marginTop: 2, marginBottom: 2 }}
//         />
//       )}
//     </div>
//   );
// };

// export default ReductionHistory;

//====================================================================================================================

// import * as React from 'react';
// import { useParams } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import {
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Pagination,
//   TableSortLabel,
// } from '@mui/material';

// // Define interfaces for your data
// interface Run {
//   experiment_number: number;
//   filename: string;
//   instrument_name: string;
//   run_start: string;
//   run_end: string;
// }

// interface Reduction {
//   reduction_state: string;
//   runs: Run[];
// }

// const ReductionHistory: React.FC = () => {
//   const theme = useTheme();
//   const { instrumentName } = useParams<{ instrumentName: string }>();
//   const [reductions, setReductions] = React.useState<Reduction[]>([]);
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const [totalPages, setTotalPages] = React.useState(0);
//   const [orderDirection, setOrderDirection] = React.useState<'asc' | 'desc'>(
//     'asc'
//   );
//   const [orderBy, setOrderBy] = React.useState<string>('');
//   const limit = 10;

//   const fetchTotalCount = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/instrument/${instrumentName}/reductions/count`
//       );
//       const data = await response.json();
//       setTotalPages(Math.ceil(data.count / limit));
//     } catch (error) {
//       console.error('Error fetching total count:', error);
//     }
//   };

//   const handleSort = (property: string): void => {
//     const isAsc = orderBy === property && orderDirection === 'asc';
//     setOrderDirection(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const fetchReductions = async (): Promise<void> => {
//     try {
//       const offset = (currentPage - 1) * limit;
//       let query = `limit=${limit}&offset=${offset}`;
//       if (orderBy) {
//         query += `&order_by=${orderBy}&order_direction=${orderDirection}`;
//       }
//       const response = await fetch(
//         `http://localhost:8000/instrument/${instrumentName}/reductions?${query}`
//       );
//       const data = await response.json();

//       const reductionDetails = await Promise.all(
//         data.map(async (reduction: any) => {
//           const res = await fetch(
//             `http://localhost:8000/reduction/${reduction.id}`
//           );
//           return res.json();
//         })
//       );

//       setReductions(reductionDetails);
//     } catch (error) {
//       console.error('Error fetching reductions:', error);
//     }
//   };

//   React.useEffect(() => {
//     if (instrumentName) {
//       fetchTotalCount();
//       fetchReductions();
//     }
//   }, [instrumentName]);

//   React.useEffect(() => {
//     if (instrumentName) {
//       fetchReductions();
//     }
//   }, [instrumentName, currentPage, orderBy, orderDirection]);

//   const handlePageChange = (
//     event: React.ChangeEvent<unknown>,
//     page: number
//   ): void => {
//     setCurrentPage(page);
//   };

//   return (
//     <div>
//       <Typography
//         variant="h3"
//         component="h1"
//         style={{ color: theme.palette.text.primary }}
//       >
//         {instrumentName
//           ? `${instrumentName.toUpperCase()} Reduction History`
//           : 'Reduction History'}
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>RB Number</TableCell>{' '}
//               {/* Can't sort with current API configuration */}
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'reduction_state'}
//                   direction={
//                     orderBy === 'reduction_state' ? orderDirection : 'asc'
//                   }
//                   onClick={() => handleSort('reduction_state')}
//                 >
//                   Reduction State
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>Run Start</TableCell>{' '}
//               {/* Can't sort with current API configuration */}
//               <TableCell>Run End</TableCell>{' '}
//               {/* Can't sort with current API configuration */}
//               <TableCell>Run Output</TableCell>{' '}
//               {/* Can't sort with current API configuration */}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {reductions.map((reduction, reductionIndex) =>
//               reduction.runs.map((run, runIndex) => (
//                 <TableRow key={`${reductionIndex}-${runIndex}`}>
//                   <TableCell>{run.experiment_number}</TableCell>
//                   <TableCell>{reduction.reduction_state}</TableCell>
//                   <TableCell>{run.run_start}</TableCell>
//                   <TableCell>{run.run_end}</TableCell>
//                   <TableCell>{run.filename}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {totalPages > 1 && (
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={handlePageChange}
//           color="primary"
//           sx={{ marginTop: 2, marginBottom: 2 }}
//         />
//       )}
//     </div>
//   );
// };

// export default ReductionHistory;

//========================================================================================================================

// import * as React from 'react';
// import { useParams } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import {
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from '@mui/material';

// // Define interfaces for your data
// interface Run {
//   experiment_number: number;
//   filename: string;
//   instrument_name: string;
//   run_start: string;
//   run_end: string;
//   // Add other fields as necessary
// }

// interface Reduction {
//   reduction_state: string;
//   runs: Run[];
//   // Add other fields as necessary
// }

// const ReductionHistory: React.FC = () => {
//   const theme = useTheme();
//   const { instrumentName } = useParams<{ instrumentName: string }>();
//   const [reductions, setReductions] = React.useState<Reduction[]>([]);

//   React.useEffect(() => {
//     async function fetchReductions(): Promise<void> {
//       try {
//         const response = await fetch(
//           `http://localhost:8000/instrument/${instrumentName}/reductions`
//         );
//         const data = await response.json();

//         const reductionDetails = await Promise.all(
//           data.map(async (reduction: any) => {
//             const res = await fetch(
//               `http://localhost:8000/reduction/${reduction.id}`
//             );
//             return res.json();
//           })
//         );

//         setReductions(reductionDetails);
//       } catch (error) {
//         console.error('Error fetching reductions:', error);
//       }
//     }

//     if (instrumentName) {
//       fetchReductions();
//     }
//   }, [instrumentName]);

//   return (
//     <div>
//       <Typography
//         variant="h3"
//         component="h1"
//         style={{ color: theme.palette.text.primary }}
//       >
//         {instrumentName
//           ? `${instrumentName.toUpperCase()} Reduction History`
//           : 'Reduction History'}
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>RB Number</TableCell>
//               <TableCell>Reduction State</TableCell>
//               <TableCell>Instrument</TableCell>
//               <TableCell>Run Start</TableCell>
//               <TableCell>Run End</TableCell>
//               <TableCell>Run Output</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {reductions.map((reduction) =>
//               reduction.runs.map((run: Run, index: number) => (
//                 <TableRow key={index}>
//                   <TableCell>{run.experiment_number}</TableCell>
//                   <TableCell>{reduction.reduction_state}</TableCell>
//                   <TableCell>{run.instrument_name}</TableCell>
//                   <TableCell>{run.run_start}</TableCell>
//                   <TableCell>{run.run_end}</TableCell>
//                   <TableCell>{run.filename}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default ReductionHistory;

// import * as React from 'react';
// import { useParams } from 'react-router-dom';
// import Typography from '@mui/material/Typography';
// import { useTheme } from '@mui/material/styles';

// const ReductionHistory: React.FC = () => {
//   const theme = useTheme();
//   const { instrumentName } = useParams<{ instrumentName: string }>();
//   return (
//     <div>
//       <Typography
//         variant="h3"
//         component="h1"
//         style={{ color: theme.palette.text.primary }}
//       >
//         {instrumentName
//           ? `${instrumentName.toUpperCase()} Reduction History Page`
//           : 'Reduction History Page'}
//       </Typography>
//       <Typography variant="body1" style={{ color: theme.palette.text.primary }}>
//         This is the reduction history page. Content will be added soon.
//       </Typography>
//     </div>
//   );
// };

// export default ReductionHistory;
