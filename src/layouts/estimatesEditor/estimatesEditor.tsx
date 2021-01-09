import React, { useState, useEffect, FormEvent } from 'react';
import { addDays } from 'date-fns';
import { formatMoney } from 'accounting';
import { toast } from 'react-toastify';
import { Autocomplete } from '@material-ui/lab';
import { useHistory, useParams } from 'react-router-dom';
import {
  IconButton,
  Box,
  Button,
  Container,
  TextField,
  TextFieldProps,
  Grid,
  GridProps,
  Typography,
} from '@material-ui/core';
import { AddBoxOutlined as AddIcon, DeleteOutline as DeleteIcon } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { EstimateActionsAddProps, EstimateActionsUpdateProps } from 'actions';
import { Form, FormDataProp, FormDataElementProp, BreadcrumbsCrumbProp } from 'components';
import { AppActions, Estimate, Tax, Customer, LineItem, Item } from 'types';
import { Common } from 'layouts';
import { Routes } from 'enums';
import styles from './estimatesEditor.module.css';

export type EstimatesEditorProps = {
  actions: AppActions;
  breadcrumbs?: BreadcrumbsCrumbProp[];
  customers: Customer[];
  estimates?: Estimate[];
  items: Item[];
  taxPerItem: boolean;
  taxes: Tax[];
};

const lineItemDraft: LineItem = {
  amount: 0,
  description: '',
  itemId: '',
  price: 0,
  quantity: 1,
  taxAmount: 0,
  total: 0,
  unit: '',
  discountAmount: 0,
  discountType: 'fixed',
  discountValue: 0,
  lineTaxes: [],
};

