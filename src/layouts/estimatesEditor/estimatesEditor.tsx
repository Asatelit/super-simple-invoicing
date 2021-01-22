import React, { useMemo, useState, useEffect, FormEvent } from 'react';
import { addDays } from 'date-fns';
import { formatMoney, settings } from 'accounting';
import { toast } from 'react-toastify';
import { Autocomplete } from '@material-ui/lab';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  GridProps,
  IconButton,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  TextField,
  TextFieldProps,
  Typography,
} from '@material-ui/core';
import { AddBoxOutlined as AddIcon, DeleteOutline as DeleteIcon } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { EstimateActionsUpdateProps } from 'actions';
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
  const [data, setData] = useState<Estimate>(
    actions.estimates.calculate({ expiryDate: addDays(new Date(), 7), lineItems: [lineItemDraft] }),
  );

  useEffect(() => {
    if (!estimates) return;
    // Get data for editing
    const estimate = estimates.find((element) => element.id === id);
    if (estimate) {
      setData(estimate);
    } else {
      history.replace(Routes.Admin);
      toast.error('The requested resource was not found.');
    }
  }, [estimates, history, id]);

  // Data update helper
  const updateData = (value: EstimateActionsUpdateProps) => {
    const estimate = actions.estimates.calculate(value, data);
    setData(estimate);
  };

  const renderActions = (
    <Button type="submit" variant="contained" color="primary" form="EditEstimateForm">
      {estimates ? 'Update Estimate' : 'Save Estimate'}
    </Button>
  );

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    actions.estimates.update(data);
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

    const update = (value: Partial<LineItem>, key: number) => {
      const updLineItems = [...data.lineItems];
      updLineItems[key] = { ...updLineItems[key], ...value };
      updateData({ lineItems: updLineItems });
    };

    data.lineItems.forEach((lineItem, key) => {
      result.push(
        {
          gridProps: { ...gridProps, md: 6 },
          children: (
            <Autocomplete
              id={`EstimatesEditorLineItem${key}`}
              options={items}
              getOptionLabel={(option: Item) => option.name || ''}
              value={items.find((item) => item.id === lineItem.itemId) || null}
              onChange={(_, selectedItem) =>
                update({ itemId: selectedItem?.id, price: selectedItem?.price || 0 }, key)
              }
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
              value={lineItem.quantity || 1}
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
              value={lineItem.price || 0}
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
                onClick={() => updateData({ lineItems: data.lineItems.filter((_, index) => key !== index) })}
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
    const updLineItems = [...data.lineItems];
    updLineItems.push(lineItemDraft);
    updateData({ lineItems: updLineItems });
  };

  const discountValue = data.discountValue || 0;
  const isPercentage = data.discountType === 'percentage';
  const subtotal = useMemo(() => data.lineItems.reduce((a, b) => a + b.total, 0), [data.lineItems]);
  const discount = useMemo(() => (isPercentage ? (discountValue / 100) * subtotal : discountValue), [
    isPercentage,
    discountValue,
    subtotal,
  ]);
  const amount = {
    subtotal,
    discount,
    total: subtotal - discount,
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
              rows={4}
              value={data.notes ?? ''}
              onChange={(e) => updateData({ notes: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...gridProps, md: 6 },
          children: (
            <Grid container>
              <Grid item md={12}>
                <Typography align="right" className="mr-4 mb-3">
                  <span className="mr-4">Subtotal:</span>
                  {formatMoney(amount.subtotal)}
                </Typography>
              </Grid>
              <Grid item md={12}>
                <Box textAlign="right">
                  <FormControl variant="outlined" size="small" className="mb-3" style={{ width: '180px' }}>
                    <InputLabel htmlFor="EstimatesEditorDiscountValue">Discount</InputLabel>
                    <OutlinedInput
                      id="EstimatesEditorDiscountValue"
                      name="EstimatesEditorDiscountValue"
                      value={data.discountValue || ''}
                      error={Math.sign(amount.total) === -1}
                      onChange={(e) => updateData({ discountValue: parseInt(e.target.value, 10) })}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            style={{ minWidth: '27px' }}
                            onClick={() =>
                              updateData({
                                discountType: data.discountType === 'fixed' ? 'percentage' : 'fixed',
                              })
                            }
                          >
                            {data.discountType === 'fixed' ? settings.currency.symbol : '%'}
                          </IconButton>
                        </InputAdornment>
                      }
                      inputProps={{ 'aria-label': 'type' }}
                      labelWidth={70}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item md={12}>
                <Typography align="right" className="mr-4">
                  <span className="mr-4">Total (UAH):</span>
                  {formatMoney(amount.total)}
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
