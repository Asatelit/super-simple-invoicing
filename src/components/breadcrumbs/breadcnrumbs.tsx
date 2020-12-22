import React from 'react';
import { Breadcrumbs as MaterialBreadcrumbs, Link, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

export type BreadcrumbsCrumbProp = {
  name: string;
  path: string;
};

export type BreadcrumbsProps = {
  crumbs: BreadcrumbsCrumbProp[];
  className?: string;
};

export const Breadcrumbs = ({ crumbs, className }: BreadcrumbsProps) => {
  // Don't render a single breadcrumb.
  if (crumbs.length <= 1) return null;

  const LinkRouter = (props: any) => <Link {...props} component={RouterLink} />;

  return (
    <MaterialBreadcrumbs className={className} aria-label="breadcrumb">
      {/* Link back to any previous steps of the breadcrumb. */}
      {crumbs.map(({ name, path }, key) =>
        key + 1 === crumbs.length ? (
          <Typography color="textPrimary" key="key">
            {name}
          </Typography>
        ) : (
          <LinkRouter color="inherit" to={path} key={key}>
            {name}
          </LinkRouter>
        ),
      )}
    </MaterialBreadcrumbs>
  );
};
