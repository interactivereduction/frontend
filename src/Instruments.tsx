// React components
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Material UI components
import { Box, Button, Collapse, IconButton, Link, List, ListItem, Typography, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Local data
import { instruments } from './InstrumentData';

const Instruments: React.FC = () => {
  const theme = useTheme();
  const [expandedIds, setExpandedIds] = React.useState<number[]>([]);

  const handleToggleExpand = (id: number, event?: React.MouseEvent): void => {
    if (event) {
      event.stopPropagation();
    }
    setExpandedIds((prevExpandedIds) =>
      prevExpandedIds.includes(id)
        ? prevExpandedIds.filter((expandedId) => expandedId !== id)
        : [...prevExpandedIds, id]
    );
  };

  return (
    <>
      <Typography variant="h3" component="h1" style={{ color: theme.palette.text.primary, padding: '20px' }}>
        ISIS instruments
      </Typography>
      <Box sx={{ paddingBottom: '2rem' }}>
        {instruments.map((instrument) => (
          <Box
            key={instrument.id}
            sx={{ marginBottom: 1, marginLeft: 2, marginRight: 2 }}
            onClick={() => handleToggleExpand(instrument.id)}
          >
            <Box
              sx={{
                padding: '12px 16px',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px',
                backgroundColor: expandedIds.includes(instrument.id)
                  ? theme.palette.action.hover
                  : theme.palette.background.paper,
              }}
            >
              <Box display="flex" alignItems="center">
                <IconButton
                  aria-expanded={expandedIds.includes(instrument.id)}
                  aria-label="show more"
                  onClick={(event) => handleToggleExpand(instrument.id, event)}
                >
                  <ExpandMoreIcon
                    style={{ transform: expandedIds.includes(instrument.id) ? 'rotate(180deg)' : 'none' }}
                  />
                </IconButton>
                <Box sx={{ marginLeft: 2 }}>
                  <Typography
                    variant="h6"
                    component="h1"
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      color: theme.palette.mode === 'dark' ? '#86b4ff' : theme.palette.primary.main,
                    }}
                  >
                    {instrument.name}
                  </Typography>
                  <Typography sx={{ color: theme.palette.text.primary }} variant="body1">
                    {instrument.type}
                  </Typography>
                </Box>
              </Box>
              <Collapse in={expandedIds.includes(instrument.id)} timeout="auto" unmountOnExit>
                <Box marginTop={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography
                      variant="body2"
                      paragraph
                      sx={{ flex: 2, marginRight: 2, color: theme.palette.text.primary }}
                    >
                      {instrument.description}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                        Scientists:
                      </Typography>
                      <List>
                        {instrument.scientists.map((scientist) => (
                          <ListItem key={scientist} style={{ padding: '0', color: theme.palette.text.primary }}>
                            <Typography variant="body2">Dr. {scientist}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                  <Link href={instrument.infoPage} target="_blank" rel="noopener" underline="always">
                    {instrument.infoPage}
                  </Link>
                  <Box marginTop={2}>
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to={`/reduction-history/${instrument.name.toUpperCase()}`}
                    >
                      Reduction History
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Instruments;
