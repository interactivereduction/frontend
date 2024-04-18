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
  Tabs,
  Tab,
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Plot from 'react-plotly.js';
import Editor from '@monaco-editor/react';
import { instruments } from './InstrumentData';

const DataViewer: React.FC = () => {
  const theme = useTheme();
  const history = useHistory();
  const { instrumentName, experimentNumber } = useParams<{ instrumentName: string; experimentNumber: string }>();
  const [selectedInstrument, setSelectedInstrument] = useState<string>(instrumentName || instruments[0].name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plotData, setPlotData] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeEditorTab, setActiveEditorTab] = useState<number>(0);

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
  }, [fetchPlotData, experimentNumber]);

  const handleInstrumentChange = (event: SelectChangeEvent): void => {
    const newInstrument = event.target.value as string;
    setSelectedInstrument(newInstrument);
    history.push(`/data-viewer/${newInstrument}/${experimentNumber}`);
  };

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChangeEditorTab = (event: React.SyntheticEvent, newValue: number): void => {
    setActiveEditorTab(newValue);
  };

  const editorContents = [
    "# Scientist's Python script 1",
    "# Scientist's Python script 2",
    "# Scientist's Python script 3",
  ];

  // TODO: Generate number of dots for mobile stepper depending on number
  // reduction output files. Fetch plots using output file names.
  // function countOutputFiles(input: string | string[]): number {
  //   if (typeof input === 'string') {
  //     return 1;
  //   }
  //   return input.length;
  // }

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
        <Grid item xs={12}>
          <Box style={{ border: '4px solid darkgray', padding: '10px', marginBottom: '10px' }}>
            <Typography variant="h5" component="h2" style={{ color: textColor }}>
              Experiment Summary
            </Typography>
            <p style={{ color: textColor }}>Placeholder text for important information related to this reduction.</p>
            <p style={{ color: textColor }}>Lorem Ipsum text...</p>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            style={{
              border: '4px solid darkgray',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plot
              data={[plotData[activeStep]]}
              layout={{
                width: 800,
                height: 500,
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
                  Next <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  <KeyboardArrowLeft /> Back
                </Button>
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box style={{ border: '4px solid darkgray', overflow: 'hidden' }}>
            <Tabs value={activeEditorTab} onChange={handleChangeEditorTab} aria-label="code editor tabs">
              <Tab label="Script 1" />
              <Tab label="Script 2" />
              <Tab label="Script 3" />
            </Tabs>
            <Editor
              width="100%"
              height="500px"
              defaultLanguage="python"
              value={editorContents[activeEditorTab]}
              theme={editorTheme}
              options={{ minimap: { enabled: false }, automaticLayout: true }}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default DataViewer;
