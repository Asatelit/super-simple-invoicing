import React, { useMemo, useState } from 'react';
import { useHistory, generatePath } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DataMap } from '@grapecity/wijmo.grid';
import { CellMaker } from '@grapecity/wijmo.grid.cellmaker';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Edit, Visibility, Delete, CheckCircle, Description } from '@material-ui/icons';
import { MenuButton, UndoButton } from 'components';
import { AppActions, Customer, Estimate, Invoice } from 'types';
import { Routes } from 'enums';
import { formatItem } from 'utils';
import styles from './dashboard.module.css';

export type DashboardProps = {
  actions: AppActions;
  customers: Customer[];
  invoices: Invoice[];
  estimates: Estimate[];
};

export const Dashboard: React.FC<DashboardProps> = ({ actions, customers, invoices, estimates }) => {
  const [invoiceMenuAnchorElement, setInvoiceMenuAnchorElement] = useState<null | HTMLElement>(null);
  const [estimateMenuAnchorElement, setEstimateMenuAnchorElement] = useState<null | HTMLElement>(null);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [currentEstimate, setCurrentEstimate] = useState<Estimate | null>(null);

  const availableInvoices = useMemo(() => invoices.filter((invoice) => !invoice.isDeleted), [invoices]);
  const availableEstimates = useMemo(() => estimates.filter((estimate) => !estimate.isDeleted), [estimates]);

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

  const renderInvoiceCustomerLink = CellMaker.makeLink({
    href: Routes.InvoicesView.replace(':id', '${item.id}'), // eslint-disable-line
    click: (_, ctx) => history.push(generatePath(Routes.InvoicesView, { id: ctx.item.id })),
  });

  const renderEstimateCustomerLink = CellMaker.makeLink({
    href: Routes.EstimatesView.replace(':id', '${item.id}'), // eslint-disable-line
    click: (_, ctx) => history.push(generatePath(Routes.EstimatesView, { id: ctx.item.id })),
  });

  const renderInvoiceActionsCell = (cell: { item: Invoice }) => (
    <MenuButton onClick={(e) => handleOnClickInvoiceMenu(e, cell.item)} />
  );

  const renderEstimateActionsCell = (cell: { item: Estimate }) => (
    <MenuButton onClick={(e) => handleOnClickEstimateMenu(e, cell.item)} />
  );

  const renderInvoicesWidget = (
    <div className={styles.widget}>
      <Typography variant="h5" component="h2" gutterBottom>
        Due Invoices
      </Typography>
      <FlexGrid {...gridCommonProps} itemsSource={availableInvoices}>
        <FlexGridColumn header="Due On" binding="dueDate" format="dd MMM yyyy" />
        <FlexGridColumn
          header="Customer"
          binding="customerId"
          width="*"
          dataMap={customersMap}
          cellTemplate={renderInvoiceCustomerLink}
        />
        <FlexGridColumn header="Status" binding="status" />
        <FlexGridColumn header="Amount Due" binding="total" format="c2" />
        <FlexGridColumn allowPinning="None" width={66}>
          <FlexGridCellTemplate cellType="Cell" template={renderInvoiceActionsCell} />
        </FlexGridColumn>
      </FlexGrid>
    </div>
  );

  const renderEstimatesWidget = (
    <div className={styles.widget}>
      <Typography variant="h5" component="h2" gutterBottom>
        Recent Estimates
      </Typography>
      <FlexGrid {...gridCommonProps} itemsSource={availableEstimates}>
        <FlexGridColumn header="Date" binding="expiryDate" format="dd MMM yyyy" />
        <FlexGridColumn
          header="Customer"
          binding="customerId"
          width="*"
          dataMap={customersMap}
          cellTemplate={renderEstimateCustomerLink}
        />
        <FlexGridColumn header="Status" binding="status" />
        <FlexGridColumn header="Amount Due" binding="total" format="c2" />
        <FlexGridColumn allowPinning="None" width={66}>
          <FlexGridCellTemplate cellType="Cell" template={renderEstimateActionsCell} />
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

  return (
    <div className={styles.root}>
      {renderMenu(estimateMenuAnchorElement, estimatesGridMenu)}
      {renderMenu(invoiceMenuAnchorElement, invoicesGridMenu)}
      <Container maxWidth="lg" className={styles.container}>
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  $123,562.00
                </Typography>
                <Typography color="textSecondary">Amount Due</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {customers.length}
                </Typography>
                <Typography color="textSecondary">Customers</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {invoices.length}
                </Typography>
                <Typography color="textSecondary">Invoices</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {estimates.length}
                </Typography>
                <Typography color="textSecondary">Estimates</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {renderInvoicesWidget}
        {renderEstimatesWidget}
      </Container>
    </div>
  );
};
