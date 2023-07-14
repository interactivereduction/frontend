import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';

import { instruments } from './InstrumentData'; // import the instruments data

const ExpandableCard = styled(Card)({
  backgroundColor: 'darkblue',
  color: 'white',
  width: '100%', // full width
});

const Instrument: React.FC = () => {
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const handleExpandClick = (id: number): void => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      {instruments.map((instrument) => (
        <Box key={instrument.id} sx={{ marginBottom: 1 }}>
          <ExpandableCard>
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
              <CardContent sx={{ padding: '6px 16px' }}>
                <Typography variant="body2">
                  {instrument.description}
                </Typography>
              </CardContent>
            )}
          </ExpandableCard>
        </Box>
      ))}
    </>
  );
};

export default Instrument;
