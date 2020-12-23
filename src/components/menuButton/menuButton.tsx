import React from 'react';
import { IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

export type MenuButtonProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export const MenuButton = ({ onClick }: MenuButtonProps) => (
  <div>
    <IconButton
      size="small"
      aria-label="more"
      aria-controls="long-menu"
      aria-haspopup="true"
      onClick={(e) => onClick(e)}
    >
      <MoreVert />
    </IconButton>
  </div>
);
