import React from 'react';
import { NavLink } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

export type ListItemLinkProps = {
  to: string;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  icon?: any;
  selected?: boolean;
};

export const ListItemNavLink = ({ icon, primary, secondary, to, selected }: ListItemLinkProps) => {
  const renderNavLink = React.useMemo(
    () => React.forwardRef((linkProps, _) => <NavLink activeClassName={''} to={to} {...linkProps} />),
    [to],
  );

  return (
    <ListItem button selected={selected} component={renderNavLink}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  );
};
