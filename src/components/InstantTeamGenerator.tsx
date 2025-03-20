import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { TeamMember, Team } from '../types';
import TeamDisplay from './TeamDisplay';

interface InstantTeamGeneratorProps {
  members: TeamMember[];
}

const InstantTeamGenerator: React.FC<InstantTeamGeneratorProps> = ({
  members,
}) => {
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState('');

  const generateTeams = () => {
    if (members.length === 0) {
      setError('Please add team members first');
      return;
    }

    if (numberOfTeams <= 0) {
      setError('Number of teams must be at least 1');
      return;
    }

    if (numberOfTeams > members.length) {
      setError('Number of teams cannot exceed number of members');
      return;
    }

    setError('');

    // Shuffle members
    const shuffledMembers = [...members].sort(() => Math.random() - 0.5);

    // Create empty teams
    const newTeams: Team[] = Array.from({ length: numberOfTeams }, (_, i) => ({
      id: `team-${i + 1}`,
      name: `Team ${i + 1}`,
      members: [],
    }));

    // Distribute members evenly
    shuffledMembers.forEach((member, index) => {
      const teamIndex = index % numberOfTeams;
      newTeams[teamIndex].members.push(member);
    });

    setTeams(newTeams);
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, mb: 3 }}
    >
      <Typography
        variant='h6'
        gutterBottom
      >
        Instant Team Generator
      </Typography>

      <Box
        display='flex'
        alignItems='center'
        mb={2}
      >
        <TextField
          label='Number of Teams'
          type='number'
          InputProps={{ inputProps: { min: 1 } }}
          value={numberOfTeams}
          onChange={(e) => setNumberOfTeams(parseInt(e.target.value) || 0)}
          sx={{ width: '150px', mr: 2 }}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={generateTeams}
        >
          Generate Teams
        </Button>
      </Box>

      {error && (
        <Alert
          severity='error'
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <TeamDisplay teams={teams} />
    </Paper>
  );
};

export default InstantTeamGenerator;
