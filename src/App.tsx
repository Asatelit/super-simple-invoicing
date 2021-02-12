import React, { Fragment, ReactElement, useContext, useEffect, useCallback, useMemo } from 'react';
import { Switch as SwitchRoute, Route, Redirect, useHistory } from 'react-router-dom';
import {
  eachMonthOfInterval,
  isWithinInterval,
  startOfYear,
  startOfMonth,
  endOfYear,
  endOfMonth,
  format,
} from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import clsx from 'clsx';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
  AppBar,
  Box,
  CssBaseline,
  Dialog,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ThemeProvider,
  Toolbar,
  Menu,
  MenuItem,
  createMuiTheme,
} from '@material-ui/core';
import { Brightness7, Brightness4 } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { appContext } from './hooks';
import { navItems, SearchResults } from './components';
import { Routes } from './enums';
import { flatten } from './utils';
import { themeOptions } from './theme';
import {
  MappedInvoice,
  MappedCustomer,
  MappedEstimate,
  Customer,
  DateRange,
  DataCollection,
  Item,
} from './types';
import * as L from './layouts';
import * as D from './dialogs';
import styles from './app.module.css';

const root = document.querySelector(':root') as any;

interface MappedData {
  invoices: MappedInvoice[];
  customers: MappedCustomer[];
  estimates: MappedEstimate[];
}

