import { CSSProperties } from 'react';
import { Card } from '@mui/material';
import { styled } from '@mui/system';

export const ExpandableCard = styled(Card)<{ expanded: boolean }>(({ expanded }) => ({
  backgroundColor: expanded ? '#12285c' : '#23428d',
  color: 'white',
  margin: '8px',
}));

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
    padding: '12px 16px',
    height: '36px',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  instrumentName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
    paddingBottom: '24px',
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
  },
  scientistBox: {
    flex: '1',
  },
  listItem: {
    padding: '0',
  },
};
