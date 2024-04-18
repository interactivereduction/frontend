import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
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
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { Card } from '@mui/material';

import { instruments, InstrumentData } from './InstrumentData';

type Order = 'asc' | 'desc';

function compare<Key extends keyof InstrumentData>(a: InstrumentData, b: InstrumentData, orderBy: Key): number {
  if ((b[orderBy] as string) < (a[orderBy] as string)) {
    return -1;
  }
  if ((b[orderBy] as string) > (a[orderBy] as string)) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof InstrumentData>(
  order: Order,
  orderBy: Key
): (a: InstrumentData, b: InstrumentData) => number {
  return order === 'asc' ? (a, b) => compare<Key>(a, b, orderBy) : (a, b) => -compare<Key>(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const ExpandableCard = styled(Card)<{ expanded: boolean }>(({ theme, expanded }) => ({
  backgroundColor: expanded
    ? theme.palette.mode === 'light'
      ? '#dcdcdc' // expanded light mode
      : '#12285c' // expanded dark mode
    : theme.palette.mode === 'light'
    ? '#ffffff' // unexpanded light mode
    : '#23428d', // unexpanded dark mode
  color: theme.palette.text.primary,
  margin: '8px',
}));

const Instrument: React.FC = () => {
  const theme = useTheme();
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof InstrumentData>('name');

  const handleExpandClick = (id: number): void => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSortRequest = (property: keyof InstrumentData): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const styles = {
    expandMoreIcon: {
      color: theme.palette.mode === 'light' ? '#333' : 'white',
      fontSize: '2rem',
    },
    expandMoreIconExpanded: {
      color: theme.palette.mode === 'light' ? '#333' : 'white',
      fontSize: '2rem',
      transform: 'rotate(180deg)',
    },
    button: {
      marginBottom: 14,
      outline: '1px solid white',
    },
    secondButton: {
      outline: '1px solid white',
    },
    infoLink: {
      marginTop: '10',
      color: theme.palette.mode === 'light' ? '#0066cc' : 'lightblue',
    },
    cardContentExpanded: {
      padding: '6px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      paddingBottom: '24px',
    },
    tableSortLabel: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    scientistBox: {
      flex: '1',
    },
    cardContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      height: '36px',
    },
    infoBox: {
      flex: '1.8',
      marginRight: 60,
    },
    listItem: {
      padding: '0',
    },
  };

  return (
    <>
      <div style={{ padding: '20px' }}>
        <Typography variant="h3" component="h1" style={{ color: theme.palette.text.primary }}>
          ISIS instruments
        </Typography>
      </div>
      <Box sx={{ paddingBottom: '2rem' }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                data-cy="sort-button"
                style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase' }}
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => handleSortRequest('name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase' }}
                active={orderBy === 'type'}
                direction={orderBy === 'type' ? order : 'asc'}
                onClick={() => handleSortRequest('type')}
              >
                Type
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        {stableSort(instruments, getComparator(order, orderBy)).map((instrument) => (
          <Box key={instrument.id} sx={{ marginBottom: 1 }} onClick={() => handleExpandClick(instrument.id)}>
            <ExpandableCard expanded={expandedId === instrument.id} elevation={4}>
              <CardContent style={styles.cardContent}>
                <Box>
                  <Typography
                    variant="h6"
                    component="h1"
                    style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', width: '15%' }}
                  >
                    {instrument.name}
                  </Typography>
                  <Typography variant="body1">{instrument.type}</Typography>
                </Box>
                <IconButton aria-expanded={expandedId === instrument.id} aria-label="show more">
                  <ExpandMoreIcon
                    style={expandedId === instrument.id ? styles.expandMoreIconExpanded : styles.expandMoreIcon}
                  />
                </IconButton>
              </CardContent>
              {expandedId === instrument.id && (
                <CardContent style={styles.cardContentExpanded}>
                  <Box style={{ display: 'flex', flexDirection: 'column', marginRight: 20 }}>
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to={`/data-viewer/${instrument.name.toUpperCase()}/1`}
                      style={styles.button}
                    >
                      Data Viewer
                    </Button>
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to={`/reduction-history/${instrument.name.toUpperCase()}`}
                      style={styles.secondButton}
                    >
                      Reduction History
                    </Button>
                  </Box>
                  <Box style={styles.infoBox}>
                    <Typography variant="body2" paragraph style={{ textAlign: 'justify', marginBottom: 30 }}>
                      {instrument.description}
                    </Typography>
                    <Link
                      href={instrument.infoPage}
                      target="_blank"
                      rel="noopener"
                      underline="always"
                      style={styles.infoLink}
                    >
                      {instrument.infoPage}
                    </Link>
                  </Box>
                  <Box style={styles.scientistBox}>
                    <Typography variant="body2">Scientists:</Typography>
                    <List>
                      {instrument.scientists.map((scientist) => (
                        <ListItem key={scientist} style={styles.listItem}>
                          <Typography variant="body2">Dr. {scientist}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              )}
            </ExpandableCard>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Instrument;
