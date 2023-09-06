import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

import { styles } from './HomePage.styles';

const HomePage: FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <strong>Data reduction</strong> and <strong>processing</strong> <br />
        for <strong>large-scale</strong> science facilities
      </h1>
      <div style={styles.boxes}>
        <div style={styles.largeBox}>
          <h2 style={styles.boxHeading}>
            Reduce and perform basic analysis remotely from a clean web
            interface
          </h2>
          <p style={styles.largeBoxText}>
            Large scale facilities, such as synchrotrons, neutron and muon
            sources, lasers and accelerators, generate vast amounts of data that
            need to be managed in an efficient way, supporting data ingestion
            for long-term storage and archival, as well as data analysis and
            data publication workflows.
          </p>
          <p style={styles.largeBoxText}>
            Interactive Reduction focuses on providing automatic reduction and
            live reduction functionality interactively from the web.
          </p>
          <Link to="instruments">
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
            <h3 style={styles.boxHeading}>Live reduction</h3>
            <p style={styles.smallBoxText}>
              Browse a list of instruments and access the live data
              functionality for a specific instrument.
            </p>
            <Link to="instruments">
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
            <h3 style={styles.boxHeading}>Histrorical reductions</h3>
            <p style={styles.smallBoxText}>
              Browse and search a list of all reductions performed on the
              platform.
            </p>
            <Link to="history">
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
            <h3 style={styles.boxHeading}>ISIS Neutron and Muon Source</h3>
            <p style={styles.smallBoxText}>
              World-leading centre for research giving unique insights into the
              properties of materials on the atomic scale.
            </p>
            <a
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
