import clsx from 'clsx';
import React, { useMemo } from 'react';
import { printComponent } from 'react-print-tool';
import { useParams, generatePath } from 'react-router-dom';
import { formatMoney } from 'accounting';
import { format } from 'date-fns';
import { Grid, Button, Container, List, Typography, Paper } from '@material-ui/core';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp, ListItemNavLink, Invoice } from 'components';
import { DataCollection, MappedInvoice, Settings, Item, AppActions } from 'types';
import { Routes, InvoiceStatus } from 'enums';
import styles from './invoicesView.module.css';

export type InvoicesViewProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  invoices: MappedInvoice[];
  settings: Settings;
  items: DataCollection<Item>;
  actions: AppActions;
};

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  breadcrumbs,
  actions,
  invoices,
  settings,
  items,
}) => {
  const { id } = useParams<{ id: string }>();

  const getColor = (value: InvoiceStatus) =>
    clsx({
      green: value === InvoiceStatus.COMPLETED,
      orange: value === InvoiceStatus.SENT,
      yellowgreen: value === InvoiceStatus.DRAFT,
    });

  const invoice = useMemo(() => invoices.find((element) => element.id === id), [invoices, id]);

  if (!invoice) return null;

  const renderActions = (
    <>
      {!invoice.sent && (
        <Button variant="outlined" color="primary" className="mr-2" onClick={() => handle.markAsSent()}>
          Mark as sent
        </Button>
      )}
      <Button variant="contained" color="primary" onClick={() => handle.print()}>
        Print
      </Button>
    </>
  );

  const handle = {
    print: () => printComponent(<Invoice invoice={invoice} items={items} settings={settings} />),
    markAsSent: () => actions.invoices.markSent([invoice.id]),
  };

  return (
    <Grid container spacing={0} className={styles.root}>
      <Grid item sm={true} md={3} className={styles.menu}>
        <List component="nav" dense disablePadding>
          {invoices.map((invoice) => (
            <ListItemNavLink
              divider
              key={`Invoice${invoice.id}`}
              to={generatePath(Routes.InvoicesView.replace(':id', invoice.id))}
              contentClassName={styles.navLink}
              selected={id === invoice.id}
              primary={
                <>
                  <Typography variant="body2" display="block" noWrap>
                    {invoice.customer?.name || 'Customer'}
                  </Typography>
                  <Typography variant="body2" display="block" color="textSecondary" noWrap>
                    {invoice.invoiceNumber}
                  </Typography>
                  <span className={styles.chip} style={{ background: getColor(invoice.status) }}>
                    {invoice.status}
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
                    {formatMoney(invoice.total)}
                  </Typography>
                  {invoice.dueDate && (
                    <Typography
                      variant="body2"
                      variantMapping={{ body2: 'span' }}
                      display="block"
                      align="right"
                      color="textSecondary"
                      noWrap
                    >
                      {format(invoice.dueDate, 'MM/dd/yyyy')}
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
          <Common title="Invoice" actions={renderActions} />
          <Paper
            variant="elevation"
            style={{
              height: 'calc(100vh - 200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              justifyContent: 'start',
              overflow: 'auto',
              padding: '48px',
            }}
          >
            <Invoice invoice={invoice} items={items} settings={settings} />
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};
