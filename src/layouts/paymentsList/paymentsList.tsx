import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useHistory, generatePath } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Container, ListItemIcon, Menu, MenuItem, Typography } from '@material-ui/core';
import { Edit, Delete, Visibility } from '@material-ui/icons';
import { DataMap } from '@grapecity/wijmo.grid';
import { CellMaker } from '@grapecity/wijmo.grid.cellmaker';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import { BreadcrumbsCrumbProp, MenuButton } from 'components';
import { formatItem } from 'utils';
import { Common } from 'layouts';
import { Payment, Customer, AppActions } from 'types';
import { Routes } from 'enums';
import styles from './paymentsList.module.css';

export type PaymentsListProps = {
  actions: AppActions;
  breadcrumbs?: BreadcrumbsCrumbProp[];
  payments: Payment[];
  customers: Customer[];
};

export const PaymentsList: React.FC<PaymentsListProps> = ({ actions, breadcrumbs, payments, customers }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const history = useHistory();

  // Mappings
  const customersMap = useMemo(() => new DataMap(customers, 'id', 'name'), [customers]);

  // Handlers
  const handlers = {
    showMenu: (event: React.MouseEvent<HTMLElement>, item: Payment) => {
      setAnchorEl(event.currentTarget);
      setCurrentPayment(item);
    },

    closeMenu: () => {
      setAnchorEl(null);
      setCurrentPayment(null);
    },

    edit: () => {
      if (!currentPayment) return;
      history.push(generatePath(Routes.PaymentsEdit, { id: currentPayment.id }));
      handlers.closeMenu();
    },

    view: () => {
      if (!currentPayment) return;
      history.push(generatePath(Routes.PaymentsView, { id: currentPayment.id }));
      handlers.closeMenu();
    },

    delete: () => {
      if (!currentPayment) return;
      const removedData = actions.payments.delete([currentPayment.id]);
      if (removedData) toast.success('Payment deleted.');
      handlers.closeMenu();
    },
  };

  // Renderers
  const renderers = {
    commonActions: (
      <Button variant="contained" color="primary" component={RouterLink} to={Routes.PaymentsCreate}>
        New Payment
      </Button>
    ),

    gridPaymentNumberCell: CellMaker.makeLink({
      href: generatePath(Routes.PaymentsView.replace(':id', '${item.id}')), // eslint-disable-line
      click: (_, ctx) => history.push(generatePath(Routes.PaymentsView, { id: ctx.item.id })),
    }),

    gridActionsCell: (cell: { item: Payment }) => (
      <MenuButton onClick={(e: React.MouseEvent<HTMLElement>) => handlers.showMenu(e, cell.item)} />
    ),

    gridMenu: () => {
      const menuItems = [
        { label: 'Edit', icon: <Edit fontSize="small" />, handler: handlers.edit },
        { label: 'View', icon: <Visibility fontSize="small" />, handler: handlers.view },
        { label: 'Delete', icon: <Delete fontSize="small" />, handler: handlers.delete },
      ];
      return (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handlers.closeMenu}
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
    },
  };

  // Grid props
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

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="Payments" breadcrumbs={breadcrumbs} actions={renderers.commonActions}>
        {renderers.gridMenu()}
        <Typography variant="body2" color="textSecondary" align="right" className="mb-3">
          {`Showing: ${payments.length} of ${payments.length}`}
        </Typography>
        <FlexGrid {...gridCommonProps} itemsSource={payments}>
          <FlexGridFilter />
          <FlexGridColumn header="Date" binding="paymentDate" format="MMM d yyyy" width={140} />
          <FlexGridColumn
            header="Payment Number"
            binding="paymentNumber"
            width={180}
            cellTemplate={renderers.gridPaymentNumberCell}
          />
          <FlexGridColumn
            header="Customer"
            binding="customerId"
            width="*"
            minWidth={200}
            dataMap={customersMap}
          />
          <FlexGridColumn header="Payment Mode" binding="paymentMode" width={200} />
          <FlexGridColumn header="Invoice" binding="invoiceId" width={130} />
          <FlexGridColumn header="Amount" binding="amount" format="c2" width={150} />
          <FlexGridColumn allowPinning="None" width={66}>
            <FlexGridCellTemplate cellType="Cell" template={renderers.gridActionsCell} />
          </FlexGridColumn>
        </FlexGrid>
      </Common>
    </Container>
  );
};
