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

import { instruments, InstrumentData } from './InstrumentData';
import { ExpandableCard, styles } from './Instrument.styles';

type Order = 'asc' | 'desc';

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

function getComparator<Key extends keyof InstrumentData>(
  order: Order,
  orderBy: Key
): (a: InstrumentData, b: InstrumentData) => number {
  return order === 'asc'
    ? (a, b) => compare<Key>(a, b, orderBy)
    : (a, b) => -compare<Key>(a, b, orderBy);
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

const Instrument: React.FC = () => {
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

  return (
    <Box sx={{ paddingBottom: '2rem' }}>
      <TableHead>
        <TableRow>
          <TableCell>
            <TableSortLabel
              data-cy="sort-button"
              style={styles.tableSortLabel}
              active={orderBy === 'name'}
              direction={orderBy === 'name' ? order : 'asc'}
              onClick={() => handleSortRequest('name')}
            >
              Name
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              style={styles.tableSortLabel}
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
          <Box
            key={instrument.id}
            sx={{ marginBottom: 1 }}
            onClick={() => handleExpandClick(instrument.id)}
          >
            <ExpandableCard
              expanded={expandedId === instrument.id}
              elevation={4}
            >
              <CardContent style={styles.cardContent}>
                <Box>
                  <Typography
                    variant="h6"
                    component="h1"
                    style={styles.instrumentName}
                  >
                    {instrument.name}
                  </Typography>
                  <Typography variant="body1">{instrument.type}</Typography>
                </Box>
                <IconButton
                  aria-expanded={expandedId === instrument.id}
                  aria-label="show more"
                >
                  <ExpandMoreIcon
                    style={
                      expandedId === instrument.id
                        ? styles.expandMoreIconExpanded
                        : styles.expandMoreIcon
                    }
                  />
                </IconButton>
              </CardContent>
              {expandedId === instrument.id && (
                <CardContent style={styles.cardContentExpanded}>
                  <Box style={styles.buttonBox}>
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to={`/${instrument.name.toLowerCase()}/live_reduction`}
                      style={styles.button}
                    >
                      Live Reduction
                    </Button>
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to={`/${instrument.name.toLowerCase()}/reduction_history`}
                      style={styles.secondButton}
                    >
                      Reduction History
                    </Button>
                  </Box>
                  <Box style={styles.infoBox}>
                    <Typography
                      variant="body2"
                      paragraph
                      style={styles.description}
                    >
                      {instrument.description}
                    </Typography>
                    <Link
                      href={instrument.infoPage}
                      target="_blank"
                      rel="noopener"
                      underline="always"
                      style={styles.infoLink}
                    >
                      More Information
                    </Link>
                  </Box>
                  <Box style={styles.scientistBox}>
                    <Typography variant="body2">Scientists:</Typography>
                    <List>
                      {instrument.scientists.map((scientist) => (
                        <ListItem key={scientist} style={styles.listItem}>
                          <Typography variant="body2">
                            Dr. {scientist}
                          </Typography>
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
    </Box>
  );
};

export default Instrument;
