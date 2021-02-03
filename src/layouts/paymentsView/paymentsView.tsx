import React, { useState, useEffect } from 'react';
import { formatMoney } from 'accounting';
import { toast } from 'react-toastify';
import { useParams, generatePath, useHistory } from 'react-router-dom';
import { Hidden, Grid, Button, Container, List, Paper, Typography } from '@material-ui/core';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp, ListItemNavLink, Payment as PaymentDocument } from 'components';
import { DataCollection, Customer, Payment, Settings } from 'types';
import { Routes } from 'enums';
import styles from './paymentsView.module.css';

export type PaymentsViewProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  customers: DataCollection<Customer>;
  payments: Payment[];
  settings: Settings;
};

export const PaymentsView: React.FC<PaymentsViewProps> = ({ settings, payments, customers }) => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Payment | null>(null);
  const history = useHistory();

  useEffect(() => {
    // Get selected customer
    const payment = payments.find((payment) => payment.id === id);
    if (payment) {
      setData(payment);
    } else {
      toast.error('The requested resource was not found.');
      return history.replace(generatePath(Routes.Admin));
    }
  }, [payments, history, id]);

  const handlers = {
    edit: () => history.push(generatePath(Routes.PaymentsEdit, { id })),
  };

  const renderActions = (
    <>
      <Button variant="outlined" color="primary" className="mr-2" onClick={handlers.edit}>
        Edit
      </Button>
    </>
  );

  if (!data || !id) return null;

  return (
    <Grid container spacing={0} className={styles.root}>
      <Hidden smDown>
        <Grid item md={3} lg={2} className={styles.menu}>
          <List component="nav" dense disablePadding>
            {payments.map((payment) => (
              <ListItemNavLink
                divider
                key={`Payment${payment.id}`}
                to={generatePath(Routes.PaymentsView, { id: payment.id })}
                contentClassName={styles.navLink}
                selected={id === payment.id}
                primary={
                  <>
                    <Typography variant="body2" display="block" noWrap>
                      {customers[payment.customerId].name || 'Customer'}
                    </Typography>
                    <Typography variant="body2" display="block" color="textSecondary" noWrap>
                      {payment.paymentNumber}
                    </Typography>
                  </>
                }
                secondary={
                  <Typography variant="h6" noWrap>
                    {formatMoney(payment.amount)}
                  </Typography>
                }
              />
            ))}
          </List>
        </Grid>
      </Hidden>
      <Grid item sm={12} md={9} lg={10}>
        <Container>
          <Common title={data.paymentNumber} actions={renderActions} />
          <Paper variant="elevation" className={styles.paper}>
            <PaymentDocument payment={data} settings={settings} />
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};
