import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useHistory, generatePath } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Container, ListItemIcon, Menu, MenuItem, Typography } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import { DataMap } from '@grapecity/wijmo.grid';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { CellMaker } from '@grapecity/wijmo.grid.cellmaker';
import { AppActions, Expense, Customer } from 'types';
import { BreadcrumbsCrumbProp, MenuButton } from 'components';
import { formatItem } from 'utils';
import { Common } from 'layouts';
import { Routes } from 'enums';
import styles from './expensesList.module.css';

export type ExpensesListProps = {
  actions: AppActions;
  breadcrumbs?: BreadcrumbsCrumbProp[];
  customers: Customer[];
  expenses: Expense[];
};

export const ExpensesList: React.FC<ExpensesListProps> = ({ actions, breadcrumbs, expenses, customers }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const history = useHistory();

  // Mappings
  const customersMap = useMemo(() => new DataMap(customers, 'id', 'name'), [customers]);

  // Handlers
  const handlers = {
    showMenu: (event: React.MouseEvent<HTMLElement>, item: Expense) => {
      setAnchorEl(event.currentTarget);
      setCurrentExpense(item);
    },

    closeMenu: () => {
      setAnchorEl(null);
      setCurrentExpense(null);
    },

    edit: () => {
      if (!currentExpense) return;
      history.push(generatePath(Routes.ExpensesEdit, { id: currentExpense.id }));
      handlers.closeMenu();
    },

    delete: () => {
      if (!currentExpense) return;
      const removedData = actions.expenses.delete([currentExpense.id]);
      if (removedData) toast.success('Expense deleted.');
      handlers.closeMenu();
    },
  };

  // Renderers
  const renderers = {
    commonActions: (
      <Button variant="contained" color="primary" component={RouterLink} to={Routes.ExpensesCreate}>
        New Expense
      </Button>
    ),

    gridCategoryCell: CellMaker.makeLink({
      href: generatePath(Routes.ExpensesEdit.replace(':id', '${item.id}')), // eslint-disable-line
      click: (_, ctx) => history.push(generatePath(Routes.ExpensesEdit, { id: ctx.item.id })),
    }),

    gridActionsCell: (cell: { item: Expense }) => (
      <MenuButton onClick={(e: React.MouseEvent<HTMLElement>) => handlers.showMenu(e, cell.item)} />
    ),

    gridMenu: () => {
      const menuItems = [
        { label: 'Edit', icon: <Edit fontSize="small" />, handler: handlers.edit },
        { label: 'Delete', icon: <Delete fontSize="small" />, handler: handlers.delete },
      ];
      return (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handlers.closeMenu}
          PaperProps={{ style: { maxHeight: '50vh' } }}
        >
          {menuItems.map((option, key) => (
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
      <Common title="Expenses" breadcrumbs={breadcrumbs} actions={renderers.commonActions}>
        {renderers.gridMenu()}
        <Typography variant="body2" color="textSecondary" align="right" className="mb-3">
          {`Showing: ${expenses.length} of ${expenses.length}`}
        </Typography>
        <FlexGrid {...gridCommonProps} itemsSource={expenses}>
          <FlexGridFilter />
          <FlexGridColumn header="Date" binding="createdAt" format="MMM d yyyy" width={140} />
          <FlexGridColumn
            header="Category"
            binding="expenseCategory"
            minWidth={200}
            cellTemplate={renderers.gridCategoryCell}
          />
          <FlexGridColumn
            header="Customer"
            binding="customerId"
            width="*"
            minWidth={200}
            dataMap={customersMap}
          />
          <FlexGridColumn header="Note" binding="notes" width={130} />
          <FlexGridColumn header="Amount" binding="amount" format="c2" width={150} />
          <FlexGridColumn allowPinning="None" width={66}>
            <FlexGridCellTemplate cellType="Cell" template={renderers.gridActionsCell} />
          </FlexGridColumn>
        </FlexGrid>
      </Common>
    </Container>
  );
};