function App() {
  const [open, setOpen] = React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [context, actions] = useContext(appContext);
  const history = useHistory();

  const { customers, estimates, items, invoices, settings, payments, expenses, taxes } = context;

  // Generate a theme base on the options received.
  // Users might have specified a preference for a light or dark theme.
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        ...themeOptions,
        palette: { ...themeOptions.palette, type: isDarkMode ? 'dark' : 'light' },
      }),
    [isDarkMode],
  );

  const getCustomersById = useCallback(
    (id: string | null) => customers.find((customer) => customer.id === id),
    [customers],
  );

  const mapped: MappedData = {
    invoices: useMemo(
      () => invoices.map((data) => ({ ...data, customer: getCustomersById(data.customerId) })),
      [invoices, getCustomersById],
    ),
    estimates: useMemo(
      () => estimates.map((data) => ({ ...data, customer: getCustomersById(data.customerId) })),
      [estimates, getCustomersById],
    ),
    customers: useMemo(
      () =>
        customers.map((customer) => {
          const currentDate = new Date();
          const months = eachMonthOfInterval({
            start: startOfYear(currentDate),
            end: endOfYear(currentDate),
          });

          const getOverallData = ({ start, end }: DateRange) => {
            const relevantInvoices = invoices.filter(
              (invoice) =>
                invoice.customerId === customer.id && isWithinInterval(invoice.invoiceDate, { start, end }),
            );
            const relevantPayments = payments.filter(
              (payment) =>
                payment.customerId === customer.id && isWithinInterval(payment.paymentDate, { start, end }),
            );
            const relevantExpenses = expenses.filter(
              (expense) =>
                expense.customerId === customer.id && isWithinInterval(expense.expenseDate, { start, end }),
            );

            const overalSales = relevantInvoices.reduce((a, b) => a + (b['total'] || 0), 0);
            const overallReceipts = relevantPayments.reduce((a, b) => a + (b['amount'] || 0), 0);
            const overallExpenses = relevantExpenses.reduce((a, b) => a + (b['amount'] || 0), 0);
            const overalNetIncome = overallReceipts - overallExpenses;

            return {
              sales: overalSales,
              receipts: overallReceipts,
              expenses: overallExpenses,
              netIncome: overalNetIncome,
            };
          };

          return {
            ...customer,
            summary: {
              overall: {
                ...getOverallData({ start: startOfYear(currentDate), end: endOfYear(currentDate) }),
              },
              monthly: months.map((month) => ({
                ...getOverallData({ start: startOfMonth(month), end: endOfMonth(month) }),
                month: format(month, 'MMM'),
              })),
            },
          };
        }),
      [customers, expenses, invoices, payments],
    ),
  };

  const summary = useMemo(() => {
    const currentDate = new Date();
    const months = eachMonthOfInterval({
      start: startOfYear(currentDate),
      end: endOfYear(currentDate),
    });

    const getOverallData = ({ start, end }: DateRange) => {
      const relevantInvoices = invoices.filter((invoice) =>
        isWithinInterval(invoice.invoiceDate, { start, end }),
      );
      const relevantPayments = payments.filter((payment) =>
        isWithinInterval(payment.paymentDate, { start, end }),
      );
      const relevantExpenses = expenses.filter((expense) =>
        isWithinInterval(expense.expenseDate, { start, end }),
      );

      const overalSales = relevantInvoices.reduce((a, b) => a + (b['total'] || 0), 0);
      const overallReceipts = relevantPayments.reduce((a, b) => a + (b['amount'] || 0), 0);
      const overallExpenses = relevantExpenses.reduce((a, b) => a + (b['amount'] || 0), 0);
      const overalNetIncome = overallReceipts - overallExpenses;

      return {
        sales: overalSales,
        receipts: overallReceipts,
        expenses: overallExpenses,
        netIncome: overalNetIncome,
      };
    };

    return {
      overall: { ...getOverallData({ start: startOfYear(currentDate), end: endOfYear(currentDate) }) },
      monthly: months.map((month) => ({
        ...getOverallData({ start: startOfMonth(month), end: endOfMonth(month) }),
        month: format(month, 'MMM'),
      })),
    };
  }, [expenses, invoices, payments]);

  // Convert array of object to single object.
  const dataCollections = {
    items: useMemo(
      (): DataCollection<Item> =>
        items.reduce((obj, item) => {
          obj[item['id']] = item;
          return obj;
        }, {}),
      [items],
    ),
    customers: useMemo(
      (): DataCollection<Customer> =>
        customers.reduce((obj, item) => {
          obj[item['id']] = item;
          return obj;
        }, {}),
      [customers],
    ),
  };

  // Transpose Material UI palette to CSS variables.
  useEffect(() => {
    if (!root?.style) return;
    Object.keys(flatten(theme.palette)).forEach((key) =>
      root.style.setProperty(`--${key.replaceAll('.', '-')}`, flatten(theme.palette)[key]),
    );
  }, [theme.palette]);

  // Handlers
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Dialogs
  // prettier-ignore
  const dialogRoutes = [
    { path: Routes.SettingsTaxAdd, name: 'Add Tax',  c: <D.TaxEditDialog actions={actions} /> },
    { path: Routes.SettingsTaxEdit, name: 'Edit Tax', c: <D.TaxEditDialog actions={actions} taxes={taxes} /> },
  ];

  // Layouts
  // prettier-ignore
  const layoutRoutes = [
    { path: Routes.Admin, name: 'Admin', c: <></> },
    { path: Routes.Dashboard, name: 'Dashboard', c: <L.Dashboard actions={actions} invoices={invoices} estimates={estimates} customers={customers} summary={summary} /> },
    { path: Routes.CustomersList, name: 'Customers', c: <L.CustomersList actions={actions} customers={mapped.customers} /> },
    { path: Routes.CustomersCreate, name: 'New Customer', c: <L.CustomersEditor actions={actions} /> },
    { path: Routes.CustomersEdit, name: 'Edit Customer', c: <L.CustomersEditor actions={actions} customers={customers} /> },
    { path: Routes.CustomersView, name: 'Customers', c: <L.CustomersView customers={mapped.customers} /> },
    { path: Routes.ItemsList, name: 'Items', c: <L.ItemsList actions={actions} items={items} /> },
    { path: Routes.ItemsEdit, name: 'Edit Item', c: <L.ItemsEditor actions={actions} items={items} taxes={taxes} taxPerItem={settings.taxPerItem} /> },
    { path: Routes.ItemsCreate, name: 'New Item', c: <L.ItemsEditor actions={actions} taxes={taxes} taxPerItem={settings.taxPerItem} /> },
    { path: Routes.EstimatesList, name: 'Estimates', c: <L.EstimatesList actions={actions} estimates={estimates} customers={customers} /> },
    { path: Routes.EstimatesView, name: 'Estimates', c: <L.EstimatesView actions={actions} estimates={mapped.estimates} items={dataCollections.items} settings={settings} /> },
    { path: Routes.EstimatesEdit, name: 'Edit Estimate', c: <L.EstimatesEditor actions={actions} estimates={mapped.estimates} items={items} customers={customers} taxes={taxes} taxPerItem={settings.taxPerItem}/> },
    { path: Routes.EstimatesCreate, name: 'New Estimate', c: <L.EstimatesEditor actions={actions} items={items} customers={customers} taxes={taxes} taxPerItem={settings.taxPerItem} /> },
    { path: Routes.InvoicesList, name: 'Invoices', c: <L.InvoicesList actions={actions} invoices={invoices} customers={customers} /> },
    { path: Routes.InvoicesEdit, name: 'Edit Invoice', c: <L.InvoicesEditor actions={actions} invoices={mapped.invoices} items={items} customers={customers} taxes={taxes} taxPerItem={settings.taxPerItem}/> },
    { path: Routes.InvoicesCreate, name: 'New Invoice', c: <L.InvoicesEditor actions={actions} items={items} customers={customers} taxes={taxes} taxPerItem={settings.taxPerItem}/> },
    { path: Routes.InvoicesView, name: 'Invoices', c: <L.InvoicesView actions={actions} invoices={mapped.invoices} items={dataCollections.items} settings={settings} /> },
    { path: Routes.PaymentsList, name: 'Payments', c: <L.PaymentsList actions={actions} payments={payments} customers={customers} /> },
    { path: Routes.PaymentsCreate, name: 'Payments', c: <L.PaymentsEditor actions={actions} payments={payments} customers={customers} invoices={invoices} settings={settings} /> },
    { path: Routes.PaymentsEdit, name: 'Payments', c: <L.PaymentsEditor actions={actions} payments={payments} customers={customers} invoices={invoices} settings={settings} /> },
    { path: Routes.PaymentsView, name: 'Payments', c: <L.PaymentsView customers={dataCollections.customers} payments={payments} settings={settings} /> },
    { path: Routes.ExpensesList, name: 'Expenses', c: <L.ExpensesList actions={actions} expenses={expenses} customers={customers} /> },
    { path: Routes.ExpensesCreate, name: 'Expenses', c: <L.ExpensesEditor actions={actions} expenses={expenses} customers={customers} settings={settings} /> },
    { path: Routes.ExpensesEdit, name: 'Expenses', c: <L.ExpensesEditor actions={actions} expenses={expenses} customers={customers} settings={settings} /> },
    { path: Routes.Reports, name: 'Reports', c: <L.Reports invoices={invoices} customers={dataCollections.customers} items={dataCollections.items} expenses={expenses} /> },
    { path: Routes.Settings, name: 'Settings', exact: false, c: <L.Settings actions={actions} settings={settings} taxes={taxes} /> },
  ];

  // Rendering the layout according to the current route.
  const renderRoute = (key: number, path: string, c: ReactElement, exact: boolean | undefined) => (
    <Route
      exact={exact ?? true}
      path={path}
      key={key}
      render={(props) => {
        // Get all routes that contain the current one.
        // Swap out any dynamic routes with their param values.
        // E.g. "/invices/:invoiceId" will become "/invoices/1"
        const breadcrumbs = layoutRoutes
          .filter(({ path }) => props.match.path.includes(path))
          .map(({ path, ...rest }) => ({
            path: Object.keys(props.match.params).length
              ? Object.keys(props.match.params).reduce(
                  (path, param) => path.replace(`:${param}`, props.match.params[param]),
                  path,
                )
              : path,
            ...rest,
          }));

        return <Fragment>{{ ...c, props: { ...c.props, breadcrumbs } }}</Fragment>;
      }}
    />
  );

  const render = {
    appbar: (
      // The top app bar displays information and actions relating to the current screen.
      <AppBar position="absolute" className={clsx(styles.appBar, open && styles.appBarShift)}>
        <Toolbar className={styles.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(styles.menuButton, open && styles.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <div className={styles.search}>
            <Box display="flex" alignItems="center">
              <div className={styles.searchIcon}>
                <SearchIcon />
              </div>
              {searchTerm && (
                <div className={styles.closeIcon} onClick={() => setSearchTerm('')}>
                  <CloseIcon />
                </div>
              )}
              <InputBase
                placeholder="Search"
                classes={{
                  root: styles.inputRoot,
                  input: styles.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>

            {searchTerm && (
              <SearchResults
                searchTerm={searchTerm}
                customers={customers}
                estimate={estimates}
                invoices={invoices}
                items={items}
                expenses={expenses}
                payments={payments}
              />
            )}
          </div>
          <div className={styles.grow} />
          <IconButton
            color="inherit"
            aria-controls="create-new-menu"
            aria-haspopup="true"
            onClick={(e) => setMenuAnchorEl(e.currentTarget)}
          >
            <AddCircleIcon />
          </IconButton>
          <Menu
            keepMounted
            id="create-new-menu"
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={() => setMenuAnchorEl(null)}
            onClick={() => setMenuAnchorEl(null)}
          >
            <MenuItem onClick={() => history.push(Routes.InvoicesCreate)}>New Invoice</MenuItem>
            <MenuItem onClick={() => history.push(Routes.EstimatesCreate)}>New Estimate</MenuItem>
            <MenuItem onClick={() => history.push(Routes.CustomersCreate)}>New Customer</MenuItem>
          </Menu>
          <IconButton color="inherit" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
          </IconButton>
        </Toolbar>
      </AppBar>
    ),
    // Navigation drawer
    drawer: (
      <Drawer
        variant="permanent"
        open={open}
        classes={{
          paper: clsx(styles.drawerPaper, !open && styles.drawerPaperClose),
        }}
      >
        <div className={styles.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {navItems.map((group, index) => (
          <Fragment key={`app-nav-group_${index}`}>
            <List>{group}</List>
            <Divider />
          </Fragment>
        ))}
      </Drawer>
    ),
  };

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className={styles.root}>
          <CssBaseline />
          <SwitchRoute>
            {dialogRoutes.map(({ c, path, name }) => (
              <Route key={path} path={path}>
                <Dialog open aria-labelledby={name} onClose={() => history.goBack()}>
                  {c}
                </Dialog>
              </Route>
            ))}
          </SwitchRoute>
          {render.appbar}
          {render.drawer}
          <main className={styles.content}>
            <div className={styles.barSpacer} />
            <SwitchRoute>
              <Route exact path={Routes.Admin}>
                <Redirect to={Routes.Dashboard} />
              </Route>
              {layoutRoutes.map(({ path, c, exact }, key) => renderRoute(key, path, c, exact))}
            </SwitchRoute>
          </main>
        </div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
