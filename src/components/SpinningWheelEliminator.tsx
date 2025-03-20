import React, { useState, useEffect, useRef } from 'react';
import { TextField } from '@mui/material';

import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { TeamMember, Team } from '../types';
import TeamDisplay from './TeamDisplay';

interface SpinningWheelEliminatorProps {
  members: TeamMember[];
}

const SpinningWheelEliminator: React.FC<SpinningWheelEliminatorProps> = ({
  members,
}) => {
  const [remainingMembers, setRemainingMembers] = useState<TeamMember[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);
  const animationFrameRef = useRef<number>(0);
  const [teamCount, setTeamCount] = useState(2);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startElimination = () => {
    if (members.length === 0) {
      setError('Please add team members first');
      return;
    }

    if (teamCount <= 0 || teamCount > members.length) {
      setError('Invalid number of teams');
      return;
    }

    setError('');

    // Shuffle members
    const shuffledMembers = [...members].sort(() => Math.random() - 0.5);
    setRemainingMembers(shuffledMembers);

    // Create empty teams
    const newTeams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
      id: `team-${i + 1}`,
      name: `Team ${i + 1}`,
      members: [],
    }));

    setTeams(newTeams);
    setIsActive(true);
  };

  const spinWheel = () => {
    if (remainingMembers.length === 0) {
      setIsActive(false);
      return;
    }

    setIsSpinning(true);
    setSelectedMember(null);

    // Random spin duration between 2-4 seconds
    const duration = 200 + Math.random() * 200;

    let startTime: number;
    let lastIndex = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Gradually slow down the spinning
      const spinSpeed = Math.max(50, 300 - (elapsed / duration) * 300);

      if (timestamp - lastIndex > spinSpeed) {
        lastIndex = timestamp;
        setSelectedMember(
          remainingMembers[Math.floor(Math.random() * remainingMembers.length)]
        );
      }

      if (elapsed < duration) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        finishSpin();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const finishSpin = () => {
    setIsSpinning(false);

    if (remainingMembers.length === 0) return;

    // Randomly select a member
    const randomIndex = Math.floor(Math.random() * remainingMembers.length);
    const selectedMember = remainingMembers[randomIndex];
    setSelectedMember(selectedMember);

    // Remove member from remaining list
    const updatedRemainingMembers = [...remainingMembers];
    updatedRemainingMembers.splice(randomIndex, 1);
    setRemainingMembers(updatedRemainingMembers);

    // Add member to the team with fewest members
    const teamIndex = teams.reduce(
      (minIndex, team, index, arr) =>
        team.members.length < arr[minIndex].members.length ? index : minIndex,
      0
    );

    const updatedTeams = [...teams];
    updatedTeams[teamIndex].members.push(selectedMember);
    setTeams(updatedTeams);

    if (updatedRemainingMembers.length === 0) {
      setIsActive(false);
    }
  };

  const resetElimination = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setTeams([]);
    setRemainingMembers([]);
    setIsActive(false);
    setIsSpinning(false);
    setSelectedMember(null);
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
        Spinning Wheel Eliminator
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
            value={teamCount}
            onChange={(e) => setTeamCount(parseInt(e.target.value) || 0)}
            sx={{ width: '150px', mr: 2 }}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={startElimination}
          >
            Start
          </Button>
        </Box>
      ) : (
        <Box mb={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
              p: 3,
              border: '1px dashed #ccc',
              borderRadius: 2,
              position: 'relative',
              minHeight: '100px',
            }}
          >
            {isSpinning ? (
              <>
                <CircularProgress size={60} />
                <Typography
                  variant='h6'
                  sx={{ mt: 2 }}
                >
                  Spinning...
                </Typography>
              </>
            ) : selectedMember ? (
              <Box textAlign='center'>
                <Typography
                  variant='h4'
                  color='primary'
                  sx={{ mb: 1 }}
                >
                  {selectedMember.name}
                </Typography>
                <Typography variant='body1'>has been selected</Typography>
              </Box>
            ) : (
              <Typography variant='body1'>
                Click Spin to select a member
              </Typography>
            )}
          </Box>

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
              onClick={spinWheel}
              disabled={isSpinning || remainingMembers.length === 0}
            >
              Spin
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={resetElimination}
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
export default SpinningWheelEliminator;
