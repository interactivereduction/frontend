import { CSSProperties } from 'react';
import { Card, TableCell } from '@mui/material';
import { styled } from '@mui/system';

export const ExpandableCard = styled(Card)<{ expanded: boolean }>(
  ({ theme, expanded }) => ({
    backgroundColor: expanded ? '#12285c' : '#23428d',
    color: 'white',
    width: '100%',
  })
);

export const WideTableCell = styled(TableCell)({
  width: '71%',
});

export const styles: Record<string, CSSProperties> = {
  tableSortLabel: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 16px',
    height: '60px',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  instrumentName: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginRight: '17px',
    width: '15%',
  },
  expandMoreIcon: {
    color: 'white',
    fontSize: '2rem',
  },
  expandMoreIconExpanded: {
    color: 'white',
    fontSize: '2rem',
    transform: 'rotate(180deg)',
  },
  cardContentExpanded: {
    padding: '6px 16px',
    display: 'flex',
    alignItems: 'flex-start',
  },
  buttonBox: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: 20,
  },
  button: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  secondButton: {
    fontWeight: 'bold',
  },
  infoBox: {
    flex: '1.8',
    marginRight: 60,
  },
  description: {
    textAlign: 'justify',
    marginBottom: 30,
  },
  infoLink: {
    marginTop: '10',
    color: 'lightblue',
    textDecoration: 'none',
  },
  scientistBox: {
    flex: '1',
  },
  listItem: {
    padding: '0',
  },
};
