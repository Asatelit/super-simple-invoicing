import React from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Grid, Button, Container, List, Paper } from '@material-ui/core';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp, ListItemNavLink } from 'components';
import { MappedInvoice } from 'types';
import { Routes, InvoiceStatus } from 'enums';
import styles from './invoicesView.module.css';

export type InvoicesViewProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  invoices: MappedInvoice[];
};

export const InvoicesView: React.FC<InvoicesViewProps> = ({ breadcrumbs, invoices }) => {
  const { id } = useParams<{ id: string }>();


  const renderActions = (
    <>
      <Button variant="outlined" color="primary" className="mr-2">
        Mark as sent
      </Button>
      <Button variant="contained" color="primary">
        Send Invoice
      </Button>
    </>
  );

  const getColor = (value: InvoiceStatus) =>
    clsx({
      green: value === InvoiceStatus.COMPLETED,
      orange: value === InvoiceStatus.SENT,
      yellowgreen: value === InvoiceStatus.DRAFT,
    });

  if (!id) return null;

  return (
    <Grid container spacing={0} className={styles.root}>
      <Grid item sm={true} md={3} className={styles.menu}>
        <List component="nav" dense disablePadding>
          {invoices.map((invoice) => (
            <ListItemNavLink
              key={`Invoice${invoice.id}`}
              to={Routes.InvoicesView.replace(':id', invoice.id)}
              selected={id === invoice.id}
              primary={invoice.customer?.name || 'Unknown'}
              secondary={
                <>
                  <div>{invoice.invoiceNumber}</div>
                  <div className={styles.chip} style={{ background: getColor(invoice.status) }}>
                    {invoice.status}
                  </div>
                </>
              }
            />
          ))}
        </List>
      </Grid>
      <Grid item sm={12} md={9}>
        <Container>
          <Common title="Invoice" actions={renderActions} />
          <Paper
            variant="elevation"
            style={{
              height: 'calc(100vh - 200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Invoice Preview
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};
