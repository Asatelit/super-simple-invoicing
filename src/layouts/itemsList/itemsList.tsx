import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useHistory, generatePath } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Button, Typography, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { CellMaker } from '@grapecity/wijmo.grid.cellmaker';
import { Edit, Visibility, Delete } from '@material-ui/icons';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import { BreadcrumbsCrumbProp, MenuButton, UndoButton } from 'components';
import { formatItem } from 'utils';
import { AppActions, Item } from 'types';
import { Common } from 'layouts';
import { Routes } from 'enums';
import styles from './itemsList.module.css';

export type ItemsListProps = {
  actions: AppActions;
  breadcrumbs?: BreadcrumbsCrumbProp[];
  items: Item[];
};

export const ItemsList: React.FC<ItemsListProps> = ({ actions, breadcrumbs, items }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Item | null>(null);
  const history = useHistory();

  const availableData = useMemo(() => items.filter((item) => !item.isDeleted), [items]);

  const handlers = {
    showMenu: (event: React.MouseEvent<HTMLElement>, item: Item) => {
      setAnchorEl(event.currentTarget);
      setCurrentCustomer(item);
    },

    closeMenu: () => {
      setAnchorEl(null);
      setCurrentCustomer(null);
    },

    edit: () => {
      if (!currentCustomer) return;
      history.push(generatePath(Routes.ItemsEdit, { id: currentCustomer.id }));
      handlers.closeMenu();
    },

    show: () => {
      if (!currentCustomer) return;
      history.push(generatePath(Routes.ItemsView, { id: currentCustomer.id }));
      handlers.closeMenu();
    },

    delete: () => {
      if (!currentCustomer) return;
      const removedData = actions.items.remove([currentCustomer.id]);
      if (removedData) {
        toast(<UndoButton message="Customer deleted." onClick={() => handlers.undo(removedData)} />);
      }
      handlers.closeMenu();
    },

    undo: (customers: Item[]) => {
      const restoringDataIds = customers.map((item) => item.id);
      actions.items.undoRemove(restoringDataIds);
    },
  };

  const renderers = {
    customerLink: CellMaker.makeLink({
      href: Routes.ItemsView.replace(':id', '${item.id}'), // eslint-disable-line
      click: (_, ctx) => history.push(generatePath(Routes.ItemsView, { id: ctx.item.id })),
    }),

    commonActions: (
      <Button variant="contained" color="primary" component={RouterLink} to={Routes.ItemsCreate}>
        New Item
      </Button>
    ),

    gridActionsCell: (cell: { item: Item }) => (
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
      <Common title="Items" breadcrumbs={breadcrumbs} actions={renderers.commonActions}>
        {renderers.gridMenu()}
        <FlexGrid {...gridCommonProps} itemsSource={availableData}>
          <FlexGridFilter />
          <FlexGridColumn header="Name" binding="name" width="*" cellTemplate={renderers.customerLink} />
          <FlexGridColumn header="Unit" binding="unitId" width={130} />
          <FlexGridColumn header="Price" binding="price" format="c2" width={130} />
          <FlexGridColumn allowPinning="None" width={66}>
            <FlexGridCellTemplate cellType="Cell" template={renderers.gridActionsCell} />
          </FlexGridColumn>
        </FlexGrid>
      </Common>
    </Container>
  );
};
