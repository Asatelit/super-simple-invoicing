import React, { useState, useEffect, FormEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import {
  Button,
  Container,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  TextFieldProps,
  GridProps,
  FormControl,
} from '@material-ui/core';
import { Form, FormDataProp, BreadcrumbsCrumbProp } from 'components';
import { AppActions, Customer, Payment, Invoice, Settings } from 'types';
import { PaymentDataAdd, PaymentDataUpdate } from 'actions';
import { Common } from 'layouts';
import { Routes } from 'enums';
import styles from './paymentsEditor.module.css';

export type PaymentsEditorProps = {
  actions: AppActions;
  customers: Customer[];
  invoices: Invoice[];
  settings: Settings;
  breadcrumbs?: BreadcrumbsCrumbProp[];
  payments: Payment[];
};

export const PaymentsEditor = ({
  actions,
  breadcrumbs,
  customers,
  invoices,
  payments,
  settings,
}: PaymentsEditorProps) => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const [data, setData] = useState<PaymentDataAdd | PaymentDataUpdate>({
    id: '',
    paymentDate: new Date(),
    paymentNumber: `${settings.paymentPrefix}-${1001 + (payments?.length || 0)}`,
    paymentMode: 'Other',
    amount: 0,
  });

  useEffect(() => {
    if (id === undefined) return;
    // Get data for editing
    const payment = payments.find((element) => element.id === id);
    if (payment) {
      setData(payment);
    } else {
      history.replace(Routes.Admin);
      toast.error('The requested resource was not found.');
    }
  }, [payments, history, id]);

  // Data update helper
  const updateData = (value: Partial<PaymentDataAdd | PaymentDataUpdate>) => setData({ ...data, ...value });

  const renderActions = (
    <Button type="submit" variant="contained" color="primary" form="EditPaymentForm">
      {id ? 'Update Payment' : 'Save Payment'}
    </Button>
  );

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (id) {
      // Update item
      actions.payments.update(data as PaymentDataUpdate);
    } else {
      // Create item
      actions.payments.add(data as PaymentDataAdd);
    }
    history.goBack();
  };

  const getCommonTextFieldProps = (id: string): TextFieldProps => ({
    id: `PaymentEditor${id}`,
    name: `PaymentEditor${id}`,
    size: 'small',
    variant: 'outlined',
  });

  const gridProps: GridProps = { item: true, sm: 12, md: 6 };

  const formData: FormDataProp[] = [
    {
      elements: [
        {
          gridProps,
          children: (
            <KeyboardDatePicker
              fullWidth
              required
              id="PaymentInvoiceDate"
              name="PaymentInvoiceDate"
              size="small"
              inputVariant="outlined"
              label="Invoice Date"
              format="MM/dd/yyyy"
              value={data.paymentDate ?? ''}
              onChange={(date) => updateData({ paymentDate: date || undefined })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('PaymentNumber')}
              fullWidth
              label="Payment Number"
              value={data.paymentNumber ?? ''}
              onChange={(e) => updateData({ paymentNumber: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <Autocomplete
              id="PaymentCustomer"
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
            <Autocomplete
              id="PaymentInvoiceId"
              options={invoices}
              getOptionLabel={(option: Invoice) => option.invoiceNumber || ''}
              value={invoices.find((invoice) => data.invoiceId === invoice.id) || null}
              onChange={(_, selectedInvoice) => updateData({ invoiceId: selectedInvoice?.id })}
              renderInput={(params) => (
                <TextField {...params} label="Invoice" variant="outlined" size="small" />
              )}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('PaymentAmount')}
              fullWidth
              required
              InputProps={{ inputProps: { min: 0, step: 'any', type: 'number' } }}
              label="Amount"
              value={data.amount ?? 0}
              onChange={(e) => updateData({ amount: parseFloat(e.target.value) })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel id="PaymentModeLabel">Payment Mode</InputLabel>
              <Select
                id="PaymentMode"
                labelId="PaymentModeLabel"
                labelWidth={140}
                value={data.paymentMode ?? null}
                onChange={(e) => updateData({ paymentMode: e.target.value as string })}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Check">Check</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          ),
        },
        {
          gridProps: { ...gridProps, md: 12 },
          children: (
            <TextField
              {...getCommonTextFieldProps('PaymentDescription')}
              fullWidth
              multiline
              rows={2}
              label="Notes"
              value={data.notes ?? ''}
              onChange={(e) => updateData({ notes: e.target.value })}
            />
          ),
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common
        title={payments ? 'Edit Payment' : 'New Payment'}
        breadcrumbs={breadcrumbs}
        actions={renderActions}
      >
        <Form id="EditPaymentForm" data={formData} onSubmit={handleOnSubmit} className={styles.form} />
      </Common>
    </Container>
  );
};
