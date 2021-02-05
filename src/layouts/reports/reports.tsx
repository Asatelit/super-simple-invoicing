import React, { useState, useCallback } from 'react';
import { format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { formatMoney } from 'accounting';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Container, FormGroup, Paper, Grid, Tabs, Tab } from '@material-ui/core';
import { Common } from 'layouts';
import { Customer, Invoice, SalesByCustomer, DateRange, DataCollection } from 'types';
import { BreadcrumbsCrumbProp, SalesCustomerReport } from 'components';
import styles from './reports.module.css';

export type ReportsProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  invoices: Invoice[];
  customers: DataCollection<Customer>;
};

export const Reports: React.FC<ReportsProps> = ({ breadcrumbs, invoices, customers }) => {
  const [tab, setTab] = useState(0);
  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  const getSalesByCustomer = useCallback(
    (dateRange: DateRange): SalesByCustomer => {
      const relevantInvoices = invoices.filter((invoice) => isWithinInterval(invoice.invoiceDate, dateRange));
      let data = {};

      relevantInvoices.forEach((invoice) => {
        const customerName = invoice.customerId ? customers[invoice.customerId].name : 'Uncategorized';
        const result = {
          date: format(invoice.invoiceDate, 'MM/dd/yyyy'),
          number: invoice.invoiceNumber,
          amount: formatMoney(invoice.total),
        };
        if (!data[customerName]) data = { ...data, [customerName]: [] };
        data[customerName].push(result);
      });

      return {
        data,
        totalAmount: formatMoney(relevantInvoices.reduce((acc, invoice) => acc + invoice.total, 0)),
      };
    },
    [customers, invoices],
  );

  const renderDateRangeForm = () => (
    <Grid container justify="space-around">
      <FormGroup>
        <KeyboardDatePicker
          id="ReportDateRangeStart"
          size="small"
          inputVariant="outlined"
          label="From Date"
          format="MM/dd/yyyy"
          margin="dense"
          value={currentDateRange.start}
          onChange={(date) => setCurrentDateRange({ ...currentDateRange, start: date || new Date() })}
        />
      </FormGroup>
      <FormGroup>
        <KeyboardDatePicker
          id="ReportDateRangeEnd"
          size="small"
          inputVariant="outlined"
          label="To Date"
          format="MM/dd/yyyy"
          margin="dense"
          value={currentDateRange.end}
          onChange={(date) => setCurrentDateRange({ ...currentDateRange, end: date || new Date() })}
        />
      </FormGroup>
    </Grid>
  );

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="Reports" breadcrumbs={breadcrumbs}>
        <Tabs
          value={tab}
          variant="scrollable"
          scrollButtons="auto"
          onChange={(_, index) => setTab(index)}
          aria-label="simple tabs example"
          className={styles.tabs}
        >
          <Tab label="Sales" />
        </Tabs>
        <Grid container spacing={4}>
          <Grid item md={4} lg={3}>
            {renderDateRangeForm()}
          </Grid>
          <Grid item md={8} lg={9}>
            <Paper variant="elevation" className={styles.paper}>
              {tab === 0 && (
                <SalesCustomerReport
                  formatedDateRange={`${format(currentDateRange.start, 'MM/dd/yyyy')} - ${format(
                    currentDateRange.end,
                    'MM/dd/yyyy',
                  )}`}
                  data={getSalesByCustomer(currentDateRange)}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Common>
    </Container>
  );
};
