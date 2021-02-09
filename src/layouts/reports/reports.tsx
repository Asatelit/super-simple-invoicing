import React, { useState, useCallback } from 'react';
import { format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { formatMoney } from 'accounting';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Container, FormGroup, Paper, Grid, Tabs, Tab, Divider } from '@material-ui/core';
import { Common } from 'layouts';
import { Customer, Invoice, SalesByCustomer, SalesByItem, DateRange, DataCollection, Item } from 'types';
import { BreadcrumbsCrumbProp, SalesByItemReport, SalesByCustomerReport } from 'components';
import styles from './reports.module.css';

export type ReportsProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  invoices: Invoice[];
  customers: DataCollection<Customer>;
  items: DataCollection<Item>;
};

export const Reports: React.FC<ReportsProps> = ({ breadcrumbs, invoices, items, customers }) => {
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

  const getSalesByItems = useCallback(
    (dateRange: DateRange): SalesByItem => {
      const relevantInvoices = invoices.filter((invoice) => isWithinInterval(invoice.invoiceDate, dateRange));
      let data = {};

      relevantInvoices.forEach((invoice) => {
        invoice.lineItems.forEach((lineItem) => {
          const itemName = items[lineItem.itemId].name || 'Unnamed Item';
          const updProp = data[itemName];
          data = {
            ...data,
            [itemName]: {
              qty: updProp?.qty || 0 + lineItem.quantity,
              amount: updProp?.amount || 0 + lineItem.total,
            },
          };
        });
      });

      return {
        data,
        totalAmount: Object.keys(data).reduce((acc, key) => acc + data[key].amount, 0),
      };
    },
    [customers, invoices],
  );

  const renderDateRangeForm = () => (
    <Grid container>
      <FormGroup style={{ width: '100%' }}>
        <KeyboardDatePicker
          fullWidth
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
      <FormGroup style={{ width: '100%' }}>
        <KeyboardDatePicker
          fullWidth
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
    <Container maxWidth="xl" className={styles.container}>
      <Common title="Reports" breadcrumbs={breadcrumbs}>
        <Tabs
          value={tab}
          variant="scrollable"
          scrollButtons="auto"
          onChange={(_, index) => setTab(index)}
          aria-label="simple tabs example"
        >
          <Tab label="Sales by Customer" />
          <Tab label="Sales by Items" />
        </Tabs>
        <Divider className="mb-4" />
        <Grid container spacing={4}>
          <Grid item md={4} lg={3}>
            {renderDateRangeForm()}
          </Grid>
          <Grid item md={8} lg={9}>
            <Paper variant="elevation" className={styles.paper}>
              {tab === 0 && (
                <SalesByCustomerReport
                  formatedDateRange={`${format(currentDateRange.start, 'MM/dd/yyyy')} - ${format(
                    currentDateRange.end,
                    'MM/dd/yyyy',
                  )}`}
                  data={getSalesByCustomer(currentDateRange)}
                />
              )}
              {tab === 1 && (
                <SalesByItemReport
                  formatedDateRange={`${format(currentDateRange.start, 'MM/dd/yyyy')} - ${format(
                    currentDateRange.end,
                    'MM/dd/yyyy',
                  )}`}
                  data={getSalesByItems(currentDateRange)}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Common>
    </Container>
  );
};
