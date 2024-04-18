import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Grid, MobileStepper, Button, Tabs, Tab } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Plot from 'react-plotly.js';
import Editor from '@monaco-editor/react';

const DataViewer: React.FC = () => {
  const theme = useTheme();
  const { instrumentName, experimentNumber } = useParams<{ instrumentName: string; experimentNumber: string }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plotData, setPlotData] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeEditorTab, setActiveEditorTab] = useState<number>(0);

  const backgroundColor = theme.palette.mode === 'dark' ? '#192d57' : 'white';
  const boxColor = theme.palette.mode === 'dark' ? '#192d57' : 'white';
  const editorColor = theme.palette.mode === 'dark' ? 'vs-dark' : 'light';
  const textColor = theme.palette.text.primary;
  const axisStyles =
    theme.palette.mode === 'dark'
      ? {
          color: '#888',
          zerolinecolor: '#FFF',
          gridcolor: '#666',
          tickcolor: '#888',
        }
      : {
          color: '#333',
          zerolinecolor: '#333',
          gridcolor: '#CCC',
          tickcolor: '#333',
        };

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
    '# PLACEHOLDER',
  ];

  // TODO: Generate number of dots for mobile stepper depending on number of
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
          {`${instrumentName.toUpperCase()} experiment ${experimentNumber}`}
        </Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box
            style={{ border: '3px solid darkgray', padding: '10px', marginBottom: '5px', backgroundColor: boxColor }}
          >
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
              border: '3px solid darkgray',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: boxColor,
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
                xaxis: {
                  zeroline: true,
                  zerolinecolor: axisStyles.zerolinecolor,
                  gridcolor: axisStyles.gridcolor,
                  tickcolor: axisStyles.tickcolor,
                  linecolor: axisStyles.color,
                },
                yaxis: {
                  zeroline: true,
                  zerolinecolor: axisStyles.zerolinecolor,
                  gridcolor: axisStyles.gridcolor,
                  tickcolor: axisStyles.tickcolor,
                  linecolor: axisStyles.color,
                },
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
          <Box style={{ border: '3px solid darkgray', overflow: 'hidden' }}>
            <Tabs value={activeEditorTab} onChange={handleChangeEditorTab} aria-label="code editor tabs">
              <Tab label="Script 1" />
              <Tab label="Script 2" />
              <Tab label="Script 3" />
              <Tab label="GUI Inputs" />
            </Tabs>
            <Editor
              width="100%"
              height="500px"
              defaultLanguage="python"
              value={editorContents[activeEditorTab]}
              theme={editorColor}
              options={{ minimap: { enabled: false }, automaticLayout: true }}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default DataViewer;
