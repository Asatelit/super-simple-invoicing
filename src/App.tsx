import React, { Fragment, ReactElement, useContext, useEffect, useMemo } from 'react';
import { Switch as SwitchRoute, Route, Redirect } from 'react-router-dom';
import clsx from 'clsx';
import {
  AppBar,
  Badge,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
  ThemeProvider,
  InputBase,
  Switch,
  createMuiTheme,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SearchIcon from '@material-ui/icons/Search';
import { appContext } from './hooks';
import { navItems } from './components';
import { Routes } from './enums';
import { flatten } from './utils';
import { MappedInvoice } from './types';
import * as L from './layouts';
import styles from './app.module.css';

const root = document.querySelector(':root') as any;

type MappedData = {
  invoices: MappedInvoice[];
};

function App() {
  const [open, setOpen] = React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [context, actions] = useContext(appContext);

  const { customers, estimates, items, invoices, settings, payments, expenses } = context;

  // Users might have specified a preference for a light or dark theme.
  const theme = React.useMemo(() => createMuiTheme({ palette: { type: isDarkMode ? 'dark' : 'light' } }), [
    isDarkMode,
  ]);

  const mapped: MappedData = {
    invoices: useMemo(
      () =>
        invoices.map((invoice) => ({
          ...invoice,
          customer: customers.find((customer) => customer.id === invoice.customerId),
        })),
      [invoices, customers],
    ),
  };

  // Transpose Material UI palette to CSS variables.
  useEffect(() => {
    if (!root?.style) return;
    Object.keys(flatten(theme.palette)).forEach((key) =>
      root.style.setProperty(`--${key.replaceAll('.', '-')}`, flatten(theme.palette)[key]),
    );
  }, [theme.palette]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // prettier-ignore
  const routes = [
    { path: Routes.Admin, name: 'Admin', component: <></> },
    { path: Routes.Dashboard, name: 'Dashboard', component: <L.Dashboard actions={actions} invoices={invoices} estimates={estimates} customers={customers} /> },
    { path: Routes.Customers, name: 'Customers', component: <L.Customers customers={customers} /> },
    { path: Routes.CustomersCreate, name: 'New Customer', component: <L.CreateCustomer actions={actions} /> },
    { path: Routes.Items, name: 'Items', component: <L.Items items={items} /> },
    { path: Routes.ItemsCreate, name: 'New Item', component: <L.CreateItem actions={actions} /> },
    { path: Routes.Estimates, name: 'Estimates', component: <L.Estimates estimates={estimates} /> },
    { path: Routes.InvoicesList, name: 'Invoices', component: <L.InvoicesList invoices={invoices} /> },
    { path: Routes.InvoicesView, name: 'Invoices', component: <L.InvoicesView invoices={mapped.invoices} /> },
    { path: Routes.Payments, name: 'Payments', component: <L.Payments payments={payments} /> },
    { path: Routes.Expenses, name: 'Expenses', component: <L.Expenses expenses={expenses} /> },
    { path: Routes.Reports, name: 'Reports', component: <></> },
    { path: Routes.Settings, name: 'Settings', component: <L.Settings actions={actions} settings={settings} /> },
  ];

  const renderRoute = (key: number, path: string, children: ReactElement) => (
    <Route
      exact
      path={path}
      key={key}
      render={(props) => {
        // Get all routes that contain the current one.
        // Swap out any dynamic routes with their param values.
        // E.g. "/invices/:invoiceId" will become "/invoices/1"
        const breadcrumbs = routes
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

        return <Fragment>{{ ...children, props: { ...children.props, breadcrumbs } }}</Fragment>;
      }}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.root}>
        <CssBaseline />
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
              <div className={styles.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: styles.inputRoot,
                  input: styles.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <div className={styles.grow} />

            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Switch checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(styles.drawerPaper, !open && styles.drawerPaperClose),
          }}
          open={open}
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
        <main className={styles.content}>
          <div className={styles.barSpacer} />

          <SwitchRoute>
            <Route exact path={Routes.Admin}>
              <Redirect to={Routes.Dashboard} />
            </Route>
            {routes.map(({ path, component }, key) => renderRoute(key, path, component))}
          </SwitchRoute>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
