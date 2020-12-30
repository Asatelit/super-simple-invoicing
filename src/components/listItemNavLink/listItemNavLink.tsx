import React from 'react';
import { NavLink } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

export type ListItemLinkProps = {
  activeClassName?: string;
  contentClassName?: string;
  divider?: boolean;
  icon?: any;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  selected?: boolean;
  to: string;
};

export const ListItemNavLink = ({
  icon,
  primary,
  secondary,
  to,
  selected,
  divider = false,
  activeClassName = '',
  contentClassName = '',
}: ListItemLinkProps) => {
  const renderNavLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, _) => (
        <NavLink activeClassName={activeClassName} to={to} {...linkProps} />
      )),
    [to, activeClassName],
  );

  return (
    <ListItem button selected={selected} component={renderNavLink} divider={divider}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} secondary={secondary} className={contentClassName} />
    </ListItem>
  );
};
