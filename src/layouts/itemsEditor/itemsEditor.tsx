import React, { useState, useEffect, FormEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Autocomplete } from '@material-ui/lab';
import { Button, Container, TextField, TextFieldProps, GridProps } from '@material-ui/core';
import { Form, FormDataProp, BreadcrumbsCrumbProp } from 'components';
import { AppActions, Item, Tax } from 'types';
import { ItemsActionsAdd, ItemsActionsUpdate } from 'actions';
import { Common } from 'layouts';
import { Routes } from 'enums';
import styles from './itemsEditor.module.css';

export type ItemsEditorProps = {
  actions: AppActions;
  taxPerItem: boolean;
  breadcrumbs?: BreadcrumbsCrumbProp[];
  taxes: Tax[];
  items?: Item[];
};

export const ItemsEditor = ({ actions, breadcrumbs, items, taxes, taxPerItem }: ItemsEditorProps) => {
  const [data, setData] = useState<ItemsActionsAdd | ItemsActionsUpdate>({
    name: '',
    price: 0,
    taxesIds: [],
  });
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();

  useEffect(() => {
    if (!items) return;
    // Get data for editing
    const item = items.find((element) => element.id === id);
    if (item) {
      setData(item);
    } else {
      history.replace(Routes.Admin);
      toast.error('The requested resource was not found.');
    }
  }, [items, history, id]);

  // Data update helper
  const updateData = (value: Partial<ItemsActionsAdd | ItemsActionsUpdate>) => setData({ ...data, ...value });

  const renderActions = (
    <Button type="submit" variant="contained" color="primary" form="EditCustomerForm">
      {items ? 'Update Item' : 'Save Item'}
    </Button>
  );

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (items) {
      // Update item
      actions.items.update(data as ItemsActionsUpdate);
      console.info(data);
    } else {
      // Create item
      actions.items.add(data as ItemsActionsAdd);
    }
    history.goBack();
  };

  const getCommonTextFieldProps = (id: string): TextFieldProps => ({
    id: `ItemsEditor${id}`,
    name: `ItemsEditor${id}`,
    size: 'small',
    variant: 'outlined',
  });

  const gridProps: GridProps = { item: true, sm: 12 };

  const formData: FormDataProp[] = [
    {
      elements: [
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('Name')}
              fullWidth
              required
              label="Name"
              value={data.name ?? ''}
              onChange={(e) => updateData({ name: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('Price')}
              InputProps={{ inputProps: { min: 0, step: 'any', type: 'number' } }}
              label="Price"
              value={data.price ?? 0}
              onChange={(e) => updateData({ price: parseFloat(e.target.value) })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('Unit')}
              label="Unit"
              value={data.unit ?? ''}
              onChange={(e) => updateData({ unit: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: taxPerItem ? (
            <Autocomplete
              id="ItemEditorTaxesAutocomplete"
              multiple
              options={taxes}
              getOptionLabel={(option: Tax) => option.name}
              style={{ width: 300 }}
              value={taxes.filter((tax) => data.taxesIds?.includes(tax.id))}
              onChange={(_, taxes) => updateData({ taxesIds: taxes.map((tax) => tax.id) })}
              renderInput={(params) => (
                <TextField {...params} label="Taxes" variant="outlined" size="small" />
              )}
            />
          ) : null,
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('Description')}
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={data.description ?? ''}
              onChange={(e) => updateData({ description: e.target.value })}
            />
          ),
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title={items ? 'Edit Item' : 'New Item'} breadcrumbs={breadcrumbs} actions={renderActions}>
        <Form id="EditCustomerForm" data={formData} onSubmit={handleOnSubmit} className={styles.form} />
      </Common>
    </Container>
  );
};