export const EstimatesEditor = ({
  actions,
  breadcrumbs,
  customers,
  estimates,
  items,
  taxPerItem,
  taxes,
}: EstimatesEditorProps) => {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...lineItemDraft }]);
  const [data, setData] = useState<EstimateActionsAddProps & EstimateActionsUpdateProps>({
    id: '',
    estimateDate: new Date(),
    expiryDate: addDays(new Date(), 7),
    customerId: '',
    estimateNumber: 'EST-000001',
  });

  useEffect(() => {
    if (!estimates) return;
    // Get data for editing
    const estimate = estimates.find((element) => element.id === id);
    if (estimate) {
      setData(estimate);
      setLineItems(estimate.lineItems);
    } else {
      history.replace(Routes.Admin);
      toast.error('The requested resource was not found.');
    }
  }, [estimates, history, id]);

  // Data update helper
  const updateData = (value: Partial<EstimateActionsAddProps | EstimateActionsUpdateProps>) =>
    setData({ ...data, ...value });

  const renderActions = (
    <Button type="submit" variant="contained" color="primary" form="EditEstimateForm">
      {estimates ? 'Update Estimate' : 'Save Estimate'}
    </Button>
  );

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (id) {
      const props: EstimateActionsUpdateProps = { ...data, lineItems };
      actions.estimates.update(props);
    } else {
      const props: EstimateActionsAddProps = { ...data, lineItems };
      actions.estimates.add(props);
    }
    history.goBack();
  };

  const getCommonTextFieldProps = (id: string): TextFieldProps => ({
    id: `EstimatesEditor${id}`,
    name: `EstimatesEditor${id}`,
    size: 'small',
    variant: 'outlined',
  });

  const getLineItemsFormControls = () => {
    const result: FormDataElementProp[] = [];
    const update = (data: Partial<LineItem>, key: number) => {
      const updLineItems = [...lineItems];
      updLineItems[key] = { ...updLineItems[key], ...data };
      updLineItems[key].amount = updLineItems[key].quantity * updLineItems[key].price;
      updLineItems[key].total = updLineItems[key].amount + updLineItems[key].discountAmount + updLineItems[key].taxAmount;
      setLineItems(updLineItems);
    };

    lineItems.forEach((lineItem, key) => {
      result.push(
        {
          gridProps: { ...gridProps, md: 6 },
          children: (
            <Autocomplete
              id={`EstimatesEditorLineItem${key}`}
              options={items}
              getOptionLabel={(option: Item) => option.name || ''}
              value={items.find((item) => item.id === lineItem.itemId) || null}
              onChange={(_, selectedItem) => update({ itemId: selectedItem?.id }, key)}
              renderInput={(params) => (
                <TextField {...params} required label="Item" variant="outlined" size="small" />
              )}
            />
          ),
        },
        {
          gridProps: { ...gridProps, xs: 6, md: 2 },
          children: (
            <TextField
              {...getCommonTextFieldProps(`LineItemQuantity${key}`)}
              fullWidth
              label="Quantity"
              value={lineItem.quantity}
              onChange={(e) => update({ quantity: parseInt(e.target.value, 10) }, key)}
            />
          ),
        },
        {
          gridProps: { ...gridProps, xs: 6, md: 2 },
          children: (
            <TextField
              {...getCommonTextFieldProps(`LineItemPrice${key}`)}
              fullWidth
              label="Price"
              value={lineItem.price}
              onChange={(e) => update({ price: parseInt(e.target.value, 10) }, key)}
            />
          ),
        },
        {
          gridProps: { ...gridProps, md: 2 },
          children: (
            <Box display="flex" alignItems="center">
              <Box width={1}>
                <Typography align="right">{formatMoney(lineItem.amount)}</Typography>
              </Box>
              <IconButton
                size="small"
                className="ml-2"
                onClick={() => setLineItems(lineItems.filter((_, index) => key !== index))}
              >
                <DeleteIcon style={{ margin: '0.25rem' }} />
              </IconButton>
            </Box>
          ),
        },
      );
    });

    result.push({
      gridProps: { ...gridProps, md: 12 },
      children: (
        <Button variant="text" color="primary" fullWidth onClick={addLineItem}>
          <AddIcon className="mr-2" />
          Add an Item
        </Button>
      ),
    });

    return result;
  };

  const addLineItem = () => {
    const updLineItems = [...lineItems];
    updLineItems.push(lineItemDraft);
    setLineItems(updLineItems);
  };

  const gridProps: GridProps = { item: true, sm: 12, md: 6 };

  const formData: FormDataProp[] = [
    {
      elements: [
        {
          gridProps: { ...gridProps, md: 12 },
          children: (
            <Autocomplete
              id="EstimatesEditorCustomer"
              options={customers}
              getOptionLabel={(option: Customer) => option.name || ''}
              value={customers.find((customer) => data.customerId === customer.id) || null}
              onChange={(_, selectedCustomer) => updateData({ customerId: selectedCustomer?.id })}
              renderInput={(params) => (
                <TextField {...params} required label="Customer" variant="outlined" size="small" />
              )}
            />
          ),
        },
        {
          gridProps,
          children: (
            <KeyboardDatePicker
              fullWidth
              required
              id="EstimatesEditorEstimateDate"
              name="EstimatesEditorEstimateDate"
              size="small"
              inputVariant="outlined"
              label="Estimate Date"
              format="MM/dd/yyyy"
              value={data.estimateDate ?? ''}
              onChange={(date) => updateData({ estimateDate: date || undefined })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <KeyboardDatePicker
              fullWidth
              required
              id="EstimatesEditorDueDate"
              name="EstimatesEditorDueDate"
              size="small"
              inputVariant="outlined"
              label="Due Date"
              format="MM/dd/yyyy"
              value={data.expiryDate ?? ''}
              onChange={(date) => updateData({ expiryDate: date || undefined })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('EstimateNumber')}
              fullWidth
              required
              label="Estimate Number"
              value={data.estimateNumber ?? ''}
              onChange={(e) => updateData({ estimateNumber: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('RefNumber')}
              fullWidth
              label="Ref Number"
              value={data.referenceNumber ?? ''}
              onChange={(e) => updateData({ referenceNumber: e.target.value })}
            />
          ),
        },
      ],
    },
    {
      label: 'Items',
      elements: getLineItemsFormControls(),
    },
    {
      label: 'Notes',
      elements: [
        {
          gridProps: { ...gridProps, md: 6 },
          children: (
            <TextField
              {...getCommonTextFieldProps('Notes')}
              multiline
              fullWidth
              rows={3}
              value={data.notes ?? ''}
              onChange={(e) => updateData({ notes: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...gridProps, md: 6 },
          children: (
            <Grid container>
              <Grid md={12}>
                <Typography align="right" className="mr-4">
                  <span className="mr-4">Subtotal:</span>
                  {formatMoney(lineItems.reduce((a, b) => a + b.total, 0))}
                </Typography>
              </Grid>
              <Grid md={12}>
                <Typography align="right" className="mr-4">
                  <span className="mr-4">Total (UAH):</span>
                  {formatMoney(lineItems.reduce((a, b) => a + b.total, 0))}
                </Typography>
              </Grid>
            </Grid>
          ),
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Common
        title={estimates ? 'Edit Estimate' : 'New Estimate'}
        breadcrumbs={breadcrumbs}
        actions={renderActions}
      >
        <Form id="EditEstimateForm" data={formData} onSubmit={handleOnSubmit} className={styles.form} />
      </Common>
    </Container>
  );
};
