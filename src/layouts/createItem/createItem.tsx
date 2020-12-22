import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Button, TextField } from '@material-ui/core';
import { Common } from 'layouts';
import { Form, FormDataProp, BreadcrumbsCrumbProp } from 'components';
import { AppActions, Customer } from 'types';
import { Routes } from 'enums';
import styles from './createItem.module.css';

export type CreateItemProps = {
  actions: AppActions;
  breadcrumbs?: BreadcrumbsCrumbProp[];
};

export const CreateItem: React.FC<CreateItemProps> = ({ actions, breadcrumbs }) => {
  const [data, setData] = useState<Partial<Customer>>({});
  const { replace } = useHistory();

  const updateData = (value: Partial<Customer>) => setData({ ...data, ...value });

  const renderActions = (
    <Button type="submit" variant="contained" color="primary" form="CreateItemForm">
      Save Item
    </Button>
  );

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    actions.customers.add({ name: '', ...data });
    replace(Routes.Customers);
  };

  const formData: FormDataProp[] = [
    {
      label: 'Basic Info',
      elements: [
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              required
              fullWidth
              id="DisplayName"
              name="DisplayName"
              label="Display Name"
              value={data.name || ''}
              onChange={(e) => updateData({ name: e.target.value })}
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="PrimaryContactName"
              name="PrimaryContactName"
              label="Primary Contact Name"
              value={data.contactName || ''}
              onChange={(e) => updateData({ contactName: e.target.value })}
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              type="email"
              id="Email"
              name="Email"
              label="Email"
              autoComplete="email"
              value={data.email || ''}
              onChange={(e) => updateData({ email: e.target.value })}
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="Phone"
              name="Phone"
              label="Phone"
              autoComplete="phone"
              value={data.phone || ''}
              onChange={(e) => updateData({ phone: e.target.value })}
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="PrimaryCurrency"
              name="PrimaryCurrency"
              label="Primary Currency"
              value={data.currencyId}
              onChange={(e) => updateData({ currencyId: e.target.value })}
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              type="url"
              id="Website"
              name="Website"
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
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="BillingAddressName"
              name="BillingAddressName"
              label="Name"
              value={data.website}
              onChange={(e) => updateData({ website: e.target.value })}
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField fullWidth id="BillingAddressCountry" name="BillingAddressCountry" label="Country" />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: <TextField fullWidth id="BillingAddressState" name="BillingAddressState" label="State" />,
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: <TextField fullWidth id="BillingAddressCity" name="BillingAddressCity" label="City" />,
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="BillingAddressStreet1"
              name="BillingAddressStreet1"
              label="Address Line 1"
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: <TextField fullWidth id="BillingAddressPhone" name="BillingAddressPhone" label="Phone" />,
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="BillingAddressStreet2"
              name="BillingAddressStreet2"
              label="Address Line 2"
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField fullWidth id="BillingAddressZipCode" name="BillingAddressZipCode" label="Zip Code" />
          ),
        },
      ],
    },
    {
      label: 'Shipping Address',
      elements: [
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: <TextField fullWidth id="ShippingAddressName" name="ShippingAddressName" label="Name" />,
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField fullWidth id="ShippingAddressCountry" name="ShippingAddressCountry" label="Country" />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField fullWidth id="ShippingAddressState" name="ShippingAddressState" label="State" />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: <TextField fullWidth id="ShippingAddressCity" name="ShippingAddressCity" label="City" />,
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="ShippingAddressStreet1"
              name="ShippingAddressStreet1"
              label="Address Line 1"
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField fullWidth id="ShippingAddressPhone" name="ShippingAddressPhone" label="Phone" />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="ShippingAddressStreet2"
              name="ShippingAddressStreet2"
              label="Address Line 2"
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField fullWidth id="ShippingAddressZipCode" name="ShippingAddressZipCode" label="Zip Code" />
          ),
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="New Item" breadcrumbs={breadcrumbs} actions={renderActions}>
        <Form id="CreateItemForm" data={formData} onSubmit={handleOnSubmit} />
      </Common>
    </Container>
  );
};
