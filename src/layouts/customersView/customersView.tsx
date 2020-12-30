import React, { useState, useEffect } from 'react';
import { formatMoney } from 'accounting';
import { toast } from 'react-toastify';
import { useParams, generatePath, useHistory } from 'react-router-dom';
import { Hidden, Grid, Button, Container, List, Paper, Typography } from '@material-ui/core';
import { FlexChart, FlexChartLegend, FlexChartSeries } from '@grapecity/wijmo.react.chart';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp, ListItemNavLink } from 'components';
import { MappedCustomer } from 'types';
import { Routes } from 'enums';
import styles from './customersView.module.css';

export type CustomersViewProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  customers: MappedCustomer[];
};

export const CustomersView: React.FC<CustomersViewProps> = ({ breadcrumbs, customers }) => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MappedCustomer | null>(null);
  const history = useHistory();

  useEffect(() => {
    // Get selected customer
    const customer = customers.find((customer) => customer.id === id);
    if (customer) {
      setData(customer);
    } else {
      toast.error('The requested resource was not found.');
      return history.replace(generatePath(Routes.Admin));
    }
  }, [customers, history, id]);

  const handlers = {
    edit: () => history.push(generatePath(Routes.CustomersEdit, { id })),
  };

  const renderActions = (
    <>
      <Button variant="outlined" color="primary" className="mr-2" onClick={handlers.edit}>
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

  if (!data || !id) return null;

  return (
    <Grid container spacing={0} className={styles.root}>
      <Hidden smDown>
        <Grid item md={3} lg={2} className={styles.menu}>
          <List component="nav" dense disablePadding>
            {customers.map((customer) => (
              <ListItemNavLink
                divider
                key={`Customer${customer.id}`}
                to={generatePath(Routes.CustomersView, { id: customer.id })}
                contentClassName={styles.navLink}
                selected={id === customer.id}
                primary={
                  <>
                    <Typography variant="body2" display="block" noWrap>
                      {customer.name || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" display="block" color="textSecondary" noWrap>
                      {customer.contactName}
                    </Typography>
                  </>
                }
                secondary={
                  <Typography variant="h6" noWrap>{formatMoney(customer.summary.overall.sales)}</Typography>
                }
              />
            ))}
          </List>
        </Grid>
      </Hidden>
      <Grid item sm={12} md={9} lg={10}>
        <Container>
          <Common title={data.name} actions={renderActions} />
          <Paper
            variant="elevation"
            style={{
              height: 'calc(100vh - 200px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
            }}
          >
            <Typography variant="h5" color="textSecondary" className="mb-4">
              Sales & Expenses
            </Typography>
            <Grid container spacing={3} className="mb-4">
              <Grid item sm={12} lg={10}>
                <FlexChart itemsSource={data.summary.monthly} bindingX="month" chartType="Line">
                  <FlexChartLegend position="None" />
                  <FlexChartSeries binding="sales" name="Sales" />
                  <FlexChartSeries binding="receipts" name="Receipts" />
                  <FlexChartSeries binding="expenses" name="Expenses" />
                  <FlexChartSeries binding="netIncome" name="Net Income" />
                </FlexChart>
              </Grid>
              <Grid item sm={12} lg={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3} lg={12}>
                    <div className="mb-4">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        display="block"
                        className="mb-1"
                        align="right"
                      >
                        Sales
                      </Typography>
                      <Typography variant="h5" display="block" align="right">
                        {formatMoney(data.summary.overall.sales)}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={12}>
                    <div className="mb-4">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        display="block"
                        className="mb-1"
                        align="right"
                      >
                        Receipts
                      </Typography>
                      <Typography variant="h5" display="block" align="right">
                        {formatMoney(data.summary.overall.sales)}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={12}>
                    <div className="mb-4">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        display="block"
                        className="mb-1"
                        align="right"
                      >
                        Expenses
                      </Typography>
                      <Typography variant="h5" display="block" align="right">
                        {formatMoney(data.summary.overall.sales)}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={12}>
                    <div className="mb-4">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        display="block"
                        className="mb-1"
                        align="right"
                      >
                        Net Income
                      </Typography>
                      <Typography variant="h5" display="block" align="right">
                        {formatMoney(data.summary.overall.sales)}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Typography variant="h5" color="textSecondary" className="mb-4">
              Basic Info
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="textSecondary" display="block">
                  Display Name
                </Typography>
                <Typography variant="body1" display="block">
                  {data.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="textSecondary" display="block">
                  Primary Contact Name
                </Typography>
                <Typography variant="body1" display="block">
                  {data.contactName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="textSecondary" display="block">
                  Email
                </Typography>
                <Typography variant="body1" display="block">
                  {data.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="textSecondary" display="block">
                  Currency
                </Typography>
                <Typography variant="body1" display="block">
                  {data.currencySymbol}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="textSecondary" display="block">
                  Phone Number
                </Typography>
                <Typography variant="body1" display="block">
                  {data.phone}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="textSecondary" display="block">
                  Website
                </Typography>
                <Typography variant="body1" display="block">
                  {data.website}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};
