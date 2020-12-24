import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Edit, Delete } from '@material-ui/icons';
import { Paper, Box, Typography, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import { MenuButton, UndoButton } from 'components';
import { AppActions, Tax } from 'types';
import { formatItem } from 'utils';
import { Routes } from 'enums';

export type SettingsTaxesTabProps = {
  taxes: Tax[];
  actions: AppActions;
};

export const SettingsTaxesTab = ({ actions, taxes }: SettingsTaxesTabProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentItem, setCurrentItem] = useState<Tax | null>(null);
  const history = useHistory();

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

  const availableTaxes = useMemo(() => taxes.filter((tax) => !tax.isDeleted), [taxes]);

  const handlers = {
    showMenu: (event: React.MouseEvent<HTMLElement>, item: Tax) => {
      setAnchorEl(event.currentTarget);
      setCurrentItem(item);
    },

    closeMenu: () => {
      setAnchorEl(null);
      setCurrentItem(null);
    },

    edit: () => {
      if (!currentItem) return;
      history.push(Routes.CustomersEdit.replace(':id', currentItem.id));
      handlers.closeMenu();
    },

    delete: () => {
      if (!currentItem) return;
      const removedData = actions.taxes.remove([currentItem.id]);
      if (removedData) {
        toast(<UndoButton message="Tax deleted." onClick={() => handlers.undo(removedData)} />);
      }
      handlers.closeMenu();
    },

    undo: (items: Tax[]) => {
      const restoringDataIds = items.map((item) => item.id);
      actions.taxes.undoRemove(restoringDataIds);
    },
  };

  const renderGridActionsCell = (cell: { item: Tax }) => (
    <MenuButton onClick={(e: React.MouseEvent<HTMLElement>) => handlers.showMenu(e, cell.item)} />
  );

  const renderMenu = () => {
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
        <div>
          <Typography display="block" variant="h6">
            Tax Types
          </Typography>
          <Typography display="block" variant="body1" color="textSecondary" style={{ margin: '12px 0 24px' }}>
            You can add or remove taxes as you please. The app supports taxes on individual Items as well as
            on the invoice.
          </Typography>
        </div>
      </Box>
      {renderMenu()}
      <FlexGrid {...gridCommonProps} itemsSource={availableTaxes}>
        <FlexGridFilter />
        <FlexGridColumn header="Tax Name" binding="name" width="*" />
        <FlexGridColumn header="Compound Tax" binding="compoundTax" width={160} />
        <FlexGridColumn header="Percent" binding="percent" width={160} />
        <FlexGridColumn allowPinning="None" width={66}>
          <FlexGridCellTemplate cellType="Cell" template={renderGridActionsCell} />
        </FlexGridColumn>
      </FlexGrid>
    </Paper>
  );
};
