import { formatMoney } from 'accounting';
import React, { useMemo, useState } from 'react';
import { useHistory, generatePath, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DataMap } from '@grapecity/wijmo.grid';
import { CellMaker } from '@grapecity/wijmo.grid.cellmaker';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import { FlexChart, FlexChartLegend, FlexChartSeries, FlexChartAxis } from '@grapecity/wijmo.react.chart';
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Box,
  Button,
} from '@material-ui/core';
import {
  Edit,
  Visibility,
  Delete,
  CheckCircle,
  Description,
  AttachMoney,
  Person,
  Subject,
} from '@material-ui/icons';

import { MenuButton, UndoButton, StatusChip } from 'components';
import { AppActions, Customer, Estimate, Invoice, SummaryData } from 'types';
import { Routes, InvoicePaidStatus, InvoiceStatus } from 'enums';
import { formatItem, getDivisibleBy } from 'utils';
import styles from './dashboard.module.css';

export type DashboardProps = {
  actions: AppActions;
  customers: Customer[];
  invoices: Invoice[];
  estimates: Estimate[];
  summary: {
    monthly: SummaryData[];
    overall: SummaryData;
  };
};

const pallete = {
  sales: 'rgb(0, 0, 0)',
  receipts: 'rgb(0, 201, 156)',
  expenses: 'rgb(251, 113, 120)',
  netIncome: 'rgb(88, 81, 216)',
};

