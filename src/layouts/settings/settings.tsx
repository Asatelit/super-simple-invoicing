import React, { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Container, Button, TextField } from '@material-ui/core';
import { Common } from 'layouts';
import { Settings as AppSettings, AppActions } from 'types';
import { Form, FormDataProp, BreadcrumbsCrumbProp } from 'components';
import styles from './settings.module.css';

export type SettingsProps = {
  actions: AppActions;
  settings: AppSettings;
  breadcrumbs?: BreadcrumbsCrumbProp[];
};

export const Settings: React.FC<SettingsProps> = ({ actions, breadcrumbs, settings }) => {
  const [data, setData] = useState<Partial<AppSettings>>(settings);

  const updateData = (value: Partial<AppSettings>) => setData({ ...data, ...value });

  const renderActions = (
    <Button type="submit" variant="contained" color="primary" form="SettingsForm">
      Save
    </Button>
  );

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    toast.success('Settings successfully updated.');
  };

  const formData: FormDataProp[] = [
    {
      label: 'Account Settings',
      elements: [
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="Name"
              name="Name"
              label="Name"
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
              id="Email"
              name="Email"
              label="Email"
              value={data.email || ''}
              onChange={(e) => updateData({ email: e.target.value })}
            />
          ),
        },
      ],
    },
    {
      label: 'Company info',
      elements: [
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              required
              fullWidth
              id="CompanyName"
              name="CompanyName"
              label="Company Name"
              value={data.companyName}
              onChange={(e) => updateData({ companyName: e.target.value })}
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
              label="Email"
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
              id="Country"
              name="Country"
              label="Country"
              value={data.addressCountry || ''}
              onChange={(e) => updateData({ addressCountry: e.target.value })}
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="State"
              name="State"
              label="State"
              value={data.addressState || ''}
              onChange={(e) => updateData({ addressState: e.target.value })}
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="City"
              name="City"
              label="City"
              value={data.addressCity || ''}
              onChange={(e) => updateData({ addressCity: e.target.value })}
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="Zip"
              name="Zip"
              label="Zip"
              value={data.addressZip || ''}
              onChange={(e) => updateData({ addressZip: e.target.value })}
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="AddressLine1"
              name="AddressLine1"
              label="Address Line 1"
              value={data.addressLine1 || ''}
              onChange={(e) => updateData({ addressLine1: e.target.value })}
            />
          ),
        },
        {
          gridProps: { item: true, xs: 12, sm: 6 },
          children: (
            <TextField
              fullWidth
              id="AddressLine1"
              name="AddressLine1"
              label="Address Line 2"
              value={data.addressLine2 || ''}
              onChange={(e) => updateData({ addressLine2: e.target.value })}
            />
          ),
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="Settings" breadcrumbs={breadcrumbs} actions={renderActions}>
        <Form id="SettingsForm" data={formData} onSubmit={handleOnSubmit} />
      </Common>
    </Container>
  );
};
