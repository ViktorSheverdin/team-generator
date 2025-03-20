import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  CssBaseline,
  AppBar,
  Toolbar,
  Divider,
  useMediaQuery,
  ThemeProvider,
} from '@mui/material';
import { theme } from './styles';
import { TeamMember } from './types';
import TeamMemberList from './components/TeamMemberList';
import InstantTeamGenerator from './components/InstantTeamGenerator';
import SequentialTeamGenerator from './components/SequentialTeamGenerator';
import SpinningWheelEliminator from './components/SpinningWheelEliminator';
import GroupsIcon from '@mui/icons-material/Groups';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const App: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position='static'>
        <Toolbar>
          <GroupsIcon sx={{ mr: 2 }} />
          <Typography
            variant='h6'
            component='div'
          >
            Team Generator
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth='lg'>
        <Box sx={{ my: 4 }}>
          <TeamMemberList
            members={members}
            setMembers={setMembers}
          />

          <Divider sx={{ my: 3 }} />

          <Typography
            variant='h5'
            gutterBottom
          >
            Team Generation Methods
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label='team generation methods'
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons={isMobile ? 'auto' : undefined}
            >
              <Tab
                label='Instant Split'
                {...a11yProps(0)}
              />
              <Tab
                label='Sequential'
                {...a11yProps(1)}
              />
              <Tab
                label='Spinning Wheel'
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>

          <TabPanel
            value={tabValue}
            index={0}
          >
            <InstantTeamGenerator members={members} />
          </TabPanel>
          <TabPanel
            value={tabValue}
            index={1}
          >
            <SequentialTeamGenerator members={members} />
          </TabPanel>
          <TabPanel
            value={tabValue}
            index={2}
          >
            <SpinningWheelEliminator members={members} />
          </TabPanel>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
