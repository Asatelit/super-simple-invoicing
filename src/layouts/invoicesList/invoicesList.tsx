import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useHistory, generatePath } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Container,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import { Edit, Delete, CheckCircle, Description, Reply, Visibility } from '@material-ui/icons';
import { DataMap } from '@grapecity/wijmo.grid';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { CellMaker } from '@grapecity/wijmo.grid.cellmaker';
import { BreadcrumbsCrumbProp, MenuButton, UndoButton, StatusChip } from 'components';
import { formatItem } from 'utils';
import { AppActions, Invoice, Customer } from 'types';
import { Common } from 'layouts';
import { Routes } from 'enums';
import styles from './invoicesList.module.css';

export type InvoicesListProps = {
  actions: AppActions;
  breadcrumbs?: BreadcrumbsCrumbProp[];
  customers: Customer[];
  invoices: Invoice[];
};

type FilterByStatus = 'DUE' | 'DRAFT' | 'ALL';

export const InvoicesList: React.FC<InvoicesListProps> = ({ actions, breadcrumbs, invoices, customers }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentEstimate, setCurrentEstimate] = useState<Invoice | null>(null);
  const [tabFilter, setTabFilter] = useState<FilterByStatus>('DUE');
  const history = useHistory();

  const availableData = useMemo(() => invoices.filter((invoice) => !invoice.isDeleted), [invoices]);
  const customersMap = useMemo(() => new DataMap(customers, 'id', 'name'), [customers]);
  const filteredData = useMemo(() => {
    if (tabFilter === 'ALL') return availableData;
    if (tabFilter === 'DUE') return availableData.filter((el) => el.status !== 'COMPLETED');
    return availableData.filter((el) => el.status === tabFilter);
  }, [availableData, tabFilter]);

  const handlers = {
    showMenu: (event: React.MouseEvent<HTMLElement>, item: Invoice) => {
      setAnchorEl(event.currentTarget);
      setCurrentEstimate(item);
    },

    closeMenu: () => {
      setAnchorEl(null);
      setCurrentEstimate(null);
    },

    edit: () => {
      if (!currentEstimate) return;
      history.push(generatePath(Routes.InvoicesEdit, { id: currentEstimate.id }));
      handlers.closeMenu();
    },

    view: () => {
      if (!currentEstimate) return;
      history.push(generatePath(Routes.InvoicesView, { id: currentEstimate.id }));
      handlers.closeMenu();
    },

    delete: () => {
      if (!currentEstimate) return;
      const removedData = actions.invoices.remove([currentEstimate.id]);
      if (removedData) {
        toast(<UndoButton message="Invoice deleted." onClick={() => handlers.undo(removedData)} />);
      }
      handlers.closeMenu();
    },

    clone: () => alert('WIP'),

    send: () => alert('WIP'),

    undo: (data: Invoice[]) => {
      const restoringDataIds = data.map((item) => item.id);
      actions.invoices.undoRemove(restoringDataIds);
    },

    markSent: () => {
      if (!currentEstimate) return;
      const removedData = actions.invoices.markSent([currentEstimate.id]);
      if (removedData) toast.success('Invoice marked as sent');
      handlers.closeMenu();
    },
  };

  const renderers = {
    commonActions: (
      <Button variant="contained" color="primary" component={RouterLink} to={Routes.InvoicesCreate}>
        New Item
      </Button>
    ),

    gridEstimateCell: CellMaker.makeLink({
      href: generatePath(Routes.InvoicesEdit.replace(':id', '${item.id}')), // eslint-disable-line
      click: (_, ctx) => history.push(generatePath(Routes.InvoicesEdit, { id: ctx.item.id })),
    }),

    gridActionsCell: (cell: { item: Invoice }) => (
      <MenuButton onClick={(e: React.MouseEvent<HTMLElement>) => handlers.showMenu(e, cell.item)} />
    ),

    gridStatusCell: (cell: { item: Invoice }) => (
      <StatusChip status={cell.item.status} size="small" label={cell.item.status} />
    ),

    gridPaidStatusCell: (cell: { item: Invoice }) => (
      <StatusChip status={cell.item.paidStatus} size="small" label={cell.item.paidStatus} />
    ),

    gridMenu: () => {
      const menuItems = [
        { label: 'Edit', icon: <Edit fontSize="small" />, handler: handlers.edit },
        { label: 'Delete', icon: <Delete fontSize="small" />, handler: handlers.delete },
        { label: 'View', icon: <Visibility fontSize="small" />, handler: handlers.view },
        { label: 'Clone invoice', icon: <Description fontSize="small" />, handler: handlers.clone },
        { label: 'Mark as sent', icon: <CheckCircle fontSize="small" />, handler: handlers.markSent },
        { label: 'Send invoice', icon: <Reply fontSize="small" />, handler: handlers.send },
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
      <Common title="Invoices" breadcrumbs={breadcrumbs} actions={renderers.commonActions}>
        {renderers.gridMenu()}
        <Tabs
          value={tabFilter}
          indicatorColor="primary"
          textColor="primary"
          aria-label="Estimates"
          onChange={(_, val) => setTabFilter(val)}
        >
          <Tab label="Due" value="DUE" />
          <Tab label="Draft" value="DRAFT" />
          <Tab label="All" value="ALL" />
        </Tabs>
        <Divider className="mb-3" />
        <Typography
          variant="body2"
          color="textSecondary"
          align="right"
          className="mb-3"
        >{`Showing: ${filteredData.length} of ${availableData.length}`}</Typography>
        <FlexGrid {...gridCommonProps} itemsSource={filteredData}>
          <FlexGridFilter />
          <FlexGridColumn header="Date" binding="invoiceDate" format="MMM d yyyy" width={140} />
          <FlexGridColumn
            header="Number"
            binding="invoiceNumber"
            width={180}
            cellTemplate={renderers.gridEstimateCell}
          />
          <FlexGridColumn header="Customer" binding="customerId" width="*" dataMap={customersMap} />
          <FlexGridColumn header="Status" binding="status" width={130}>
            <FlexGridCellTemplate cellType="Cell" template={renderers.gridStatusCell} />
          </FlexGridColumn>
          <FlexGridColumn header="Paid Status" binding="paidStatus" width={130}>
            <FlexGridCellTemplate cellType="Cell" template={renderers.gridPaidStatusCell} />
          </FlexGridColumn>
          <FlexGridColumn header="Amount Due" binding="total" format="c2" width={150} />
          <FlexGridColumn allowPinning="None" width={66}>
            <FlexGridCellTemplate cellType="Cell" template={renderers.gridActionsCell} />
          </FlexGridColumn>
        </FlexGrid>
      </Common>
    </Container>
  );
};
