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
import { AppActions, Customer, Expense } from 'types';
import { ExpensesActionsAddProps, ExpensesActionsUpdateProps } from 'actions';
import { Common } from 'layouts';
import { Routes } from 'enums';

export type ExpensesEditorProps = {
  actions: AppActions;
  customers: Customer[];
  breadcrumbs?: BreadcrumbsCrumbProp[];
  expenses: Expense[];
};

export const ExpensesEditor = ({ actions, breadcrumbs, customers, expenses }: ExpensesEditorProps) => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const [data, setData] = useState<ExpensesActionsAddProps | ExpensesActionsUpdateProps>({
    id: '',
    expenseDate: new Date(),
    amount: 0,
    expenseCategory: 'Uncategorized',
  });

  useEffect(() => {
    if (id === undefined) return;
    // Get data for editing
    const expense = expenses.find((element) => element.id === id);
    if (expense) {
      setData(expense);
    } else {
      history.replace(Routes.Admin);
      toast.error('The requested resource was not found.');
    }
  }, [expenses, history, id]);

  // Data update helper
  const updateData = (value: Partial<ExpensesActionsUpdateProps | ExpensesActionsUpdateProps>) =>
    setData({ ...data, ...value });

  const renderActions = (
    <Button type="submit" variant="contained" color="primary" form="EditPaymentForm">
      {id ? 'Update Expense' : 'Save Expense'}
    </Button>
  );

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (id) {
      // Update item
      actions.expenses.update(data as ExpensesActionsUpdateProps);
    } else {
      // Create item
      actions.expenses.add(data as ExpensesActionsAddProps);
    }
    history.goBack();
  };

  const getCommonTextFieldProps = (id: string): TextFieldProps => ({
    id: `ExpenseEditor${id}`,
    name: `ExpenseEditor${id}`,
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
            <FormControl variant="outlined" size="small" fullWidth required>
              <InputLabel id="PaymentCategoryLabel">Category</InputLabel>
              <Select
                id="PaymentCategory"
                labelId="PaymentCategoryLabel"
                labelWidth={140}
                value={data.expenseCategory ?? null}
                onChange={(e) => updateData({ expenseCategory: e.target.value as string })}
              >
                <MenuItem value="Tolls">Tolls</MenuItem>
                <MenuItem value="Taxi & Parking">Taxi & Parking</MenuItem>
                <MenuItem value="Insurance">Insurance</MenuItem>
                <MenuItem value="Lease payments">Lease payments</MenuItem>
                <MenuItem value="Rent">Rent</MenuItem>
                <MenuItem value="Advertising">Advertising</MenuItem>
                <MenuItem value="Education and Training">Education and Training</MenuItem>
                <MenuItem value="Restaurants/Dining">Restaurants/Dining</MenuItem>
                <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                <MenuItem value="Bank Fees">Bank Fees</MenuItem>
                <MenuItem value="Taxes & Licenses">Taxes & Licenses</MenuItem>
                <MenuItem value="Accounting">Accounting</MenuItem>
                <MenuItem value="Phone">Phone</MenuItem>
                <MenuItem value="Uncategorized">Uncategorized</MenuItem>
              </Select>
            </FormControl>
          ),
        },
        {
          gridProps,
          children: (
            <KeyboardDatePicker
              fullWidth
              required
              id="ExpenseDate"
              name="ExpenseDate"
              size="small"
              inputVariant="outlined"
              label="Invoice Date"
              format="MM/dd/yyyy"
              value={data.expenseDate ?? ''}
              onChange={(date) => updateData({ expenseDate: date || undefined })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('ExpenseAmount')}
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
            <Autocomplete
              id="ExpenseCustomer"
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
          gridProps: { ...gridProps, md: 12 },
          children: (
            <TextField
              {...getCommonTextFieldProps('ExpenseNote')}
              fullWidth
              multiline
              rows={4}
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
    <Container maxWidth="lg">
      <Common
        title={expenses ? 'Edit Expense' : 'New Expense'}
        breadcrumbs={breadcrumbs}
        actions={renderActions}
      >
        <Form id="EditPaymentForm" data={formData} onSubmit={handleOnSubmit}/>
      </Common>
    </Container>
  );
};
