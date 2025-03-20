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

interface SequentialTeamGeneratorProps {
  members: TeamMember[];
}

const SequentialTeamGenerator: React.FC<SequentialTeamGeneratorProps> = ({
  members,
}) => {
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [remainingMembers, setRemainingMembers] = useState<TeamMember[]>([]);
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);

  const startSequentialAllocation = () => {
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
    setRemainingMembers(shuffledMembers);

    // Create empty teams
    const newTeams: Team[] = Array.from({ length: numberOfTeams }, (_, i) => ({
      id: `team-${i + 1}`,
      name: `Team ${i + 1}`,
      members: [],
    }));

    setTeams(newTeams);
    setIsActive(true);
  };

  const allocateNextMember = () => {
    if (remainingMembers.length === 0) {
      setIsActive(false);
      return;
    }

    const nextMember = remainingMembers[0];
    const updatedRemainingMembers = remainingMembers.slice(1);
    setRemainingMembers(updatedRemainingMembers);

    // Find the team with the fewest members
    const teamIndex = teams.reduce(
      (minIndex, team, index, arr) =>
        team.members.length < arr[minIndex].members.length ? index : minIndex,
      0
    );

    const updatedTeams = [...teams];
    updatedTeams[teamIndex].members.push(nextMember);
    setTeams(updatedTeams);

    if (updatedRemainingMembers.length === 0) {
      setIsActive(false);
    }
  };

  const resetAllocation = () => {
    setTeams([]);
    setRemainingMembers([]);
    setIsActive(false);
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
        Sequential Team Generator
      </Typography>

      {!isActive ? (
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
            onClick={startSequentialAllocation}
          >
            Start
          </Button>
        </Box>
      ) : (
        <Box mb={2}>
          <Typography
            variant='body1'
            gutterBottom
          >
            Remaining members: {remainingMembers.length}
          </Typography>
          <Box
            display='flex'
            gap={2}
          >
            <Button
              variant='contained'
              color='primary'
              onClick={allocateNextMember}
              disabled={remainingMembers.length === 0}
            >
              Assign Next Member
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={resetAllocation}
            >
              Reset
            </Button>
          </Box>
        </Box>
      )}

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

export default SequentialTeamGenerator;
