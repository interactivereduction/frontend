// React components
import React, { useState } from 'react';

// Material UI components
import { Box, Tabs, Tab, Typography, Button, useTheme } from '@mui/material';

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

  const handleRunnerVersionChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setRunnerVersion(event.target.value);
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
    <Box sx={{ width: '100%', height: '90vh', overflow: 'hidden' }}>
      <Box sx={{ p: 2, backgroundColor: theme.palette.background.default }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color: theme.palette.text.primary, mr: 2 }}>Runner version:</Typography>
            <select
              value={runnerVersion}
              onChange={handleRunnerVersionChange}
              style={{
                color: theme.palette.primary.contrastText,
                backgroundColor: theme.palette.primary.main,
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              <option value="1">Mantid 6.9.1</option>
              <option value="2">Mantid 6.8.0</option>
              <option value="3">Mantid Imaging 2.8</option>
            </select>
          </Box>
          <Button variant="contained" color="primary">
            Rerun with changes
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          borderTop: 3,
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Value Editor Tabs"
          color="primary"
          sx={{
            '& .MuiTab-root': {
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : undefined,

              '&.Mui-selected': {
                color: theme.palette.mode === 'dark' ? theme.palette.common.white : undefined,
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[500] : undefined,
              },
            },
          }}
        >
          {['Script', 'User inputs'].map((label, index) => (
            <Tab key={index} label={label} {...a11yProps(index)} />
          ))}
        </Tabs>
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
