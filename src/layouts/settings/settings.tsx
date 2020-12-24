import React, { useState, useEffect, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Container, Button, TextField, TextFieldProps, GridProps, Tabs, Tab } from '@material-ui/core';
import { Common } from 'layouts';
import { Settings as AppSettings, AppActions, Tax } from 'types';
import { Form, FormDataProp, BreadcrumbsCrumbProp } from 'components';
import { SettingsTaxesTab } from './settingsTaxesTab';
import styles from './settings.module.css';

export type SettingsProps = {
  actions: AppActions;
  breadcrumbs?: BreadcrumbsCrumbProp[];
  settings: AppSettings;
  taxes: Tax[],
};

export const Settings: React.FC<SettingsProps> = ({ actions, breadcrumbs, taxes, settings }) => {
  const [settingsData, setSettingsData] = useState<Partial<AppSettings>>(settings);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    setSettingsData(settings);
  }, [settings]);

  const updateData = (value: Partial<AppSettings>) => setSettingsData({ ...settingsData, ...value });

  const renderActions = (
    <Button type="submit" variant="contained" color="primary" form="SettingsForm">
      Save
    </Button>
  );

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    actions.settings.update(settingsData);
    toast.success('Settings successfully updated.');
  };

  const getCommonTextFieldProps = (id: string): TextFieldProps => ({
    id,
    name: id,
    fullWidth: true,
    size: 'small',
    variant: 'outlined',
  });

  const gridProps: GridProps = { item: true, sm: 12, lg: 6 };

  const formSettingsData: FormDataProp[] = [
    {
      label: 'Account Settings',
      elements: [
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('SettingsAccountName')}
              label="Account Name"
              value={settingsData.accountName ?? ''}
              onChange={(e) => updateData({ accountName: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('SettingsAccountEmail')}
              type="email"
              label="Email"
              value={settingsData.accountEmail ?? ''}
              onChange={(e) => updateData({ accountEmail: e.target.value })}
            />
          ),
        },
      ],
    },
    {
      label: 'Company Info',
      subtitle:
        'Information about your company that will be displayed on invoices, estimates and other documents.',
      elements: [
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('SettingsCompanyInfoCompanyName')}
              required
              label="Company Name"
              value={settingsData.companyName ?? ''}
              onChange={(e) => updateData({ companyName: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('SettingsCompanyInfoCity')}
              label="City"
              value={settingsData.addressCity ?? ''}
              onChange={(e) => updateData({ addressCity: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('SettingsCompanyInfoEmail')}
              type="email"
              label="Email"
              value={settingsData.email ?? ''}
              onChange={(e) => updateData({ email: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('SettingsCompanyInfoState')}
              label="State"
              value={settingsData.addressState ?? ''}
              onChange={(e) => updateData({ addressState: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('SettingsCompanyAddressLine1')}
              label="Address Line 1"
              value={settingsData.addressLine1 ?? ''}
              onChange={(e) => updateData({ addressLine1: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('SettingsCompanyInfoCountry')}
              label="Country"
              value={settingsData.addressCountry ?? ''}
              onChange={(e) => updateData({ addressCountry: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('SettingsCompanyAddressLine2')}
              label="Address Line 2"
              value={settingsData.addressLine2 ?? ''}
              onChange={(e) => updateData({ addressLine2: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('SettingsCompanyAddressZip')}
              label="Zip"
              value={settingsData.addressZip ?? ''}
              onChange={(e) => updateData({ addressZip: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('SettingsCompanyPhone')}
              label="Phone"
              value={settingsData.phone ?? ''}
              onChange={(e) => updateData({ phone: e.target.value })}
            />
          ),
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="Settings" breadcrumbs={breadcrumbs} actions={renderActions}>
        <Tabs
          value={tab}
          variant="scrollable"
          scrollButtons="auto"
          onChange={(_, index) => setTab(index)}
          aria-label="simple tabs example"
        >
          <Tab label="Company Information" />
          <Tab label="Tax Types" />
        </Tabs>
        {tab === 0 && <Form id="SettingsForm" data={formSettingsData} onSubmit={handleOnSubmit} />}
        {tab === 1 && <SettingsTaxesTab actions={actions} taxes={taxes} />}
      </Common>
    </Container>
  );
};
