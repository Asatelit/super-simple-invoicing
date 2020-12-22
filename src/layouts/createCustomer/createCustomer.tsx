import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Button, TextField, TextFieldProps, GridProps } from '@material-ui/core';
import { Common } from 'layouts';
import { Form, FormDataProp, BreadcrumbsCrumbProp } from 'components';
import { AppActions, Customer } from 'types';
import { Routes } from 'enums';
import styles from './createCustomer.module.css';

export type CreateCustomerProps = {
  actions: AppActions;
  breadcrumbs?: BreadcrumbsCrumbProp[];
};

export const CreateCustomer: React.FC<CreateCustomerProps> = ({ actions, breadcrumbs }) => {
  const [data, setData] = useState<Partial<Customer>>({});
  const { replace } = useHistory();

  const updateData = (value: Partial<Customer>) => setData({ ...data, ...value });

  const renderActions = (
    <Button type="submit" variant="contained" color="primary" form="CreateCustomerForm">
      Save Customer
    </Button>
  );

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    actions.customers.add({ name: '', ...data });
    replace(Routes.Customers);
  };

  const commonGridProps: GridProps = { item: true, xs: 12, sm: 6 };

  const getTextFieldProps = (id: string): TextFieldProps => ({
    id,
    name: id,
    fullWidth: true,
    size: 'small',
    variant: 'outlined',
  });

  const formData: FormDataProp[] = [
    {
      label: 'Basic Info',
      elements: [
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getTextFieldProps('DisplayName')}
              required
              label="Display Name"
              value={data.name || ''}
              onChange={(e) => updateData({ name: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getTextFieldProps('PrimaryContactName')}
              name="PrimaryContactName"
              label="Primary Contact Name"
              value={data.contactName || ''}
              onChange={(e) => updateData({ contactName: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getTextFieldProps('Email')}
              label="Email"
              autoComplete="email"
              value={data.email || ''}
              onChange={(e) => updateData({ email: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getTextFieldProps('Phone')}
              label="Phone"
              autoComplete="phone"
              value={data.phone || ''}
              onChange={(e) => updateData({ phone: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getTextFieldProps('PrimaryCurrency')}
              label="Primary Currency"
              value={data.currencyId}
              onChange={(e) => updateData({ currencyId: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: (
            <TextField
              {...getTextFieldProps('Website')}
              type="url"
              label="Website"
              value={data.website}
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
              {...getTextFieldProps('BillingAddressName')}
              label="Name"
              value={data.website}
              onChange={(e) => updateData({ website: e.target.value })}
            />
          ),
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('BillingAddressCountry')} label="Country" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('BillingAddressState')} label="State" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('BillingAddressCity')} label="City" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('BillingAddressStreet1')} label="Address Line 1" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('BillingAddressPhone')} label="Phone" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('BillingAddressStreet2')} label="Address Line 2" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('BillingAddressZipCode')} label="Zip Code" />,
        },
      ],
    },
    {
      label: 'Shipping Address',
      elements: [
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('ShippingAddressName')} label="Name" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('ShippingAddressCountry')} label="Country" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('ShippingAddressState')} label="State" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('ShippingAddressCity')} label="City" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('ShippingAddressStreet1')} label="Address Line 1" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('ShippingAddressPhone')} label="Phone" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('ShippingAddressStreet2')} label="Address Line 2" />,
        },
        {
          gridProps: { ...commonGridProps },
          children: <TextField {...getTextFieldProps('ShippingAddressZipCode')} label="Zip Code" />,
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="New Customers" breadcrumbs={breadcrumbs} actions={renderActions}>
        <Form id="CreateCustomerForm" data={formData} onSubmit={handleOnSubmit} />
      </Common>
    </Container>
  );
};
