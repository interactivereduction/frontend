import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Link,
  List,
  ListItem,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';

import { instruments, InstrumentData } from './InstrumentData'; // Import the instrument data

// Order type
type Order = 'asc' | 'desc';

// Styling for the expandable card
const ExpandableCard = styled(Card)<{ expanded: boolean }>(
  ({ theme, expanded }) => ({
    backgroundColor: expanded ? '#12285c' : '#23428d',
    color: 'white',
    width: '100%',
    // boxShadow: `0px 0px 2px 4px ${expanded ? '#1b3fec' : '#23428d'}`,
  })
);

// Function to compare two objects based on the orderBy key
function compare<Key extends keyof InstrumentData>(
  a: InstrumentData,
  b: InstrumentData,
  orderBy: Key
): number {
  if ((b[orderBy] as string) < (a[orderBy] as string)) {
    return -1;
  }
  if ((b[orderBy] as string) > (a[orderBy] as string)) {
    return 1;
  }
  return 0;
}

// Function to get the comparator based on the order
function getComparator<Key extends keyof InstrumentData>(
  order: Order,
  orderBy: Key
): (a: InstrumentData, b: InstrumentData) => number {
  return order === 'asc'
    ? (a, b) => compare<Key>(a, b, orderBy)
    : (a, b) => -compare<Key>(a, b, orderBy);
}

// Function to perform a stable sort on the array
function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Instrument component
const Instrument: React.FC = () => {
  // Setting up state
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof InstrumentData>('name');

  // Handler for the expandable card click
  const handleExpandClick = (id: number): void => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handler for the sort request
  const handleSortRequest = (property: keyof InstrumentData): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: '71%' }}>
            <TableSortLabel
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
              active={orderBy === 'name'}
              direction={orderBy === 'name' ? order : 'asc'}
              onClick={() => handleSortRequest('name')}
            >
              Name
            </TableSortLabel>
          </TableCell>

          <TableCell>
            <TableSortLabel
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
              active={orderBy === 'type'}
              direction={orderBy === 'type' ? order : 'asc'}
              onClick={() => handleSortRequest('type')}
            >
              Type
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
      {stableSort(instruments, getComparator(order, orderBy)).map(
        (instrument) => (
          <Box key={instrument.id} sx={{ marginBottom: 1 }}>
            <ExpandableCard expanded={expandedId === instrument.id}>
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '24px 16px',
                  height: '60px',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      marginRight: '20px',
                      width: '15%',
                    }}
                  >
                    {instrument.name}
                  </Typography>
                  <Typography variant="body1">{instrument.type}</Typography>
                </Box>
                <CardActions disableSpacing>
                  <IconButton
                    onClick={() => handleExpandClick(instrument.id)}
                    aria-expanded={expandedId === instrument.id}
                    aria-label="show more"
                    sx={{ color: 'white' }}
                  >
                    <ExpandMoreIcon
                      style={{
                        transform:
                          expandedId === instrument.id
                            ? 'rotate(180deg)'
                            : 'rotate(0)',
                        fontSize: '2rem',
                      }}
                    />
                  </IconButton>
                </CardActions>
              </CardContent>
              {expandedId === instrument.id && (
                <CardContent
                  sx={{
                    padding: '6px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginRight: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/live-reduction"
                      sx={{ marginBottom: 1, fontWeight: 'bold' }}
                    >
                      Live Reduction
                    </Button>
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/reduction-history"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Reduction History
                    </Button>
                  </Box>
                  <Box sx={{ flex: '1.8', marginRight: 6 }}>
                    <Typography
                      variant="body2"
                      paragraph
                      sx={{ textAlign: 'justify' }}
                    >
                      {instrument.description}
                    </Typography>
                    <Link
                      href={instrument.infoPage}
                      target="_blank"
                      rel="noopener"
                      underline="always"
                      sx={{ color: 'lightblue' }}
                    >
                      More Information
                    </Link>
                  </Box>
                  <Box sx={{ flex: '1' }}>
                    <Typography variant="body2">Scientists:</Typography>
                    <List>
                      {instrument.scientists.map((scientist, index) => (
                        <ListItem key={index} sx={{ padding: '0' }}>
                          <Typography variant="body2">{scientist}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              )}
            </ExpandableCard>
          </Box>
        )
      )}
    </>
  );
};

export default Instrument;
