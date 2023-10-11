import { CSSProperties } from 'react';

import backdrop from './backdrop.jpg';

export const styles: Record<string, CSSProperties> = {
  container: {
    textAlign: 'center',
    padding: '20px',
    backgroundImage: `url(${backdrop})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  title: {
    marginTop: '20px',
    fontSize: '3rem',
    fontWeight: '300',
  },
  boxes: {
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  largeBox: {
    backgroundColor: '#484848',
    width: '80%',
    paddingLeft: '20px',
    paddingBottom: '20px',
    marginBottom: '20px',
    borderRadius: '5px',
  },
  boxHeading: {
    marginTop: '10px',
    marginBottom: '10px',
    color: 'white',
    textAlign: 'left',
    maxWidth: '50%',
  },
  largeBoxText: {
    color: 'white',
    textAlign: 'left',
    fontSize: '16px',
    marginTop: '20px',
    maxWidth: '50%',
  },
  button: {
    marginTop: '20px',
    display: 'block',
    fontWeight: 'bold',
  },
  secondRow: {
    display: 'flex',
    width: '81.25%',
    justifyContent: 'space-between',
    marginBottom: '40px',
    alignItems: 'stretch',
  },
  search: {
    marginTop: '15px',
    backgroundColor: 'blue',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBox: {
    backgroundColor: '#484848',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingBottom: '20px',
    borderRadius: '5px',
    flexGrow: 1,
  },
  smallBoxText: {
    color: 'white',
    textAlign: 'left',
    fontSize: '16px',
  },
};
