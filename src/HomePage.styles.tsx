import { CSSProperties } from 'react';

import backdrop from './backdrop.jpg';

export const styles: Record<string, CSSProperties> = {
  container: {
    textAlign: 'center',
    padding: '20px',
    backgroundImage: `url(${backdrop})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    // height: '30vh',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '300',
    color: 'white',
  },
  boxes: {
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
    textDecoration: 'none',
  },
  secondRow: {
    display: 'flex',
    width: '81.25%',
    justifyContent: 'space-between',
    marginBottom: '40px', // adjusted margin here
    alignItems: 'stretch',
  },
  search: {
    marginTop: '20px',
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
