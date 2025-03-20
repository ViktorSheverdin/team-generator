import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TeamMember } from '../types';

interface TeamMemberListProps {
  members: TeamMember[];
  setMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({
  members,
  setMembers,
}) => {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    if (newMemberName.trim() === '') return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
    };

    setMembers([...members, newMember]);
    setNewMemberName('');
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddMember();
    }
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
        Team Members
      </Typography>

      <Box
        display='flex'
        mb={2}
      >
        <TextField
          fullWidth
          label='Add Team Member'
          variant='outlined'
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddMember}
          sx={{ ml: 1 }}
        >
          Add
        </Button>
      </Box>

      <List>
        {members.map((member) => (
          <ListItem key={member.id}>
            <ListItemText primary={member.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge='end'
                aria-label='delete'
                onClick={() => handleRemoveMember(member.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TeamMemberList;
