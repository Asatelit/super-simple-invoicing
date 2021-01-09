import React from 'react';
import { useParams, generatePath, Link as RouterLink } from 'react-router-dom';
import { Grid, Button, Container, List, Paper } from '@material-ui/core';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp, ListItemNavLink } from 'components';
import { MappedEstimate } from 'types';
import { Routes } from 'enums';
import styles from './estimatesView.module.css';

export type EstimatesViewProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  estimates: MappedEstimate[];
};

export const EstimatesView: React.FC<EstimatesViewProps> = ({ breadcrumbs, estimates }) => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  const renderActions = (
    <>
      <Button
        variant="outlined"
        color="primary"
        className="mr-2"
        component={RouterLink}
        to={generatePath(Routes.EstimatesEdit, { id })}
      >
        Edit
      </Button>
      <Button variant="contained" color="primary" className="mr-2">
        New Transaction
      </Button>
      <Button variant="contained" color="secondary">
        Delete
      </Button>
    </>
  );

  return (
    <Grid container spacing={0} className={styles.root}>
      <Grid item sm={true} md={3} className={styles.menu}>
        <List component="nav" dense disablePadding>
          {estimates.map((estimate) => (
            <ListItemNavLink
              key={`Estimate${estimate.id}`}
              to={generatePath(Routes.EstimatesView, { id: estimate.id })}
              selected={id === estimate.id}
              primary={estimate.customer?.name || 'Unknown'}
              secondary={
                <>
                  <span className={styles.number}>{estimate.total}</span>
                  <span className={styles.chip}>{estimate.status}</span>
                </>
              }
            />
          ))}
        </List>
      </Grid>
      <Grid item sm={12} md={9}>
        <Container>
          <Common title="Estimate" actions={renderActions} />
          <Paper
            variant="elevation"
            style={{
              height: 'calc(100vh - 200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Customer Preview
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};
