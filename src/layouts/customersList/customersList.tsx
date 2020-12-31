import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useHistory, generatePath } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Edit, Visibility, Delete } from '@material-ui/icons';
import { Container, Button, Typography, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { CellMaker } from '@grapecity/wijmo.grid.cellmaker';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import { BreadcrumbsCrumbProp, MenuButton, UndoButton } from 'components';
import { AppActions, Customer, MappedCustomer } from 'types';
import { formatItem } from 'utils';
import { Common } from 'layouts';
import { Routes } from 'enums';
import styles from './customersList.module.css';

export type CustomersListProps = {
  actions: AppActions;
  customers: MappedCustomer[];
  breadcrumbs?: BreadcrumbsCrumbProp[];
};

export const CustomersList: React.FC<CustomersListProps> = ({ actions, breadcrumbs, customers }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const history = useHistory();

  const availableCustomers = useMemo(() => customers.filter((customer) => !customer.isDeleted), [customers]);

  const handlers = {
    showMenu: (event: React.MouseEvent<HTMLElement>, item: Customer) => {
      setAnchorEl(event.currentTarget);
      setCurrentCustomer(item);
    },

    closeMenu: () => {
      setAnchorEl(null);
      setCurrentCustomer(null);
    },

    edit: () => {
      if (!currentCustomer) return;
      history.push(Routes.CustomersEdit.replace(':id', currentCustomer.id));
      handlers.closeMenu();
    },

    show: () => {
      if (!currentCustomer) return;
      history.push(Routes.CustomersView.replace(':id', currentCustomer.id));
      handlers.closeMenu();
    },

    delete: () => {
      if (!currentCustomer) return;
      const removedData = actions.customers.remove([currentCustomer.id]);
      if (removedData) {
        toast(<UndoButton message="Customer deleted." onClick={() => handlers.undo(removedData)} />);
      }
      handlers.closeMenu();
    },

    undo: (customers: Customer[]) => {
      const restoringDataIds = customers.map((item) => item.id);
      actions.customers.undoRemove(restoringDataIds);
    },
  };

  const renderers = {
    customerLink: CellMaker.makeLink({
      href: Routes.CustomersView.replace(':id', '${item.id}'), // eslint-disable-line
      click: (_, ctx) => history.push(generatePath(Routes.CustomersView, { id: ctx.item.id })),
    }),

    commonActions: (
      <Button variant="contained" color="primary" component={RouterLink} to={Routes.CustomersCreate}>
        New Customer
      </Button>
    ),

    gridActionsCell: (cell: { item: Customer }) => (
      <MenuButton onClick={(e: React.MouseEvent<HTMLElement>) => handlers.showMenu(e, cell.item)} />
    ),

    gridMenu: () => {
      const menuItems = [
        { label: 'Edit', icon: <Edit fontSize="small" />, handler: handlers.edit },
        { label: 'View', icon: <Visibility fontSize="small" />, handler: handlers.show },
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
      <Common title="Customers" breadcrumbs={breadcrumbs} actions={renderers.commonActions}>
        {renderers.gridMenu()}
        <FlexGrid {...gridCommonProps} itemsSource={availableCustomers}>
          <FlexGridFilter />
          <FlexGridColumn
            header="Display Name"
            binding="name"
            cellTemplate={renderers.customerLink}
            minWidth={150}
            width="*"
          />
          <FlexGridColumn header="Contact Name" binding="contactName" width="*" />
          <FlexGridColumn header="Phone" binding="phone" width={160} />
          <FlexGridColumn header="Amount Due" binding=""  width={140} format="c0" />
          <FlexGridColumn header="Added On" binding="createdAt" format="MMM d yyyy" width={140} />
          <FlexGridColumn allowPinning="None" width={66}>
            <FlexGridCellTemplate cellType="Cell" template={renderers.gridActionsCell} />
          </FlexGridColumn>
        </FlexGrid>
      </Common>
    </Container>
  );
};
