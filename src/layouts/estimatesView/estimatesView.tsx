import clsx from 'clsx';
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { formatMoney } from 'accounting';
import { useParams, generatePath, Link as RouterLink } from 'react-router-dom';
import { Grid, Button, Container, List, Typography } from '@material-ui/core';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp, ListItemNavLink, Estimate } from 'components';
import { MappedEstimate, Item, Settings, DataCollection } from 'types';
import { Routes, EstimateStatus } from 'enums';
import styles from './estimatesView.module.css';

export type EstimatesViewProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  estimates: MappedEstimate[];
  settings: Settings;
  items: DataCollection<Item>;
};

export const EstimatesView: React.FC<EstimatesViewProps> = ({ breadcrumbs, estimates, settings, items }) => {
  const { id } = useParams<{ id: string }>();

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

  const getColor = (value: EstimateStatus) =>
    clsx({
      green: value === EstimateStatus.ACCEPTED,
      orange: value === EstimateStatus.SENT,
      yellowgreen: value === EstimateStatus.DRAFT,
    });

  const estimate = useMemo(() => estimates.find((element) => element.id === id), [estimates, id]);

  if (!estimate) return null;

  return (
    <Grid container spacing={0} className={styles.root}>
      <Grid item sm={true} md={3} className={styles.menu}>
        <List component="nav" dense disablePadding>
          {estimates.map((estimate) => (
            <ListItemNavLink
              divider
              key={`Estimate${estimate.id}`}
              to={generatePath(Routes.EstimatesView, { id: estimate.id })}
              contentClassName={styles.navLink}
              selected={id === estimate.id}
              primary={
                <>
                  <Typography variant="body2" display="block" noWrap>
                    {estimate.customer?.name || 'Customer'}
                  </Typography>
                  <Typography variant="body2" display="block" color="textSecondary" noWrap>
                    {estimate.estimateNumber}
                  </Typography>
                  <span className={styles.chip} style={{ background: getColor(estimate.status) }}>
                    {estimate.status}
                  </span>
                </>
              }
              secondary={
                <>
                  <Typography
                    variant="h6"
                    variantMapping={{ h6: 'span' }}
                    display="block"
                    align="right"
                    noWrap
                  >
                    {formatMoney(estimate.total)}
                  </Typography>
                  {estimate.expiryDate && (
                    <Typography
                      variant="body2"
                      variantMapping={{ body2: 'span' }}
                      display="block"
                      align="right"
                      color="textSecondary"
                      noWrap
                    >
                      {format(estimate.expiryDate, 'MM/dd/yyyy')}
                    </Typography>
                  )}
                </>
              }
            />
          ))}
        </List>
      </Grid>
      <Grid item sm={12} md={9}>
        <Container>
          <Common title="Estimate" actions={renderActions} />
          <Estimate estimate={estimate} items={items} settings={settings} />
        </Container>
      </Grid>
    </Grid>
  );
};
