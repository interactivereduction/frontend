import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
  Grid,
  MobileStepper,
  Button,
  // Tabs,
  // Tab
} from '@mui/material';
import Plot from 'react-plotly.js';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Editor from '@monaco-editor/react';
import { instruments } from './InstrumentData';

const DataViewer: React.FC = () => {
  const theme = useTheme();
  const history = useHistory();
  const { instrumentName, experimentNumber } = useParams<{ instrumentName: string; experimentNumber: string }>();
  const [selectedInstrument, setSelectedInstrument] = useState<string>(instrumentName || instruments[0].name);
  const [activeStep, setActiveStep] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plotData, setPlotData] = useState<any[]>([]);
  // const [activeTab, setActiveTab] = useState<number>(0);

  const backgroundColor = theme.palette.mode === 'dark' ? '#282828' : 'white';
  const editorTheme = theme.palette.mode === 'dark' ? 'vs-dark' : 'light';
  const textColor = theme.palette.text.primary;

  const fetchPlotData = useCallback(async (): Promise<void> => {
    try {
      const irApiUrl = process.env.REACT_APP_IR_REST_API_URL;
      const response = await fetch(`${irApiUrl}/reduction/${experimentNumber}/plots`);
      const data = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const processedData = data.map((plot: any) => {
        if (plot.type === '1d') {
          return {
            x: plot.x,
            y: plot.y,
            error_y: {
              type: 'data',
              array: plot.errors,
              visible: true,
            },
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'orange' },
            name: 'Data with error bars',
          };
        } else if (plot.type === '2d') {
          return {
            x: plot.x,
            y: plot.y,
            z: plot.errors,
            type: 'heatmap',
            colorscale: 'Viridis',
            name: '2D Histogram',
          };
        }
        return plot;
      });

      setPlotData(processedData);
    } catch (error) {
      console.error('Error fetching plot data:', error);
    }
  }, [experimentNumber]);

  useEffect(() => {
    fetchPlotData();

    if (!instruments.some((i) => i.name === instrumentName)) {
      setSelectedInstrument(instruments[0].name);
      history.replace(`/data-viewer/${instruments[0].name}/${experimentNumber}`);
    }
  }, [fetchPlotData, instrumentName, experimentNumber, history]);

  const handleInstrumentChange = (event: SelectChangeEvent): void => {
    const newInstrument = event.target.value as string;
    setSelectedInstrument(newInstrument);
    history.push(`/data-viewer/${newInstrument}/${experimentNumber}`);
  };

  // const handleChangeTab = (event: React.SyntheticEvent, newValue: number): void => {
  //   setActiveTab(newValue);
  // };

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h3" component="h1" style={{ color: textColor }}>
          {`${selectedInstrument.toUpperCase()} experiment ${experimentNumber}`}
        </Typography>
        <FormControl style={{ minWidth: '200px' }}>
          <InputLabel id="instrument-select-label">Instrument</InputLabel>
          <Select
            labelId="instrument-select-label"
            value={selectedInstrument}
            label="Instrument"
            onChange={handleInstrumentChange}
          >
            {instruments.map((instrument) => (
              <MenuItem key={instrument.id} value={instrument.name}>
                {instrument.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Box width={750} mx="auto">
            <Plot
              data={[plotData[activeStep]]}
              layout={{
                width: 750,
                height: 440,
                title: `Plot ${activeStep + 1}`,
                paper_bgcolor: backgroundColor,
                plot_bgcolor: backgroundColor,
                font: { color: textColor },
              }}
            />
            <MobileStepper
              variant="dots"
              steps={plotData.length}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button size="small" onClick={handleNext} disabled={activeStep === plotData.length - 1}>
                  Next
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  <KeyboardArrowLeft />
                  Back
                </Button>
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Editor
            height="440px"
            defaultLanguage="python"
            defaultValue="# Add your code here"
            theme={editorTheme}
            options={{ minimap: { enabled: false }, automaticLayout: true }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DataViewer;
