import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Delete } from '@material-ui/icons';
import { Box, ListItemIcon, Menu, MenuItem, Paper, Typography } from '@material-ui/core';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import { MenuButton, UndoButton } from 'components';
import { AppActions, Settings, Tax } from 'types';
import { formatItem } from 'utils';

export type ExpenseCategoriesTabProps = {
  settings: Settings;
  actions: AppActions;
};

export const ExpenseCategoriesTab = ({ actions, settings }: ExpenseCategoriesTabProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentItem, setCurrentItem] = useState<{ name: string } | null>(null);

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

  const handlers = {
    showMenu: (event: React.MouseEvent<HTMLElement>, item: Tax) => {
      setAnchorEl(event.currentTarget);
      setCurrentItem(item);
    },

    closeMenu: () => {
      setAnchorEl(null);
      setCurrentItem(null);
    },

    delete: () => {
      if (!currentItem) return;
      const expenseCategories = settings.expenseCategories;
      const removedData = actions.settings.update({
        expenseCategories: expenseCategories.filter((cat) => cat.name !== currentItem.name),
      });
      if (removedData) {
        toast(
          <UndoButton
            message={`"${currentItem.name}" deleted.`}
            onClick={() => {
              actions.settings.update({
                expenseCategories,
              });
            }}
          />,
        );
      }
      handlers.closeMenu();
    },
  };

  const renderGridActionsCell = (cell: { item: Tax }) => (
    <MenuButton onClick={(e: React.MouseEvent<HTMLElement>) => handlers.showMenu(e, cell.item)} />
  );

  const renderMenu = () => {
    const menuItems = [{ label: 'Delete', icon: <Delete fontSize="small" />, handler: handlers.delete }];
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
  };

  return (
    <Paper style={{ padding: '48px', marginBottom: '48px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" style={{ marginBottom: '24px' }}>
        <div style={{ marginRight: '24px' }}>
          <Typography display="block" variant="h6">
            Expense Categories
          </Typography>
          <Typography display="block" variant="body1" color="textSecondary" style={{ margin: '12px 0 24px' }}>
            Categories are required for adding expense entries. You can Add or Remove these categories
            according to your preference.
          </Typography>
        </div>
        {/* <Button variant="outlined" color="primary" onClick={() => history.push(Routes.SettingsTaxAdd)}>
          Add New Category
        </Button> */}
      </Box>
      {renderMenu()}
      <FlexGrid {...gridCommonProps} itemsSource={settings.expenseCategories} on>
        <FlexGridFilter />
        <FlexGridColumn header="Categoory Name" binding="name" width={300} />
        <FlexGridColumn header="Description" binding="description" width="*" />
        <FlexGridColumn allowPinning="None" width={66}>
          <FlexGridCellTemplate cellType="Cell" template={renderGridActionsCell} />
        </FlexGridColumn>
      </FlexGrid>
    </Paper>
  );
};
