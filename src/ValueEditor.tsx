// React components
import React, { useState } from 'react';

// Material UI components
import {
  Box,
  Tabs,
  Tab,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  useTheme,
  SelectChangeEvent,
} from '@mui/material';

// Monaco components
import Editor from '@monaco-editor/react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3, height: 'calc(80vh - 48px - 48px - 24px)' }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number): { id: string; 'aria-controls': string } => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
};

const ValueEditor: React.FC = () => {
  const theme = useTheme();
  const [value, setValue] = useState<number>(0);
  const [runnerVersion, setRunnerVersion] = useState<string>('1');

  const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue);
  };

  const handleRunnerVersionChange = (event: SelectChangeEvent<string>): void => {
    setRunnerVersion(event.target.value as string);
  };

  const fizzBuzzCode = `
  for i in range(1, 101):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`;

  return (
    <Box sx={{ marginTop: 2, width: '100%', height: '90vh', overflow: 'hidden' }}>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          borderBottom: 2,
          borderTop: 2,
          borderColor: '#1b3972',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Value Editor Tabs"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor:
                theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.secondary.main,
            },
          }}
        >
          {['Script', 'User inputs'].map((label, index) => (
            <Tab
              key={index}
              label={label}
              {...a11yProps(index)}
              sx={{
                color: theme.palette.primary.contrastText,
                '&.Mui-selected': {
                  color: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.text.primary,
                  backgroundColor: theme.palette.mode === 'light' ? '#3367b4' : theme.palette.action.selected,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ borderBottom: 2, borderColor: '#1b3972', p: 2, backgroundColor: theme.palette.primary.light }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ color: theme.palette.common.white, mr: 2 }}>Runner version</Typography>
          <FormControl
            variant="outlined"
            sx={{
              borderColor: theme.palette.common.white,
            }}
          >
            <Select
              sx={{ color: theme.palette.common.white }}
              id="runner-version"
              value={runnerVersion}
              onChange={handleRunnerVersionChange}
            >
              <MenuItem value={1}>Mantid 6.9.1</MenuItem>
              <MenuItem value={2}>Mantid 6.8.0</MenuItem>
              <MenuItem value={3}>Mantid Imaging 2.8</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: theme.palette.common.white, mr: 2 }}>
            Rerun reduction with selected options
          </Typography>
          <Button variant="contained" color="primary">
            Run
          </Button>
        </Box>
      </Box>
      <TabPanel value={value} index={0}>
        <Editor
          height="100%"
          defaultLanguage="python"
          defaultValue={'# User script \n' + fizzBuzzCode}
          theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'vs-light'}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
          Options for user inputs will appear here soon
        </Typography>
      </TabPanel>
    </Box>
  );
};

export default ValueEditor;
