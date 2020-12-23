import React, { useState, useEffect, FormEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Button, TextField, TextFieldProps, GridProps } from '@material-ui/core';
import { Form, FormDataProp, BreadcrumbsCrumbProp } from 'components';
import { AppActions, Customer } from 'types';
import { CustomersActionsAdd, CustomersActionsUpdate } from 'actions';
import { Common } from 'layouts';
import { Routes } from 'enums';
import styles from './customersEditor.module.css';

export type CustomersEditorProps = {
  actions: AppActions;
  breadcrumbs?: BreadcrumbsCrumbProp[];
  customers?: Customer[];
};

export const CustomersEditor: React.FC<CustomersEditorProps> = ({ actions, breadcrumbs, customers }) => {
  const [data, setData] = useState<CustomersActionsAdd | CustomersActionsUpdate>({ name: '' });
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();

  useEffect(() => {
    if (!customers) return;
    // Get data for editing
    const customer = customers.find((item) => item.id === id);
    if (customer) {
      setData(customer);
    } else {
      history.replace(Routes.Admin);
      toast.error('The requested resource was not found.');
    }
  }, [customers, history, id]);

  // Data update helper
  const updateData = (value: Partial<Customer>) => setData({ ...data, ...value });

  const renderActions = (
    <Button type="submit" variant="contained" color="primary" form="CreateCustomerForm">
      {customers ? 'Update Customer' : 'Save Customer'}
    </Button>
  );

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (customers) {
      // Update customer
      actions.customers.update(data as CustomersActionsUpdate);
    } else {
      // Create customer
      actions.customers.add(data as CustomersActionsAdd);
    }
    history.goBack();
  };

  const fillShippingAddress = () => {
    console.info('fillShippingAddress');
    setData({
      ...data,
      shippingAddressLine1: data.billingAddressLine1 ?? '',
      shippingAddressLine2: data.billingAddressLine2 ?? '',
      shippingCity: data.billingCity ?? '',
      shippingCountry: data.billingCountry ?? '',
      shippingFax: data.billingFax ?? '',
      shippingPhone: data.billingPhone ?? '',
      shippingState: data.billingState ?? '',
      shippingZip: data.billingZip ?? '',
    });
  };

  const getCommonTextFieldProps = (id: string): TextFieldProps => ({
    id,
    name: id,
    fullWidth: true,
    size: 'small',
    variant: 'outlined',
  });

  const commonGridProps: GridProps = { item: true, xs: 12, sm: 6 };

  const formData: FormDataProp[] = [
    {
      label: 'Basic Info',
      elements: [
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('DisplayName')}
              required
              label="Display Name"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('PrimaryContactName')}
              label="Primary Contact Name"
              value={data.contactName ?? ''}
              onChange={(e) => updateData({ contactName: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('Email')}
              label="Email"
              autoComplete="email"
              value={data.email ?? ''}
              onChange={(e) => updateData({ email: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('Phone')}
              label="Phone"
              autoComplete="phone"
              value={data.phone ?? ''}
              onChange={(e) => updateData({ phone: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('PrimaryCurrency')}
              label="Primary Currency"
              value={data.currencyId ?? ''}
              onChange={(e) => updateData({ currencyId: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('Website')}
              type="url"
              label="Website"
              value={data.website ?? ''}
              onChange={(e) => updateData({ website: e.target.value })}
            />
          ),
        },
      ],
    },
    {
      label: 'Billing Address',
      elements: [
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('BillingAddressStreet1')}
              label="Address Line 1"
              value={data.billingAddressLine1 ?? ''}
              onChange={(e) => updateData({ billingAddressLine1: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('BillingAddressCountry')}
              label="Country"
              value={data.billingCountry ?? ''}
              onChange={(e) => updateData({ billingCountry: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('BillingAddressStreet2')}
              label="Address Line 2"
              value={data.billingAddressLine2 ?? ''}
              onChange={(e) => updateData({ billingAddressLine2: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('BillingAddressState')}
              label="State"
              value={data.billingState ?? ''}
              onChange={(e) => updateData({ billingState: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('BillingAddressCity')}
              label="City"
              value={data.billingCity ?? ''}
              onChange={(e) => updateData({ billingCity: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('BillingAddressPhone')}
              label="Phone"
              value={data.billingPhone ?? ''}
              onChange={(e) => updateData({ billingPhone: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('BillingAddressZipCode')}
              label="Zip Code"
              value={data.billingZip ?? ''}
              onChange={(e) => updateData({ billingZip: e.target.value })}
            />
          ),
        },
      ],
    },
    {
      label: 'Shipping Address',
      action: (
        <Button type="button" variant="outlined" color="primary" onClick={fillShippingAddress}>
          Copy from Billing
        </Button>
      ),
      elements: [
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('ShippingAddressStreet1')}
              label="Address Line 1"
              value={data.shippingAddressLine1 ?? ''}
              onChange={(e) => updateData({ shippingAddressLine1: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('ShippingAddressCountry')}
              label="Country"
              value={data.shippingCountry ?? ''}
              onChange={(e) => updateData({ shippingCountry: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('ShippingAddressStreet2')}
              label="Address Line 2"
              value={data.shippingAddressLine2 ?? ''}
              onChange={(e) => updateData({ shippingAddressLine2: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('ShippingAddressState')}
              label="State"
              value={data.shippingState ?? ''}
              onChange={(e) => updateData({ shippingState: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('ShippingAddressCity')}
              label="City"
              value={data.shippingCity ?? ''}
              onChange={(e) => updateData({ shippingCity: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('ShippingAddressPhone')}
              label="Phone"
              value={data.shippingPhone ?? ''}
              onChange={(e) => updateData({ shippingPhone: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getCommonTextFieldProps('ShippingAddressZipCode')}
              label="Zip Code"
              value={data.shippingZip ?? ''}
              onChange={(e) => updateData({ shippingZip: e.target.value })}
            />
          ),
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common
        title={customers ? 'Edit Customer' : 'New Customers'}
        breadcrumbs={breadcrumbs}
        actions={renderActions}
      >
        <Form id="CreateCustomerForm" data={formData} onSubmit={handleOnSubmit} />
      </Common>
    </Container>
  );
};