export const Dashboard: React.FC<DashboardProps> = ({ actions, customers, invoices, estimates, summary }) => {
  const [invoiceMenuAnchorElement, setInvoiceMenuAnchorElement] = useState<null | HTMLElement>(null);
  const [estimateMenuAnchorElement, setEstimateMenuAnchorElement] = useState<null | HTMLElement>(null);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [currentEstimate, setCurrentEstimate] = useState<Estimate | null>(null);

  const availableInvoices = useMemo(() => invoices.filter((invoice) => !invoice.isDeleted), [invoices]);
  const availableEstimates = useMemo(() => estimates.filter((estimate) => !estimate.isDeleted), [estimates]);
  const amountDue = useMemo(
    () =>
      availableInvoices
        .filter(
          (item) => item.status !== InvoiceStatus.COMPLETED && item.paidStatus === InvoicePaidStatus.UNPAID,
        )
        .reduce((amount, value) => amount + value.total, 0),
    [availableInvoices],
  );

  const customersMap = useMemo(() => new DataMap(customers, 'id', 'name'), [customers]);

  const history = useHistory();

  const handlers = {
    invoice: {
      edit: () => {
        if (!currentInvoice) return;
        history.push(Routes.InvoicesEdit.replace(':id', currentInvoice.id));
        handleCloseMenu();
      },

      show: () => {
        if (!currentInvoice) return;
        history.push(Routes.InvoicesView.replace(':id', currentInvoice.id));
        handleCloseMenu();
      },

      markSent: () => {
        if (!currentInvoice) return;
        const removedData = actions.invoices.markSent([currentInvoice.id]);
        if (removedData) toast.success('Invoice marked as sent');
        handleCloseMenu();
      },

      delete: () => {
        if (!currentInvoice) return;
        const removedData = actions.invoices.remove([currentInvoice.id]);
        if (removedData) {
          toast(<UndoButton message="Invoice deleted." onClick={() => handlers.invoice.undo(removedData)} />);
        }
        handleCloseMenu();
      },

      undo: (invoices: Invoice[]) => {
        const restoringDataIds = invoices.map((item) => item.id);
        actions.invoices.undoRemove(restoringDataIds);
      },
    },
    estimate: {
      convertToInvoice: () => {},

      edit: () => {
        if (!currentInvoice) return;
        history.push(Routes.EstimatesEdit.replace(':id', currentInvoice.id));
        handleCloseMenu();
      },

      show: () => {
        if (!currentInvoice) return;
        history.push(Routes.EstimatesView.replace(':id', currentInvoice.id));
        handleCloseMenu();
      },

      markAccepted: () => {
        if (!currentEstimate) return;
        const removedData = actions.estimates.markAccepted([currentEstimate.id]);
        if (removedData) toast.success('Estimate marked as accepted');
        handleCloseMenu();
      },

      markRejected: () => {
        if (!currentEstimate) return;
        const removedData = actions.estimates.markRejected([currentEstimate.id]);
        if (removedData) toast.success('Estimate marked as rejected');
        handleCloseMenu();
      },

      markSent: () => {
        if (!currentEstimate) return;
        const removedData = actions.estimates.markSent([currentEstimate.id]);
        if (removedData) toast.success('Estimate marked as sent');
        handleCloseMenu();
      },

      delete: () => {
        if (!currentEstimate) return;
        const removedData = actions.estimates.remove([currentEstimate.id]);
        if (removedData) {
          toast(
            <UndoButton message="Estimate deleted." onClick={() => handlers.estimate.undo(removedData)} />,
          );
        }
        handleCloseMenu();
      },

      undo: (estimates: Estimate[]) => {
        const restoringDataIds = estimates.map((item) => item.id);
        actions.estimates.undoRemove(restoringDataIds);
      },
    },
  };

  const handleOnClickInvoiceMenu = (event: React.MouseEvent<HTMLElement>, item: Invoice) => {
    setInvoiceMenuAnchorElement(event.currentTarget);
    setCurrentInvoice(item);
  };

  const handleOnClickEstimateMenu = (event: React.MouseEvent<HTMLElement>, item: Estimate) => {
    setEstimateMenuAnchorElement(event.currentTarget);
    setCurrentEstimate(item);
  };

  const handleCloseMenu = () => {
    setEstimateMenuAnchorElement(null);
    setInvoiceMenuAnchorElement(null);
    setCurrentInvoice(null);
    setCurrentEstimate(null);
  };

  const gridCommonProps = {
    formatItem,
    allowAddNew: false,
    alternatingRowStep: 0,
    autoGenerateColumns: false,
    allowDelete: false,
    allowPinning: 'SingleColumn',
    selectionMode: 'None',
    validateEdits: false,
    headersVisibility: 'Column',
    style: { maxWidth: '100%' },
  };

  const invoicesGridMenu = [
    { label: 'Edit', icon: <Edit fontSize="small" />, handler: handlers.invoice.edit },
    { label: 'View', icon: <Visibility fontSize="small" />, handler: handlers.invoice.show },
    { label: 'Mark as sent', icon: <CheckCircle fontSize="small" />, handler: handlers.invoice.markSent },
    { label: 'Delete', icon: <Delete fontSize="small" />, handler: handlers.invoice.delete },
  ];

  // prettier-ignore
  const estimatesGridMenu = [
    { label: 'View', icon: <Visibility fontSize="small" />, handler: handlers.estimate.edit },
    { label: 'Convert to invoice', icon: <Description fontSize="small" />, handler: handlers.estimate.convertToInvoice },
    { label: 'Mark as sent', icon: <CheckCircle fontSize="small" />, handler: handlers.estimate.markSent },
    { label: 'Mark as accepted', icon: <CheckCircle fontSize="small" />, handler: handlers.estimate.markAccepted, },
    { label: 'Mark as rejected', icon: <CheckCircle fontSize="small" />, handler: handlers.estimate.markRejected, },
    { label: 'Delete', icon: <Delete fontSize="small" />, handler: handlers.estimate.delete },
  ];

  const renderers = {
    gridStatusCell: (cell: { item: Invoice | Estimate }) => (
      <StatusChip status={cell.item.status} size="small" label={cell.item.status} />
    ),

    invoiceCustomerLink: CellMaker.makeLink({
      href: Routes.InvoicesView.replace(':id', '${item.id}'), // eslint-disable-line
      click: (_, ctx) => history.push(generatePath(Routes.InvoicesView, { id: ctx.item.id })),
    }),

    estimateCustomerLink: CellMaker.makeLink({
      href: Routes.EstimatesView.replace(':id', '${item.id}'), // eslint-disable-line
      click: (_, ctx) => history.push(generatePath(Routes.EstimatesView, { id: ctx.item.id })),
    }),

    invoiceActionsCell: (cell: { item: Invoice }) => (
      <MenuButton onClick={(e) => handleOnClickInvoiceMenu(e, cell.item)} />
    ),

    estimateActionsCell: (cell: { item: Estimate }) => (
      <MenuButton onClick={(e) => handleOnClickEstimateMenu(e, cell.item)} />
    ),
  };

  const renderInvoicesWidget = (
    <div className={styles.widget}>
      <Box display="flex" alignItems="center" mb={3}>
        <Box flexGrow="1">
          <Typography variant="h5" component="h2">
            Due Invoices
          </Typography>
        </Box>
        <Button variant="outlined" color="primary" size="small" component={Link} to={Routes.InvoicesList}>
          View All
        </Button>
      </Box>

      <FlexGrid {...gridCommonProps} itemsSource={availableInvoices.slice(0, 5)}>
        <FlexGridColumn header="Due On" binding="dueDate" format="dd MMM yyyy" width={100} />
        <FlexGridColumn
          header="Customer"
          binding="customerId"
          minWidth={120}
          width="*"
          dataMap={customersMap}
          cellTemplate={renderers.invoiceCustomerLink}
        />
        <FlexGridColumn header="Status" binding="status" width={70}>
          <FlexGridCellTemplate cellType="Cell" template={renderers.gridStatusCell} />
        </FlexGridColumn>
        <FlexGridColumn header="Amount Due" binding="total" format="c2" minWidth={70} width="*" />
        <FlexGridColumn allowPinning="None" width={66}>
          <FlexGridCellTemplate cellType="Cell" template={renderers.invoiceActionsCell} />
        </FlexGridColumn>
      </FlexGrid>
    </div>
  );

  const renderEstimatesWidget = (
    <div className={styles.widget}>
      <Box display="flex" alignItems="center" mb={3}>
        <Box flexGrow="1">
          <Typography variant="h5" component="h2">
            Recent Estimates
          </Typography>
        </Box>
        <Button variant="outlined" color="primary" size="small" component={Link} to={Routes.EstimatesList}>
          View All
        </Button>
      </Box>

      <FlexGrid {...gridCommonProps} itemsSource={availableEstimates.slice(0, 5)}>
        <FlexGridColumn header="Date" binding="expiryDate" format="dd MMM yyyy" width={100} />
        <FlexGridColumn
          header="Customer"
          binding="customerId"
          minWidth={120}
          width="*"
          dataMap={customersMap}
          cellTemplate={renderers.estimateCustomerLink}
        />
        <FlexGridColumn header="Status" binding="status" width={70}>
          <FlexGridCellTemplate cellType="Cell" template={renderers.gridStatusCell} />
        </FlexGridColumn>
        <FlexGridColumn header="Amount Due" binding="total" format="c2" minWidth={70} width="*" />
        <FlexGridColumn allowPinning="None" width={66}>
          <FlexGridCellTemplate cellType="Cell" template={renderers.estimateActionsCell} />
        </FlexGridColumn>
      </FlexGrid>
    </div>
  );

  const renderMenu = (anchorEl: any, menuItems: Object[]) => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
      PaperProps={{ style: { maxHeight: '50vh' } }}
    >
      {menuItems.map((option: any, key) => (
        <MenuItem key={`${option.label}-${key}`} onClick={option.handler}>
          <ListItemIcon>{option.icon}</ListItemIcon>
          <Typography variant="inherit" noWrap>
            {option.label}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  );

  const max = getDivisibleBy(summary.overall.sales, 10);

  return (
    <div className={styles.root}>
      {renderMenu(estimateMenuAnchorElement, estimatesGridMenu)}
      {renderMenu(invoiceMenuAnchorElement, invoicesGridMenu)}
      <Container maxWidth="lg" className={styles.container}>
        <Grid container spacing={3} className="mb-3">
          <Grid item xs={6} md={3}>
            <Link to={Routes.InvoicesList} className="unstyled">
              <Card className={styles.card}>
                <CardContent>
                  <Box display="flex" alignItems="center" flexDirection="row">
                    <Box flex="1 1 auto">
                      <Typography variant="h5" component="h2" noWrap>
                        {formatMoney(amountDue)}
                      </Typography>
                      <Typography color="textSecondary">Amount Due</Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="50%"
                      width="42px"
                      height="42px"
                      style={{ background: 'var(--secondary-light)' }}
                    >
                      <AttachMoney htmlColor="var(--secondary-contrastText)" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={6} md={3}>
            <Link to={Routes.CustomersList} className="unstyled">
              <Card className={styles.card}>
                <CardContent>
                  <Box display="flex" alignItems="center" flexDirection="row">
                    <Box flex="1 1 auto">
                      <Typography variant="h5" component="h2" noWrap>
                        {customers.length}
                      </Typography>
                      <Typography color="textSecondary">Customers</Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="50%"
                      width="42px"
                      height="42px"
                      style={{ background: 'var(--primary-light)' }}
                    >
                      <Person htmlColor="var(--primary-contrastText)" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={6} md={3}>
            <Link to={Routes.InvoicesList} className="unstyled">
              <Card className={styles.card}>
                <CardContent>
                  <Box display="flex" alignItems="center" flexDirection="row">
                    <Box flex="1 1 auto">
                      <Typography variant="h5" component="h2" noWrap>
                        {invoices.length}
                      </Typography>
                      <Typography color="textSecondary">Invoices</Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="50%"
                      width="42px"
                      height="42px"
                      style={{ background: 'var(--primary-light)' }}
                    >
                      <Subject htmlColor="var(--primary-contrastText)" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={6} md={3}>
            <Link to={Routes.EstimatesList} className="unstyled">
              <Card className={styles.card}>
                <CardContent>
                  <Box display="flex" alignItems="center" flexDirection="row">
                    <Box flex="1 1 auto">
                      <Typography variant="h5" component="h2" noWrap>
                        {estimates.length}
                      </Typography>
                      <Typography color="textSecondary">Estimates</Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="50%"
                      width="42px"
                      height="42px"
                      style={{ background: 'var(--primary-light)' }}
                    >
                      <Description htmlColor="var(--primary-contrastText)" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        </Grid>
        <Paper variant="elevation" style={{ padding: '2rem' }}>
          <Typography variant="h6" className="mb-4">
            Sales & Expenses
          </Typography>
          <Grid container spacing={3} className="mb-4">
            <Grid item sm={12} lg={10}>
              <FlexChart itemsSource={summary.monthly} bindingX="month" chartType="Line">
                <FlexChartLegend position="None" />
                <FlexChartAxis wjProperty="axisX" majorGrid={true} majorTickMarks="Cross" majorUnit={1} />
                <FlexChartAxis
                  wjProperty="axisY"
                  majorGrid={true}
                  majorTickMarks="Cross"
                  max={max}
                  majorUnit={max / 10}
                />
                <FlexChartSeries
                  binding="sales"
                  name="Sales"
                  chartType="LineSymbols"
                  style={{ stroke: pallete.sales, strokeWidth: 3, fill: 'var(--background-paper)' }}
                />
                <FlexChartSeries
                  binding="receipts"
                  name="Receipts"
                  chartType="LineSymbols"
                  style={{ stroke: pallete.receipts, strokeWidth: 3, fill: 'var(--background-paper)' }}
                />
                <FlexChartSeries
                  binding="expenses"
                  name="Expenses"
                  chartType="LineSymbols"
                  style={{ stroke: pallete.expenses, strokeWidth: 3, fill: 'var(--background-paper)' }}
                />
                <FlexChartSeries
                  binding="netIncome"
                  name="Net Income"
                  chartType="LineSymbols"
                  style={{ stroke: pallete.netIncome, strokeWidth: 3, fill: 'var(--background-paper)' }}
                />
              </FlexChart>
            </Grid>
            <Grid item sm={12} lg={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3} lg={12}>
                  <div className="my-3">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      display="block"
                      className="mb-1"
                      align="right"
                    >
                      Sales
                    </Typography>
                    <Typography variant="h5" display="block" align="right" style={{ color: pallete.sales }}>
                      {formatMoney(summary.overall.sales)}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={12}>
                  <div className="my-3">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      display="block"
                      className="mb-1"
                      align="right"
                    >
                      Receipts
                    </Typography>
                    <Typography
                      variant="h5"
                      display="block"
                      align="right"
                      style={{ color: pallete.receipts }}
                    >
                      {formatMoney(summary.overall.receipts)}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={12}>
                  <div className="my-3">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      display="block"
                      className="mb-1"
                      align="right"
                    >
                      Expenses
                    </Typography>
                    <Typography
                      variant="h5"
                      display="block"
                      align="right"
                      style={{ color: pallete.expenses }}
                    >
                      {formatMoney(summary.overall.expenses)}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={12}>
                  <div className="my-3">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      display="block"
                      className="mb-1"
                      align="right"
                    >
                      Net Income
                    </Typography>
                    <Typography
                      variant="h5"
                      display="block"
                      align="right"
                      style={{ color: pallete.netIncome }}
                    >
                      {formatMoney(summary.overall.netIncome)}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={3} className="mb-4">
          <Grid item sm={12} lg={6}>
            {renderInvoicesWidget}
          </Grid>
          <Grid item sm={12} lg={6}>
            {renderEstimatesWidget}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
