import React, { useState, useCallback } from 'react';
import {
  format,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { formatMoney } from 'accounting';
import { KeyboardDatePicker } from '@material-ui/pickers';
import {
  Container,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Paper,
  Grid,
  Tabs,
  Tab,
  Divider,
} from '@material-ui/core';
import { Common } from 'layouts';
import {
  Customer,
  Invoice,
  SalesByCustomer,
  SalesByItem,
  DateRange,
  DataCollection,
  Item,
  Expense,
  ExpensesReportData,
} from 'types';
import { BreadcrumbsCrumbProp, SalesByItemReport, SalesByCustomerReport, ExpensesReport } from 'components';
import styles from './reports.module.css';

export type ReportsProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  invoices: Invoice[];
  expenses: Expense[];
  customers: DataCollection<Customer>;
  items: DataCollection<Item>;
};

export const Reports: React.FC<ReportsProps> = ({ breadcrumbs, invoices, items, customers, expenses }) => {
  const [tab, setTab] = useState(0);
  const [datePreset, setDatePreset] = useState<
    'Today' | 'This Week' | 'This Month' | 'This Quarter' | 'This Year' | 'Custom'
  >('This Month');
  const [currentDateRange, setCurrentDateRange] = useState<DateRange>({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  const handleChangeDateRange = (range: DateRange) => {
    setDatePreset('Custom');
    setCurrentDateRange(range);
  };

  const handleChangeDatePreset = (preset: string) => {
    const now = new Date();
    switch (preset) {
      case 'Today':
        setDatePreset('Today');
        setCurrentDateRange({ start: startOfDay(now), end: endOfDay(now) });
        break;
      case 'This Week':
        setDatePreset('This Week');
        setCurrentDateRange({ start: startOfWeek(now), end: endOfWeek(now) });
        break;
      case 'This Month':
        setDatePreset('This Month');
        setCurrentDateRange({ start: startOfMonth(now), end: endOfMonth(now) });
        break;
      case 'This Quarter':
        setDatePreset('This Quarter');
        setCurrentDateRange({ start: startOfQuarter(now), end: endOfQuarter(now) });
        break;
      case 'This Year':
        setDatePreset('This Year');
        setCurrentDateRange({ start: startOfYear(now), end: endOfYear(now) });
        break;
      default:
        setDatePreset('Custom');
    }
  };

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
    [items, invoices],
  );

  const getExpenses = useCallback(
    (dateRange: DateRange): ExpensesReportData => {
      const relevantExpenses = expenses.filter((expense) => isWithinInterval(expense.expenseDate, dateRange));
      let data = {};

      relevantExpenses.forEach((expense) => {
        const updProp = data[expense.expenseCategory];
        data = {
          ...data,
          [expense.expenseCategory]: updProp || 0 + expense.amount,
        };
      });

      return {
        data,
        totalExpense: Object.keys(data).reduce((acc, key) => acc + data[key], 0),
      };
    },
    [expenses],
  );

  const renderDateRangeForm = () => (
    <Grid container>
      <FormControl variant="outlined" size="small" fullWidth className="mb-3">
        <InputLabel id="ReportDatePresetLabel">Payment Mode</InputLabel>
        <Select
          id="ReportDatePreset"
          labelId="ReportDatePresetLabel"
          labelWidth={140}
          value={datePreset}
          onChange={(e) => handleChangeDatePreset(e.target.value as string)}
        >
          <MenuItem value="Today">Today</MenuItem>
          <MenuItem value="This Week">This Week</MenuItem>
          <MenuItem value="This Month">This Month</MenuItem>
          <MenuItem value="This Quarter">This Quarter</MenuItem>
          <MenuItem value="This Year">This Year</MenuItem>
          <MenuItem value="Custom">Custom</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth className="mb-3">
        <KeyboardDatePicker
          fullWidth
          id="ReportDateRangeStart"
          size="small"
          inputVariant="outlined"
          label="From Date"
          format="MM/dd/yyyy"
          margin="dense"
          value={currentDateRange.start}
          onChange={(date) => handleChangeDateRange({ ...currentDateRange, start: date || new Date() })}
        />
      </FormControl>
      <FormControl fullWidth className="mb-3">
        <KeyboardDatePicker
          fullWidth
          id="ReportDateRangeEnd"
          size="small"
          inputVariant="outlined"
          label="To Date"
          format="MM/dd/yyyy"
          margin="dense"
          value={currentDateRange.end}
          onChange={(date) => handleChangeDateRange({ ...currentDateRange, end: date || new Date() })}
        />
      </FormControl>
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
          indicatorColor="primary"
        >
          <Tab label="Sales by Customer" />
          <Tab label="Sales by Items" />
          <Tab label="Expenses" />
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
              {tab === 2 && (
                <ExpensesReport
                  formatedDateRange={`${format(currentDateRange.start, 'MM/dd/yyyy')} - ${format(
                    currentDateRange.end,
                    'MM/dd/yyyy',
                  )}`}
                  data={getExpenses(currentDateRange)}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Common>
    </Container>
  );
};
