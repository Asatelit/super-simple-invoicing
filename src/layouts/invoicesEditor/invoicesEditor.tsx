import React, { useState, useEffect, FormEvent } from 'react';
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
import { InvoiceActionsCalculateProps } from 'actions';
import { Form, FormDataProp, FormDataElementProp, BreadcrumbsCrumbProp } from 'components';
import { AppActions, Invoice, Tax, Customer, LineItem, Item } from 'types';
import { Common } from 'layouts';
import { Routes } from 'enums';
import styles from './invoicesEditor.module.css';

export type InvoicesEditorProps = {
  actions: AppActions;
  breadcrumbs?: BreadcrumbsCrumbProp[];
  customers: Customer[];
  invoices?: Invoice[];
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

export const InvoicesEditor = ({
  actions,
  breadcrumbs,
  customers,
  invoices,
  items,
  taxPerItem,
  taxes,
}: InvoicesEditorProps) => {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const [data, setData] = useState<Invoice>(
    actions.invoices.calculate({ dueDate: addDays(new Date(), 7), lineItems: [lineItemDraft] }),
  );

  useEffect(() => {
    if (!invoices) return;
    // Get data for editing
    const invoice = invoices.find((element) => element.id === id);
    if (invoice) {
      setData(invoice);
    } else {
      history.replace(Routes.Admin);
      toast.error('The requested resource was not found.');
    }
  }, [invoices, history, id]);

  // Data update helper
  const updateData = (value: InvoiceActionsCalculateProps) => {
    const estimate = actions.invoices.calculate(value, data);
    setData(estimate);
  };

  const renderActions = (
    <Button type="submit" variant="contained" color="primary" form="EditInvoiceForm">
      {invoices ? 'Update Invoice' : 'Save Invoice'}
    </Button>
  );

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    actions.invoices.update(data);
    history.goBack();
  };

  const getCommonTextFieldProps = (id: string): TextFieldProps => ({
    id: `InvoicesEditor${id}`,
    name: `InvoicesEditor${id}`,
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
              id={`InvoicesEditorLineItem${key}`}
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

  const gridProps: GridProps = { item: true, sm: 12, md: 6 };

  const formData: FormDataProp[] = [
    {
      elements: [
        {
          gridProps: { ...gridProps, md: 12 },
          children: (
            <Autocomplete
              id="InvoicesEditorCustomer"
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
              id="InvoicesEditorInvoiceDate"
              name="InvoicesEditorInvoiceDate"
              size="small"
              inputVariant="outlined"
              label="Invoice Date"
              format="MM/dd/yyyy"
              value={data.invoiceDate ?? ''}
              onChange={(date) => updateData({ invoiceDate: date || undefined })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <KeyboardDatePicker
              fullWidth
              required
              id="InvoiceEditorDueDate"
              name="InvoiceEditorDueDate"
              size="small"
              inputVariant="outlined"
              label="Due Date"
              format="MM/dd/yyyy"
              value={data.dueDate ?? ''}
              onChange={(date) => updateData({ dueDate: date || undefined })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('InvoiceNumber')}
              fullWidth
              required
              label="Invoice Number"
              value={data.invoiceNumber ?? ''}
              onChange={(e) => updateData({ invoiceNumber: e.target.value })}
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
                  {formatMoney(data.subTotal)}
                </Typography>
              </Grid>
              <Grid item md={12}>
                <Box textAlign="right">
                  <FormControl variant="outlined" size="small" className="mb-3" style={{ width: '180px' }}>
                    <InputLabel htmlFor="InvoicesEditorDiscountValue">Discount</InputLabel>
                    <OutlinedInput
                      id="InvoicesEditorDiscountValue"
                      name="InvoicesEditorDiscountValue"
                      value={data.discountValue || ''}
                      error={Math.sign(data.total) === -1}
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
                  {formatMoney(data.total)}
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
        title={invoices ? 'Edit Invoice' : 'New Invoice'}
        breadcrumbs={breadcrumbs}
        actions={renderActions}
      >
        <Form id="EditInvoiceForm" data={formData} onSubmit={handleOnSubmit} className={styles.form} />
      </Common>
    </Container>
  );
};
