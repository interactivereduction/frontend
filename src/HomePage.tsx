import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { styles } from './HomePage.styles';

const HomePage: FC = () => {
  const theme = useTheme();
  return (
    <div style={styles.container}>
      <Typography
        variant="h1"
        style={{
          ...styles.title,
          color: theme.palette.text.primary,
        }} // manually set color for now
      >
        <strong>Data reduction</strong> and <strong>processing</strong> <br />
        for <strong>large-scale</strong> science facilities
      </Typography>
      <div style={styles.boxes}>
        <div style={styles.largeBox}>
          <Typography variant="h4" component="h1" style={styles.boxHeading}>
            Reduce and perform basic analysis remotely from a clean web
            interface
          </Typography>
          <Typography variant="body1" style={styles.largeBoxText}>
            Large scale facilities, such as synchrotrons, neutron and muon
            sources, lasers and accelerators, generate vast amounts of data that
            need to be managed in an efficient way, supporting data ingestion
            for long-term storage and archival, as well as data analysis and
            data publication workflows.
          </Typography>
          <Typography variant="body1" style={styles.largeBoxText}>
            Interactive Reduction focuses on providing automatic reduction and
            live reduction functionality interactively from the web.
          </Typography>
          <Link to="instruments" style={{ textDecoration: 'none' }}>
            <Button variant="contained" style={styles.button}>
              Browse instruments
            </Button>
          </Link>
        </div>

        <div style={styles.secondRow}>
          <div style={styles.smallBox}>
            <div style={styles.search}>
              <SearchIcon style={{ color: 'white' }} />
            </div>
            <Typography variant="h5" component="h2" style={styles.boxHeading}>
              Live reduction
            </Typography>
            <Typography variant="body1" style={styles.smallBoxText}>
              Browse a list of instruments and access the live data
              functionality for a specific instrument.
            </Typography>
            <Link to="instruments" style={{ textDecoration: 'none' }}>
              <Button variant="contained" style={styles.button}>
                Browse instruments
              </Button>
            </Link>
          </div>
          <div
            style={{
              ...styles.smallBox,
              margin: '0 10px',
            }}
          >
            <div style={styles.search}>
              <SearchIcon style={{ color: 'white' }} />
            </div>
            <Typography variant="h5" component="h2" style={styles.boxHeading}>
              Histrorical reductions
            </Typography>
            <Typography variant="body1" style={styles.smallBoxText}>
              Browse and search a list of all reductions performed on the
              platform.
            </Typography>
            <Link to="history" style={{ textDecoration: 'none' }}>
              <Button variant="contained" style={styles.button}>
                Browse reductions
              </Button>
            </Link>
          </div>

          <div
            style={{
              ...styles.smallBox,
              backgroundColor: 'darkblue',
            }}
          >
            <Typography variant="h5" component="h2" style={styles.boxHeading}>
              ISIS Neutron and Muon Source
            </Typography>
            <Typography variant="body1" style={styles.smallBoxText}>
              World-leading centre for research giving unique insights into the
              properties of materials on the atomic scale.
            </Typography>
            <a
              style={{ textDecoration: 'none' }}
              href="https://www.isis.stfc.ac.uk/Pages/About.aspx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="contained" style={styles.button}>
                Read more
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
