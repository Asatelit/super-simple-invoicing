import React from 'react';
import { Box, Typography, Button } from '@material-ui/core';

export type UndoButtonProps = {
  message: string;
  onClick: () => void;
};

export const UndoButton = ({ message, onClick }: UndoButtonProps) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" mx={2}>
    <Typography variant="body1" component="span">
      {message}
    </Typography>
    <Button size="small" variant="outlined" onClick={onClick}>
      UNDO
    </Button>
  </Box>
);
