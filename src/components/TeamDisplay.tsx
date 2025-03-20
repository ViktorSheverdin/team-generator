import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
} from '@mui/material';
import { Team } from '../types';

interface TeamDisplayProps {
  teams: Team[];
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ teams }) => {
  if (teams.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, mt: 3 }}
    >
      <Typography
        variant='h6'
        gutterBottom
      >
        Generated Teams
      </Typography>

      <Box
        display='flex'
        flexWrap='wrap'
        justifyContent='space-around'
      >
        {teams.map((team) => (
          <Paper
            key={team.id}
            elevation={2}
            sx={{
              width: { xs: '100%', sm: '45%', md: '30%' },
              m: 1,
              p: 2,
              backgroundColor: '#f5f5f5',
              minHeight: '100px',
            }}
          >
            <Typography
              variant='subtitle1'
              fontWeight='bold'
              color='primary'
            >
              {team.name}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <List dense>
              {team.members.length > 0 ? (
                team.members.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemText primary={member.name} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary='No members' />
                </ListItem>
              )}
            </List>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
};

export default TeamDisplay;
