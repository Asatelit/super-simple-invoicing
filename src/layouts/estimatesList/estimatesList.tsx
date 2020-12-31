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
import { Edit, Delete, CheckCircle, Description, Cancel, Reply, Visibility } from '@material-ui/icons';
import { DataMap } from '@grapecity/wijmo.grid';
import { FlexGrid, FlexGridColumn, FlexGridCellTemplate } from '@grapecity/wijmo.react.grid';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { CellMaker } from '@grapecity/wijmo.grid.cellmaker';
import { BreadcrumbsCrumbProp, MenuButton, UndoButton, StatusChip } from 'components';
import { formatItem } from 'utils';
import { AppActions, Estimate, Customer } from 'types';
import { Common } from 'layouts';
import { Routes } from 'enums';
import styles from './estimatesList.module.css';

export type EstimatesListProps = {
  actions: AppActions;
  breadcrumbs?: BreadcrumbsCrumbProp[];
  customers: Customer[];
  estimates: Estimate[];
};

type FilterByStatus = 'DRAFT' | 'SENT' | 'ALL';

export const EstimatesList: React.FC<EstimatesListProps> = ({
  actions,
  breadcrumbs,
  estimates,
  customers,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentEstimate, setCurrentEstimate] = useState<Estimate | null>(null);
  const [tabFilter, setTabFilter] = useState<FilterByStatus>('DRAFT');
  const history = useHistory();

  const availableData = useMemo(() => estimates.filter((estimate) => !estimate.isDeleted), [estimates]);
  const customersMap = useMemo(() => new DataMap(customers, 'id', 'name'), [customers]);
  const filteredData = useMemo(() => {
    if (tabFilter === 'ALL') return availableData;
    return availableData.filter((el) => el.status === tabFilter);
  }, [availableData, tabFilter]);

  const handlers = {
    showMenu: (event: React.MouseEvent<HTMLElement>, item: Estimate) => {
      setAnchorEl(event.currentTarget);
      setCurrentEstimate(item);
    },

    closeMenu: () => {
      setAnchorEl(null);
      setCurrentEstimate(null);
    },

    edit: () => {
      if (!currentEstimate) return;
      history.push(generatePath(Routes.EstimatesEdit, { id: currentEstimate.id }));
      handlers.closeMenu();
    },

    view: () => {
      if (!currentEstimate) return;
      history.push(generatePath(Routes.EstimatesView, { id: currentEstimate.id }));
      handlers.closeMenu();
    },

    delete: () => {
      if (!currentEstimate) return;
      const removedData = actions.estimates.remove([currentEstimate.id]);
      if (removedData) {
        toast(<UndoButton message="Estimate deleted." onClick={() => handlers.undo(removedData)} />);
      }
      handlers.closeMenu();
    },

    convert: () => alert('WIP'),

    send: () => alert('WIP'),

    undo: (customers: Estimate[]) => {
      const restoringDataIds = customers.map((item) => item.id);
      actions.estimates.undoRemove(restoringDataIds);
    },

    /**
     * Mark as accepted.
     */
    markAccepted: () => {
      if (!currentEstimate) return;
      const removedData = actions.estimates.markAccepted([currentEstimate.id]);
      if (removedData) toast.success('Estimate marked as accepted');
      handlers.closeMenu();
    },

    /**
     * Mark as rejected.
     */
    markRejected: () => {
      if (!currentEstimate) return;
      const removedData = actions.estimates.markRejected([currentEstimate.id]);
      if (removedData) toast.success('Estimate marked as rejected');
      handlers.closeMenu();
    },

    /**
     * Mark as sent.
     */
    markSent: () => {
      if (!currentEstimate) return;
      const removedData = actions.estimates.markSent([currentEstimate.id]);
      if (removedData) toast.success('Estimate marked as sent');
      handlers.closeMenu();
    },
  };

  const renderers = {
    commonActions: (
      <Button variant="contained" color="primary" component={RouterLink} to={Routes.EstimatesCreate}>
        New Item
      </Button>
    ),

    gridEstimateCell: CellMaker.makeLink({
      href: generatePath(Routes.EstimatesEdit.replace(':id', '${item.id}')), // eslint-disable-line
      click: (_, ctx) => history.push(generatePath(Routes.EstimatesEdit, { id: ctx.item.id })),
    }),

    gridActionsCell: (cell: { item: Estimate }) => (
      <MenuButton onClick={(e: React.MouseEvent<HTMLElement>) => handlers.showMenu(e, cell.item)} />
    ),

    gridStatusCell: (cell: { item: Estimate }) => (
      <StatusChip status={cell.item.status} size="small" label={cell.item.status} />
    ),

    gridMenu: () => {
      const menuItems = [
        { label: 'Edit', icon: <Edit fontSize="small" />, handler: handlers.edit },
        { label: 'Delete', icon: <Delete fontSize="small" />, handler: handlers.delete },
        { label: 'View', icon: <Visibility fontSize="small" />, handler: handlers.view },
        { label: 'Convert to invoice', icon: <Description fontSize="small" />, handler: handlers.convert },
        { label: 'Mark as sent', icon: <CheckCircle fontSize="small" />, handler: handlers.markSent },
        { label: 'Send estimate', icon: <Reply fontSize="small" />, handler: handlers.send },
        { label: 'Mark as accepted', icon: <CheckCircle fontSize="small" />, handler: handlers.markAccepted },
        { label: 'Mark as rejected', icon: <Cancel fontSize="small" />, handler: handlers.markRejected },
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
      <Common title="Estimates" breadcrumbs={breadcrumbs} actions={renderers.commonActions}>
        {renderers.gridMenu()}
        <Tabs
          value={tabFilter}
          indicatorColor="primary"
          textColor="primary"
          aria-label="Estimates"
          onChange={(_, val) => setTabFilter(val)}
        >
          <Tab label="Draft" value="DRAFT" />
          <Tab label="Sent" value="SENT" />
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
          <FlexGridColumn header="Date" binding="estimateDate" format="MMM d yyyy" />
          <FlexGridColumn
            header="Estimate"
            binding="estimateNumber"
            width={180}
            cellTemplate={renderers.gridEstimateCell}
          />
          <FlexGridColumn header="Customer" binding="customerId" width="*" dataMap={customersMap} />
          <FlexGridColumn header="Status" binding="status" width={130}>
            <FlexGridCellTemplate cellType="Cell" template={renderers.gridStatusCell} />
          </FlexGridColumn>
          <FlexGridColumn header="Amount Due" binding="total" format="c2" width={140} />
          <FlexGridColumn allowPinning="None" width={66}>
            <FlexGridCellTemplate cellType="Cell" template={renderers.gridActionsCell} />
          </FlexGridColumn>
        </FlexGrid>
      </Common>
    </Container>
  );
};
